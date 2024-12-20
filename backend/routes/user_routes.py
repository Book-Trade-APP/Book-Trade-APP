from flask import Blueprint
from controllers.user_contorller import login_controller, register_controller, update_controller, evaluate_controller, logout
from flask_login import login_required

# 初始化 Blueprint
user_bp = Blueprint("user", __name__)

# 註冊用戶
@user_bp.route("/register", methods=["POST"])
def register_route():
    return register_controller()

# 登入用戶
@user_bp.route("/login", methods=["POST"])
def login_route():
    return login_controller()

# 更新用戶資訊
@user_bp.route("/update",methods=["POST"])
# @login_required
def update_route():
    return update_controller()

# 使用者評價
@user_bp.route("/evaluate",methods=["POST"])
def evaluate_route():
    return evaluate_controller()

# 登出用戶
@user_bp.route("/logout",methods=["POST"])
@login_required
def logout_route():
    return logout()



