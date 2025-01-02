import re
import os
import random
import string
from bson import ObjectId
from flask_bcrypt import Bcrypt
from utils.send_email import send_email


class UserService: 
    def __init__(self, db):
        self.db = db
        self.collection = db["users"]
        self.bcrypt = Bcrypt()
        
    # 檢查重要資訊是否有空值，有空=>True   
    def _check_all_items(self, d: dict) -> bool:
        validation = ["_id","username","email"]
        for i in validation:
            if not d[i]:
                return True
        return False
    
    # 隨機生成臨時密碼
    def _generate_temp_password(self):
        return ''.join(random.choices(string.ascii_letters + string.digits, k=12))

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
        result = self.collection.insert_one({
            "username": username,
            "email": email,
            "password": hashed_password,
            "info": "",
            "gender":"",
            "birthday":"",
            "phone":"",
            "cart_id":"",
            "favorites_id":"",
            "evaluate":0,
            "transaction_number":0,
            "headshot":""
        })
        
        # Success
        return {
            "code":200,
            "message":"註冊成功",
            "body": str(result.inserted_id)
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
                    "message":"_id, username, password, email不能包含空值",
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
            
            password = request_data.get("password","")
            userName = request_data.get('username')
            email = request_data.get('email')
            info = request_data.get("info")
            gender = request_data.get("gender")
            birthday = request_data.get("birthday")
            phone = request_data.get("phone")
            headshot = request_data.get("headshot")
            
            myquery = {"_id": ObjectId(id)}
            newvalues = {}
            if password and not self.bcrypt.check_password_hash(user["password"], password):
                hashed_password = self.bcrypt.generate_password_hash(password).decode('utf-8')
                newvalues["password"] = hashed_password
            
            newvalues = {
                "username": userName,
                "email": email,
                "info": info,
                "gender":gender,
                "birthday":birthday,
                "phone":phone,
                "headshot":headshot
            }
            # Success
            user_data =self.collection.update_one(myquery,{"$set":newvalues})
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
    # 根據id找用戶
    def find_user_by_id(self, user_id:str):
        try:
            user = self.collection.find_one({"_id": ObjectId(user_id)})
            if not user:
                return {
                    "code": 404,
                    "message": "找不到該用戶",
                    "body": {}
                }
            user["_id"] = str(user["_id"])
            return {
                "code": 200,
                "message": "成功找到用戶",
                "body": user
            }
        except Exception as e:
            print("查詢用戶失敗:", str(e))
            
    # 使用者評價        
    def user_evaluate(self, data):
        try:
            id = data.get("user_id")
            evaluate = float(data.get("evaluate"))
            if not id or evaluate is None:
                return {
                    "code": 400,
                    "message": "請提供user_id, evaluate",
                    "body": {}
                }
                
            user = self.collection.find_one({"_id":ObjectId(id)})
            if not user:
                return{
                    "code": 404,
                    "message": "使用者不存在",
                    "body": {}
                }
            
            if evaluate < 1 or evaluate > 5:
                return {
                    "code": 400,
                    "message": "評價分數必須在 1 到 5 之間",
                    "body": {}
                }
            # Success
            old_evaluate = float(user.get("evaluate"))
            transaction_number = int(user.get("transaction_number"))
            new_evaluate = round((old_evaluate * transaction_number + evaluate) / (transaction_number + 1),1)
            # 更新 transaction_number, evaluate
            self.collection.update_one({"_id":ObjectId(id)}, {"$set":{"transaction_number":transaction_number + 1,"evaluate":new_evaluate}})
            return {
                "code": 200,
                "message": "成功更新使用者評價",
                "body": {}
            }
        except Exception as e:
            return {
                "code": 500,
                "message": f"Server Error(user_service): {str(e)}",
                "body": {}
            }
            
    # todo: update jwt token
    # 使用者忘記密碼
    def user_forget_password(self, data):
        try:
            email = data.get("email")
            user = self.collection.find_one({"email": email})
            if not user:
                return {
                    "code": 404,
                    "message": "找不到該用戶",
                    "body": {}
                }
            # 生成暫時密碼，暫時更新他的密碼
            tmp_password = self._generate_temp_password()
            hashed_password = self.bcrypt.generate_password_hash(tmp_password).decode('utf-8')
            from_email = os.getenv("OFFICIAL_EMAIL")
            self.collection.update_one({"_id": user["_id"]},{"$set":{"password": hashed_password}})
            subject = '【二手書交易平台】'
            content = f'您好，這是您的暫時密碼：{tmp_password}\n請在登入後立即變更您的密碼！'
            # 發送email重設密碼
            send_email(from_email=from_email, to_email=email, subject=subject, plain_text_content=content)
            return {
                "code": 200,
                "message": "成功寄送忘記密碼email",
                "body": str(user["_id"])
            }
            
        except Exception as e:
            return {
                "code": 500,
                "message": f"Server Error(user_service): {str(e)}",
                "body": {}
            }
            
    # 使用者更新密碼
    def user_update_password(self, data):
        try:
            id = data.get("user_id")
            password = data.get("password")
            new_password = data.get("new_password")
            if not (id and new_password and password):
                return {
                    "code": 400,
                    "message": "請提供user_id, password, new password",
                    "body": {}
                }
            user = self.collection.find_one({"_id":ObjectId(id)})
            if not user:
                return{
                    "code": 404,
                    "message": "使用者不存在",
                    "body": {}
                }
                
            if not self.bcrypt.check_password_hash(user["password"], password):
                return {
                    "code": 400,
                    "message": "密碼驗證錯誤，請重新輸入",
                    "body": {}
                }
                
            if new_password == password:
                return {
                    "code":400,
                    "message":"新、舊密碼相同，請重新輸入",
                    "body":{}
                }
                
            hashed_password = self.bcrypt.generate_password_hash(new_password).decode('utf-8')
            self.collection.update_one({"_id":ObjectId(id)}, {"$set":{"password":hashed_password}})
            return {
                "code": 200,
                "message": "成功更新密碼",
                "body": {}
            }
        except Exception as e:
            return {
                "code": 500,
                "message": f"Server Error(user_service): {str(e)}",
                "body": {}
            }
    # 寄信api
    def user_send_email(self, data):
        try:
            subject = data.get("subject", None)
            from_email = os.getenv("OFFICIAL_EMAIL")
            plain_text_content = data.get("content")
            to_email = os.getenv("ADMIN_EMAIL")
            if not plain_text_content:
                return {
                    "code":400,
                    "message":"需要提供plain_text_content",
                    "body":{}
                }
            send_email(from_email=from_email,subject=subject,to_email=to_email,plain_text_content=plain_text_content)
            return {
                "code":200,
                "message":"成功寄送郵件",
                "body":{}
            }
        except Exception as e:
            return {
                "code": 500,
                "message": f"Server Error(user_service): {str(e)}",
                "body": {}
            }