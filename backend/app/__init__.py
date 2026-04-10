from flask import Flask, jsonify
from flask_cors import CORS
from app.routes.success import success_bp
from app.routes.auth import auth_bp
from app.routes.ml import ml_bp

# def create_app():
#     app = Flask(__name__)
#     CORS(app)

#     app.register_blueprint(success_bp)
#     app.register_blueprint(auth_bp)

#     @app.route("/", methods=["GET"])
#     def home():
#         return jsonify({
#             "ok": True,
#             "message": "WorkLinker backend running"
#         })

#     return app

# ----------------------------------리액트를 시작페이지로----------------------------------
import os
from flask import Flask, send_from_directory

def create_app2():
    build_path = os.path.join(os.getcwd(), '../build')

    app = Flask(__name__, static_folder=build_path, static_url_path='')
    CORS(app)

    app.register_blueprint(success_bp)
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(ml_bp, url_prefix='/ml')

    @app.route('/', methods=['GET', 'POST'])
    def home():
         # React의 index.html 파일로 첫페이지 응답
        return send_from_directory(app.static_folder, "index.html")

    # React Router 대응
    @app.route("/<path:path>")
    def serve_static(path):
        file_path = os.path.join(app.static_folder, path)

        if os.path.exists(file_path):
            return send_from_directory(app.static_folder, path)
        else:
            return send_from_directory(app.static_folder, "index.html")

    # 브라우저 새로고침할때 404에러가 발생한다면.
    # 리액트(React)와 같은 SPA를 플라스크(Flask)에서 호스팅할 때 새로고침하면 react-router를 하기전에 실제 /서브경로 폴더를 찾음. 없으니 404발생...
    # API 경로가 아닌 모든 요청 중, 파일이 없는 경우 index.html을 반환
    @app.errorhandler(404)
    def not_found(e):
        return send_from_directory(app.static_folder, "index.html")
               
    return app