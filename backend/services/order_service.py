from bson import ObjectId
import datetime

class OrderService:
    def __init__(self, db):
        self.orders = db["orders"]  # 訂單集合

    # 工具函數: 將 _id 轉換為字串
    def _convert_objectid_to_str(self, data):
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

    # 1. 創建訂單
    def create_order(self, data):
        try:
            buyer_id = data.get("buyer_id")
            seller_id = data.get("seller_id")
            product_ids = data.get("product_ids")  # 商品ID陣列
            quantities = data.get("quantities")    # 商品數量陣列
            payment_method = data.get("payment_method")
            note = data.get("note")
            location = data.get("location")
            agreed_time = data.get("agreed_time")
            total_amount = data.get("total_amount")

            if not buyer_id or not seller_id or not product_ids or not quantities or not payment_method:
                return {"code": 400, "message": "缺少必要資訊", "body": {}}

            if len(product_ids) != len(quantities):
                return {"code": 400, "message": "商品ID數量和物品數量不一致", "body": {}}

            # 創建訂單
            order_data = {
                "buyer_id": str(ObjectId(buyer_id)),
                "seller_id": str(ObjectId(seller_id)),
                "product_ids": str([ObjectId(pid) for pid in product_ids]),
                "quantities": quantities,
                "buyer_status": "待確認",
                "seller_status": "待確認",
                "payment_method": payment_method,
                "created_at": datetime.datetime.utcnow(),
                "note": note,
                "location": location,
                "agreed_time": agreed_time,
                "total_amount": total_amount
            }
            result = self.orders.insert_one(order_data)

            # 返回訂單資料
            new_order = self.orders.find_one({"_id": result.inserted_id})
            return {"code": 200, "message": "訂單創建成功", "body": self._convert_objectid_to_str(new_order)}

        except Exception as e:
            return {"code": 500, "message": f"Server Error: {str(e)}", "body": {}}

    # 2. 輸入訂單id刪除訂單
    def delete_order_by_id(self, order_id):
        try:
            result = self.orders.delete_one({"_id": ObjectId(order_id)})
            if result.deleted_count == 0:
                return {"code": 404, "message": "找不到該訂單", "body": {}}
            return {"code": 200, "message": "訂單刪除成功", "body": {}}

        except Exception as e:
            return {"code": 500, "message": f"Server Error: {str(e)}", "body": {}}

    # 3. 查詢所有訂單
    def get_all_orders(self):
        try:
            orders = list(self.orders.find())

            # 將所有 ObjectId 轉換為字串
            for order in orders:
                if "_id" in order:
                    order["_id"] = str(order["_id"])  # 訂單的 _id 轉成字串
                if "user_id" in order:
                    order["user_id"] = str(order["user_id"])  # 用戶 ID 轉成字串
                if "product_ids" in order and isinstance(order["product_ids"], list):
                    order["product_ids"] = [str(pid) for pid in order["product_ids"]]  # 產品 ID 陣列轉成字串

            return {
                "code": 200,
                "message": "成功取得所有訂單",
                "body": orders
            }
        except Exception as e:
            return {
                "code": 500,
                "message": f"Server Error: {str(e)}",
                "body": {}
            }



    # 4. 用ID查詢單一訂單
    def get_order_by_id(self, order_id):
        try:
            order = self.orders.find_one({"_id": ObjectId(order_id)})
            if not order:
                return {"code": 404, "message": "找不到該訂單", "body": {}}
            return {"code": 200, "message": "成功取得訂單", "body": self._convert_objectid_to_str(order)}

        except Exception as e:
            return {"code": 500, "message": f"Server Error: {str(e)}", "body": {}}

    # 5. 獲取買/賣家的訂單    
    def get_orders_by_Userid(self, buyer_id, seller_id, buyer_status, seller_status):
        try:
            # 查詢符合條件的訂單
            if not seller_id:
                orders = list(self.orders.find({"buyer_id": buyer_id, "buyer_status": buyer_status}))
            elif not buyer_id:
                orders = list(self.orders.find({"seller_id": seller_id, "seller_status": seller_status}))
            if not orders:
                return {"code": 404, "message": "找不到該訂單", "body": {}}

            # 過濾返回的字段
            filtered_orders = []
            for order in orders:
                filtered_order = {
                    "_id": str(order["_id"]),
                    "product_ids": [str(pid) for pid in eval(order["product_ids"])],
                    "quantities": order["quantities"],
                    "total_amount": order.get("total_amount", 0)
                }
                filtered_orders.append(filtered_order)

            return {"code": 200, "message": "成功取得訂單", "body": filtered_orders}

        except Exception as e:
            return {"code": 500, "message": f"Server Error: {str(e)}", "body": {}}
        
    # 根據order_id更改status 
    def update_order_by_id(self, data):
        try:
            order_id = data.get("order_id")
            buyer_status = data.get("buyer_status")
            seller_status = data.get("seller_status")
            if not (order_id and buyer_status and seller_status):
                return {"code":400,"message":"缺少order_id, buyer_status, seller_status","body":{}}
            
            update_order = self.orders.update_one({"_id":ObjectId(order_id)}, {"$set":{"buyer_status":buyer_status, "seller_status":seller_status}})
            if update_order.matched_count == 0:
                return {"code":400,"message":"沒有找到相符的訂單","body":{}}
            
            # success
            return {
                "code":200,
                "message":"update successfully",
                "body":{
                    "matched_count": update_order.matched_count,  # 匹配到的數量
                    "modified_count": update_order.modified_count # 修改數量               
                }
            }
        except Exception as e:
            return {"code": 500, "message": f"Server Error: {str(e)}", "body": {}}
        