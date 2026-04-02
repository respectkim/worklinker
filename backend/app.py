from kakao_utils import get_coords # 카카오에서 만든 함수 불러오기
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.json.ensure_ascii = False

@app.route('/api/check-id', methods=['POST'])
def check_id():
    data = request.get_json()
    user_id = data.get('id')

    if not user_id:
        return jsonify({"status": "error", "message": "아이디가 누락되었습니다."}), 400

    # 🚨 [팩트 체크] 팀원에게 전달할 사항:
    # 아직 DB가 완벽히 연동되지 않았으므로 임시로 'admin', 'test'만 막아둡니다.
    # 팀원이 DB 연동을 마치면 이 부분을 실제 SQL 쿼리(SELECT username FROM users WHERE username = ...)로 교체해야 합니다.
    
    existing_users = ['admin', 'test', 'manager'] # 임시 가짜 DB
    
    if user_id in existing_users:
        return jsonify({"status": "duplicate", "message": "이미 사용 중인 아이디입니다."})
    else:
        return jsonify({"status": "available", "message": "사용 가능한 아이디입니다."})
    

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    address = data.get('region') # 사용자가 입력한 주소 (예: 서울시 마포구...)
    
    # 🚨 여기서 카카오 API 연동!
    lat, lng = get_coords(address)
    
    # DB 저장 로직 (팀원분이 짠 코드에 붙여넣기)
    # INSERT INTO users (username, region, latitude, longitude ...) 
    # VALUES (data['username'], address, lat, lng ...)
    
    return jsonify({"message": "회원가입 성공, 좌표 저장 완료"})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)