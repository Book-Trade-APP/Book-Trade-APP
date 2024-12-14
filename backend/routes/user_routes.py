from flask import Blueprint
from controllers.user_contorller import login, register

# 初始化 Blueprint
user_bp = Blueprint("user", __name__)

# 註冊用戶
@user_bp.route("/register", methods=["POST"])
def register_route():
    return register()

# 登入用戶
@user_bp.route("/login", methods=["POST"])
def login_route():
    return login()

