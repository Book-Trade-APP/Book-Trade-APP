from flask import Blueprint, request, jsonify, current_app
from services.user_service import UserService
from views.response import success_response, error_response

# 初始化 Blueprint
user_bp = Blueprint("user", __name__)

# 註冊用戶
@user_bp.route("/Register", methods=["POST"])
def register():
    user_service = UserService(current_app.config["MongoDB"])  # 延遲初始化
    try:
        data = request.json
        email = data.get("email")
        username = data.get("username")
        password = data.get("password")
        user_service.register_user(email, username, password)
        return success_response(None, "註冊成功")
    except ValueError as e:
        return error_response(str(e), 400)

# 登入用戶
@user_bp.route("/Login", methods=["POST"])
def login():
    user_service = UserService(current_app.config["MongoDB"])  # 延遲初始化
    try:
        data = request.json
        email = data.get("email")
        password = data.get("password")
        response = user_service.login_user(email, password)
        return success_response(response)
    except ValueError as e:
        return error_response(str(e), 400)