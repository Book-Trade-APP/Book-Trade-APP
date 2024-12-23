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

# 5. 用user_id查詢不同狀態訂單(代處理、已完成、待評價、已取消)
def get_order_by_user_id_controller(data):
    order_service = OrderService(current_app.config["MongoDB"])
    user_id = data.get("user_id")
    status = data.get("status")
    if not user_id or not status:
        return {"code": 400, "message": "缺少必要參數 'user_id' 或 'status'", "body": {}}, 400

    response = order_service.get_order_by_user_id(user_id, status)
    return jsonify(response), response["code"]

