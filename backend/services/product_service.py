from bson import ObjectId

class ProductService:
    def __init__(self, db):
        self.db = db
        self.collection = db["products"]

    # 檢查dict value 是否有空值    
    def _check_all_items(self, d: dict) -> bool:
        for v in d.values():
            if not v:
                return True
        return False
    
    # 提取並轉換 _id 值的方法
    def _convert_objectid_to_str(self, data):
        for item in data:
            # 將 MongoDB 的 ObjectId 轉換成字串格式
            item["_id"] = str(item["_id"])
        return data
    
    #! 會重複加資料
    #todo: 驗證商品格式
    def add_product(self, product_data):
        try:
            # 商品資料不能為空
            if not product_data:
                return {
                    "code": 400,
                    "message":"商品資料是空的",
                    "body": {}
                }
            
            if self._check_all_items(product_data):
                return {
                    "code": 400,
                    "message":"商品資料不能包含空值",
                    "body": {}
                }
            
            # Success
            self.collection.insert_one(product_data)
            return {
                "code": 201,
                "message":"商品新增成功",
                "body": {}
            }
            
        except Exception as e:
            return {
                "code": 500,
                "message":f"Sever Error(product_service.py): {str(e)}",
                "body": {}
            }

    # 返回所有商品
    def get_products(self):
        try:
            products = list(self.collection.find())
            converted_body = self._convert_objectid_to_str(products)
            
            return {
                "code":200,
                "message":"成功取得所有商品",
                "body": converted_body
            }
            
        except Exception as e:
            return {
                "code": 500,
                "message":f"Sever Error(product_service.py): {str(e)}",
                "body": {}
            }
            
    # 加入購物車    
    def add_to_cart(self, request_data):
        try:
            if not request_data:
                return {
                    "code": 400,
                    "message":"沒有取得任何資料",
                    "body": {}
                }
                
            user_id = request_data["user_id"]
            product_id = request_data["product_id"]
            if not (user_id and product_id):
                return {
                    "code": 400,
                    "message":"需要提供user_id 跟 product_id",
                    "body": {}
                }
                
            user = self.db["users"].find_one({"_id": ObjectId(user_id)})
            product = self.collection.find_one({"_id":ObjectId(product_id)})
            if not (user and product):
                if not user:
                    message = "user not find"
                else:
                    message = "product not find"
                return {
                    "code": 404,
                    "message":message,
                    "body": {}
                }
            # 確定使用者有沒有購物車
            user_cart_id = user.get("cart_id",[]) # ObjectId()
            # 有存在
            if user_cart_id:
                # 加入product_id list中
                cart = self.db["cart"].find_one({"_id": ObjectId(user_cart_id)})
                if not cart:
                    return {
                        "code": 500,
                        "message": "無法找到購物車資料",
                        "body": {}
                    }
                cart_product_ids = cart.get("product_id")
                # 更新cart
                if ObjectId(product_id) not in cart_product_ids:
                    cart_product_ids.append(ObjectId(product_id))
                    self.db["cart"].update_one(
                        {"_id": ObjectId(user_cart_id)},
                        {"$set": {"product_id": cart_product_ids}}
                    )
                
            # 不存在
            else:
                # 創建新購物車
                new_cart = {
                    "user_id": ObjectId(user_id),
                    "product_id": [ObjectId(product_id)]
                }
                result = self.db["cart"].insert_one(new_cart)
                new_cart_id = result.inserted_id

                # 更新使用者的 cart_id
                self.db["users"].update_one(
                    {"_id": ObjectId(user_id)},
                    {"$set": {"cart_id": new_cart_id}}
                )
            return {
                "code": 200,
                "message": "商品成功新增到購物車",
                "body": {}
            }
            
        except Exception as e:
            return {
                "code": 500,
                "message":f"Sever Error(product_service.py): {str(e)}",
                "body": {}
            }
    # 加入收藏
    def add_to_favorite():
        pass