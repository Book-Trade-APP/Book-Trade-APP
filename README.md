# How to use

安裝依賴

`pip install or pip3 install`

啟用後端

` python app.py or  python3 app.py`


.env.example 按照指示修改至.env

## API使用教學

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

### 新增書籍

輸入：

```
[POST] http://127.0.0.1:8000/items/Products

{
  "id": 1,
  "name": "Python 入門書籍",
  "language": "中文",
  "category": "程式設計",
  "condiction": "全新",
  "author": "張三",
  "publisher": "ABC 出版社",
  "publishDate": "2024-01-01",
  "ISBN": 1234567890123,
  "price": 500,
  "description": "一本適合初學者的 Python 書籍",
  "photouri": "https://example.com/book.jpg",
  "selected": false,
  "collected": false
}
```

回傳：

```
{
    "message": "商品新增成功"
}
```

### 查詢所有書籍

輸入：

```
[GET] http://127.0.0.1:8000/items/GetAllProducts
```

回傳：

```
"products": [
        {
            "ISBN": 9781234567890,
            "author": "F. Scott Fitzgerald",
            "date": "1925-04-10",
            "details": "A classic novel of the Jazz Age.",
            "id": 1,
            "image": "https://example.com/book.jpg",
            "price": 300,
            "publishes": "Scribner",
            "quantity": 50,
            "title": "The Great Gatsby"
        }
]
```