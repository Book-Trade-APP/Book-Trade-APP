from flask import jsonify

class ResponseHandler:
    def __init__(self, code: int = 500, message: str = "", body: dict = None):
        self.code = code
        self.message = message
        self.body = body if body is not None else {}

    def response(self):
        return jsonify({
            "code": self.code,
            "message": self.message,
            "body": self.body
        }), self.code
