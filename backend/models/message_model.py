from bson import ObjectId
from config import init_db
from datetime import datetime

db = init_db()  # 使用 config 中的 init_db 來初始化資料庫連接

def create_message(chat_id, sender_id, receiver_id, content):
    message = {
        "chat_id": chat_id,
        "sender_id": sender_id,
        "receiver_id": receiver_id,
        "content": content,
        "timestamp": datetime.utcnow(),
        "is_read": False
    }
    return db.messages.insert_one(message)

def get_messages(chat_id):
    return list(db.messages.find({"chat_id": ObjectId(chat_id)}).sort("timestamp", 1))
