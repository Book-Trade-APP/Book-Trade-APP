from flask import request, jsonify, current_app
from services.product_service import ProductService

# 加入產品
def add_product():
    product_service = ProductService(current_app.config["MongoDB"])
    try:
        data = request.json
        response = product_service.add_product(data)
        return jsonify(response), response["code"]

    except Exception as e:
        return jsonify({
            "code": 500,
            "message": str(e),
            "body": {}
        }), 500

# 取得所有產品
def get_all_products():
    product_service = ProductService(current_app.config["MongoDB"])
    try:
        response = product_service.get_products()
        return jsonify(response), response["code"]

    except Exception as e:
        return jsonify({
            "code": 500,
            "message": str(e),
            "body": {}
        }), 500