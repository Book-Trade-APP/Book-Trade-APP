from flask import Flask
from flask_cors import CORS
from config import Config, init_db
from routes.product_routes import register_product_routes
from routes.user_routes import register_user_routes
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)

# 載入 Flask 設定
app.config.from_object(Config)

# 初始化 MongoDB 連接，存入 app.config
app.config["MongoDB"] = init_db()

# 設置 Flask 應用上下文
with app.app_context():
    register_product_routes(app)
    register_user_routes(app)

@app.route("/")
def home():
    return "<h1>Book Trade APP 後端服務</h1>"

if __name__ == "__main__":
    app.run(debug=app.config["DEBUG"], host="0.0.0.0", port=Config.PORT)