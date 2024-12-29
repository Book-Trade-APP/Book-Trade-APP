from flask import request, jsonify
from services.message_service import send_new_message, get_chat_messages, get_chat_message
from services.chat_service import update_chat_last_message

def send_message_controller():
    data = request.get_json()
    chat_id = data['chat_id']
    sender_id = data['sender_id']
    receiver_id = data['receiver_id']
    content = data['content']

    message = send_new_message(chat_id, sender_id, receiver_id, content)
    message_id = str(message.inserted_id)
    inserted_message = get_chat_message(message_id)
    update_chat_last_message(
        inserted_message["chat_id"],
        inserted_message["content"],
        inserted_message["timestamp"]
    )
    return jsonify({
        "message": "Message sent successfully!",
        "message_id": message_id,
        "inserted_message": inserted_message
    }), 201

def get_messages_controller(chat_id):
    messages = get_chat_messages(chat_id)
    return jsonify(messages), 200
