from flask import request, jsonify, current_app
from services.order_service import OrderService

# 創建訂單
def create_order_controller():
    order_service = OrderService(current_app.config["MongoDB"])  # 初始化服務
    try:
        data = request.json
        cart_id = data.get("cart_id")  # 從請求中獲取購物車 ID
        payment_method = data.get("payment_method")  # 獲取付款方式

        if not cart_id or not payment_method:
            return jsonify({"code": 400, "message": "缺少購物車ID或付款方式", "body": {}}), 400

        response = order_service.create_order(cart_id, payment_method)
        return jsonify(response), response["code"]

    except Exception as e:
        return jsonify({"code": 500, "message": str(e), "body": {}}), 500
