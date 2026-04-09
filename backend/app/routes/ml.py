

from kakao_utils import get_coords # 기존 카카오 함수
from flask import Flask, request, jsonify, Blueprint
from flask_cors import CORS

# 🚨 [새로 추가된 라이브러리] AI 추천 엔진용
import pandas as pd
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import math
import os

ml_bp = Blueprint("ml", __name__)


@ml_bp.route('/aaaa', methods = ['POST', 'OPTIONS'])
def aaa():
    return 'aaa'

app = Flask(__name__)
CORS(app)
app.json.ensure_ascii = False

# =====================================================================
# 🚨 [핵심 추가 1] AI 모델 & 데이터 전역 로딩 (Global Load)
# 서버가 켜질 때 딱 한 번만 실행되어 메모리에 상주합니다.
# =====================================================================
print("⏳ AI 추천 모델 및 훈련 데이터 로드 중... (약 10~20초 소요)")
try:
    programs_df = pd.read_csv('final_programs_with_ai_keywords.csv')
    
    # 1. 방어 로직: NaN 값을 빈 문자열로 치환 (문자열 덧셈 시 에러 및 데이터 오염 방지)
    programs_df = programs_df.fillna('')
    
    # 2. 5대 키워드 하나로 합치기 
    keyword_combined = (
        programs_df['분야'].astype(str) + " " +
        programs_df['기술'].astype(str) + " " +
        programs_df['도구'].astype(str) + " " +
        programs_df['업무'].astype(str) + " " +
        programs_df['메타'].astype(str)
    )
    
    # 3. 훈련명 + 요약 + 5대 키워드를 모두 합쳐서 최종 AI 학습용 텍스트 생성
    programs_df['ml_keywords'] = programs_df['title'] + " " + keyword_combined
    
    # 4. 모델 로드 및 임베딩 진행 (이제 키워드까지 모두 포함된 텍스트로 벡터화됨)
    model = SentenceTransformer('jhgan/ko-sroberta-multitask')
    print("✅ AI 추천 시스템 및 5대 키워드 정답지 준비 완료!")
except Exception as e:
    # 혹시 파일이 없을 경우를 대비한 방어 코드
    programs_df = pd.DataFrame() 
    print(f"⚠️ 추천 데이터 또는 모델을 불러오지 못했습니다: {e}")
# =====================================================================


   

# ---------------------------------------------------------------------
# 기존 API 2: 회원가입 및 카카오 좌표 변환
# ---------------------------------------------------------------------
@ml_bp.route('/signup', methods=['POST', 'OPTIONS'])
def signup():
    data = request.get_json()
    address = data.get('region')
    
    # 카카오 API 연동 (kakao_utils.py 필요)
    lat, lng = get_coords(address)
    
    # TODO: DB 저장 로직 추가
    
    return jsonify({"message": "회원가입 성공, 좌표 저장 완료"})




# =====================================================================
# 🚨 [핵심 추가 2] 추천 엔진 API 라우터
# 프론트엔드(ProgramExplorePage.js)에서 호출하는 주소입니다.
# =====================================================================
@ml_bp.route('/explore', methods=['POST', 'OPTIONS'])
def explore_programs():

    # 방어로직:JSON 데이터가 없거나 잘못됐을때 뻗지 않도록 처리
    req_data = request.get_json(silent=True)
    if not req_data:
        req_data={}

    region_filter = req_data.get('region', '전국')
    price_filter = req_data.get('price', 'all')
    sort_option = req_data.get('sortOption', 'recommend')

        
    # 1. DB에서 현재 로그인한 유저 정보를 가져왔다고 가정 (시뮬레이션)
    user_jobs = ["인공지능학습데이터구축", "IT·인공지능"] 
    user_intent = " ".join(user_jobs)

    # 2. SBERT 유사도 계산
    user_embedding = model.encode([user_intent])
    program_embeddings = model.encode(programs_df['ml_keywords'].tolist())
    similarities = cosine_similarity(user_embedding, program_embeddings).flatten()
    
    df_result = programs_df.copy()
    df_result['matchScore'] = [math.ceil(score * 100) for score in similarities]

    # 3. 프론트엔드 필터링 적용 (지역 및 가격)
    if region_filter != "전국":
        df_result = df_result[df_result['address'].str.contains(region_filter, na=False)]
    
    if price_filter == "free":
        df_result = df_result[df_result['self_pay'] == 0]
    elif price_filter == "under_10":
        df_result = df_result[df_result['self_pay'] < 100000]

    # 4. 프론트엔드 정렬 조건 적용
    if sort_option == "recommend":
        df_result = df_result.sort_values(by='matchScore', ascending=False)
    elif sort_option == "price_asc":
        df_result = df_result.sort_values(by='self_pay', ascending=True)

    # 5. 키워드 생성 로직
    final_results = []
    
    # 필터링된 데이터(df_result)를 8개만 뽑아서 프론트엔드에 보낼 준비를 합니다.
    for idx, row in df_result.head(8).iterrows(): 
        
        # 🚨 예전의 복잡한 매칭 로직은 다 지우고, 
        # 새 CSV 파일에 있는 5개 기둥(분야, 기술, 도구, 업무, 메타)을 그대로 가져옵니다.
        raw_keywords = [
            str(row.get('분야', '')),
            str(row.get('기술', '')),
            str(row.get('도구', '')),
            str(row.get('업무', '')),
            str(row.get('메타', ''))
        ]
        
        # 'nan', '기타', '미분류' 등 쓸모없는 값을 걸러내고 깔끔한 배열로 만듭니다.
        clean_keywords = [
            kw.strip() for kw in raw_keywords 
            if kw.strip() and kw.strip().lower() != 'nan' and kw.strip() not in ['기타', '미분류', '일반', '공통']
        ]

        # 프론트엔드가 요구하는 형식에 맞춰서 딕셔너리로 포장합니다.
        final_results.append({
            "id": f"TRPR_{idx}", 
            "title": row.get("title", "제목 없음"),
            "institution": row.get("institution", "기관 없음"),
            "region": str(row.get("address", "지역 미상")).split()[0], 
            "cost": int(row.get("self_pay", 0)),
            "isFree": bool(row.get("is_free", False)),
            "matchScore": int(row.get("matchScore", 0)), # 🚨 [수정됨] 95점이 아니라 AI가 계산한 진짜 점수 장착!
            "keywords": clean_keywords 
        })

    return jsonify(final_results)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)