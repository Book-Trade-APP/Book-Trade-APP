from flask import Flask, jsonify
from flask_cors import CORS
from config import Config, init_db
from routes.product_routes import product_bp
from routes.user_routes import user_bp

app = Flask(__name__)
CORS(app)

# 載入 Flask 設定
app.config.from_object(Config)

# 初始化 MongoDB 連接，存入 app.config
app.config["MongoDB"] = init_db()

# blueprint
app.register_blueprint(product_bp, url_prefix="/products")
app.register_blueprint(user_bp, url_prefix="/users")

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