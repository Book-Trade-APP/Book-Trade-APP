from flask import Blueprint, request, jsonify, current_app
from flask_bcrypt import Bcrypt
import re

# 初始化 Blueprint
register_bp = Blueprint('register', __name__)
bcrypt = Bcrypt()

# 註冊
@register_bp.route('/register', methods=['POST'])
def register():
    db = current_app.config["MongoDB"]  # 從 app.config 中獲取資料庫對象
    users_collection = db.users

    data = request.json
    email = data.get("email")
    username = data.get("username")
    password = data.get("password")

    # 檢查 email 格式
    email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
    if not re.match(email_regex, email):
        return jsonify({"error": "電子郵件格式不正確"}), 400

    # 檢查是否已有相同的 email
    if users_collection.find_one({"email": email}):
        return jsonify({"error": "此電子郵件已經註冊過"}), 409

    # 加密
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    # 插入用戶數據到 MongoDB
    users_collection.insert_one({
        "username": username,
        "email": email,
        "password": hashed_password
    })

    return jsonify({"message": "註冊成功"}), 201