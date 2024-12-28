from flask import Flask
from flask_cors import CORS
# from flask_mail import Mail
from config import Config, init_db
from routes.product_routes import product_bp
from routes.user_routes import user_bp
from routes.order_routes import order_bp 
from routes.notification_routes import notification_bp
# from routes.test import test_bp

app = Flask(__name__)
CORS(app)

# 載入 Flask 設定
app.config.from_object(Config)

# 初始化 MongoDB 連接，存入 app.config
app.config["MongoDB"] = init_db()

# flask-email
# mail = Mail(app)

# blueprint
app.register_blueprint(product_bp, url_prefix="/products")
app.register_blueprint(user_bp, url_prefix="/users")
app.register_blueprint(order_bp, url_prefix="/orders")
app.register_blueprint(notification_bp, url_prefix="/notifications")
# app.register_blueprint(test_bp, url_prefix="/test")

if __name__ == "__main__":
    app.run(debug=app.config["DEBUG"], host="0.0.0.0", port=Config.PORT)