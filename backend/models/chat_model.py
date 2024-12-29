from bson import ObjectId
from config import init_db
from datetime import datetime
from flask import jsonify

db = init_db()  # 使用 config 中的 init_db 來初始化資料庫連接

def create_chat(participants):
    chat = {
        "participants": participants,
        "last_message": "",
        "last_message_time": datetime.utcnow()
    }
    return db.chats.insert_one(chat)

def get_chats(user_id):
    chats = list(db.chats.find({"participants": ObjectId(user_id)}).sort("last_message_time", -1))
    return chats
