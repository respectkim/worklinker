import requests
import json
import pandas as pd

# 1. API 설정 (훈련과정 명세서 팩트 체크)
# 서비스 URL: http://apis.data.go.kr/B490007/ncsTrainingCource/openapi18 [cite: 44, 50]
url = 'http://apis.data.go.kr/B490007/ncsTrainingCource/openapi18'
params = {
    # 🚨 팩트 체크: 지난번처럼 인코딩되지 않은 '순수 키'를 사용합니다.
    'serviceKey': 'Bspt2k1Cwz+AzXf14a+2/BX6cmnlr1C8VayBowNY71YDMIhCoWmSRAdO0hEFwL2m4+QvlkTW3TxOMjZKH7i3hw==', 
    'pageNo': '1', 
    'numOfRows': '100', 
    'returnType': 'json', # 🚨 JSON으로 받으면 BeautifulSoup이 필요 없습니다. 
    'ncsLclasCd': '01'    # 대분류코드 01: 사업관리 [cite: 52]
}

try:
    print("🚀 NCS 훈련과정 데이터를 수집 중입니다...")
    response = requests.get(url, params=params)
    response.raise_for_status()

    # 2. JSON 데이터 파싱 (기계적으로 처리 가능)
    data = response.json() 

    # 🚨 이전 디버깅 결과에 따라 데이터는 'data' 키에 들어있을 확률이 높습니다. [cite: 58]
    items = data.get('data', []) 

    if items:
        print(f"✅ 수집 성공! 총 {len(items)}건의 훈련과정을 찾았습니다.")
        
        # 3. 엑셀 파일 생성 (Pandas 활용)
        df = pd.DataFrame(items)
        df.to_excel("ncs_training_data.xlsx", index=False)
        print("📊 'ncs_training_data.xlsx' 파일이 생성되었습니다.")
        
        # 4. 샘플 데이터 출력 (한글 깨짐 방지)
        print("\n🔥 [훈련과정 데이터 샘플]")
        print(json.dumps(items[0], indent=4, ensure_ascii=False))
    else:
        print("📭 응답은 왔으나 훈련과정 데이터가 없습니다. 응답 구조를 확인하세요.")
        print(data)

except Exception as e:
    print(f"❌ 오류 발생: {e}")