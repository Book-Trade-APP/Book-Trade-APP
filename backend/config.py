import os
from dotenv import load_dotenv
from pymongo import MongoClient

# 載入 .env 檔案
load_dotenv()

class Config:
    # MongoDB 設定
    MONGO_USERNAME = os.getenv("MONGO_USERNAME")
    MONGO_PASSWORD = os.getenv("MONGO_PASSWORD")
    MONGO_HOST = os.getenv("MONGO_HOST")
    MONGO_OPTIONS = os.getenv("MONGO_OPTIONS", "")
    DB_NAME = os.getenv("DB_NAME")

    # Flask 設定
    SECRET_KEY = os.getenv("SECRET_KEY")
    DEBUG = True  # 開發環境設為 True
    PORT = int(os.getenv("PORT", 8000))  # 讀取 PORT，預設值為 8000

    # 組合 MongoDB 連接 URI
    MONGO_URI = (
        f"mongodb+srv://{MONGO_USERNAME}:{MONGO_PASSWORD}"
        f"@{MONGO_HOST}/?{MONGO_OPTIONS}"
    )
    
    # flask-email 設定
    MAIL_SERVE = os.getenv("MAIL_SERVE")
    MAIL_PORT = os.getenv("MAIL_PORT")
    MAIL_USE_TLS = os.getenv("MAIL_USE_TLS")
    MAIL_USERNAME=os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD")
    MAIL_DEFAULT_SENDER = os.getenv("MAIL_DEFAULT_SENDER")
    
# 資料庫連接函數
def init_db():
    client = MongoClient(Config.MONGO_URI)
    db = client[Config.DB_NAME]
    return db