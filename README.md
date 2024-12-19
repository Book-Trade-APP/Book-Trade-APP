# How to use

創建python 虛擬環境  

`python -m venv venv`

啟動虛擬環境(windows)  

`.\venv\Scripts\activate`

ctrl + shift + p  
    ![選擇python 解譯器](./images/select_interpreter1.png)  
    
選擇python 解譯器(VScode)  
    ![選擇python 解譯器](./images/select_interpreter2.png)

安裝依賴
`pip install -r .\requirements.txt` or
`pip3 install -r .\requirements.txt`

啟用後端

`python app.py or  python3 app.py`


.env.example 按照指示修改至.env

## User API使用教學

### 登入

輸入：


`[POST] http://127.0.0.1:8000/users/login`  

```
{
    "email": "test@example.com",
    "password": "password123"
}
```

回傳：
- code 200

    ```
    {
        "body": {
            "birthday": "",
            "email": "test@example.com",
            "gender": "",
            "info": "",
            "password": "YOUR_PASSWORD_AFTER_HASHED",
            "phone": "",
            "username": "YOUR_USER_NAME"
        },
        "code": 200,
        "message": "登入成功"
    }
    ```
- code 400
    ```
    {
        "code": 400,
        "message": "電子郵件、名稱、密碼不得為空",
        "body": {}
    }
    ```
- code 401
    ``` 
    {
        "code": 401,
        "message": "帳號/密碼錯誤",
        "body": {}
    }
    ```
- code 404
    ```
    {
        "code": 404,
        "message": "帳戶不存在",
        "body": {}
    }
    ```
- code 500
    ```
    {
        "code": 500,
        "message": "Server Error",
        "body": {}
    }
    ```
### 註冊

輸入：


`[POST] http://127.0.0.1:8000/users/register`  

```
{
    "email": "test@example.com",
    "username": "testuser",
    "password": "password123"
}
```

回傳：
- code 201
    ```
    {
        "code": 201,
        "message": "註冊成功",
        "body": {}
    }
    ```
- code 400
    ```
    {
        "code": 400,
        "message": "電子郵件、名稱、密碼不得為空" | "電子郵件格式不正確",
        "body": {}
    }
    ```
- code 409
    ```
    {
        "code": 409,
        "message": "此電子郵件已經註冊過",
        "body": {}
    }
    ```
- code 500
    ```
    {
        "code": 500,
        "message": "Server Error",
        "body": {}
    }
    ```
### 更新使用者資料
輸入：

`[post] http://127.0.0.1:8000/users/update`
```
{
    "_id":"675e12341234b6f1234af867",
    "username":"test",
    "info":"人生好累",
    "gender":"男",
    "birthday":"",
    "phone":"0912345678",
    "email":"test@gmail.com",
    "password":"test"
}
```
回傳：
- code 200
    ```
    {
        "body": {
            "matched_count": 1,
            "modified_count": 1
        },
        "code": 200,
        "message": "更新個人資料成功"
    }
    ```
- code 400
    ```
    {
        "code": 400,
        "message": "請提供正確的 JSON 資料",
        "body": {}
    }
    ```
- code 404
    ```
    {
        "code": 404,
        "message": "帳戶不存在",
        "body": {}
    }
    ```
- code 500
    ```
    {
        "code": 500,
        "message": "Server Error(user_service): ${error}",
        "body": {}
    }
    ```
## Product API使用教學

### 新增書籍

輸入：

`[POST] http://127.0.0.1:8000/products//AddProducts`
```
{
    "name": "書本名稱",
    "language": "繁體中文",
    "category": "文學",
    "condiction": "二手",
    "author": "作者",
    "publisher": "出版社",
    "publishDate": "1945-01-01",
    "ISBN": 1234567890123,
    "price": 300,
    "description":"這是一本書",
    "photouri":"mple.com/image.jpg"
}
```

回傳：
- code 201
    ```
    {
        "body": {},
        "code": 201,
        "message": "商品新增成功"
    }
    ```
- code 400
    ```
    {
        "body": {},
        "code": 400,
        "message": "商品資料是空的" | "商品資料不能包含空值"
    }
    ```
- code 500 (${error}視情況而定)
    ```
    {
        "body": {},
        "code": 500,
        "message":"Sever Error(product_service.py): ${error}"
    }
    ```
### 查詢所有書籍

輸入：

`[GET] http://127.0.0.1:8000/products/GetAllProducts`

回傳：

