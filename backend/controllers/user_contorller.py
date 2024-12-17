from flask import  request, jsonify, current_app
from services.user_service import UserService
from flask_login import logout_user

# 登入
def login():
    try:
        user_service = UserService(current_app.config["MongoDB"])
        data = request.json
        if not data:
            return jsonify({
                "code": 400,
                "message": "請提供正確的 JSON 資料",
                "body": {}
            }), 400
        email = data.get("email")
        password = data.get("password")
        response = user_service.user_login(email, password)
        return jsonify(response), response["code"]
    
    except Exception as e:
        return jsonify({
            "code": 500,
            "message":f"Sever Error(user_contorller): {str(e)}",
            "body": {}
        }), 500

# 註冊
def register():
    try:
        user_service = UserService(current_app.config["MongoDB"])
        data = request.json
        if not data:
            return jsonify({
                "code": 400,
                "message": "請提供正確的 JSON 資料",
                "body": {}
            }), 400
        email = data.get("email")
        username = data.get("username")
        password = data.get("password")
        response = user_service.user_register(email, username, password)
        return jsonify(response), response["code"]
        
    except Exception as e:
        return jsonify({
            "code": 500,
            "message":f"Sever Error(user_contorller): {str(e)}",
            "body": {}
        }), 500

# 更新資料
def update():
    try:
        user_service = UserService(current_app.config["MongoDB"])
        validation = {"_id", "username", "info", "gender", "birthday", "phone", "email", "password"}
        data = request.json
        if not data or not set(data.keys()) == validation:
            return jsonify({
                "code": 400,
                "message": "請提供正確的 JSON 資料",
                "body": {}
            }), 400
        response = user_service.user_update(data)
        return jsonify(response), response["code"]
    
    except Exception as e:
        return jsonify({
            "code": 500,
            "message":f"Sever Error(user_contorller): {str(e)}",
            "body": {}
        }), 500

# 登出    
def logout():
    logout_user()
    return jsonify({
        "code": 200,
        "message":"Logout Success",
        "body": {}
    }),200