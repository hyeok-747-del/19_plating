# PLATING · 플레팅

매일의 건강을 플레이팅하다.

HTML·CSS·Vanilla JavaScript로 만든 건강식 정기구독 웹앱입니다.

- **첫 번째 페이지** `plating/index.html`: 월·수·금 식단 캘린더, 구독 신청·조회·수정·삭제(localStorage), 배송지역 확인
- **두 번째 페이지** `plating/detail.html`: 상품 상세와 USDA FoodData Central API 영양정보 조회
- 샐러드 12종·주스/음료 8종, 알레르기 경고와 대체 샐러드 2팩 선택
- 주 1·2·3회 및 1·2·3·4주 플랜, 배송일·팩 수·금액 계산
- PC·모바일 반응형 디자인

## 실행

VS Code에서 프로젝트를 열고 `plating/index.html`을 우클릭 → **Open with Live Server**를 선택하세요. 빌드나 패키지 설치는 필요 없습니다.

카카오 배송지 확인에는 앱의 JavaScript 키와 실행 도메인 등록이 필요합니다. USDA 영양정보는 공식 DEMO_KEY로 조회하거나 개인 키를 입력할 수 있습니다.

- [실행·API 설정·CRUD 사용 설명](plating/README.md)
- [배송지역 수동 테스트](plating/DELIVERY_TESTS.md)
- [검증 기록](plating/VALIDATION.md)

`qa_check.py`는 Python과 로컬 Chrome을 사용하는 기능 검사 도구입니다. `tests/`에는 공개 관공서 주소로 받은 카카오 응답 회귀검사 자료가 있습니다. 고객 개인정보는 포함하지 않습니다.

과제용 서비스이며 실제 결제는 진행하지 않습니다. 이름·연락처·구독 내역은 브라우저 localStorage에 저장하고, 주소 검색 시에는 주소와 좌표를 카카오에 전송합니다.
