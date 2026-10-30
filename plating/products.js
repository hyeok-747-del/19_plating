/* 상품명, 가격, 사진, 영양정보는 이 파일에서 수정하세요. 영양정보는 판매 제품을 가정한 샘플입니다. */
const photo = (id) => `assets/${id}.jpg`;
const PRODUCTS = [
  {id:'green',category:'salad',name:'그린 가든 샐러드',price:8900,description:'아삭한 채소와 아보카도, 자연 그대로의 신선함.',image:photo('photo-1512621776951-a57141f2eefd'),badge:'추천 메뉴',weight:280,ingredients:[['로메인','국내산'],['아보카도','페루산'],['방울토마토','국내산'],['아몬드','미국산']],allergens:['견과류'],nutrition:[285,24,9,18,6,320],query:'샐러드'},
  {id:'chicken',category:'salad',name:'그릴드 치킨 샐러드',price:10900,description:'담백한 닭가슴살과 풍성한 채소의 든든한 조화.',image:photo('photo-1546793665-c74683f339c1'),badge:'인기 메뉴',weight:320,ingredients:[['닭가슴살','국내산'],['양상추','국내산'],['방울토마토','국내산'],['요거트 드레싱','국내산']],allergens:['우유'],nutrition:[345,22,32,14,7,480],query:'샐러드'},
  {id:'citrus',category:'juice',name:'오렌지 선샤인 주스',price:5900,description:'오렌지와 당근을 담아 산뜻하게 깨우는 아침.',image:photo('photo-1613478223719-2ab802602423'),badge:'착즙주스',weight:250,ingredients:[['오렌지','미국산'],['당근','국내산'],['레몬','미국산']],allergens:[],nutrition:[110,26,2,0.4,20,35],query:'오렌지주스'},
  {id:'greenjuice',category:'juice',name:'애플 그린 주스',price:5900,description:'사과의 달콤함에 케일과 오이의 싱그러움을 더해요.',image:photo('photo-1610970881699-44a5587cabec'),badge:'가벼운 시작',weight:250,ingredients:[['사과','국내산'],['케일','국내산'],['오이','국내산']],allergens:[],nutrition:[95,23,1,0.2,18,30],query:'사과주스'},
  {id:'sandwich',category:'sandwich',name:'에그 아보 샌드위치',price:7900,description:'고소한 통밀빵에 부드러운 달걀과 아보카도를 듬뿍.',image:photo('photo-1528735602780-2552fd46c7af'),badge:'든든한 한 끼',weight:240,ingredients:[['통밀빵','밀: 미국산'],['달걀','국내산'],['아보카도','페루산']],allergens:['밀','달걀'],nutrition:[410,38,17,21,5,560],query:'샌드위치'},
  {id:'lunch',category:'lunch',name:'밸런스 현미 도시락',price:11900,description:'현미밥과 구운 닭가슴살, 제철 채소를 균형 있게.',image:photo('photo-1547592180-85f173990554'),badge:'균형 잡힌 식사',weight:380,ingredients:[['현미','국내산'],['닭가슴살','국내산'],['브로콜리','국내산'],['간장','대두: 미국산']],allergens:['대두','밀'],nutrition:[485,58,34,13,5,640],query:'도시락'}
];
// 월간 식단에 자동 편성할 추가 샐러드 샘플입니다.
PRODUCTS.push(
 {id:'tofu',category:'salad',name:'구운 두부 곡물 샐러드',price:9900,description:'노릇하게 구운 두부와 고소한 곡물을 담은 한 끼.',image:photo('photo-1512621776951-a57141f2eefd'),badge:'식물성 한 끼',weight:300,ingredients:[['두부','대두: 국내산'],['현미','국내산'],['로메인','국내산']],allergens:['대두'],nutrition:[315,32,19,12,5,380],query:'샐러드'},
 {id:'sweetpotato',category:'salad',name:'로스트 고구마 샐러드',price:9900,description:'달콤한 구운 고구마와 아삭한 제철 채소.',image:photo('photo-1547592180-85f173990554'),badge:'식물성 한 끼',weight:300,ingredients:[['고구마','국내산'],['양상추','국내산'],['방울토마토','국내산']],allergens:[],nutrition:[290,44,6,10,12,250],query:'샐러드'},
 {id:'egg',category:'salad',name:'에그 포테이토 샐러드',price:9900,description:'부드러운 달걀과 포슬포슬한 감자의 든든한 만남.',image:photo('photo-1546793665-c74683f339c1'),badge:'균형 잡힌 메뉴',weight:310,ingredients:[['달걀','국내산'],['감자','국내산'],['로메인','국내산']],allergens:['달걀'],nutrition:[330,30,17,16,4,360],query:'샐러드'},
 {id:'mushroom',category:'salad',name:'머쉬룸 퀴노아 샐러드',price:10900,description:'향긋한 구운 버섯과 톡톡 씹히는 퀴노아.',image:photo('photo-1512621776951-a57141f2eefd'),badge:'균형 잡힌 메뉴',weight:300,ingredients:[['새송이버섯','국내산'],['퀴노아','페루산'],['양상추','국내산']],allergens:[],nutrition:[305,35,10,14,4,290],query:'샐러드'}
);
// 다양한 단백질 메뉴와 채소·곡물 메뉴를 조합할 수 있도록 확장한 샘플입니다.
PRODUCTS.push(
 {id:'salmon',category:'salad',name:'구운 연어 아보 샐러드',price:12900,description:'고소한 연어와 아보카도, 산뜻한 레몬 드레싱.',image:photo('photo-1546793665-c74683f339c1'),badge:'단백질 메뉴',weight:320,ingredients:[['연어','노르웨이산'],['아보카도','페루산'],['로메인','국내산'],['레몬','미국산']],allergens:['생선'],nutrition:[395,23,28,23,5,390],query:'샐러드'},
 {id:'shrimp',category:'salad',name:'레몬 쉬림프 샐러드',price:11900,description:'탱글한 새우와 상큼한 채소의 가벼운 한 끼.',image:photo('photo-1546793665-c74683f339c1'),badge:'단백질 메뉴',weight:300,ingredients:[['새우','베트남산'],['로메인','국내산'],['오이','국내산'],['레몬','미국산']],allergens:['새우'],nutrition:[285,25,26,10,5,420],query:'샐러드'},
 {id:'bulgogi',category:'salad',name:'불고기 현미 샐러드',price:11900,description:'담백한 소불고기와 현미를 담아 든든하게.',image:photo('photo-1547592180-85f173990554'),badge:'든든한 한 끼',weight:340,ingredients:[['소고기','호주산'],['현미','국내산'],['양상추','국내산'],['간장','대두·밀: 미국산']],allergens:['대두','밀'],nutrition:[430,43,29,16,9,560],query:'샐러드'},
 {id:'chickpea',category:'salad',name:'칙피 쿠스쿠스 샐러드',price:9900,description:'병아리콩과 폭신한 쿠스쿠스의 고소한 조화.',image:photo('photo-1512621776951-a57141f2eefd'),badge:'식물성 메뉴',weight:300,ingredients:[['병아리콩','미국산'],['쿠스쿠스','밀: 프랑스산'],['파프리카','국내산']],allergens:['밀'],nutrition:[325,43,13,11,5,280],query:'샐러드'},
 {id:'pumpkin',category:'salad',name:'단호박 렌틸 샐러드',price:9900,description:'달콤한 단호박과 렌틸콩으로 채우는 한 그릇.',image:photo('photo-1547592180-85f173990554'),badge:'식물성 메뉴',weight:300,ingredients:[['단호박','국내산'],['렌틸콩','캐나다산'],['로메인','국내산']],allergens:[],nutrition:[305,41,12,10,10,240],query:'샐러드'},
 {id:'beet',category:'salad',name:'비트 오렌지 샐러드',price:9900,description:'구운 비트와 오렌지로 완성한 상큼한 채소 식단.',image:photo('photo-1512621776951-a57141f2eefd'),badge:'산뜻한 메뉴',weight:280,ingredients:[['비트','국내산'],['오렌지','미국산'],['양상추','국내산'],['올리브유','스페인산']],allergens:[],nutrition:[245,32,5,12,13,190],query:'샐러드'},
 {id:'beetjuice',category:'juice',name:'레드 비트 애플 주스',price:6500,description:'비트와 사과의 산뜻하고 은은한 달콤함.',image:photo('photo-1613478223719-2ab802602423'),badge:'착즙주스',weight:250,ingredients:[['비트','국내산'],['사과','국내산'],['레몬','미국산']],allergens:[],nutrition:[115,27,1,0.3,23,45],query:'사과주스'},
 {id:'berry',category:'juice',name:'베리 요거트 스무디',price:6900,description:'블루베리와 딸기에 부드러운 요거트를 더해요.',image:photo('photo-1610970881699-44a5587cabec'),badge:'스무디',weight:250,ingredients:[['블루베리','칠레산'],['딸기','국내산'],['요거트','우유: 국내산']],allergens:['우유'],nutrition:[175,28,7,4,22,80],query:'요거트'},
 {id:'tomatojuice',category:'juice',name:'퓨어 토마토 주스',price:5900,description:'잘 익은 토마토 본연의 맛을 담은 한 병.',image:photo('photo-1613478223719-2ab802602423'),badge:'채소주스',weight:250,ingredients:[['토마토','국내산']],allergens:['토마토'],nutrition:[55,12,2,0.3,9,35],query:'토마토주스'},
 {id:'pineapple',category:'juice',name:'파인애플 민트 주스',price:6500,description:'달콤한 파인애플에 민트 한 잎의 산뜻함.',image:photo('photo-1613478223719-2ab802602423'),badge:'착즙주스',weight:250,ingredients:[['파인애플','필리핀산'],['민트','국내산'],['레몬','미국산']],allergens:[],nutrition:[125,30,1,0.2,25,15],query:'파인애플주스'},
 {id:'carrot',category:'juice',name:'캐럿 진저 주스',price:6500,description:'당근과 사과에 생강의 향긋함을 살짝.',image:photo('photo-1613478223719-2ab802602423'),badge:'채소주스',weight:250,ingredients:[['당근','국내산'],['사과','국내산'],['생강','국내산']],allergens:[],nutrition:[100,23,2,0.3,18,65],query:'당근주스'},
 {id:'soy',category:'juice',name:'고소한 무가당 두유',price:4900,description:'콩의 고소함을 그대로 즐기는 부드러운 음료.',image:photo('photo-1610970881699-44a5587cabec'),badge:'식물성 음료',weight:250,ingredients:[['대두','국내산'],['정제수','국내산']],allergens:['대두'],nutrition:[125,6,10,7,2,100],query:'두유'}
);
// 식재료에 명시된 토마토도 알레르기 확인 목록에 반영합니다.
PRODUCTS.forEach(product=>{if(product.ingredients.some(([name])=>name.includes('토마토'))&&!product.allergens.includes('토마토'))product.allergens.push('토마토');});
// 구독 출고 가능 요일: 월·수·금
const SHIPPING_DAYS=[1,3,5];
const CATEGORIES={salad:'샐러드',juice:'주스·음료',sandwich:'샌드위치',lunch:'도시락'};
const ALLERGENS=['우유','달걀','밀','대두','견과류','생선','새우','토마토'];
const money=value=>new Intl.NumberFormat('ko-KR').format(value)+'원';
const escapeHTML=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const nutritionLabels=['칼로리','탄수화물','단백질','지방','당류','나트륨'];
const nutritionUnits=['kcal','g','g','g','g','mg'];

