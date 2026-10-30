"""Chrome 기능 검사. API 고정 응답 검사는 실제 연결 검증과 구분합니다."""
from pathlib import Path
import subprocess,json,re
root=Path(__file__).parent
app=root/'plating'
temp=app/'qa-temporary.html'
def run(source,probe,query=''):
    source=source.replace('<link rel="stylesheet" href="style.css">','').replace('</head>','<script>window.qaErrors=[];window.addEventListener("error",e=>{if(e.message)qaErrors.push(e.message)});</script></head>')
    temp.write_text(source.replace('</body>','<script>'+probe+'</script></body>'),encoding='utf-8')
    try:
        result=subprocess.run(['C:/Program Files/Google/Chrome/Application/chrome.exe','--headless','--disable-gpu','--no-sandbox','--disable-software-rasterizer','--no-first-run','--virtual-time-budget=2000','--user-data-dir='+str(root/'.qa-browser'),'--dump-dom',temp.as_uri()+query],capture_output=True,timeout=45)
        output=result.stdout.decode('utf-8',errors='replace')
        match=re.search(r'<pre id="qa-result">(.*?)</pre>',output,re.S)
        if not match:raise RuntimeError('검사 결과 없음: '+output[-500:])
        checks=json.loads(match.group(1));print(json.dumps(checks,ensure_ascii=False),flush=True)
        assert all(x.get('ok') is True for x in checks),'기능 검사 실패'
    finally:temp.unlink(missing_ok=True)
