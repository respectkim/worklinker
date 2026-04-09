import requests
import pandas as pd
import time

API_KEY = "0d027736-50f0-4d46-9380-31219e3172ba"
LIST_URL = "https://www.work24.go.kr/cm/openApi/call/hr/callOpenApiSvcInfo310L01.do"
DETAIL_URL = "https://www.work24.go.kr/cm/openApi/call/hr/callOpenApiSvcInfo310L02.do"

def fetch_master_data():
    # 1. 목록(L01) 수집
    list_params = {
        'authKey': API_KEY, 'returnType': 'JSON', 'outType': '1',
        'pageNum': '1', 'pageSize': '50', 'srchTraArea1': '11'
    }
    
    res = requests.get(LIST_URL, params=list_params)
    items = res.json().get('srchList', [])
    
    if not items:
        print("❌ 목록 데이터가 없습니다."); return

    final_results = []

    for item in items:
        # 🚨 명세서 기반 파라미터 매핑 수정
        # L01 응답에서 ID를 찾지 못할 경우를 대비해 가능한 키들을 체크합니다.
        trpr_id = item.get('trprId') or item.get('trainCourseId') or item.get('trpr_id')
        trpr_degr = item.get('trprDegr')
        torg_id = item.get('instCd') or item.get('instC') # 명세서상 instCd

        if not trpr_id:
            print(f"⚠️ '{item.get('title')}' 과정의 ID(trprId)를 목록에서 찾을 수 없어 상세조회를 건너뜁니다.")
            continue

        # 2. 상세(L02) 호출 파라미터 (명세서 규격 일치)
        detail_params = {
            'authKey': API_KEY, 'returnType': 'json', 'outType': '1',
            'srchTrprId': trpr_id, 
            'srchTrprDegr': trpr_degr, 
            'srchTorgId': torg_id
        }
        
        try:
            # 💡 상세 API 호출
            detail_res = requests.get(DETAIL_URL, params=detail_params)
            
            # HTML 에러 페이지가 왔는지 체크 (Expecting value 에러 방지)
            if detail_res.status_code != 200 or '<html' in detail_res.text:
                print(f"❌ 상세 정보 호출 에러 (ID: {trpr_id}): 서버가 데이터를 주지 않음")
                continue

            data = detail_res.json()
            base = data.get('inst_base_info', {})
            detail = data.get('inst_detail_info', {})

            # 3. 팩트 체크 반영: 자부담금 vs 정부지원금
            self_pay = detail.get('tgcrGnrlTrneOwepAllt', '0') # 본인부담액
            # gov_pay = base.get('perTrco', '0')                # 정부지원금
            ncs_name = base.get('ncsNm', '미분류') 

            # 4. 데이터 저장
            final_results.append({
                'title': base.get('trprNm', item.get('title')),
                'institution': item.get('subTitle'),
                'address': f"{base.get('addr1', '')} {base.get('addr2', '')}".strip(),
                'ncsNm': ncs_name,  # 🚨 드디어 ncsNm 열이 추가되었습니다!
                'self_pay': self_pay,
                'summary': base.get('trprTarget', '') # 훈련대상
            })
            print(f"✅ 수집 완료: {item.get('title')[:15]}...")

        except Exception as e:
            print(f"❌ 처리 중 오류 발생: {e}")
        
        time.sleep(0.5)

    # 5. 결과 저장
    pd.DataFrame(final_results).to_csv('final_checked_data.csv', index=False, encoding='utf-8-sig')
    print("\n✨ 모든 작업이 완료되었습니다.")

if __name__ == "__main__":
    fetch_master_data()

