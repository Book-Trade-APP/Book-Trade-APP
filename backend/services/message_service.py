from models.message_model import create_message, get_messages_by_chat_id, get_message
from bson import ObjectId
from services.user_service import UserService
from flask import current_app

def send_new_message(chat_id, sender_id, receiver_id, content):
    message = create_message(chat_id, sender_id, receiver_id, content)
    return message

def get_chat_messages_by_chat_id(chat_id):
    messages = get_messages_by_chat_id(chat_id)
    enriched_messages = []
    for message in messages:
        enriched_messages.append(enriched_message(message))
    return enriched_messages

def get_chat_message(message_id):
    message = get_message(message_id)
    return enriched_message(message)

def enriched_message(message):
    user_service = UserService(current_app.config["MongoDB"])
    receiver_result = user_service.find_user_by_id(message["receiver_id"])
    if receiver_result["code"] == 200:
        receiver = receiver_result['body']
        enriched_message = {
            "message_id": str(message["_id"]),
            "chat_id": str(message["chat_id"]),
            "sender_id": str(message["sender_id"]),
            "receiver_id": str(message["receiver_id"]),
            "receiver_username": receiver['username'],
            "content": message["content"],
            "timestamp": message["timestamp"],
        }
        return enriched_message
    else:
        print(f"無法找到用戶 {message["receiver_id"]}，錯誤訊息: {receiver_result['message']}")
    return message