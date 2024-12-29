from models.message_model import create_message, get_messages
from bson import ObjectId

def send_new_message(chat_id, sender_id, receiver_id, content):
    message = create_message(chat_id, sender_id, receiver_id, content)
    return message

def get_chat_messages(chat_id):
    messages = get_messages(chat_id)
    return messages
