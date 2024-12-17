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
                    "message":f"沒有取得任何資料",
                    "body": {}
                }
                
            user_id = request_data["user_id"]
            product_id = request_data["product_id"]
            if not (user_id and product_id):
                return {
                    "code": 400,
                    "message":f"需要提供user_id 跟 product_id",
                    "body": {}
                }
                
            user = self.db["users"].find({"_id": ObjectId(user_id)})
            product = self.collection.find({"_id":ObjectId(product_id)})
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
            user_cart = user["cart_id"]
            cart_product_id = list(self.db["cart"].find({"_id": ObjectId(user_cart)})) # must be list
            # 有存在
            if cart_product_id != [] or cart_product_id != None:
                new_product_id = cart_product_id + product_id
                self.db["cart"].update_one({"_id": ObjectId(user_cart)},{"$set":{"product_id":new_product_id}})
            # 不存在
            else:
                self.db["cart"].insert_one({"user_id":ObjectId(user_id),"product_id":ObjectId(product_id)})
                cart_id = self.db["cart"].find({"user_id":ObjectId(user_id)})["_id"]
                self.db["users"].update_one({"_id": ObjectId(user_id)}, {'$set':{"cart_id":cart_id}})
            return {
                "code": 201,
                "message":"成功加入購物車",
                "body": {}
            }
            
        except Exception as e:
            return {
                "code": 500,
                "message":f"Sever Error(product_service.py): {str(e)}",
                "body": {}
            }
            
# {
#     "user_id":"675eef76f84cb6f6196af867",
#     "product_id":"675958f77edaae5261c7adea"
# }
    
    # 加入收藏
    def add_to_favorite():
        pass