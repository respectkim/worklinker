from flask import Flask, jsonify
from flask_cors import CORS
from app.routes.success import success_bp
from app.routes.auth import auth_bp

def create_app():
    app = Flask(__name__)
    CORS(app)

    app.register_blueprint(success_bp)
    app.register_blueprint(auth_bp)

    @app.route("/", methods=["GET"])
    def home():
        return jsonify({
            "ok": True,
            "message": "WorkLinker backend running"
        })

    return app