- code 200
    ```
    {
        "body": [
            {
                "ISBN": 1234567890123,
                "author": "張三",
                "category": "程式設計",
                "condiction": "全新",
                "description": "一本適合初學者的 Python 書籍",
                "language": "中文",
                "name": "Java 放棄書籍",
                "photouri": "https://example.com/book.jpg",
                "price": 500,
                "publishDate": "Mon, 01 Jan 2024 00:00:00 GMT",
                "publisher": "ABC 出版社"
            },
            {
                "ISBN": 1234567890123,
                "author": "作者",
                "category": "文學",
                "condiction": "二手",
                "description": "這是一本書",
                "language": "繁體中文",
                "name": "書本名稱",
                "photouri": "mple.com/image.jpg",
                "price": 300,
                "publishDate": "1945-01-01",
                "publisher": "出版社"
            }
        ],
        "code": 200,
        "message": "成功取得所有商品"
    }
    ```
- code 500 (${error}視情況而定)
    ```
    {
        "body": {},
        "code": 500,
        "message":"Sever Error(product_service.py): ${error}"
    }
    ```

### 根據ID查詢書籍

輸入：

`[GET] http://127.0.0.1:8000/products/GetOneProduct`
```
{
    "product_id":"123415ffbdb748acda6a1234"
}
```

回傳：

- code 200
    ```
    {
        "body": {
            "ISBN": 1234567890123,
            "_id": "123415ffbdb748acda6a1234",
            "author": "作者",
            "category": "程式設計",
            "condiction": "二手",
            "description": "8成新，周老師上課用書",
            "language": "英文",
            "name": "JAVA 資料結構",
            "photouri": "https://example.com/book.jpg",
            "price": 500,
            "publishDate": "2024-01-01T00:00:00.000Z",
            "publisher": "TKU 出版社"
        },
        "code": 200,
        "message": "成功取得該商品"
    }
    ```
- code 500 (${error}視情況而定)

    ```
    {
        "body": {},
        "code": 500,
        "message":"Sever Error(product_service.py): ${error}"
    }
    ```
### 更新商品資料
輸入：

`[POST] http://127.0.0.1:8000/products/UpdateProduct`
```
{
    "ISBN": 1234567890123,
    "_id": "123415ffbdb748acda6a1234",
    "author": "作者",
    "category": "電腦資訊",
    "condiction": "二手",
    "description": "7成新，黃老師上課用書",
    "language": "英文",
    "name": "作業系統",
    "photouri": "https://example.com/book.jpg",
    "price": 400,
    "publishDate": "2024-01-01T00:00:00.000Z",
    "publisher": "TKU 出版社"
}
```

- code 200
    ```
    {
        "body": {
            "matched_count": 1,
            "modified_count": 1
        },
        "code": 200,
        "message": "商品更新成功"
    }
    ```
- code 400
    ```
    {
        "body": {
            "matched_count": 0,
            "modified_count": 0
        },
        "code": 400,
        "message": "找不到該商品資料"|"商品資料是空的"|"商品資料不能包含空值"
    }
    ```
- code 500 (${error}視情況而定)

    ```
    {
        "body": {},
        "code": 500,
        "message":"Sever Error(product_service.py): ${error}"
    }
    ```
## 加到購物車

輸入：

`[POST] http://127.0.0.1:8000/products/AddToCart`
```
{
    "user_id":"1234d08a079f7ab34ccd1234",
    "product_id":"12348dc570408f6683801234"
}
```

- code 200
    ```
    {
        "body": {},
        "code": 200,
        "message": "商品成功新增到購物車"
    }
    ```
- code 400
    ```
    {
        "body": {},
        "code": 400,
        "message": "沒有取得任何資料"|"需要提供user_id 跟 product_id"|"商品重複加入"
        
    }
    ```
- code 404
    ```
    {
        "body": {},
        "code": 404,
        "message": "User not found"|"Product not found"
    }
    ```
- code 500 (${error}視情況而定)

    ```
    {
        "body": {},
        "code": 500,
        "message":"Sever Error(product_service.py): ${error}"
    }
    ```
## 加入收藏

輸入：

`[POST] http://127.0.0.1:8000/products/AddToFavorites`
```
{
    "user_id":"1234d08a079f7ab34ccd1234",
    "product_id":"12348dc570408f6683801234"
}
```

- code 200
    ```
    {
        "body": {},
        "code": 200,
        "message": "商品成功加到收藏"
    }
    ```
- code 400
    ```
    {
        "body": {},
        "code": 400,
        "message": "沒有取得任何資料"|"需要提供user_id 跟 product_id"|"商品重複加入"|"找不到使用者的收藏資料"
        
    }
    ```
- code 404
    ```
    {
        "body": {},
        "code": 404,
        "message": "User not found"|"Product not found"
    }
    ```
- code 500 (${error}視情況而定)

    ```
    {
        "body": {},
        "code": 500,
        "message":"Sever Error(product_service.py): ${error}"|
    }
    ```