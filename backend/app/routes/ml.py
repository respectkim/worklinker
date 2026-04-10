

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


# @ml_bp.route('/aaaa', methods = ['POST', 'OPTIONS'])
# def aaa():
#     return 'aaa'

app = Flask(__name__)
CORS(app)
app.json.ensure_ascii = False

# =====================================================================
# 🚨 [핵심 추가 1] AI 모델 & 데이터 전역 로딩 (Global Load)
# 서버가 켜질 때 딱 한 번만 실행되어 메모리에 상주합니다.
# =====================================================================
print("⏳ AI 추천 모델 및 훈련 데이터 로드 중...")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.abspath(
    os.path.join(BASE_DIR, "..", "..", "final_programs_with_ai_keywords.csv")
)

try:
    programs_df = pd.read_csv(CSV_PATH)
    programs_df = programs_df.fillna('')

    keyword_combined = (
        programs_df['분야'].astype(str) + " " +
        programs_df['기술'].astype(str) + " " +
        programs_df['도구'].astype(str) + " " +
        programs_df['업무'].astype(str) + " " +
        programs_df['메타'].astype(str)
    )

    programs_df['ml_keywords'] = programs_df['title'].astype(str) + " " + keyword_combined

    model = SentenceTransformer('jhgan/ko-sroberta-multitask')
    program_embeddings = model.encode(
        programs_df['ml_keywords'].tolist(),
        convert_to_numpy=True
    )

    print("✅ AI 추천 시스템 준비 완료")
except Exception as e:
    programs_df = pd.DataFrame()
    program_embeddings = []
    model = None
    print(f"⚠️ 추천 데이터 또는 모델 로드 실패: {e}")


@ml_bp.route('/explore', methods=['POST', 'OPTIONS'])
def explore_programs():
    if request.method == 'OPTIONS':
        return jsonify({"ok": True}), 200

    if programs_df.empty or model is None:
        return jsonify({
            "ok": False,
            "error": "추천 데이터가 준비되지 않았습니다."
        }), 500

    req_data = request.get_json(silent=True) or {}

    region_filter = req_data.get('region', '전국')
    category_filter = req_data.get('category', '전체')
    price_filter = req_data.get('price', 'all')
    sort_option = req_data.get('sortOption', 'recommend')
    mode = req_data.get('mode', 'hybrid')
    selected_jobs = req_data.get('selectedJobs') or []

    if not isinstance(selected_jobs, list):
      selected_jobs = []

    user_jobs = [str(job).strip() for job in selected_jobs if str(job).strip()]

    if not user_jobs:
        return jsonify({
            "ok": False,
            "error": "selectedJobs가 없습니다."
        }), 400

    user_intent = " ".join(user_jobs)

    user_embedding = model.encode([user_intent], convert_to_numpy=True)
    similarities = cosine_similarity(user_embedding, program_embeddings).flatten()

    df_result = programs_df.copy()
    df_result['jobScore'] = [math.ceil(score * 100) for score in similarities]

    # 분야 필터
    if category_filter != "전체" and '분야' in df_result.columns:
        df_result = df_result[
            df_result['분야'].astype(str).str.contains(category_filter, na=False)
        ]

    # 지역 매칭 여부
    if region_filter != "전국":
        df_result['regionMatched'] = df_result['address'].astype(str).str.contains(region_filter, na=False)
    else:
        df_result['regionMatched'] = True

    # 가격 필터
    if price_filter == "free":
        df_result = df_result[pd.to_numeric(df_result['self_pay'], errors='coerce').fillna(0) == 0]
    elif price_filter == "under_10":
        df_result = df_result[pd.to_numeric(df_result['self_pay'], errors='coerce').fillna(0) < 100000]

    # 탭 모드별 점수 계산
    if mode == 'job':
        df_result['matchScore'] = df_result['jobScore']
    elif mode == 'region':
        df_result['matchScore'] = df_result['jobScore'] + df_result['regionMatched'].apply(
            lambda x: 20 if x else 0
        )
    else:  # hybrid
        df_result['matchScore'] = df_result['jobScore'] + df_result['regionMatched'].apply(
            lambda x: 10 if x else 0
        )

    # 정렬
    if sort_option == "recommend":
        df_result = df_result.sort_values(by='matchScore', ascending=False)
    elif sort_option == "price_asc":
        df_result['self_pay_num'] = pd.to_numeric(df_result['self_pay'], errors='coerce').fillna(0)
        df_result = df_result.sort_values(by='self_pay_num', ascending=True)
    elif sort_option == "date_asc" and 'start_date' in df_result.columns:
        df_result = df_result.sort_values(by='start_date', ascending=True)

    final_results = []

    for idx, row in df_result.head(8).iterrows():
        raw_keywords = [
            str(row.get('분야', '')),
            str(row.get('기술', '')),
            str(row.get('도구', '')),
            str(row.get('업무', '')),
            str(row.get('메타', '')),
        ]

        clean_keywords = [
            kw.strip()
            for kw in raw_keywords
            if kw.strip()
            and kw.strip().lower() != 'nan'
            and kw.strip() not in ['기타', '미분류', '일반', '공통']
        ]

        cost_value = pd.to_numeric(pd.Series([row.get("self_pay", 0)]), errors='coerce').fillna(0).iloc[0]

        final_results.append({
            "id": f"TRPR_{idx}",
            "title": row.get("title", "제목 없음"),
            "institution": row.get("institution", "기관 없음"),
            "region": str(row.get("address", "지역 미상")).split()[0],
            "cost": int(cost_value),
            "isFree": int(cost_value) == 0,
            "matchScore": int(row.get("matchScore", 0)),
            "keywords": clean_keywords,
        })

    return jsonify({
        "ok": True,
        "recommendations": final_results,
        "count": len(final_results)
    })