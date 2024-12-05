from flask import Blueprint, request, jsonify, current_app
from flask_bcrypt import Bcrypt

# 初始化 Blueprint
login_bp = Blueprint('login', __name__)
bcrypt = Bcrypt()

# 登入
@login_bp.route('/login', methods=['POST'])
def login():
    db = current_app.config["MongoDB"]  # 從 app.config 中獲取資料庫對象
    users_collection = db.users

    data = request.json
    email = data.get("email")
    password = data.get("password")

    # 查詢用戶
    user = users_collection.find_one({"email": email})
    if not user:
        return jsonify({"error": "帳戶不存在"}), 404

    # 驗證密碼
    if bcrypt.check_password_hash(user["password"], password):
        return jsonify({"message": "登入成功"}), 200
    else:
        return jsonify({"error": "帳號/密碼錯誤"}), 401