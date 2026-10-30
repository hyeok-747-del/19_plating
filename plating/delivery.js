/* 카카오 Maps JavaScript SDK의 실제 addressSearch → coord2RegionCode 호출.
   검증된 상태는 메모리에만 두며 주소 변경·수정·새로고침마다 다시 검증합니다. */
const DeliveryService=(()=>{
 const addressInput=document.querySelector('[name="address"]');
 const statusBox=document.querySelector('#delivery-result');
 const candidatesBox=document.querySelector('#address-candidates');
 const mapBox=document.querySelector('#delivery-map');
 let state={status:'unchecked'},revision=0,loader=null,loadedKey='',sessionKey='',map=null,marker=null,debounce;
 const messages={
  eligible:'배송 가능한 지역입니다! 🌿\n\n플레팅의 신선한 건강식을 고객님의 아침 식탁까지 전해드릴게요.',
  ineligible:'아쉽게도 현재 배송이 어려운 지역이에요.\n\n플레팅은 신선한 식재료와 음식의 품질을 지키기 위해 배송지역을 한정하여 운영하고 있습니다.\n\n더 많은 지역에서 플레팅을 만나보실 수 있도록 노력하겠습니다.'
 };
 function update(next){state=next;statusBox.className='delivery-result '+next.status;statusBox.textContent=next.message||'배송 주소를 검색하고 배송 가능 여부를 확인해 주세요.';document.querySelector('#delivery-region').textContent=next.region?`${next.region.region_1depth_name} ${next.region.region_2depth_name} ${next.region.region_3depth_name} · 행정동 코드 ${next.region.code}`:'';document.querySelector('#address-search-button').disabled=next.status==='loading';document.dispatchEvent(new CustomEvent('delivery-state-change'));}
 function clearMarker(){if(marker)marker.setMap(null);marker=null;}
 function invalidate(message){revision++;clearTimeout(debounce);candidatesBox.innerHTML='';clearMarker();update({status:'unchecked',message});}
 function currentKey(){return document.querySelector('#kakao-key').value.trim()||DELIVERY_CONFIG.kakaoJavascriptKey.trim()||sessionKey;}
 function loadKakao(){
  const key=currentKey();if(!key){document.querySelector('.delivery-api-help').open=true;return Promise.reject(new Error('카카오 JavaScript 키가 비어 있습니다. 펼쳐진 API 설정 안내에 키를 입력하고 표시된 SDK 도메인을 카카오 Developers에 등록한 후 다시 검색해 주세요.'));}sessionKey=key;
  if(loadedKey&&loadedKey!==key)return Promise.reject(new Error('카카오 키가 변경되었습니다. 새로고침 후 새 키로 다시 검색해 주세요.'));
  if(loader)return loader;
  loader=new Promise((resolve,reject)=>{
   if(window.kakao?.maps?.services){loadedKey=key;resolve();return;}
   const script=document.createElement('script');let settled=false;
   const fail=()=>{if(settled)return;settled=true;clearTimeout(timeout);script.remove();reject(new Error('카카오 지도를 불러오지 못했습니다. JavaScript 키, 등록 도메인, 카카오맵 사용 설정과 네트워크를 확인해 주세요.'));};
   const timeout=setTimeout(fail,15000);
   script.src=`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(key)}&autoload=false&libraries=services`;
   script.onerror=fail;
   script.onload=()=>{if(settled)return;try{window.kakao.maps.load(()=>{if(settled)return;if(!window.kakao.maps.services){fail();return;}settled=true;clearTimeout(timeout);loadedKey=key;resolve();});}catch{fail();}};
   document.head.append(script);
  }).catch(error=>{loader=null;throw error;});return loader;
 }
 function kakaoCall(invoke){return new Promise((resolve,reject)=>{const timeout=setTimeout(()=>reject(new Error('주소 확인 시간이 초과되었습니다. 다시 검색해 주세요.')),12000);invoke((rows,status,pagination)=>{clearTimeout(timeout);if(status!==kakao.maps.services.Status.OK){reject(new Error(status===kakao.maps.services.Status.ZERO_RESULT?'정확한 주소를 찾지 못했습니다. 도로명과 건물번호 또는 지번까지 입력해 주세요.':'카카오 주소 API 오류입니다. 잠시 후 다시 확인해 주세요.'));return;}resolve({rows,pagination});});});}
 function validateCandidate(candidate){
  const x=Number(candidate.x),y=Number(candidate.y),address=candidate.address;
  if(!Number.isFinite(x)||!Number.isFinite(y)||x<124||x>132||y<32||y>40||!address||!/^\d{10}$/.test(address.h_code||'')||!address.main_address_no||address.main_address_no==='0')throw new Error('주소 또는 행정동 정보가 불명확합니다. 상세한 도로명·건물번호 또는 지번으로 재검색해 주세요.');
  return {x,y};
 }
 // 고객이 입력한 문자열은 판정에 사용하지 않습니다. API H/B 코드와 행정구역을 대조합니다.
 // 실제 카카오 주소 검색은 '대구', 좌표 API는 '대구광역시'를 반환합니다.
 // 이 두 공식 응답 표기만 통일하며, 주소 원문이나 부분 문자열로 배송을 승인하지 않습니다.
 function canonicalCity(name){const value=String(name||'').trim();return value==='대구'?'대구광역시':value;}
 function assess(candidate,regions){
  validateCandidate(candidate);
  const administrative=regions.filter(r=>r.region_type==='H');
  if(administrative.length!==1)throw new Error('행정동을 하나로 확인하지 못했습니다. 주소를 다시 확인해 주세요.');
  const region=administrative[0],address=candidate.address;
  if(!/^\d{10}$/.test(region.code||'')||region.code!==address.h_code||!region.region_1depth_name||!region.region_2depth_name||!region.region_3depth_name||canonicalCity(region.region_1depth_name)!==canonicalCity(address.region_1depth_name)||region.region_2depth_name!==address.region_2depth_name)throw new Error('주소와 좌표의 행정동 정보가 일치하지 않습니다. 주소를 재확인해 주세요.');
  const legal=regions.filter(r=>r.region_type==='B');
  if(legal.length!==1||!address.b_code||legal[0].code!==address.b_code)throw new Error('주소와 좌표의 법정동 정보를 확인하지 못했습니다. 재검색해 주세요.');
  const excluded=DELIVERY_CONFIG.excludedAdministrativeCodes.includes(region.code)||DELIVERY_CONFIG.excludedAdministrativeDongs.some(rule=>rule.district===region.region_2depth_name&&rule.dong===region.region_3depth_name);
  return {eligible:canonicalCity(region.region_1depth_name)===canonicalCity(DELIVERY_CONFIG.city)&&DELIVERY_CONFIG.allowedDistricts.includes(region.region_2depth_name)&&!excluded,region};
 }
 function ensureMap(position){mapBox.classList.add('is-ready');if(!map){mapBox.textContent='';map=new kakao.maps.Map(mapBox,{center:position,level:5});}map.relayout();}
 function showMap(x,y){const position=new kakao.maps.LatLng(y,x);ensureMap(position);map.setCenter(position);clearMarker();marker=new kakao.maps.Marker({position,map});}
 // 구독 화면을 열면 대구 중심 지도를 먼저 표시합니다. 지도 표시만으로 배송을 승인하지 않습니다.
 async function refreshMap(){
  if(map){map.relayout();if(marker)map.setCenter(marker.getPosition());return;}
  if(!currentKey()){mapBox.textContent='카카오 JavaScript 키를 설정하면 이곳에 지도가 표시됩니다. 아래 API 설정 안내를 확인해 주세요.';return;}
  mapBox.textContent='카카오 지도를 불러오는 중입니다…';
  try{await loadKakao();ensureMap(new kakao.maps.LatLng(35.8714,128.6014));}
  catch(error){if(map)return;mapBox.classList.remove('is-ready');mapBox.replaceChildren();const message=document.createElement('p');message.textContent=`지도를 표시하지 못했습니다. 카카오 Developers의 Default JS Key 설정에서 JavaScript SDK 도메인에 ${location.origin==='null'?'Live Server 접속 주소':location.origin}을 등록하고 새로고침해 주세요. ${error.message}`;const retry=document.createElement('button');retry.type='button';retry.className='secondary';retry.textContent='지도 다시 불러오기';retry.addEventListener('click',refreshMap);mapBox.append(message,retry);}
 }
 async function selectCandidate(candidate,token,query){
  if(token!==revision)return;
  candidatesBox.innerHTML='';
  update({status:'loading',message:'주소의 좌표와 행정동 코드를 확인하고 있습니다…'});
  try{
   const {x,y}=validateCandidate(candidate);showMap(x,y);
   const geocoder=new kakao.maps.services.Geocoder();
   const {rows}=await kakaoCall(done=>geocoder.coord2RegionCode(x,y,done));
   if(token!==revision||addressInput.value.trim()!==query)return;
   const result=assess(candidate,rows);
   candidatesBox.innerHTML='';
   update({status:result.eligible?'eligible':'ineligible',message:messages[result.eligible?'eligible':'ineligible'],query,addressName:candidate.road_address?.address_name||candidate.address.address_name,region:result.region,x,y,verifiedAt:new Date().toISOString()});
  }catch(error){if(token===revision)update({status:'error',message:error.message+' 배송 가능 여부가 확인될 때까지 신청할 수 없습니다.'});}
 }
 async function search(){
  const query=addressInput.value.trim();invalidate();const token=revision;
  if(query.length<5){update({status:'unchecked',message:'도로명과 건물번호 또는 지번까지 입력해 주세요.'});return;}
  update({status:'loading',message:'카카오맵에서 실제 주소를 검색하고 있습니다…'});
  try{
   await loadKakao();if(token!==revision)return;
   const geocoder=new kakao.maps.services.Geocoder();
   const {rows,pagination}=await kakaoCall(done=>geocoder.addressSearch(query,done,{size:10,analyze_type:kakao.maps.services.AnalyzeType.EXACT}));
   if(token!==revision||addressInput.value.trim()!==query)return;
   if(!Array.isArray(rows)||!rows.length)throw new Error('검색 결과가 없습니다. 정확한 주소로 다시 확인해 주세요.');
   if(pagination?.hasNextPage)throw new Error('여러 주소가 검색됩니다. 건물번호나 지번을 추가해 검색 범위를 좁혀 주세요.');
   if(rows.length===1){await selectCandidate(rows[0],token,query);return;}
   update({status:'ambiguous',message:'여러 주소가 검색되었습니다. 정확한 배송지를 선택해야 배송 가능 여부를 확인할 수 있습니다.'});
   rows.forEach(candidate=>{const button=document.createElement('button');button.type='button';button.className='address-candidate';button.textContent=candidate.road_address?.address_name||candidate.address_name;button.addEventListener('click',()=>selectCandidate(candidate,token,query));candidatesBox.append(button);});
  }catch(error){if(token===revision)update({status:'error',message:error.message+' 배송 가능 여부를 다시 확인해 주세요.'});}
 }
 function isVerified(){return state.status==='eligible'&&state.query===addressInput.value.trim();}
 function snapshot(){if(!isVerified())return null;return {address:state.addressName,administrativeCode:state.region.code,administrativeDong:state.region.region_3depth_name,district:state.region.region_2depth_name,city:state.region.region_1depth_name,x:state.x,y:state.y,verifiedAt:state.verifiedAt};}
 addressInput.addEventListener('input',()=>{invalidate('주소가 변경되었습니다. 배송 가능 여부를 다시 확인해 주세요.');if(addressInput.value.trim().length>=5&&currentKey())debounce=setTimeout(search,900);});
 addressInput.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();search();}});
 document.querySelector('#address-search-button').addEventListener('click',search);
 document.querySelector('#kakao-origin').textContent=location.origin==='null'?'파일 직접 실행 대신 Live Server로 실행하세요.':location.origin;
 document.querySelector('#kakao-key').addEventListener('input',()=>{sessionKey=document.querySelector('#kakao-key').value.trim();invalidate('API 설정이 변경되었습니다. 주소를 다시 검색해 주세요.');});
 document.querySelectorAll('[data-test-address]').forEach(button=>button.addEventListener('click',()=>{addressInput.value=button.dataset.testAddress;search();}));
 return {search,isVerified,snapshot,invalidate,assess,refreshMap};
})();
