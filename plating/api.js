/* 개인 인증키는 화면 입력을 권장합니다. 배포 소스에 비밀 키를 넣지 마세요. */
const API_CONFIG={key:'',baseUrl:'https://api.nal.usda.gov/fdc/v1'};
const productId=new URLSearchParams(location.search).get('id');
const product=PRODUCTS.find(p=>p.id===productId);
const detail=document.querySelector('#product-detail');
let activeRequest=null;
if(!product){detail.innerHTML='<section class="empty-state"><h1>상품을 찾을 수 없습니다.</h1><p>메뉴 목록에서 상품을 다시 선택해 주세요.</p><a class="button" href="index.html?page=menu">상품 목록으로</a></section>';document.querySelector('.api-section').hidden=true;}
else{document.title=`${product.name} · PLATING`;detail.innerHTML=`<section class="detail-hero"><img class="detail-photo" src="${product.image}" alt="${product.name}"><div><p class="eyebrow">${CATEGORIES[product.category]} · ${product.badge}</p><h1>${product.name}</h1><p class="detail-description">${product.description} 바쁜 하루에도 나를 위한 식사를 챙길 수 있도록, 신선한 재료를 정성껏 담았습니다.</p><strong class="detail-price">${money(product.price)}</strong><p class="small muted">총중량 ${product.weight}g · 과제용 샘플 상품</p><a class="button" href="index.html?page=subscribe">식단표 확인하고 구독하기 ↗</a><div class="ingredients"><h3>정직하게 담은 식재료</h3><table><caption class="sr-only">구성 식재료 및 원산지</caption><thead><tr><th>식재료</th><th>원산지</th></tr></thead><tbody>${product.ingredients.map(([name,origin])=>`<tr><td>${name}</td><td>${origin}</td></tr>`).join('')}</tbody></table><p class="allergy-note">알레르기 유발 성분: <strong>${product.allergens.join(', ')||'등록된 성분 없음'}</strong></p><p class="small muted">샘플의 등록 성분 기준이며, 실제 제조 환경의 교차 접촉은 확인되지 않았습니다.</p></div></div></section><section class="nutrition-section"><div class="section-heading"><div><p class="eyebrow">균형을 생각하는 한 끼</p><h2>상품 영양정보</h2></div><span class="small muted">1개 전체 ${product.weight}g 기준 · 샘플값</span></div><div class="nutrition-grid">${product.nutrition.map((value,i)=>`<div><span>${nutritionLabels[i]}</span><strong>${value}<small>${nutritionUnits[i]}</small></strong></div>`).join('')}</div></section>`;document.querySelector('#api-query').value=product.query;document.querySelector('#api-key').value=API_CONFIG.key;document.querySelector('#api-form').addEventListener('submit',e=>{e.preventDefault();loadNutrition();});queueMicrotask(loadNutrition);}
// USDA 검색 응답의 foodNutrients를 영양소 ID로 읽습니다. SR Legacy의 100g 기준값입니다.
const USDA_NUTRIENTS=[[1008,2047,2048],[1005],[1003],[1004],[2000,1063],[1093]];
const SEARCH_TRANSLATIONS={'샐러드':'vegetable salad','오렌지주스':'orange juice','사과주스':'apple juice','샌드위치':'egg sandwich','도시락':'chicken rice','요거트':'yogurt','토마토주스':'tomato juice','파인애플주스':'pineapple juice','당근주스':'carrot juice','두유':'soy milk'};
function nutrientValue(food,index){
 const nutrients=food.foodNutrients||[];
 for(const id of USDA_NUTRIENTS[index]){const n=nutrients.find(item=>Number(item.nutrientId)===id);if(n&&n.value!==null&&n.value!==undefined&&Number.isFinite(Number(n.value))){let value=Number(n.value);const unit=String(n.unitName||'').toLowerCase();if(index===5&&unit==='g')value*=1000;if(index>0&&index<5&&unit==='mg')value/=1000;return new Intl.NumberFormat('ko-KR',{maximumFractionDigits:2}).format(value)+' '+nutritionUnits[index];}}
 return '미제공';
}
async function loadNutrition(){
 if(activeRequest)activeRequest.abort();
 const query=document.querySelector('#api-query').value.trim();
 const status=document.querySelector('#api-status'),results=document.querySelector('#api-results');
 if(!query){status.textContent='식품 검색어를 입력해 주세요.';return;}
 const controller=new AbortController();activeRequest=controller;
 const key=document.querySelector('#api-key').value.trim()||API_CONFIG.key||'DEMO_KEY';
 const englishQuery=SEARCH_TRANSLATIONS[query]||query;
 status.textContent='USDA FoodData Central에서 영양정보를 불러오는 중입니다…';status.className='api-status loading';results.innerHTML='';results.setAttribute('aria-busy','true');
 const timeout=setTimeout(()=>controller.abort(),15000);
 try{
  const params=new URLSearchParams({api_key:key,query:englishQuery,pageSize:'5',dataType:'SR Legacy'});
  const response=await fetch(`${API_CONFIG.baseUrl}/foods/search?${params}`,{signal:controller.signal});
  if(!response.ok)throw new Error(response.status===429?'요청 한도를 초과했습니다. 잠시 후 다시 시도하거나 개인 API 키를 입력해 주세요.':[401,403].includes(response.status)?'API 키가 유효하지 않거나 사용이 제한되었습니다. 인증키를 확인해 주세요.':`서버 응답 오류 (${response.status})`);
  const data=await response.json();if(activeRequest!==controller)return;if(!Array.isArray(data.foods))throw new Error('예상한 JSON 응답이 아닙니다.');
  if(!data.foods.length){status.textContent='검색 결과가 없습니다. 샐러드·오렌지주스 등 안내된 검색어나 영문 식품명을 사용해 주세요.';status.className='api-status';return;}
  status.textContent=`USDA에서 ${data.foods.length}건을 조회했습니다. 검색어: ${englishQuery}. ${key==='DEMO_KEY'?'공용 체험 키는 요청 횟수가 제한됩니다. ':''}판매 상품과 별개인 100g 기준 참고 데이터입니다.`;status.className='api-status success';
  results.innerHTML=data.foods.map((food,i)=>`<article class="api-card"><h3>참고 식품 ${i+1}</h3><p class="api-original">원문 식품명: <span lang="en">${escapeHTML(food.description||'미제공')}</span></p><p class="small muted">100g 기준 · 자료 유형: SR Legacy · 식품 번호: ${escapeHTML(food.fdcId)} · 출처: USDA FoodData Central</p><dl>${nutritionLabels.map((label,index)=>`<div><dt>${label}</dt><dd>${nutrientValue(food,index)}</dd></div>`).join('')}</dl></article>`).join('');
 }catch(error){if(activeRequest!==controller)return;status.textContent=error.name==='AbortError'?'요청 시간이 초과되었습니다. 잠시 후 다시 조회해 주세요.':`영양정보를 불러오지 못했습니다. ${error instanceof TypeError?'네트워크 연결 또는 브라우저의 CORS 정책을 확인해 주세요.':error.message} 상품 상세정보는 계속 확인할 수 있습니다.`;status.className='api-status error';}
 finally{clearTimeout(timeout);if(activeRequest===controller){results.setAttribute('aria-busy','false');activeRequest=null;}}
}
