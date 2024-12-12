class ProductService:
    def __init__(self, db):
        self.collection = db["products"]

    def add_product(self, product_data):
        if not product_data:
            raise ValueError("商品資料不能為空")
        self.collection.insert_one(product_data)
        return {"message": "商品新增成功"}, 201

    def get_products(self):
        products = list(self.collection.find({}, {"_id": 0}))  # 返回所有商品，不包括 _id
        return {"products": products}, 200