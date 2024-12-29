from flask import Blueprint
from controllers.chat_controller import create_chat_controller, get_chats_controller
from controllers.message_controller import send_message_controller, get_messages_controller

chat_bp = Blueprint('chat', __name__)

@chat_bp.route('/create_chat', methods=['POST'])
def create_chat():
    return create_chat_controller()

@chat_bp.route('/get_chats_by_user_id/<user_id>', methods=['GET'])
def get_chats_by_user_id(user_id):
    return get_chats_controller(user_id)

@chat_bp.route('/send_message/', methods=['POST'])
def send_message():
    return send_message_controller()

@chat_bp.route('/get_messages_by_chat_id/<chat_id>', methods=['GET'])
def get_messages_by_chat_id(chat_id):
    return get_messages_controller(chat_id)