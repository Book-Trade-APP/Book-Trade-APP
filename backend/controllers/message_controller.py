from flask import request, jsonify
from services.message_service import send_new_message, get_chat_messages
from services.chat_service import update_last_message

def send_message_controller():
    data = request.get_json()
    chat_id = data['chat_id']
    sender_id = data['sender_id']
    receiver_id = data['receiver_id']
    content = data['content']

    message = send_new_message(chat_id, sender_id, receiver_id, content)
# TODO: 更新 message
#     update_last_message(chat_id, message.content, message.timestamp)
    return jsonify({"message": "Message sent successfully!", "message_id": str(message.inserted_id)}), 201

def get_messages_controller(chat_id):
    messages = get_chat_messages(chat_id)
    for message in messages:
        message["_id"] = str(message["_id"])
        message["sender_id"] = str(message["sender_id"])
        message["receiver_id"] = str(message["receiver_id"])
    return jsonify(messages), 200
