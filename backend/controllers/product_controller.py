from flask import request, jsonify, current_app
from services.product_service import ProductService

# 加入產品
def add_product_controller():
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
def get_all_products_controller():
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

# 加入購物車
def add_to_cart_controller():
    product_service = ProductService(current_app.config["MongoDB"])
    try:
        data = request.json
        response = product_service.add_to_cart(data)
        return jsonify(response), response["code"]

    except Exception as e:
        return jsonify({
            "code": 500,
            "message": str(e),
            "body": {}
        }), 500

# 加入收藏
def add_to_favorites_controller():
    product_service = ProductService(current_app.config["MongoDB"])
    try:
        data = request.json
        response = product_service.add_to_favorite(data)
        return jsonify(response), response["code"]

    except Exception as e:
        return jsonify({
            "code": 500,
            "message": str(e),
            "body": {}
        }), 500