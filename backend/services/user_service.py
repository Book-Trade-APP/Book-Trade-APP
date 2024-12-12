from models.user_model import UserModel
from flask_bcrypt import Bcrypt
import re

class UserService:
    def __init__(self, db):
        self.user_model = UserModel(db)
        self.bcrypt = Bcrypt()

    # 註冊邏輯
    def register_user(self, email, userName, password, bio, gender, birthday, phone):
        # 驗證電子郵件格式
        email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
        if not re.match(email_regex, email):
            raise ValueError("電子郵件格式不正確")
        
        # 必填欄位驗證
        if not (userName and birthday and phone and password):
            raise ValueError("缺少必要的註冊資訊")

        # 驗證 email 是否已存在
        if self.user_model.find_by_email(email):
            raise ValueError("此電子郵件已經註冊過")

        # 密碼加密
        hashed_password = self.bcrypt.generate_password_hash(password).decode('utf-8')

        # 插入用戶資料
        self.user_model.insert_user({
            "userName": userName,
            "bio": bio,
            "gender": gender,
            "birthday": birthday,
            "phone": phone,
            "email": email,
            "password": hashed_password
        })
        return {"message": "註冊成功"}

    # 登入邏輯
    def login_user(self, email, password):
        user = self.user_model.find_by_email(email)
        if not user:
            raise ValueError("帳戶不存在")

        if not self.bcrypt.check_password_hash(user["password"], password):
            raise ValueError("帳號/密碼錯誤")

        return {"message": "登入成功"}