probe=r'''
document.addEventListener('DOMContentLoaded',async()=>{
const checks=[];const check=(name,ok)=>checks.push({name,ok:!!ok});
try{
DELIVERY_CONFIG.kakaoJavascriptKey=''; // 사용자 키 대신 테스트 전용 설정만 사용합니다.
check('홈만 표시',document.body.dataset.currentPage==='home'&&document.querySelector('#subscribe').hidden);
check('후기와 슬라이드 복제',document.querySelectorAll('.review-card').length===8&&document.querySelector('.review-group[aria-hidden=true]').hasAttribute('inert'));
check('후기 정지 버튼 없음과 이름 마스킹',!document.querySelector('#toggle-reviews')&&document.querySelector('.review-copy>small').textContent.includes('박*혁'));check('검증 전 신청 차단',document.querySelector('#submit-button').disabled);
navigateTo('menu');check('메뉴 화면 분리와 URL',new URLSearchParams(location.search).get('page')==='menu'&&document.querySelector('.hero').hidden&&!document.querySelector('#monthly-page').hidden);
calendarMonth=new Date(2026,10,1);renderCalendar();check('월수금에만 메뉴 표시',document.querySelectorAll('#calendar-body time').length===30&&document.querySelectorAll('.calendar-dish').length===26&&document.querySelectorAll('.rest-day .calendar-dish').length===0);
calendarMonth=new Date(2028,1,1);renderCalendar();check('윤년 29일',document.querySelectorAll('#calendar-body time').length===29);
document.querySelector('#next-month').click();check('다음 달',document.querySelector('#calendar-title').textContent==='2028년 3월');
document.querySelector('#previous-month').click();check('이전 달',document.querySelector('#calendar-title').textContent==='2028년 2월');
const meals=Array.from({length:28},(_,i)=>menuForDate('2026-11-'+String(i+1).padStart(2,'0')));check('2팩과 메뉴 다양성',meals.every(ids=>ids.length===2&&ids[0]!==ids[1])&&new Set(meals.map(ids=>ids.join(','))).size>3);
navigateTo('subscribe');check('구독 화면 분리',!document.querySelector('#subscribe').hidden&&document.querySelector('#monthly-page').hidden);
function selectDays(days){form.querySelectorAll('[name="weekday"]').forEach(x=>x.checked=days.includes(Number(x.value)));}
field('start').value='2026-11-02';field('frequency').value='3';field('weeks').value='4';selectDays([1,3,5]);rebuild();
check('12출고 24팩',schedule.length===12&&schedule.flatMap(r=>r.products).length===24);
check('캘린더와 동일 편성',schedule.every(r=>r.products.join(',')===menuForDate(r.date).join(',')));
field('frequency').value='2';selectDays([1]);rebuild();check('요일 개수 부족 차단',document.querySelector('#submit-button').disabled);
selectDays([1,3]);form.querySelectorAll('[name="allergy"]').forEach(x=>x.checked=true);rebuild();
check('알레르기 경고와 해당 메뉴',!document.querySelector('#allergy-warning').hidden&&document.querySelector('#allergy-warning').textContent.includes('알레르기 반응')&&document.querySelector('#allergy-warning li'));
check('알레르기 빨강 경고',document.querySelector('#allergy-warning').classList.contains('has-conflicts'));
field('address').value='대구 테스트 도로 1';await DeliveryService.search();check('키 미설정 시 차단',!DeliveryService.isVerified()&&document.querySelector('#delivery-result').classList.contains('error'));document.querySelector('#kakao-key').value='qa-only-not-a-real-key';await DeliveryService.refreshMap();check('주소 검색 전 지도 표시와 미승인 유지',document.querySelector('#delivery-map').classList.contains('is-ready')&&!DeliveryService.isVerified());await DeliveryService.search();
check('배송 검증 및 알레르기 구매 허용',DeliveryService.isVerified()&&!document.querySelector('#submit-button').disabled);
check('샐러드12종 음료8종',PRODUCTS.filter(p=>p.category==='salad').length===12&&PRODUCTS.filter(p=>p.category==='juice').length===8);
const defaultFirst=[...schedule[0].products];
document.querySelector('[data-meal-mode="0"][value="custom"]').checked=true;document.querySelector('[data-meal-mode="0"][value="custom"]').dispatchEvent(new Event('change',{bubbles:true}));
check('대체 후보 알레르기 제외',replacementProducts().every(p=>!p.allergens.some(a=>settings().allergies.includes(a))));
document.querySelector('[data-copy-meal="0"]').click();check('같은 상품 2팩 선택',schedule[0].custom&&schedule[0].products[0]===schedule[0].products[1]);
const customFirst=[...schedule[0].products];rebuild();check('옵션 재계산에도 대체 선택 유지',schedule[0].products.join(',')===customFirst.join(','));
check('대체 가격과 요약 반영',document.querySelector('#total').textContent===money(totalPrice(schedule))&&document.querySelector('#summary-lines').textContent.includes('대체 메뉴 선택'));
document.querySelector('[data-meal-mode="0"][value="default"]').checked=true;document.querySelector('[data-meal-mode="0"][value="default"]').dispatchEvent(new Event('change',{bubbles:true}));
check('기본 식단 복원',!schedule[0].custom&&schedule[0].products.join(',')===defaultFirst.join(','));

check('주소 검색과 좌표 SDK 호출 경로',qaKakaoCalls.address>0&&qaKakaoCalls.region>0);
for(const recorded of qaRecordedCases){check('실제 응답 회귀검사 '+recorded.query,DeliveryService.assess(recorded.candidate,recorded.regions).eligible===recorded.expectedEligible);}
for(const district of ['동구','중구','수성구','북구']){const fixture=qaRegionFixture(district,'허용시험동');check(district+' 허용 판정',DeliveryService.assess(fixture.candidate,fixture.regions).eligible);}
for(const rule of DELIVERY_CONFIG.excludedAdministrativeDongs){const fixture=qaRegionFixture(rule.district,rule.dong);check(rule.dong+' 제외',!DeliveryService.assess(fixture.candidate,fixture.regions).eligible);}
let fixture=qaRegionFixture('동구','허용시험동','부산광역시');check('대구 외 지역 제외',!DeliveryService.assess(fixture.candidate,fixture.regions).eligible);
fixture=qaRegionFixture('달서구','허용시험동');check('대구 다른 구 제외',!DeliveryService.assess(fixture.candidate,fixture.regions).eligible);
fixture=qaRegionFixture('동구','허용시험동');fixture.regions[0].code='9999999999';let rejected=false;try{DeliveryService.assess(fixture.candidate,fixture.regions);}catch{rejected=true;}check('행정코드 불일치 차단',rejected);
fixture=qaRegionFixture('동구','허용시험동');rejected=false;try{DeliveryService.assess(fixture.candidate,fixture.regions.filter(r=>r.region_type!=='H'));}catch{rejected=true;}check('행정동 누락 차단',rejected);
fixture=qaRegionFixture('동구','허용시험동');fixture.regions[1].code='9999999999';rejected=false;try{DeliveryService.assess(fixture.candidate,fixture.regions);}catch{rejected=true;}check('법정동 불일치 차단',rejected);
field('address').value='변경한 주소 2';field('address').dispatchEvent(new Event('input'));check('주소 변경 즉시 차단',!DeliveryService.isVerified()&&document.querySelector('#submit-button').disabled);
qaKakaoFixture=qaRegionFixture('수성구','파동');await DeliveryService.search();check('제외지역 신청 차단',!DeliveryService.isVerified()&&document.querySelector('#submit-button').disabled&&document.querySelector('#delivery-result').classList.contains('ineligible'));
qaKakaoError=true;await DeliveryService.search();check('API 오류 신청 차단',!DeliveryService.isVerified()&&document.querySelector('#delivery-result').classList.contains('error'));qaKakaoError=false;
const geocoderPrototype=kakao.maps.services.Geocoder.prototype,originalAddressSearch=geocoderPrototype.addressSearch;
geocoderPrototype.addressSearch=function(query,callback){callback([qaKakaoFixture.candidate,qaKakaoFixture.candidate],'OK',{hasNextPage:false});};await DeliveryService.search();check('여러 주소 검색 시 선택 전 차단',!DeliveryService.isVerified()&&document.querySelectorAll('.address-candidate').length===2);geocoderPrototype.addressSearch=originalAddressSearch;
const originalCoord=geocoderPrototype.coord2RegionCode;let pendingRegion;
geocoderPrototype.coord2RegionCode=function(x,y,callback){pendingRegion=callback;};const oldRequest=DeliveryService.search();while(!pendingRegion)await new Promise(resolve=>setTimeout(resolve,1));field('address').value='다시 바꾼 주소 3';field('address').dispatchEvent(new Event('input'));pendingRegion(qaKakaoFixture.regions,'OK');await oldRequest;check('이전 주소의 지연 응답 무시',!DeliveryService.isVerified());geocoderPrototype.coord2RegionCode=originalCoord;
qaKakaoFixture=qaRegionFixture('동구','허용시험동');await DeliveryService.search();
document.querySelector('[data-meal-mode="0"][value="custom"]').checked=true;document.querySelector('[data-meal-mode="0"][value="custom"]').dispatchEvent(new Event('change',{bubbles:true}));document.querySelector('[data-copy-meal="0"]').click();const savedCustom=[...schedule[0].products];
field('customer').value='테스트';field('phone').value='010-1234-5678';field('consent').checked=true;form.dispatchEvent(new Event('submit',{cancelable:true}));
check('경고 상태 저장과 화면 이동',subscriptions.length===1&&JSON.parse(localStorage.getItem(STORAGE_KEY))[0].allergies.length===ALLERGENS.length&&document.body.dataset.currentPage==='history');
document.querySelector('[data-edit]').click();check('대체 선택 저장과 복원',schedule[0].custom&&schedule[0].products.join(',')===savedCustom.join(','));check('수정 시 재검증 필요',!DeliveryService.isVerified()&&document.querySelector('#submit-button').disabled);await DeliveryService.search();field('weeks').value='3';selectDays([3,5]);rebuild();field('address').value='변경 주소';field('address').dispatchEvent(new Event('input'));await DeliveryService.search();form.dispatchEvent(new Event('submit',{cancelable:true}));
check('수정 저장',subscriptions.length===1&&subscriptions[0].weeks===3&&subscriptions[0].address==='변경 주소'&&subscriptions[0].schedule.length===6);
document.querySelector('[data-delete]').click();document.querySelector('#confirm-delete').click();check('삭제 저장',subscriptions.length===0&&JSON.parse(localStorage.getItem(STORAGE_KEY)).length===0);
navigateTo('menu');window.dispatchEvent(new PopStateEvent('popstate'));check('URL로 화면 복원',document.body.dataset.currentPage==='menu');check('JS 오류 없음',qaErrors.length===0);
}catch(e){checks.push({name:String(e),ok:false,stack:e.stack});}
document.body.innerHTML='<pre id="qa-result">'+JSON.stringify(checks)+'</pre>';
});'''
kakao_mock="\n<script>\n// 아래 코드는 자동검사 전용 가짜 SDK와 합성 코드입니다. 실제 행정동 코드가 아닙니다.\nwindow.qaKakaoCalls={address:0,region:0};window.qaKakaoError=false;\nwindow.qaRegionFixture=(district,dong,city='대구광역시')=>({candidate:{x:'128.6',y:'35.9',address:{address_name:'검사용 주소',main_address_no:'1',h_code:'1000000001',b_code:'1000000002',region_1depth_name:city,region_2depth_name:district}},regions:[{region_type:'H',code:'1000000001',region_1depth_name:city,region_2depth_name:district,region_3depth_name:dong},{region_type:'B',code:'1000000002',region_1depth_name:city,region_2depth_name:district,region_3depth_name:'시험법정동'}]});\nwindow.qaKakaoFixture=qaRegionFixture('동구','허용시험동');\nwindow.kakao={maps:{LatLng:class{constructor(y,x){this.x=x;this.y=y;}},Map:class{relayout(){}setCenter(){}},Marker:class{constructor(options){this.position=options.position;}setMap(){}getPosition(){return this.position;}},services:{Status:{OK:'OK',ERROR:'ERROR',ZERO_RESULT:'ZERO_RESULT'},AnalyzeType:{EXACT:'exact'},Geocoder:class{addressSearch(query,callback){qaKakaoCalls.address++;setTimeout(()=>callback([qaKakaoFixture.candidate],qaKakaoError?'ERROR':'OK',{hasNextPage:false}),0);}coord2RegionCode(x,y,callback){qaKakaoCalls.region++;setTimeout(()=>callback(qaKakaoFixture.regions,qaKakaoError?'ERROR':'OK'),0);}}}}};\n</script>\n"
kakao_mock+='<script>window.qaRecordedCases='+json.dumps(json.loads((root/'tests/kakao-public-addresses.json').read_text(encoding='utf-8')))+';</script>'
run((app/'index.html').read_text(encoding='utf-8').replace('<script defer src="products.js">',kakao_mock+'<script defer src="products.js">'),probe)
for case in ['success','empty','failure','unknown']:
    payload={'foods':[{'fdcId':12345,'description':'Test salad','foodNutrients':[{'nutrientId':1008,'value':123,'unitName':'KCAL'},{'nutrientId':1005,'value':0,'unitName':'G'},{'nutrientId':1003,'value':4,'unitName':'G'},{'nutrientId':1093,'value':0.2,'unitName':'G'}]}]} if case=='success' else {'foods':[]}
    mock="window.qaRequest='';window.fetch=async(url)=>{qaRequest=url;return {ok:true,json:async()=>("+json.dumps(payload)+")}};"
    if case=='failure':mock="window.fetch=async()=>({ok:false,status:429});"
    source=(app/'detail.html').read_text(encoding='utf-8').replace('<script defer src="products.js">','<script>'+mock+'</script><script defer src="products.js">')
    probe="""document.addEventListener('DOMContentLoaded',()=>setTimeout(()=>{const checks=[];const check=(name,ok)=>checks.push({name,ok:!!ok});try{const kind='CASE';
if(kind==='success'){check('USDA URL과 DEMO_KEY',qaRequest.includes('api.nal.usda.gov/fdc/v1/foods/search?')&&qaRequest.includes('api_key=DEMO_KEY'));check('USDA JSON 표시',document.querySelectorAll('.api-card').length===1);check('0값과 단위 변환',document.querySelector('.api-card').textContent.includes('0 g')&&document.querySelector('.api-card').textContent.includes('200 mg'));check('누락값 미제공',document.querySelector('.api-card').textContent.includes('미제공'));}
if(kind==='empty')check('빈 결과',document.querySelector('#api-status').textContent.includes('검색 결과가 없습니다'));
if(kind==='failure')check('429 오류와 상세 유지',document.querySelector('#api-status').textContent.includes('요청 한도')&&document.querySelector('.detail-hero'));
if(kind==='unknown')check('잘못된 상품',document.querySelector('#product-detail').textContent.includes('상품을 찾을 수 없습니다'));
check('상세 JS 오류 없음',qaErrors.length===0);}catch(e){checks.push({name:String(e),ok:false});}document.body.innerHTML='<pre id="qa-result">'+JSON.stringify(checks)+'</pre>';},50));""".replace('CASE',case)
    run(source,probe,'?id='+('unknown' if case=='unknown' else 'green'))
