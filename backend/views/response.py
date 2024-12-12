from flask import jsonify

def success_response(data=None, message="Success"):
    return jsonify({"message": message, "data": data}), 200

def error_response(message="Error", status_code=400):
    return jsonify({"error": message}), status_code