from pymongo.collection import Collection

class ProductModel:
    def __init__(self, db):
        self.collection: Collection = db["products"]  # MongoDB 中的 products 集合

    def insert_product(self, product_data: dict):
        """新增商品到資料庫"""
        return self.collection.insert_one(product_data)

    def get_all_products(self):
        """查詢所有商品"""
        return list(self.collection.find())