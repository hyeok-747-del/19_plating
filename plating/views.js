/* HTML 두 개를 유지하면서 URL별 화면을 분리합니다. 뒤로가기와 직접 링크도 지원합니다. */
const PAGE_TITLES={home:'매일의 건강을 플레이팅하다',menu:'이번 달의 메뉴',subscribe:'정기구독 신청',history:'나의 구독'};
function navigateTo(page,push=true){
 if(!PAGE_TITLES[page])page='home';
 if(push){const url=new URL(location.href);url.searchParams.set('page',page);url.hash='';history.pushState({page},'',url);}
 document.querySelectorAll('[data-page]').forEach(section=>section.hidden=section.dataset.page!==page);
 document.querySelectorAll('header nav a').forEach(link=>{const active=new URL(link.href).searchParams.get('page')===page;if(active)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});
 document.title=PAGE_TITLES[page]+' · PLATING';document.body.dataset.currentPage=page;
 window.scrollTo({top:0,behavior:'instant'});if(page==='subscribe')requestAnimationFrame(()=>DeliveryService.refreshMap());
 const heading=document.querySelector(`[data-page="${page}"] h1,[data-page="${page}"] h2`);
 if(push&&heading){heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true});}
}
document.addEventListener('click',event=>{const link=event.target.closest('a[href]');if(!link||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||event.button!==0||link.target)return;const url=new URL(link.href);if(url.origin===location.origin&&(url.pathname.endsWith('/index.html')||url.pathname===location.pathname)&&!url.searchParams.has('id')){event.preventDefault();navigateTo(url.searchParams.get('page')||url.hash.slice(1)||'home');}});
window.addEventListener('popstate',()=>navigateTo(new URLSearchParams(location.search).get('page')||location.hash.slice(1)||'home',false));

let calendarMonth=new Date();calendarMonth=new Date(calendarMonth.getFullYear(),calendarMonth.getMonth(),1);
function renderCalendar(){
 const year=calendarMonth.getFullYear(),month=calendarMonth.getMonth();
 document.querySelector('#calendar-title').textContent=`${year}년 ${month+1}월`;
 const offset=(new Date(year,month,1).getDay()+6)%7,days=new Date(year,month+1,0).getDate();
 const today=localDate(new Date());const cells=[];
 for(let i=0;i<Math.ceil((offset+days)/7)*7;i++){
  const day=i-offset+1;if(day<1||day>days){cells.push('<td class="calendar-empty"></td>');continue;}
  const date=`${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
  const shipping=[1,3,5].includes(new Date(date+'T12:00:00').getDay());
  const products=(shipping?menuForDate(date):[]).map(id=>PRODUCTS.find(p=>p.id===id));
  cells.push(`<td class="${shipping?'shipping-day':'rest-day'} ${today===date?'is-today':''}"><div class="calendar-day"><time datetime="${date}">${day}</time>${shipping?'<span>출고 · 2팩</span>':'<small>배송 없음</small>'}</div>${products.map(p=>`<a class="calendar-dish" href="detail.html?id=${p.id}"><img src="${p.image}" alt="" loading="lazy"><span>${p.name}</span></a>`).join('')}${shipping?`<p class="calendar-allergens">알레르기: ${[...new Set(products.flatMap(p=>p.allergens))].join(', ')||'등록 없음'}</p>`:'<p class="no-delivery">쉬어가는 날<br>월·수·금에 만나요.</p>'}</td>`);
 }
 document.querySelector('#calendar-body').innerHTML=Array.from({length:cells.length/7},(_,i)=>'<tr>'+cells.slice(i*7,i*7+7).join('')+'</tr>').join('');
}
document.querySelector('#previous-month').addEventListener('click',()=>{calendarMonth.setMonth(calendarMonth.getMonth()-1);renderCalendar();});
document.querySelector('#next-month').addEventListener('click',()=>{calendarMonth.setMonth(calendarMonth.getMonth()+1);renderCalendar();});
document.querySelector('#current-month').addEventListener('click',()=>{const now=new Date();calendarMonth=new Date(now.getFullYear(),now.getMonth(),1);renderCalendar();});

// 이용후기 슬라이드 데이터
const REVIEWS=[
 {name:'박지혁',title:'점심시간이 조금 여유로워졌어요.',text:'출근길에 챙겨 두면 메뉴 고민이 줄어요. 아삭한 채소가 있는 점심이 제법 좋은 습관이 됐어요.',image:PRODUCTS[0].image,tag:'직장인의 점심 루틴'},
 {name:'김민준',title:'운동 다음 날에도 든든하게.',text:'출고 일정을 미리 볼 수 있어 준비하기 편해요. 두 팩이라 한 팩은 가족과 나눠 먹기에도 좋아요.',image:PRODUCTS[1].image,tag:'운동과 함께하는 한 끼'},
 {name:'이수연',title:'냉장고에 건강한 선택을 채워요.',text:'월간 식단표에서 다음 메뉴를 보는 재미가 있어요. 바쁜 날에도 제 식사를 챙기게 되더라고요.',image:PRODUCTS[5].image,tag:'나를 돌보는 저녁'},
 {name:'최도윤',title:'같이 먹으니 더 꾸준해져요.',text:'월요일과 금요일로 골라 두었어요. 서로 다른 메뉴 두 팩을 나누면서 식사하는 시간이 즐거워졌어요.',image:PRODUCTS[6].image,tag:'둘이 함께하는 식탁'}
];
const maskReviewName=name=>name.length>2?name[0]+'*'.repeat(name.length-2)+name.at(-1):name[0]+'*';
const reviewMarkup=REVIEWS.map(review=>`<article class="review-card"><img src="${review.image}" alt="${review.tag} 연출 사진" loading="lazy"><div class="review-copy"><span class="review-tag">${review.tag}</span><div class="review-stars" aria-label="평점 5점">★★★★★</div><h3>${review.title}</h3><p>${review.text}</p><small>${maskReviewName(review.name)} 님 · 이용후기</small></div></article>`).join('');
document.querySelector('#reviews-track').innerHTML=`<div class="review-group">${reviewMarkup}</div><div class="review-group" aria-hidden="true" inert>${reviewMarkup}</div>`;
renderCalendar();navigateTo(new URLSearchParams(location.search).get('page')||location.hash.slice(1)||'home',false);