/* 날짜 기반 결정적 편성: 달력과 구독 모두 이 함수를 사용합니다.
   같은 날짜는 항상 같은 두 메뉴를 반환합니다. 샐러드 상품을 추가하면 편성에도 반영됩니다. */
// 4주·12출고 순환 식단: 단백질 중심 메뉴와 채소·곡물 중심 메뉴를 조합합니다.
// 전문 식단 처방이 아닌 과제용 샘플이며, 영양값은 제품별 샘플입니다.
const MENU_CYCLE=[['green','chicken'],['tofu','sweetpotato'],['egg','mushroom'],['salmon','chickpea'],['shrimp','pumpkin'],['bulgogi','beet'],['chicken','chickpea'],['tofu','beet'],['egg','pumpkin'],['salmon','sweetpotato'],['shrimp','mushroom'],['bulgogi','green']];
function menuForDate(dateString){
 const date=new Date(dateString+'T12:00:00');
 const ordinal=Math.floor(Date.UTC(date.getFullYear(),date.getMonth(),date.getDate())/86400000);
 const monday=ordinal-((date.getDay()+6)%7);
 const week=Math.floor((monday-4)/7); // 1970-01-05 월요일을 공통 기준일로 사용
 const slot={1:0,3:1,5:2}[date.getDay()]??0;
 const index=((week*3+slot)%MENU_CYCLE.length+MENU_CYCLE.length)%MENU_CYCLE.length;
 return [...MENU_CYCLE[index]];
}
function nextWeekdayDate(startString,weekday){
 const date=new Date((startString||new Date().toLocaleDateString('sv-SE'))+'T12:00:00');
 while(date.getDay()!==weekday)date.setDate(date.getDate()+1);
 return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}

