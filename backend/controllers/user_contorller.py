from flask import  request, jsonify, current_app
from services.user_service import UserService


# 登入
def login():
    try:
        user_service = UserService(current_app.config["MongoDB"])
        data = request.json
        email = data.get("email")
        password = data.get("password")
        response = user_service.login_user(email, password)
        return jsonify(response), response["code"]
    
    except Exception as e:
        return jsonify({
            "code": 500,
            "message":f"Sever Error: {str(e)}",
            "body": {}
        }), 500

# 註冊
def register():
    try:
        user_service = UserService(current_app.config["MongoDB"])
        data = request.json
        email = data.get("email")
        username = data.get("username")
        password = data.get("password")
        response = user_service.register_user(email, username, password)
        return jsonify(response), response["code"]
        
    except Exception as e:
        return jsonify({
            "code": 500,
            "message":f"Sever Error: {str(e)}",
            "body": {}
        }), 500