from bson import ObjectId
import datetime

class NotificationService:
    def __init__(self, db):
        self.db = db
        self.notifications = db["notifications"] 

    def send_to_user(self, user_id,title, message):
        """發送通知給特定用戶"""
        try:
            notification = {
                "user_id": ObjectId(user_id),
                "title" : title,
                "message": message,
                "is_read": False,
                "created_at": datetime.datetime.now(datetime.timezone.utc)
            }
            # 插入數據
            result = self.notifications.insert_one(notification)

            # 改回String 不然又傳不回去==
            notification["_id"] = str(result.inserted_id)
            notification["user_id"] = str(notification["user_id"])

            return {"code": 200, "message": "通知已發送給用戶", "body": notification}
        except Exception as e:
            return {"code": 500, "message": f"Server Error: {str(e)}", "body": {}}

    def send_to_all(self, message, title):
            """發送通知給所有用戶"""
            try:
                # 從用戶集合中取得所有用戶 ID
                users = list(self.db["users"].find({}, {"_id": 1}))  # 只取 user_id
                if not users:
                    return {"code": 404, "message": "無用戶可接收通知", "body": {}}

                # 構建批量插入通知數據
                notifications = [
                    {
                        "user_id": user["_id"],
                        "title": title,
                        "message": message,
                        "is_read": False,
                        "created_at": datetime.datetime.now(datetime.timezone.utc)
                    }
                    for user in users
                ]

                # 批量插入通知數據
                result = self.notifications.insert_many(notifications)

                return {
                    "code": 200,
                    "message": f"已成功發送通知給 {len(result.inserted_ids)} 名用戶",
                    "body": {"notification_ids": [str(nid) for nid in result.inserted_ids]}
                }
            except Exception as e:
                return {"code": 500, "message": f"Server Error: {str(e)}", "body": {}}

    def get_user_notifications(self, user_id, only_unread=False):
        """獲取用戶的通知"""
        try:
            query = {"user_id": ObjectId(user_id)}
            if only_unread:
                query["is_read"] = False

            notifications = list(self.notifications.find(query).sort("created_at", -1))
            for notification in notifications:
                notification["_id"] = str(notification["_id"])
                notification["user_id"] = str(notification["user_id"])
            return {"code": 200, "message": "成功獲取通知", "body": notifications}
        except Exception as e:
            return {"code": 500, "message": f"Server Error: {str(e)}", "body": {}}


    def get_user_notification_detail(self, user_id, notification_id=None, title=None):
        """獲取特定用戶的特定通知"""
        try:
            query = {"user_id": ObjectId(user_id)}

            # 如果提供了通知 ID，則添加到查詢條件
            if notification_id:
                query["_id"] = ObjectId(notification_id)

            # 如果提供了標題，則添加到查詢條件
            if title:
                query["title"] = title

            # 查詢通知
            notification = self.notifications.find_one(query)
            if not notification:
                return {"code": 404, "message": "找不到該通知", "body": {}}

            # 轉換 ObjectId 為字符串
            notification["_id"] = str(notification["_id"])
            notification["user_id"] = str(notification["user_id"])

            return {"code": 200, "message": "成功獲取通知", "body": notification}

        except Exception as e:
            return {"code": 500, "message": f"Server Error: {str(e)}", "body": {}}
        

    def mark_as_read(self, notification_id):
        """將通知設置為已讀"""
        try:
            result = self.notifications.update_one(
                {"_id": ObjectId(notification_id)},
                {"$set": {"is_read": True}}
            )
            if result.matched_count == 0:
                return {"code": 404, "message": "找不到該通知", "body": {}}
            return {"code": 200, "message": "通知已標記為已讀", "body": {}}
        except Exception as e:
            return {"code": 500, "message": f"Server Error: {str(e)}", "body": {}}

    def delete_notification(self, notification_id=None, user_id=None, title=None):
        """刪除通知"""
        try:
            query = {}

            if notification_id and user_id:
                # 刪除該用戶的某條通知
                query = {"_id": ObjectId(notification_id), "user_id": ObjectId(user_id)}
            elif title and user_id:
                # 刪除該用戶的所有該標題通知
                query = {"user_id": ObjectId(user_id), "title": title}
            elif user_id:
                # 刪除該用戶的所有通知
                query = {"user_id": ObjectId(user_id)}
            elif title:
                # 刪除所有人的該標題通知
                query = {"title": title}
            else:
                # 無效請求
                return {"code": 400, "message": "請提供有效的條件參數", "body": {}}

            # 執行刪除操作
            result = self.notifications.delete_many(query)
            if result.deleted_count == 0:
                return {"code": 404, "message": "找不到符合條件的通知", "body": {}}

            return {
                "code": 200,
                "message": "成功刪除通知",
                "body": {"deleted_count": result.deleted_count}
            }
        except Exception as e:
            return {"code": 500, "message": f"Server Error: {str(e)}", "body": {}}

    def get_user_read_state(self, user_id , notification_id):
        """取得用戶是否已讀"""
        try:
            query = {"user_id": ObjectId(user_id), "_id": ObjectId(notification_id)}
            notification = self.notifications.find_one(query)
            if not notification:
                return {"code": 404, "message": "找不到該通知", "body": {}}
            return {"code": 200, "message": "成功獲取通知狀態", "body": {"is_read": notification["is_read"]}}
        except Exception as e:
            return {"code": 500, "message": f"Server Error: {str(e)}", "body": {}}