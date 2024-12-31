from flask import request, jsonify, current_app
from services.order_service import OrderService

# 1. 創建訂單
def create_order_controller():
    order_service = OrderService(current_app.config["MongoDB"])
    try:
        data = request.json
        response = order_service.create_order(data)
        return jsonify(response), response["code"]

    except Exception as e:
        return jsonify({"code": 500, "message": str(e), "body": {}}), 500

# 2. 刪除訂單
def delete_order_controller(order_id):
    order_service = OrderService(current_app.config["MongoDB"])
    response = order_service.delete_order_by_id(order_id)
    return jsonify(response), response["code"]

# 3. 查詢所有訂單
def get_all_orders_controller():
    order_service = OrderService(current_app.config["MongoDB"])
    response = order_service.get_all_orders()
    return jsonify(response), response["code"]

# 4. 用ID查詢單一訂單
def get_order_by_id_controller(order_id):
    order_service = OrderService(current_app.config["MongoDB"])
    response = order_service.get_order_by_id(order_id)
    return jsonify(response), response["code"]

# 5. 獲取買/賣家的訂單
def get_orders_by_Userid_controller():
    db = current_app.config["MongoDB"]
    order_service = OrderService(db)
    data = request.json

    buyer_id = data.get("buyer_id")
    seller_id = data.get("seller_id")
    buyer_status = data.get("buyer_status")
    seller_status = data.get("seller_status")

    if not (buyer_id or seller_id) or not (buyer_status or seller_status):
        return jsonify({"code": 400, "message": "缺少必要的 buyer_id 或 buyer_status 或 seller_id 或 seller_status"}), 400

    response = order_service.get_orders_by_Userid(buyer_id, seller_id, buyer_status, seller_status)
    return jsonify(response), response["code"]

# 根據order_id更改status
def update_order_status_by_id_controller():
    try:
        order_service = OrderService(current_app.config["MongoDB"])
        data = request.json
        result = order_service.update_order_by_id(data)
        return jsonify(result),result.get("code")
    except Exception as e:
        return jsonify({"code": 500, "message": str(e), "body": {}}), 500
    
