from bson import ObjectId
from flask import Flask, jsonify, current_app
from flask_cors import CORS
from flask_login import LoginManager
from config import Config, init_db
from routes.product_routes import product_bp
from routes.user_routes import user_bp
from routes.order_routes import order_bp 
from utils import User

app = Flask(__name__)
CORS(app)

# 載入 Flask 設定
app.config.from_object(Config)

# 初始化 MongoDB 連接，存入 app.config
app.config["MongoDB"] = init_db()

# LonginManager
login_manager = LoginManager(app)
# login_manager.login_view = "user.login_route"

@login_manager.user_loader
def load_user(user_id):
    users = app.config["MongoDB"]["users"]
    user_data = users.find_one({"_id":ObjectId(user_id)})
    try:
        if user_data:
            return User(
                        user_id=user_data["_id"],
                        username=user_data["username"],
                        email=user_data["email"],
                        password=user_data["password"],
                        info=user_data["info"],
                        gender=user_data["gender"],
                        birthday=user_data["birthday"],
                        phone=user_data["phone"]
                    )
    except Exception as e:
        print(str(e))
        return None

# blueprint
app.register_blueprint(product_bp, url_prefix="/products")
app.register_blueprint(user_bp, url_prefix="/users")
app.register_blueprint(order_bp, url_prefix="/orders")

# 全局錯誤處理
@app.errorhandler(Exception)
def handle_exception(error):
    code = getattr(error, "code", 500)
    return jsonify({
        "code": code,
        "message": str(error),
        "body": {}
    }), code

if __name__ == "__main__":
    app.run(debug=app.config["DEBUG"], host="0.0.0.0", port=Config.PORT)