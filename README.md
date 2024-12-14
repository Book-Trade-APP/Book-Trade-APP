# How to use

安裝依賴

`pip install or pip3 install`

啟用後端

` python app.py or  python3 app.py`


.env.example 按照指示修改至.env

## API使用教學

### 登入

輸入：

```
[POST] http://127.0.0.1:8000/users/Login

{
    "email": "test@example.com",
    "password": "password123"
}
```

回傳：

```
{
    "data": {
        "message": "登入成功"
    },
    "message": "Success"
}
```

### 註冊

輸入：

```
[POST] http://127.0.0.1:8000/users/register

{
    "email": "test@example.com",
    "username": "testuser",
    "password": "password123"
}
```

回傳：

```
{
    "data": null,
    "message": "註冊成功"
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