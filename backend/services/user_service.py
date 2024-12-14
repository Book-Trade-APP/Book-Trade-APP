import re
from flask_bcrypt import Bcrypt

class UserService: 
    def __init__(self, db):
        self.db = db
        self.collection = db["users"]
        self.bcrypt = Bcrypt()

    # 註冊邏輯
    def register_user(self, email, username, password):
        if not (email and username and password):
                return {
                    "code":400,
                    "message":"電子郵件、名稱、密碼不得為空",
                    "body": {}
                }
        try:
            user_exist = self.collection.find_one({"email": email})
            email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
            
            # email格式不對
            if not re.match(email_regex, email):
                return {
                    "code":400,
                    "message":"電子郵件格式不正確",
                    "body": {}
                }

            # 電子郵件已經註冊過
            if user_exist:
                return {
                    "code":409,
                    "message":"此電子郵件已經註冊過",
                    "body": {}
                }
                
        except Exception as e:
            print("登入錯誤:", str(e))
            return {
                "code": 500,
                "message": "Server Error",
                "body": {}
            }

        hashed_password = self.bcrypt.generate_password_hash(password).decode('utf-8')
        self.collection.insert_one({
            "username": username,
            "email": email,
            "password": hashed_password,
            "info": "",
            "gender":"",
            "birthday":"",
            "phone":""
        })
        
        # Success
        return {
            "code":201,
            "message":"註冊成功",
            "body": {}
        }
        
    # 登入邏輯
    def login_user(self, email, password):

        if not (email and password):
                return {
                    "code":400,
                    "message":"電子郵件、名稱、密碼不得為空",
                    "body": {}
                }

        user = self.collection.find_one({"email": email})
        try:
            if not user:
                return {
                    "code": 404,
                    "message": "帳戶不存在",
                    "body": {}
                }
            print("checked email")
            
            if not self.bcrypt.check_password_hash(user["password"], password):
                return {
                    "code": 401,
                    "message": "帳號/密碼錯誤",
                    "body": {}
                }
            print("checked password")

            # Success
            # 移除 _id 欄位，不然會出事(500)
            user.pop("_id")
            return {
                "code": 200,
                "message": "登入成功",
                "body": user
            }
            
        except Exception as e:
            print("登入錯誤:", str(e))
            return {
                "code": 500,
                "message": "Server Error",
                "body": {}
            }
    
    # 驗證使用者
    # ! not finish yet
    def authenticate_user(self, request_data):
        userName = request_data.get("username")
        password = request_data.get("password")
        
        if not (userName and password):
            raise ValueError("帳號/密碼不可為空值")
        