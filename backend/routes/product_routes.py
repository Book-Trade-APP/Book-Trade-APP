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

# 更新商品資料
@product_bp.route("/UpdateProduct", methods=["POST"])
def update_product_routes():
    return update_product_controller()

# 加入購物車
@product_bp.route("/AddToCart",methods=["POST"])
def add_to_cart_routes():
    return add_to_cart_controller()

# 加入收藏
@product_bp.route("/AddToFavorites",methods=["POST"])
def add_to_favorites_routes():
    return add_to_favorites_controller()

# 從購物車刪除
@product_bp.route("/UpdateCart",methods=["POST"])
def update_cart_routes():
    return update_cart_controller()

# 從收藏刪除一筆資料
@product_bp.route("/DeleteFromFavorites",methods=["POST"])
def delete_from_favorites_routes():
    return delete_from_favorites_controller()
    
# user_id找收藏商品
@product_bp.route("/GetFavoritesByUserId",methods=["POST"])
def get_favorites_by_user_id():
    return get_favorites_by_user_id_controller()
