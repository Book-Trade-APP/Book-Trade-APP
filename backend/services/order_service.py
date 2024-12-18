from bson import ObjectId
import datetime

class OrderService:
    def __init__(self, db):
        self.orders = db["orders"]    # 訂單集合
        self.carts = db["cart"]       # 購物車集合

    # 工具函數: 將 ObjectId 轉換為字串
    def _convert_objectid_to_str(self, data):
        """
        將 MongoDB 文檔中的 ObjectId 轉換成字串。
        支援單一文檔或文檔列表。
        """
        if isinstance(data, list):
            for item in data:
                if "_id" in item and isinstance(item["_id"], ObjectId):
                    item["_id"] = str(item["_id"])
            return data
        elif isinstance(data, dict):
            if "_id" in data and isinstance(data["_id"], ObjectId):
                data["_id"] = str(data["_id"])
            return data
        return data

    def create_order(self, cart_id, payment_method):
        try:
            # 驗證購物車 ID
            cart = self.carts.find_one({"_id": ObjectId(cart_id)})
            if not cart:
                return {"code": 404, "message": "找不到該購物車", "body": {}}

            # 獲取用戶ID與商品ID
            user_id = cart.get("user_id")
            product_ids = cart.get("product_id")

            if not user_id or not product_ids:
                return {"code": 400, "message": "購物車中缺少用戶ID或商品ID", "body": {}}

            # 將 product_ids 轉換成列表（若是單一值時包裝成列表）
            if not isinstance(product_ids, list):
                product_ids = [product_ids]

            # 創建訂單
            order_data = {
                "user_id": str(ObjectId(user_id)),  # 轉換為字串
                "product_id": [str(ObjectId(pid)) for pid in product_ids],  # 轉換為字串列表
                "status": "待處理",  # 訂單初始狀態
                "payment_method": payment_method,
                "created_at": datetime.datetime.utcnow()  # 當前時間
            }
            result = self.orders.insert_one(order_data)

            # 刪除購物車中的資料
            self.carts.delete_one({"_id": ObjectId(cart_id)})

            # 取得插入的訂單資料
            new_order = self.orders.find_one({"_id": result.inserted_id})
            new_order = self._convert_objectid_to_str(new_order)

            # 成功返回
            return {"code": 201, "message": "訂單創建成功，購物車已清空", "body": new_order}

        except Exception as e:
            return {"code": 500, "message": f"Server Error: {str(e)}", "body": {}}
