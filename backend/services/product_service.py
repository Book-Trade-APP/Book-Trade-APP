import json

class ProductService:
    def __init__(self, db):
        self.collection = db["products"]

    # 檢查dict value 是否有空值    
    def _check_all_items(self, d: dict) -> bool:
        for v in d.values():
            if not v:
                return False
        return True
    
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
            
            if not self._check_all_items(product_data):
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

    def get_products(self):
        try:
            products = list(self.collection.find({}, {"_id": 0}))  # 返回所有商品，不包括 _id(會code 500)
            return {
                "code":200,
                "message":"成功取得所有商品",
                "body": products
            }
            
        except Exception as e:
            return {
                "code": 500,
                "message":f"Sever Error(product_service.py): {str(e)}",
                "body": {}
            }