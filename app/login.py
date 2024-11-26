from app.handle_database import Handle_database
import hashlib
from flask import jsonify, request, render_template, redirect, url_for


class Login:
    
    def __init__(self) -> None:
        pass
    
    def do_login():
        
        if request.method == 'GET':
            return render_template('login.html')
        elif request.method == 'POST':
            # todo: request.get_json()
            user_email = request.form.get('email')
            user_password = request.form.get('password')
            
            if Login.check_profile(user_email, user_password):
                return jsonify({"status": "success", "message": "登入成功", "redirect_url": url_for('main')})
            else:
                return jsonify({"status": "error", "message": "電子郵件或密碼錯誤，請重試"})
                
    def check_profile(user_email: str, user_password: str)->bool:
        # 從資料庫找user_email
        collection = Handle_database(DB_name="Book_trade", DB_collection="login")
        filter={'email':user_email}
        USER = collection.find(filter)
        
        # check_password
        hash_user_password = hashlib.sha256(USER['salt'] + user_password.encode('utf-8'))
        hex_hash_user_password = hash_user_password.hexdigest()

        if hex_hash_user_password == USER["password"]:
            return True
        else:
            return False