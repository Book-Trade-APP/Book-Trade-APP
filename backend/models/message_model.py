from bson import ObjectId
from config import init_db
from datetime import datetime

db = init_db()

def create_message(chat_id, sender_id, receiver_id, content):
    message = {
        "chat_id": ObjectId(chat_id),
        "sender_id": ObjectId(sender_id),
        "receiver_id": ObjectId(receiver_id),
        "content": content,
        "timestamp": datetime.utcnow(),
        "is_read": False
    }
    return db.messages.insert_one(message)

def get_messages(chat_id):
    print(f"Fetching messages for chat_id: {chat_id}")  # 調試日誌
    messages = list(db.messages.find({"chat_id": ObjectId(chat_id)}).sort("timestamp", 1))
    print(f"messages: {messages}")
    return list(db.messages.find({"chat_id": ObjectId(chat_id)}).sort("timestamp", 1))
