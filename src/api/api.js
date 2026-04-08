// import requests

// def fetch_work24_2026_courses(api_key, keyword=''):
//     """
//     고용24(Work24) API 기반 2026년 무료 훈련과정 수집
//     """
//     # 🚨 팩트 체크: 회원님이 주신 Info 페이지에 대응하는 실제 호출(Call) 주소입니다.
//     url = "https://www.work24.go.kr/cm/openApi/call/wk/callOpenApiSvc210L01.do"
    
//     params = {
//         "authKey": api_key,
//         "returnType": "JSON",          # ✅ 조건 1: JSON 타입 리턴
//         "outType": "1",                # 리스트 형태 출력
//         "pageNum": "1",
//         "pageSize": "100",
//         "srchTraStdt": "20260101",     # ✅ 조건 2: 2026년 시작일
//         "srchTraEndt": "20261231",     # ✅ 조건 2: 2026년 종료일
//         "srchTraNm": keyword,          # 검색어
//         "sort": "DESC",
//         "sortCol": "TR_STDT"           # 개강일 순 정렬
//     }

//     try:
//         response = requests.get(url, params=params)
//         response.raise_for_status()
        
//         # 고용24 API는 응답 구조가 복잡할 수 있어 안전하게 추출합니다.
//         data = response.json()
        
//         # 실제 데이터가 담긴 리스트 경로 (규격서에 따라 srchList 또는 resultList)
//         # 보통 고용24는 resultList 혹은 srchList 명칭을 사용합니다.
//         raw_list = data.get('srchList', [])
        
//         refined_data = []
//         for item in raw_list:
//             # ✅ 조건 3: 무료 강의(자부담금 0원) 필터링
//             # 고용24 API 필드명 중 'realTraPrce'(실수강료)가 '0'인 것을 확인합니다.
//             real_price = item.get('realTraPrce', '0')
            
//             if real_price == '0' or real_price == 0:
//                 refined_data.append({
//                     'title': item.get('trNm'),           # 훈련과정명
//                     'center': item.get('instNm'),         # 훈련기관명
//                     'duration': f"{item.get('traStdt')} ~ {item.get('traEndt')}", # 기간
//                     'price': "전액무료",
//                     'region': item.get('instAddr'),       # 지역
//                     'course_id': item.get('trprId'),      # 과정ID
//                     'ncs_code': item.get('ncsCd')         # NCS 코드 (추천 모델용 핵심 데이터)
//                 })

//         print(f"✅ 2026년 무료 교육 {len(refined_data)}건 파싱 성공")
//         return refined_data

//     except Exception as e:
//         print(f"❌ 고용24 API 연동 실패: {e}")
//         return []

// # 사용 예시
// # my_api_key = "회원님의_고용24_인증키"
// # courses = fetch_work24_2026_courses(my_api_key, "IT")
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

