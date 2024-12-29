from datetime import datetime
from models.chat_model import create_chat, get_chats

def create_new_chat(participants):
    return create_chat(participants)

def get_user_chats(user_id):
    return get_chats(user_id)

def update_last_message(chat_id, last_message, last_message_time):
    # 更新聊天的 last_message 和 last_message_time
    chat_collection = db.chats
    chat_collection.update_one(
        {"_id": ObjectId(chat_id)},
        {"$set": {
            "last_message": last_message,
            "last_message_time": last_message_time
        }}
    )
