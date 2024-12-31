from flask import Blueprint, request, jsonify
from controllers.order_controller import (
    create_order_controller,
    delete_order_controller,
    get_all_orders_controller,
    get_order_by_id_controller,
    get_orders_by_Userid_controller,
    update_order_status_by_id_controller
)

order_bp = Blueprint("order", __name__)

# 創建訂單
@order_bp.route("/CreateOrder", methods=["POST"])
def create_order_route():
    return create_order_controller()

# 刪除訂單 (使用 Query Parameters)
@order_bp.route("/DeleteOrder", methods=["DELETE"])
def delete_order_route():
    order_id = request.args.get("id")  # 從 Query Params 中取得 id
    if not order_id:
        return jsonify({"code": 400, "message": "缺少必要參數 'id'", "body": {}}), 400
    return delete_order_controller(order_id)

# 查詢所有訂單
@order_bp.route("/GetAllOrders", methods=["GET"])
def get_all_orders_route():
    return get_all_orders_controller()

# 用 ID 查詢單一訂單 (使用 Query Parameters)
@order_bp.route("/GetOrderById", methods=["GET"])
def get_order_by_id_route():
    order_id = request.args.get("id")  # 從 Query Params 中取得 id
    if not order_id:
        return jsonify({"code": 400, "message": "缺少必要參數 'id'", "body": {}}), 400
    return get_order_by_id_controller(order_id)


# 獲取買/賣家的訂單
@order_bp.route("/get_orders_by_Userid", methods=["POST"])
def get_orders_by_Userid_route():
    return get_orders_by_Userid_controller()

# 根據order_id更改status
@order_bp.route("/UpdateStatusById", methods=["POST"])
def update_order_status_by_id_route():
    return update_order_status_by_id_controller()