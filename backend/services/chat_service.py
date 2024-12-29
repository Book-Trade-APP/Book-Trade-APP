from datetime import datetime
from models.chat_model import create_chat, get_chats
from bson import ObjectId

def create_new_chat(participants):
    return create_chat(participants)

def get_user_chats(user_id):
    chats = get_chats(user_id)
    for chat in chats:
        chat["chat_id"] = str(chat["_id"])
        chat["participants"] = [str(p) for p in chat["participants"]]
    return chats

def update_last_message(chat_id, last_message, last_message_time):
    chat_collection = db.chats
    chat_collection.update_one(
        {"_id": ObjectId(chat_id)},
        {"$set": {
            "last_message": last_message,
            "last_message_time": last_message_time
        }}
    )
