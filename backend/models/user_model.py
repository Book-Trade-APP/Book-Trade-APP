class UserModel:
    def __init__(self, db):
        self.collection = db["users"]

    def find_by_email(self, email):
        """根據 email 查詢用戶"""
        return self.collection.find_one({"email": email})

    def insert_user(self, user_data):
        """新增用戶資料"""
        user_document = {
            "userName": user_data.get("userName"),  # 使用 userName
            "bio": user_data.get("bio", ""),        # 預設簡介為空字串
            "gender": user_data.get("gender", "other"),  # 預設性別為 'other'
            "birthday": user_data.get("birthday"),  # 生日
            "phone": user_data.get("phone"),        # 手機號碼
            "email": user_data.get("email"),        # 電子郵件
            "password": user_data.get("password")   # 加密後的密碼
        }
        self.collection.insert_one(user_document)