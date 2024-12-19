from flask import Blueprint
from controllers.product_controller import *

product_bp = Blueprint("product", __name__)

# 新增商品
@product_bp.route("/AddProducts", methods=["POST"])
def add_product_routes():
    return add_product_controller()

# 取得所有商品
@product_bp.route("/GetAllProducts", methods=["GET"])
def get_all_products_routes():
    return get_all_products_controller()

# 根據product_id, 取得一筆資料
@product_bp.route("/GetOneProduct", methods=["GET"])
def get_one_product_by_id_routes():
    return get_one_product_by_id_controller()

# 加入購物車
@product_bp.route("/AddToCart",methods=["POST"])
def add_to_cart_routes():
    return add_to_cart_controller()

# 加入收藏
@product_bp.route("/AddToFavorites",methods=["POST"])
def add_to_favorites_routes():
    return add_to_favorites_controller()
