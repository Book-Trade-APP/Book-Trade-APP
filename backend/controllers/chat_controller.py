from flask import request, jsonify
from services.chat_service import create_new_chat, get_user_chats, get_chat_id

def create_chat_controller(participant_ids):
    chat = create_new_chat(participant_ids)
    return jsonify(str(chat.inserted_id)), 200

def get_chats_by_user_controller(user_id):
    chats = get_user_chats(user_id)
    return jsonify(chats), 200

def get_chat_id_by_participants_controller(participant_ids):
    response = get_chat_id(participant_ids)
    return jsonify(response), response["code"]