from bson import ObjectId
from config import init_db
from datetime import datetime

db = init_db()

def create_chat(participant_ids):
    existing_chat = get_chat_by_participants(participant_ids)
    if existing_chat:
        return

    participant_ids.sort()
    sorted_object_ids = [ObjectId(participant_id) for participant_id in participant_ids]
    inserted_chat = db.chats.insert_one({
        "participants": sorted_object_ids,
        "last_message_time": datetime.utcnow()
    })
    return inserted_chat

def get_chats(user_id):
    chats = list(db.chats.find({"participants": ObjectId(user_id)}).sort("last_message_time", -1))
    return chats

def get_chat_by_participants(participant_ids):
    participant_ids.sort()
    sorted_object_ids = [ObjectId(participant_id) for participant_id in participant_ids]
    return db.chats.find_one({"participants": {"$all": sorted_object_ids}})

def update_chat(chat_id, last_message, last_message_time):
    return db.chats.update_one(
        {"_id": ObjectId(chat_id)},
        {"$set": {
            "last_message": last_message,
            "last_message_time": last_message_time
        }}
    )