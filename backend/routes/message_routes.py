from flask import Blueprint
from controllers.message_controller import send_message_controller, get_messages_controller

message_api = Blueprint('message_api', __name__)

# 路由：發送消息
message_api.route('/', methods=['POST'])(send_message_controller)

# 路由：獲取消息
message_api.route('/<chat_id>', methods=['GET'])(get_messages_controller)
