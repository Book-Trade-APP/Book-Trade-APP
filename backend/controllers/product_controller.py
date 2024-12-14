from flask import request, jsonify, current_app
from services.product_service import ProductService
from utils.response import resp

# 加入產品
def add_product():
    product_service = ProductService(current_app.config["MongoDB"])
    try:
        data = request.json
        response, status = product_service.add_product(data)
        return jsonify(response), status  # 確保返回合法的 Response
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

# 取得所有產品
def get_all_products():
    product_service = ProductService(current_app.config["MongoDB"])
    try:
        response, status = product_service.get_products()
        return jsonify(response), status  # 確保返回合法的 Response
    except ValueError as e:
        return jsonify({"error": str(e)}), 400