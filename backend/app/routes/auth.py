from flask import Blueprint, jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash
from app.utils.db import get_connection

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/check-username", methods=["POST"])
def check_username():
    conn = None
    cursor = None

    try:
        data = request.get_json() or {}
        username = (data.get("username") or "").strip()

        if not username:
            return jsonify({
                "ok": False,
                "error": "username은 필수입니다."
            }), 400

        conn = get_connection()
        cursor = conn.cursor()

        sql = """
            SELECT id
            FROM users
            WHERE username = %s
        """
        cursor.execute(sql, (username,))
        user = cursor.fetchone()

        if user:
            return jsonify({
                "ok": False,
                "error": "이미 사용 중인 아이디입니다."
            }), 409

        return jsonify({
            "ok": True,
            "message": "사용 가능한 아이디입니다."
        }), 200

    except Exception as e:
        return jsonify({
            "ok": False,
            "error": str(e)
        }), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


@auth_bp.route("/register", methods=["POST"])
def register():
    conn = None
    cursor = None

    try:
        data = request.get_json() or {}

        username = (data.get("username") or "").strip()
        email = (data.get("email") or "").strip()
        password = (data.get("password") or "").strip()
        age_group = (data.get("age_group") or "").strip()
        region = (data.get("region") or "").strip()
        selected_jobs = data.get("selectedJobs") or []

        if not username or not email or not password:
            return jsonify({
                "ok": False,
                "error": "username, email, password는 필수입니다."
            }), 400

        if not isinstance(selected_jobs, list) or len(selected_jobs) != 3:
            return jsonify({
                "ok": False,
                "error": "관심 직무 3개를 선택해주세요."
            }), 400

        conn = get_connection()
        cursor = conn.cursor()

        check_sql = """
            SELECT id
            FROM users
            WHERE username = %s OR email = %s
        """
        cursor.execute(check_sql, (username, email))
        existing_user = cursor.fetchone()

        if existing_user:
            return jsonify({
                "ok": False,
                "error": "이미 사용 중인 아이디 또는 이메일입니다."
            }), 409

        find_job_sql = """
            SELECT id, category_name
            FROM job_categories
            WHERE category_name = %s
        """

        job_ids = []
        normalized_jobs = []

        for job_name in selected_jobs:
            name = (job_name or "").strip()

            if not name:
                return jsonify({
                    "ok": False,
                    "error": "빈 직무명이 포함되어 있습니다."
                }), 400

            cursor.execute(find_job_sql, (name,))
            row = cursor.fetchone()

            if not row:
                return jsonify({
                    "ok": False,
                    "error": f"job_categories에 없는 직무입니다: {name}"
                }), 400

            job_ids.append(row["id"])
            normalized_jobs.append(row["category_name"])

        password_hash = generate_password_hash(password)

        insert_user_sql = """
            INSERT INTO users (
                username,
                email,
                password_hash,
                age_group,
                region
            )
            VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(insert_user_sql, (
            username,
            email,
            password_hash,
            age_group or None,
            region or None
        ))

        user_id = cursor.lastrowid

        insert_pref_sql = """
            INSERT INTO user_job_preferences (
                user_id,
                level1_category_id,
                level2_category_id,
                level3_category_id,
                raw_target_text
            )
            VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(insert_pref_sql, (
            user_id,
            job_ids[0],
            job_ids[1],
            job_ids[2],
            ", ".join(normalized_jobs)
        ))

        conn.commit()

        return jsonify({
            "ok": True,
            "message": "회원가입이 완료되었습니다.",
            "user_id": user_id
        }), 201

    except Exception as e:
        if conn:
            conn.rollback()

        return jsonify({
            "ok": False,
            "error": str(e)
        }), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


@auth_bp.route("/login", methods=["POST", "OPTIONS"])
def login():
    if request.method == "OPTIONS":
        return jsonify({"ok": True}), 200

    conn = None
    cursor = None

    try:
        data = request.get_json() or {}
        username = (data.get("username") or "").strip()
        password = (data.get("password") or "").strip()

        if not username or not password:
            return jsonify({
                "ok": False,
                "error": "아이디와 비밀번호를 입력해주세요."
            }), 400

        conn = get_connection()
        cursor = conn.cursor()

        sql = """
            SELECT id, username, password_hash
            FROM users
            WHERE username = %s
        """
        cursor.execute(sql, (username,))
        user = cursor.fetchone()

        if not user:
            return jsonify({
                "ok": False,
                "error": "존재하지 않는 아이디입니다."
            }), 401

        if not check_password_hash(user["password_hash"], password):
            return jsonify({
                "ok": False,
                "error": "비밀번호가 올바르지 않습니다."
            }), 401

        return jsonify({
            "ok": True,
            "message": "로그인 성공",
            "user": {
                "id": user["id"],
                "username": user["username"]
            }
        }), 200

    except Exception as e:
        return jsonify({
            "ok": False,
            "error": str(e)
        }), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


@auth_bp.route("/user/<int:user_id>/preferences", methods=["GET"])
def get_user_preferences(user_id):
    conn = None
    cursor = None

    try:
        conn = get_connection()
        cursor = conn.cursor()

        sql = """
            SELECT
                ujp.user_id,
                c1.category_name AS level1_name,
                c2.category_name AS level2_name,
                c3.category_name AS level3_name,
                ujp.raw_target_text
            FROM user_job_preferences ujp
            LEFT JOIN job_categories c1
                ON ujp.level1_category_id = c1.id
            LEFT JOIN job_categories c2
                ON ujp.level2_category_id = c2.id
            LEFT JOIN job_categories c3
                ON ujp.level3_category_id = c3.id
            WHERE ujp.user_id = %s
        """
        cursor.execute(sql, (user_id,))
        row = cursor.fetchone()

        if not row:
            return jsonify({
                "ok": False,
                "error": "직무 선호 정보가 없습니다."
            }), 404

        preferences = [
            row["level1_name"],
            row["level2_name"],
            row["level3_name"]
        ]
        preferences = [item for item in preferences if item]

        return jsonify({
            "ok": True,
            "preferences": preferences,
            "raw_target_text": row["raw_target_text"]
        }), 200

    except Exception as e:
        return jsonify({
            "ok": False,
            "error": str(e)
        }), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()