from flask_login import UserMixin

class User(UserMixin):
    def __init__(self, user_id, username, email, password, info, gender, birthday, phone):
        self.id = str(user_id)
        self.username = username
        self.email = email
        self.password = password
        self.info = info
        self.gender = gender
        self.birthday = birthday
        self.phone = phone

    def get_id(self):
        return self.id