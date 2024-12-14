# class UserModel:
#     def __init__(self, db):
#         self.collection = db["users"]

#     def find_by_email(self, email):
#         return self.collection.find_one({"email": email})

#     def insert_user(self, user_data):
#         self.collection.insert_one(user_data)