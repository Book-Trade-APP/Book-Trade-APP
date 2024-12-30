from datetime import datetime
from models.chat_model import create_chat, get_chats, get_chat_by_participants, update_chat
from bson import ObjectId
from services.user_service import UserService
from flask import current_app

def create_new_chat(participant_ids):
    return create_chat(participant_ids)

def get_user_chats(user_id):
    user_service = UserService(current_app.config["MongoDB"])

    chats = get_chats(user_id)
    processed_chats = []

    for chat in chats:
        other_user_id = [p for p in chat["participants"] if str(p) != user_id][0]
        other_user_result = user_service.find_user_by_id(other_user_id)

        if other_user_result["code"] == 200:
            other_user = other_user_result["body"]
            chat_data = {
                "chat_id": str(chat["_id"]),
                "receiver_id": str(other_user['_id']),
                "username": other_user['username'],
                "avatar": other_user['headshot'],
                "last_message": chat.get("last_message", ""),
                "last_message_time": chat.get("last_message_time")
            }
            processed_chats.append(chat_data)
        else:
            print(f"無法找到用戶 {other_user_id}，錯誤訊息: {user_result['message']}")
    return processed_chats

def get_chat_id(participant_ids):
    chat = get_chat_by_participants(participant_ids)
    if not chat:
        return {"code": 404, "message": "聊天不存在", "body": {}}
    return {"code": 200, "body": str(chat["_id"])}

def update_chat_last_message(chat_id, last_message, last_message_time):
    return update_chat(chat_id, last_message, last_message_time)
