from flask import Blueprint
from controllers.user_contorller import login, register, logout, update, find_user_by_id
from flask_login import login_required

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

# 登出用戶
@user_bp.route("/logout",methods=["POST"])
@login_required
def logout_route():
    return logout()

# 更新用戶資訊
@user_bp.route("/update",methods=["POST"])
# @login_required
def update_route():
    return update()

# 用ID取得用戶資訊
@user_bp.route("/get_user_by_id",methods=["GET"])

def get_user_by_id():
    return find_user_by_id()
