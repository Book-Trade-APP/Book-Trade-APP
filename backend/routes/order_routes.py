from flask import Blueprint
from controllers.order_controller import create_order_controller

order_bp = Blueprint("order", __name__)

# 創建訂單
@order_bp.route("/CreateOrder", methods=["POST"])
def create_order_route():
    return create_order_controller()
