from copy import deepcopy
import re
from bson import ObjectId
from flask_bcrypt import Bcrypt
from flask_login import login_user
from utils.User import User
from flask import current_app 


class UserService: 
    def __init__(self, db):
        self.db = db
        self.collection = db["users"]
        self.bcrypt = Bcrypt()
        
    # 檢查重要資訊是否有空值，有空=>True   
    def _check_all_items(self, d: dict) -> bool:
        validation = ["_id","username","email","password"]
        for i in validation:
            if not d[i]:
                return True
        return False

    # 註冊邏輯
    def user_register(self, email, username, password):
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
            print("註冊錯誤:", str(e))
            return {
                "code": 500,
                "message": f"Server Error(user_service): {str(e)}",
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
            "phone":"",
            "cart_id":"",
            "favorites_id":""
        })
        
        # Success
        return {
            "code":201,
            "message":"註冊成功",
            "body": {}
        }
        
    # 登入邏輯
    def user_login(self, email, password):

        if not (email and password):
                return {
                    "code":400,
                    "message":"電子郵件、密碼不得為空",
                    "body": {}
                }

        user_data = self.collection.find_one({"email": email})
        try:
            if not user_data:
                return {
                    "code": 404,
                    "message": "帳戶不存在",
                    "body": {}
                }
            
            if not self.bcrypt.check_password_hash(user_data["password"], password):
                return {
                    "code": 401,
                    "message": "帳號/密碼錯誤",
                    "body": {}
                }

            # Success
            user = User(
                    user_id=str(user_data["_id"]),
                    username=user_data["username"],
                    email=user_data["email"],
                    password=user_data["password"],
                    info=user_data["info"],
                    gender=user_data["gender"],
                    birthday=user_data["birthday"],
                    phone=user_data["phone"]
                )
            login_user(user)
            user_data["_id"] = str(user_data["_id"])
            return {
                "code": 200,
                "message": "登入成功",
                "body": user_data
            }
            
        except Exception as e:
            print("登入錯誤:", str(e))
            return {
                "code": 500,
                "message": f"Server Error(user_service): {str(e)}",
                "body": {}
            }
    
    # 更新使用者資訊
    def user_update(self, request_data):
        try:
            if self._check_all_items(request_data):
                return{
                    "code": 400,
                    "message":"名稱、密碼、email不能包含空值",
                    "body": {}
                }
            id = request_data.get("_id")
            user = self.collection.find_one({"_id": ObjectId(id)})
            if not user:
                return{
                    "code": 404,
                    "message": "帳戶不存在",
                    "body": {}
                }
            userName = request_data.get('username')
            email = request_data.get('email')
            password = request_data.get("password")
            info = request_data.get("info")
            gender = request_data.get("gender")
            birthday = request_data.get("birthday")
            phone = request_data.get("phone")
            
            hashed_password = self.bcrypt.generate_password_hash(password).decode('utf-8')
            myquery = {"_id": ObjectId(id)}
            newvalues = { "$set": {
                "username": userName,
                "email": email,
                "password": hashed_password,
                "info": info,
                "gender":gender,
                "birthday":birthday,
                "phone":phone
            } }
            # Success
            user_data =self.collection.update_one(myquery,newvalues)
            return {
                "code": 200,
                "message": "更新個人資料成功",
                "body": {
                    "matched_count": user_data.matched_count,  # 匹配到的數量
                    "modified_count": user_data.modified_count  # 修改的數量
                }
            }
            
        except Exception as e:
            print("更新個人資料失敗:", str(e))
            return {
                "code": 500,
                "message": f"Server Error(user_service): {str(e)}",
                "body": {}
            }