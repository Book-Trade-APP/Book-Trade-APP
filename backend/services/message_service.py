from models.message_model import create_message, get_messages

def send_new_message(chat_id, sender_id, receiver_id, content):
    return create_message(chat_id, sender_id, receiver_id, content)

def get_chat_messages(chat_id):
    return get_messages(chat_id)
