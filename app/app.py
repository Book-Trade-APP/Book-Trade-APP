from flask import Flask
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from pymongo.mongo_client import MongoClient
from dotenv import load_dotenv
import os

# 載入 .env 環境變數
load_dotenv()

# 初始化 Flask 應用
app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app)

# 設置 MongoDB 資料庫連線
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client.book_trade_db

# 將資料庫對象傳遞給 Blueprint
from login import login_bp

from register import register_bp

app.register_blueprint(login_bp, url_prefix="/")

app.register_blueprint(register_bp, url_prefix="/")

# 提供資料庫對象給其他模組
app.config["MongoDB"] = db

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=8000)