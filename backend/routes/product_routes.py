from flask import Blueprint
from controllers.product_controller import add_product, get_all_products

product_bp = Blueprint("product", __name__)

@product_bp.route("/AddProducts", methods=["POST"])
def add_product_routes():
    return add_product()

@product_bp.route("/GetAllProducts", methods=["GET"])
def get_all_products_routes():
    return get_all_products()