from flask import Blueprint
from controllers.notification_controller import (
    send_to_user_controller,
    send_to_all_controller,
    get_user_notifications_controller,
    mark_as_read_controller,
    delete_notification_controller,
    get_user_notification_detail_controller,
    get_user_read_state_controller
)

notification_bp = Blueprint("notification", __name__)

@notification_bp.route("/send_to_user", methods=["POST"])
def send_to_user_route():
    return send_to_user_controller()

@notification_bp.route("/send_to_all", methods=["POST"])
def send_to_all_route():
    return send_to_all_controller()

@notification_bp.route("/get_user_notifications", methods=["GET"])
def get_user_notifications_route():
    return get_user_notifications_controller()

@notification_bp.route("/get_user_notification_detail", methods=["POST"])
def get_user_notification_detail_route():
    return get_user_notification_detail_controller()

@notification_bp.route("/mark_as_read", methods=["POST"])
def mark_as_read_route():
    return mark_as_read_controller()

@notification_bp.route("/delete_notification", methods=["POST"])
def delete_notification_route():
    return delete_notification_controller()

@notification_bp.route("/get_user_read_state", methods=["POST"])
def get_user_read_state_route():
    return get_user_read_state_controller()
