from flask import request, jsonify
from services.chat_service import create_new_chat, get_user_chats

def create_chat_controller():
    data = request.get_json()
    participants = data['participants']
    chat = create_new_chat(participants)
    return jsonify({"message": "Chat created successfully!", "chat_id": str(chat.inserted_id)}), 201

def get_chats_controller(user_id):
    chats = get_user_chats(user_id)
    for chat in chats:
        chat["_id"] = str(chat["_id"])
        chat["participants"] = [str(p) for p in chat["participants"]]
    return jsonify(chats), 200
