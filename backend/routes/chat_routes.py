from flask import Blueprint
from controllers.chat_controller import create_chat_controller, get_chats_controller

chat_api = Blueprint('chat_api', __name__)

# 路由：創建聊天
chat_api.route('/', methods=['POST'])(create_chat_controller)

# 路由：獲取用戶聊天
chat_api.route('/<user_id>', methods=['GET'])(get_chats_controller)
