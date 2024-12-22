from flask import request, jsonify, current_app
from services.product_service import ProductService
from utils.response import ResponseHandler

# 加入產品
def add_product_controller():
    product_service = ProductService(current_app.config["MongoDB"])
    try:
        data = request.json
        response = product_service.add_product(data)
        return response

    except Exception as e:
        message=f"Sever Error(product_controller.py: {str(e)}"
        return ResponseHandler(message=message).response()

# 取得所有產品
def get_all_products_controller():
    product_service = ProductService(current_app.config["MongoDB"])
    try:
        response = product_service.get_products()
        return response

    except Exception as e:
        message=f"Sever Error(product_controller.py: {str(e)}"
        return ResponseHandler(message=message).response()
        
# 根據product_id, 取得一筆資料     
def get_one_product_by_id_controller():
    product_service = ProductService(current_app.config["MongoDB"])
    try:
        data = request.args.get("product_id")
        response = product_service.get_one_product_by_id(data)
        return jsonify(response), response["code"]

    except Exception as e:
        return jsonify({
            "code": 500,
            "message": str(e),
            "body": {}
        }), 500
        
# 更新產品資料
def update_product_controller():
    product_service = ProductService(current_app.config["MongoDB"])
    try:
        data = request.json
        response = product_service.update_product(data)
        return response

    except Exception as e:
        message=f"Sever Error(product_controller.py: {str(e)}"
        return ResponseHandler(message=message).response()
        
# 加入購物車
def add_to_cart_controller():
    product_service = ProductService(current_app.config["MongoDB"])
    try:
        data = request.json
        response = product_service.add_to_cart(data)
        return response

    except Exception as e:
        message=f"Sever Error(product_controller.py: {str(e)}"
        return ResponseHandler(message=message).response()

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

# 更新購物車商品數量
def update_cart_controller():
    product_service = ProductService(current_app.config["MongoDB"])
    try:
        data = request.json
        response = product_service.update_cart(data)
        return response

    except Exception as e:
        message=f"Sever Error(product_controller.py: {str(e)}"
        return ResponseHandler(message=message).response()
        

# 從收藏刪除   
def delete_from_favorites_controller():
    product_service = ProductService(current_app.config["MongoDB"])
    try:
        data = request.json
        response = product_service.delete_from_favorites(data)
        return jsonify(response), response["code"]

    except Exception as e:
        return jsonify({
            "code": 500,
            "message": str(e),
            "body": {}
        }), 500

# user_id找收藏商品    
def get_favorites_by_user_id_controller():
    product_service = ProductService(current_app.config["MongoDB"])
    try:
        data = request.json
        response = product_service.get_favorites_by_user_id(data)
        return jsonify(response), response["code"]

    except Exception as e:
        return jsonify({
            "code": 500,
            "message": str(e),
            "body": {}
        }), 500
        
# user_id找購物車商品
def get_cart_by_user_id_controller():
    product_service = ProductService(current_app.config["MongoDB"])
    try:
        data = request.json
        response = product_service.get_cart_by_user_id(data)
        return response

    except Exception as e:
        message=f"Sever Error(product_controller.py: {str(e)}"
        return ResponseHandler(message=message).response()