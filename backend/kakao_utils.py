import requests

KAKAO_REST_API_KEY = "7fa68b0f58981922fb6606caef31e6ac"

def get_coords(address):
    """주소를 넣으면 좌표를 반환하는 공통 함수"""
    url = "https://dapi.kakao.com/v2/local/search/address.json"
    headers = {"Authorization": f"KakaoAK {KAKAO_REST_API_KEY}"}
    params = {"query": address}
    
    try:
        res = requests.get(url, headers=headers, params=params)
        res.raise_for_status()
        docs = res.json().get('documents')
        if docs:
            return float(docs[0]['y']), float(docs[0]['x']) # 위도, 경도
    except:
        return None, None