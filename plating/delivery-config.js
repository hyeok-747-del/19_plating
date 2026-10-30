/* 카카오 Developers에서 발급한 JavaScript 키를 입력하세요. REST API 키가 아닙니다.
   앱의 카카오맵 사용 설정과 웹 도메인 등록도 필요합니다. README의 설정 방법을 참고하세요. */
const DELIVERY_CONFIG = {
  kakaoJavascriptKey: "26804abeee894963afaed2c774a96c3f",
  city: "대구광역시",
  allowedDistricts: ["동구", "중구", "수성구", "북구"],
  // 주소 원문이 아닌 API의 region_type=H 행정동 필드를 정확히 비교합니다.
  excludedAdministrativeDongs: [
    { district: "수성구", dong: "파동" },
    { district: "북구", dong: "관문동" },
    { district: "북구", dong: "태전1동" },
    { district: "북구", dong: "태전2동" },
    { district: "북구", dong: "구암동" },
    { district: "북구", dong: "읍내동" },
    { district: "북구", dong: "동천동" },
    { district: "북구", dong: "국우동" },
  ],
  // 코드로 제외 지역을 추가할 때만 사용합니다. 실제 API 응답을 확인한 코드만 넣으세요.
  // 코드는 추측하지 않습니다. 실제 응답 기록은 tests/kakao-public-addresses.json을 참고하세요.
  excludedAdministrativeCodes: [],
};
