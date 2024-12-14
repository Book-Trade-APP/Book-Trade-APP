# 回傳值
class resp:
    def __init__(self, code: int = None, message: str = None, body: dict = {}):
        self.code = code
        self.message = message
        self.body = body

       