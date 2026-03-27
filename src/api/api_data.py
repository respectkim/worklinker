import requests
import json
import pandas as pd

url = 'https://www.work24.go.kr/cm/openApi/call/hr/callOpenApiSvcInfo310L02.do' 
params = {
    'authKey': '0d027736-50f0-4d46-9380-31219e3172ba', 
    'returnType': 'json',
    'outType': '1',
    'srchTrprId' : 'AIG20240000498014',
    'srchTrprDegr' : '3',
    'srchTorgId' : '500033360494'
}

try:
    print("🚀 훈련과정 및 기관 기초 정보(outType=1)를 수집 중입니다...")
    response = requests.get(url, params=params)
    response.raise_for_status()
    data = response.json() 

    # 1. API가 JSON을 문자열로 한 번 더 묶어서 보낼 경우를 대비한 파싱 로직
    if 'returnJSON' in data and isinstance(data['returnJSON'], str):
        try:
            parsed_data = json.loads(data['returnJSON'])
        except json.JSONDecodeError:
            parsed_data = data
    else:
        parsed_data = data.get('returnJSON', data)
        
    # 2. 데이터 존재 여부 확인
    if not parsed_data:
         print("📭 응답은 성공했으나 데이터가 없습니다.")
    else:
        # 3. 데이터프레임 변환 및 엑셀 저장
        # 상세 정보는 여러 계층으로 이루어진 딕셔너리(JSON Object) 형태일 확률이 높습니다.
        if isinstance(parsed_data, dict):
            # 🚨 핵심: json_normalize를 사용해 중첩된 데이터를 1차원 엑셀 표로 평탄화합니다.npm
            df = pd.json_normalize(parsed_data)
        elif isinstance(parsed_data, list):
            df = pd.DataFrame(parsed_data)
        else:
            df = pd.DataFrame([{"info": str(parsed_data)}])

        file_name = "go24_basic_info.xlsx"
        df.to_excel(file_name, index=False)
        
        print(f"✅ 수집 완료! 기관 기초/상세정보가 '{file_name}'에 저장되었습니다.")
        
        # 터미널에서 데이터 샘플 바로 확인
        print("\n🚀 [상세정보 데이터 샘플]")
        if isinstance(parsed_data, list):
            print(json.dumps(parsed_data[0], indent=4, ensure_ascii=False))
        else:
            print(json.dumps(parsed_data, indent=4, ensure_ascii=False))

except Exception as e:
    print(f"❌ 오류 발생: {e}")



