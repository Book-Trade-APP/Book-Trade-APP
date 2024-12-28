from flask import request, jsonify, current_app
from services.notification_service import NotificationService

# 發送通知給特定用戶
def send_to_user_controller():
    db = current_app.config["MongoDB"]
    notification_service = NotificationService(db)
    data = request.json
    user_id = data.get("user_id")
    title = data.get("title")
    message = data.get("message")

    if not user_id or not message or not title:
        return jsonify({"code": 400, "message": "缺少 user_id 或 title或 message"}), 400

    response = notification_service.send_to_user(user_id,title , message)
    return jsonify(response), response["code"]

# 發送通知給所有用戶
def send_to_all_controller():
    db = current_app.config["MongoDB"]  # 獲取 MongoDB 連接對象
    notification_service = NotificationService(db)  # 傳遞 db 初始化 NotificationService
    data = request.json

    message = data.get("message")
    title = data.get("title")

    if not message or not title:
        return jsonify({"code": 400, "message": "缺少 title 或 message"}), 400

    # 調用服務層方法
    response = notification_service.send_to_all(message, title)
    return jsonify(response), response["code"]



# 獲取用戶通知
def get_user_notifications_controller():
    db = current_app.config["MongoDB"]
    notification_service = NotificationService(db)

    # 從 URL Query Params 中獲取參數
    user_id = request.args.get("_id") # 用戶 ID
    only_unread = request.args.get("only_unread", "false").lower() == "true"  # 將 'true' 字符串轉換為布爾值

    if not user_id:
        return jsonify({"code": 400, "message": "缺少 user_id"}), 400

    # 調用服務層方法
    response = notification_service.get_user_notifications(user_id, only_unread)
    return jsonify(response), response["code"]


# 獲取用戶特定通知
def get_user_notification_detail_controller():
    db = current_app.config["MongoDB"]
    notification_service = NotificationService(db)

    # 從請求 JSON 中獲取參數
    data = request.json
    user_id = data.get("user_id")
    notification_id = data.get("notification_id")  # 可選
    title = data.get("title")  # 可選

    if not user_id:
        return jsonify({"code": 400, "message": "缺少 user_id"}), 400

    if not notification_id and not title:
        return jsonify({"code": 400, "message": "需要提供 notification_id 或 title"}), 400

    # 調用服務層方法
    response = notification_service.get_user_notification_detail(user_id, notification_id, title)
    return jsonify(response), response["code"]


# 標記通知為已讀
def mark_as_read_controller():
    db = current_app.config["MongoDB"]
    notification_service = NotificationService(db)
    data = request.json
    notification_id = data.get("notification_id")

    if not notification_id:
        return jsonify({"code": 400, "message": "缺少 notification_id"}), 400

    response = notification_service.mark_as_read(notification_id)
    return jsonify(response), response["code"]

# 刪除通知
def delete_notification_controller():
    db = current_app.config["MongoDB"]
    notification_service = NotificationService(db)
    data = request.json

    # 接收參數
    notification_id = data.get("notification_id")  # 單條通知 ID
    user_id = data.get("user_id")  # 用戶 ID
    title = data.get("title")  # 標題

    # 如果參數都缺少，返回錯誤
    if not (notification_id or user_id or title):
        return jsonify({"code": 400, "message": "請提供 notification_id、user_id 或 title"}), 400

    # 調用服務刪除通知
    response = notification_service.delete_notification(notification_id, user_id, title)
    return jsonify(response), response["code"]

# 取得用戶通知狀態

def get_user_read_state_controller():
    db = current_app.config["MongoDB"]
    notification_service = NotificationService(db)
    data = request.json
    user_id = data.get("user_id")
    notification_id = data.get("notification_id")

    if not user_id or not notification_id:
        return jsonify({"code": 400, "message": "缺少 user_id 或 notification_id"}), 400

    response = notification_service.get_user_read_state(user_id, notification_id)
    return jsonify(response), response["code"]
