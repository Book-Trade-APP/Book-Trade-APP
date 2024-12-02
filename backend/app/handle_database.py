import os
from dotenv import load_dotenv
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from typing import Dict

class Handle_database:
    
    def __init__(self, DB_name: str, DB_collection: str) -> None:
        self.DB_name = DB_name
        self.DB_collection = DB_collection
        self.client = None
        self.db = None
        self.collection = None
        self.connect()
    
    # 連接到MongoDB，並指到對應的db, collection
    def connect(self):
        load_dotenv()
        uri = os.getenv("MONGODB_URL")
        if not uri:
            print("MongoDB URL not found. Please check your .env file.")
            return
        self.client = MongoClient(uri, server_api=ServerApi('1'))
        
        try:
            self.client.admin.command('ping')
            print("Pinged your deployment. You successfully connected to MongoDB!")
            
            self.db = self.client[self.DB_name]
            self.collection = self.db[self.DB_collection]
            
        except Exception as e:
            print(e)
            
    # CRUD
    # insert_one()
    def insert(self, data: Dict) -> None:
        try:
            self.collection.insert_one(data)
            print('Insert success')
        except Exception as e:
            print(f"Insert error: {e}")
    
    # find_one()
    def find(self, filter: Dict, projection: Dict = None) -> Dict:
        try:
            return self.collection.find_one(filter, projection)
        except Exception as e:
            print(f"Find error: {e}")
            return {}
        
    # update_one()
    def update(self, filter: Dict, update_data: Dict) -> None:
        try:
            result = self.collection.update_one(filter, {'$set': update_data})
            if result.matched_count > 0:
                print('Update success')
            else:
                print('No document matched the filter')
        except Exception as e:
            print(f"Update error: {e}")
    
    # delete_one()
    def delete(self, filter: Dict) -> None:
        try:
            result = self.collection.delete_one(filter)
            if result.deleted_count > 0:
                print('Delete success')
            else:
                print('No document matched the filter')
        except Exception as e:
            print(f"Delete error: {e}")


# test 
                
# collection = Handle_database(DB_name="Book_trade", DB_collection="login")
# salt=os.urandom(16)
# password = hashlib.sha256(salt + '123'.encode('utf-8'))
# hex_hash_password = password.hexdigest()

# data = {'email':"kenny",'salt':salt,'password':hex_hash_password}
# new_data = {'age':20}

# filter = {'email':"kenny"}
# projection = {'salt':1,'email':1,'password':1}
# print(collection.find(filter,projection))

# db.insert(data)

# db.update(filter,new_data)
# pprint(db.find(filter))

# db.delete(filter)
# pprint(db.find(filter,projection))


