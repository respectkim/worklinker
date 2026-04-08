from flask import Blueprint, jsonify, request
from app.utils.db import get_connection

success_bp = Blueprint("success", __name__, url_prefix="/api/success")


@success_bp.route("/", methods=["GET"])
def get_success_list():
    conn = None
    cursor = None

    try:
        conn = get_connection()
        cursor = conn.cursor()

        sql = """
            SELECT
                sp.id,
                sp.user_id,
                sp.category_id,
                sp.title,
                sp.category,
                sp.job,
                sp.period,
                sp.summary,
                sp.content,
                sp.views,
                sp.featured,
                sp.created_at,
                u.username
            FROM success_posts sp
            JOIN users u
                ON sp.user_id = u.id
            ORDER BY sp.id DESC
        """
        cursor.execute(sql)
        posts = cursor.fetchall()

        return jsonify({
            "ok": True,
            "posts": posts
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


@success_bp.route("/<int:post_id>", methods=["GET"])
def get_success_detail(post_id):
    conn = None
    cursor = None

    try:
        conn = get_connection()
        cursor = conn.cursor()

        post_sql = """
            SELECT
                sp.id,
                sp.user_id,
                sp.category_id,
                sp.title,
                sp.category,
                sp.job,
                sp.period,
                sp.summary,
                sp.content,
                sp.views,
                sp.featured,
                sp.created_at,
                u.username
            FROM success_posts sp
            JOIN users u
                ON sp.user_id = u.id
            WHERE sp.id = %s
        """
        cursor.execute(post_sql, (post_id,))
        post = cursor.fetchone()

        if not post:
            return jsonify({
                "ok": False,
                "error": "게시글을 찾을 수 없습니다."
            }), 404

        comment_sql = """
            SELECT
                sc.id,
                sc.post_id,
                sc.user_id,
                sc.content,
                sc.created_at,
                u.username
            FROM success_comments sc
            JOIN users u
                ON sc.user_id = u.id
            WHERE sc.post_id = %s
            ORDER BY sc.id ASC
        """
        cursor.execute(comment_sql, (post_id,))
        comments = cursor.fetchall()

        return jsonify({
            "ok": True,
            "post": post,
            "comments": comments
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


@success_bp.route("/", methods=["POST"])
def create_success_post():
    conn = None
    cursor = None

    try:
        data = request.get_json()

        user_id = data.get("user_id")
        category_id = data.get("category_id")
        title = data.get("title")
        category = data.get("category")
        job = data.get("job")
        period = data.get("period")
        summary = data.get("summary")
        content = data.get("content")
        featured = data.get("featured", False)

        if not user_id or not title or not category or not job or not content:
            return jsonify({
                "ok": False,
                "error": "user_id, title, category, job, content는 필수입니다."
            }), 400

        conn = get_connection()
        cursor = conn.cursor()

        sql = """
            INSERT INTO success_posts (
                user_id,
                category_id,
                title,
                category,
                job,
                period,
                summary,
                content,
                featured
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(sql, (
            user_id,
            category_id,
            title,
            category,
            job,
            period,
            summary,
            content,
            featured
        ))
        conn.commit()

        return jsonify({
            "ok": True,
            "message": "게시글 등록 완료",
            "post_id": cursor.lastrowid
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


@success_bp.route("/<int:post_id>/comments", methods=["POST"])
def create_success_comment(post_id):
    conn = None
    cursor = None

    try:
        data = request.get_json()

        user_id = data.get("user_id")
        content = data.get("content")

        if not user_id or not content:
            return jsonify({
                "ok": False,
                "error": "user_id와 content는 필수입니다."
            }), 400

        conn = get_connection()
        cursor = conn.cursor()

        sql = """
            INSERT INTO success_comments (
                post_id,
                user_id,
                content
            )
            VALUES (%s, %s, %s)
        """
        cursor.execute(sql, (post_id, user_id, content))
        conn.commit()

        return jsonify({
            "ok": True,
            "message": "댓글 등록 완료",
            "comment_id": cursor.lastrowid
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
@success_bp.route("/<int:post_id>", methods=["DELETE"])
def delete_success_post(post_id):
    conn = None
    cursor = None

    try:
        conn = get_connection()
        cursor = conn.cursor()

        check_sql = """
            SELECT id
            FROM success_posts
            WHERE id = %s
        """
        cursor.execute(check_sql, (post_id,))
        post = cursor.fetchone()

        if not post:
            return jsonify({
                "ok": False,
                "error": "게시글을 찾을 수 없습니다."
            }), 404

        delete_sql = """
            DELETE FROM success_posts
            WHERE id = %s
        """
        cursor.execute(delete_sql, (post_id,))
        conn.commit()

        return jsonify({
            "ok": True,
            "message": "게시글이 삭제되었습니다."
        }), 200

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

@success_bp.route("/<int:post_id>/comments/<int:comment_id>", methods=["DELETE"])
def delete_success_comment(post_id, comment_id):
    conn = None
    cursor = None

    try:
        conn = get_connection()
        cursor = conn.cursor()

        check_sql = """
            SELECT id, post_id
            FROM success_comments
            WHERE id = %s AND post_id = %s
        """
        cursor.execute(check_sql, (comment_id, post_id))
        comment = cursor.fetchone()

        if not comment:
            return jsonify({
                "ok": False,
                "error": "댓글을 찾을 수 없습니다."
            }), 404

        delete_sql = """
            DELETE FROM success_comments
            WHERE id = %s AND post_id = %s
        """
        cursor.execute(delete_sql, (comment_id, post_id))
        conn.commit()

        return jsonify({
            "ok": True,
            "message": "댓글이 삭제되었습니다."
        }), 200

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