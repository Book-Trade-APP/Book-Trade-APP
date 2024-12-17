# 修正個人資料

from pymongo.collection import Collection

class UpdatePersonalData:
    
    def __init__(self, db) -> None:
        self.collection: Collection = db["users"]  # MongoDB 中的 users 集合
        self.user:self.collection.find_one{}# 要先知道使用者是誰

    def set_username(self,username:str) -> None:
        if username == None:
            raise ValueError("輸入值不得為空")
        elif len(self,username) > 20: 
            raise ValueError("使用者名稱不能超過20個字元")
        else:
            pass
            
    def set_info(self,info:str) -> None:
        pass

    def set_gender(self,name:str) -> None:
        pass

    def set_birthday(self,name:str) -> None:
        pass

    def set_phone(self,name:str) -> None:
        pass

    def set_email(self,email:str) -> None:
        pass
