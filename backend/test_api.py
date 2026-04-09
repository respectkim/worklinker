# import requests
# import json

# url = "http://127.0.0.1:5000/api/explore"
# payload = {
#     "region": "서울", 
#     "price": "all", 
#     "sortOption": "recommend"
# }

# try:
#     response = requests.post(url, json=payload)
#     print("🎯 [API 응답 결과]")
#     print(json.dumps(response.json(), indent=2, ensure_ascii=False))
# except Exception as e:
#     print(f"❌ 접속 실패: {e}")