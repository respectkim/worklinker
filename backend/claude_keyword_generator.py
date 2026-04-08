import pandas as pd
from anthropic import Anthropic
import json
import time
import os
from dotenv import load_dotenv

# 1. 클로드 API 설정 (환경변수나 직접 입력)
# 보안을 위해 API 키는 환경변수 설정을 권장합니다.
load_dotenv()
api_key = os.getenv('ANTHROPIC_API_KEY')
client = Anthropic(api_key=api_key)
MODEL_NAME = "claude-sonnet-4-5-20250929" # 가장 똑똑한 모델 선택

# 2. 데이터 로드
programs_df = pd.read_csv('final_checked_data.csv')
reference_df = pd.read_csv('키워드 분류_완.csv').head(5) # 연구원님의 정답지 5개를 예시로 활용

def get_keywords_from_claude(title, ncs_nm):
    system_prompt = f"""
    당신은 중장년 재취업 훈련 과정을 분석하는 전문가입니다. 
    JSON 형식으로만 답변하고, 앞뒤에 어떠한 설명도 붙이지 마세요.
    형식: {{"분야": "...", "기술": "...", "도구": "...", "업무": "...", "메타": "..."}}

    [참고 예시]
    {reference_df.to_dict(orient='records')[:3]}
    """

    user_input = f"훈련 과정명: {title}\nNCS 분류: {ncs_nm}"

    try:
        message = client.messages.create(
            model="claude-sonnet-4-5-20250929", # 🚨 안정적인 모델명으로 교체
            max_tokens=500,
            temperature=0,
            system=system_prompt,
            messages=[{"role": "user", "content": user_input}]
        )
        
        # 1. 클로드의 원본 답변 가져오기
        raw_text = message.content[0].text.strip()
        
        # 🚨 [디버깅] 클로드가 진짜 뭐라고 하는지 터미널에 찍어봅니다.
        # 만약 여기서 아무것도 안 찍힌다면 API 크레딧 문제입니다.
        # print(f"DEBUG: Claude's Response -> {raw_text}") 

        # 2. 마크다운 기호(```json) 제거 로직
        clean_text = raw_text
        if "```json" in clean_text:
            clean_text = clean_text.split("```json")[1].split("```")[0].strip()
        elif "```" in clean_text:
            clean_text = clean_text.split("```")[1].split("```")[0].strip()

        return json.loads(clean_text)

    except Exception as e:
        # 에러 발생 시 구체적으로 어떤 에러인지 출력
        print(f"❌ 추출 실패 상세: {str(e)}")
        return {"분야": "기타", "기술": "일반", "도구": "공통", "업무": "실무", "메타": "기초"}

# 3. 메인 실행 로직
print(f"🚀 {MODEL_NAME} 모델로 키워드 추출을 시작합니다... (총 {len(programs_df)}건)")

results = []
for idx, row in programs_df.iterrows():
    print(f"[{idx+1}/{len(programs_df)}] 가공 중: {row['title']}")
    
    # API 호출
    keywords = get_keywords_from_claude(row['title'], row['ncsNm'])
    results.append(keywords)
    
    # 🚨 유료 API 비용 및 속도 제한(Rate Limit) 방지를 위한 짧은 휴식
    time.sleep(0.5)

# 4. 결과 통합 및 저장
keywords_df = pd.DataFrame(results)
final_combined_df = pd.concat([programs_df, keywords_df], axis=1)

final_combined_df.to_csv('final_programs_with_ai_keywords.csv', index=False, encoding='utf-8-sig')
print("✅ 모든 데이터에 5대 키워드가 장착되었습니다!")