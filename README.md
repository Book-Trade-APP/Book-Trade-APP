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

### 使用者評價
說明：
> 提供user_id: string, evaluate: double(評價1.0 ~ 5.0)，更新使用者評價分數。

輸入：  

`[POST] http://127.0.0.1:8000/users/evaluate`
```
{
    "user_id":"1234504b91cec6fff80e192b",
    "evaluate":3.3
}
```

## Product API使用教學

### 新增書籍

輸入：

`[POST] http://127.0.0.1:8000/products//AddProducts`
```
{
    "name": "我爸的橘子",
    "language": "中文",
    "category": "文學",
    "condiction": "二手",
    "author": "台東朱自清",
    "publisher": "上海印刷",
    "publishDate": "15/10/1925",
    "ISBN": 456789487,
    "price": 2,
    "description": "爛橘子",
    "photouri": "uri",
    "quantity": 1,
    "seller_id": "12345678903b851f265a10b6"
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
                "ISBN": 456789487,
                "_id": "67677bb1a17b2332eddf34c1",
                "author": "台東朱自清",
                "category": "文學",
                "condiction": "二手",
                "description": "爛橘子",
                "language": "中文",
                "name": "我爸的橘子",
                "photouri": "uri",
                "price": 2,
                "publishDate": "15/10/1925",
                "publisher": "上海印刷",
                "quantity": 1,
                "seller_id": "12345678903b851f265a10b6"
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
                "publishDate": "01/01/1925",
                "publisher": "出版社",
                "quantity": 1,
                "seller_id": "12345678903b851f265a10b6"
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

`[GET] http://127.0.0.1:8000/products/GetOneProduct?product_id=123458f77edaae5261c71234`

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
            "publisher": "TKU 出版社",
            "quantity": 1,
            "seller_id": "12345678903b851f265a10b6"
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
    "publisher": "TKU 出版社",
    "quantity": 1,
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
## 更新購物車商品數量
說明：  
提供user_id, product_id, quantity(商品數量)，更新使用者的商品數量，如果數量為零則刪除  

輸入：  

`[POST] http://127.0.0.1:8000/products/UpdateCart`  
```
{
    "user_id":"67667a4e363b851f265a10b6",
    "product_id":"675958f77edaae5261c7adea",
    "quantity": 14
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
        "message": "已更新該購物車商品數量資料"
    }
    ```
- 其他...

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
### 刪除收藏

說明：  
提供user_id 跟 product_id（要刪除的商品id），刪除一筆資料

輸入：

`[POST] http://127.0.0.1:8000/products/DeleteFromFavorites`

```
{
    "user_id":"6765a04b91cec6fff80e192b",
    "product_id":"675958f77edaae5261c7adea"
}
```

### user_id找收藏商品
說明：  
根據user_id找收藏商品，返回所有收藏商品Id(porduct_id)string型態  

輸入：  

`[POST] http://127.0.0.1:8000/products/GetFavoritesByUserId`

```
{
    "user_id":"1234564e363b851f265a10b6"
}
```
輸出：  
- code 200  
    ```
    {
        "body": [
            "6763e1bc7677b8502bed1344"
        ],
        "code": 200,
        "message": "成功取得該使用者收藏的所有product_id資料"
    }
    ```
- other...

### user_id找購物車商品
說明：  
根據user_id找購物車商品，返回所有購物車商品Id(porduct_id)string型態

輸入：  

`[POST] http://127.0.0.1:8000/products/GetCartByUserId`

```
{
    "user_id":"1234564e363b851f265a10b6"
}
```

輸出：  
- code 200   
    ```
    {
        "body": [
            "675958f77edaae5261c7adea",
            "6763e1bc7677b8502bed1344"
        ],
        "code": 200,
        "message": "成功取得該使用者購物車的所有product_id資料"
    }
    ```
- other...


### 創立訂單
說明：
輸入user_id,product_ids(array),quantities(array),payment_method，即可創立一個訂單

輸入：

`[POST] http://127.0.0.1:8000/orders/CreateOrder`

```
{
    "user_id": "6763d08a079f7ab34ccd56da",
    "product_ids": ["67595e27df035ca464ff2dba","675958f77edaae5261c7adea","675d8dc570408f66838017d1"],
    "quantities": ["1","1","2"],
    "payment_method": "Credit Card"
}
```

輸出：

```
{
    "body": {
        "_id": "6766c49dbcbc630d2621b295",
        "created_at": "Sat, 21 Dec 2024 13:37:33 GMT",
        "payment_method": "Credit Card",
        "product_ids": "[ObjectId('67595e27df035ca464ff2dba'), ObjectId('675958f77edaae5261c7adea'), ObjectId('675d8dc570408f66838017d1')]",
        "quantities": [
            "1",
            "1",
            "2"
        ],
        "status": "待處理",
        "user_id": "6763d08a079f7ab34ccd56da"
    },
    "code": 200,
    "message": "訂單創建成功"
}
```

### 刪除訂單
說明：
輸入訂單id刪除資料

輸入：
`[DELETE] http://127.0.0.1:8000/orders/DeleteOrder?id=6766c49dbcbc630d2621b295`

輸出：
```
{
    "body": {},
    "code": 200,
    "message": "訂單刪除成功"
}
```

### 查詢所有訂單
說明：
查詢目前資料庫內所有已成立訂單

輸入：
`[GET] http://127.0.0.1:8000/orders/GetAllOrders`

輸出：
```
{
    "body": [
        {
            "_id": "6762e0b963e4b6f407629c47",
            "created_at": "Wed, 18 Dec 2024 14:48:25 GMT",
            "payment_method": "Credit Card",
            "product_id": [
                "67595e32df035ca464ff2dbb"
            ],
            "status": "Pending",
            "user_id": "674fca2bc1aded6a8520e5ff"
        },
        {
            "_id": "6763fe5b3ed3620a55dbdfab",
            "created_at": "Thu, 19 Dec 2024 11:07:07 GMT",
            "payment_method": "Credit Card",
            "product_ids": "[ObjectId('675958f77edaae5261c7adea'), ObjectId('675958f77edaae5261c7aded')]",
            "quantities": [
                2,
                3
            ],
            "status": "待處理",
            "user_id": "675eef76f84cb6f6196af867"
        },
        {
            "_id": "6763fe5c3ed3620a55dbdfac",
            "created_at": "Thu, 19 Dec 2024 11:07:08 GMT",
            "payment_method": "Credit Card",
            "product_ids": "[ObjectId('675958f77edaae5261c7adea'), ObjectId('675958f77edaae5261c7aded')]",
            "quantities": [
                2,
                3
            ],
            "status": "待處理",
            "user_id": "675eef76f84cb6f6196af867"
        },
        {
            "_id": "6763fe5c3ed3620a55dbdfad",
            "created_at": "Thu, 19 Dec 2024 11:07:08 GMT",
            "payment_method": "Credit Card",
            "product_ids": "[ObjectId('675958f77edaae5261c7adea'), ObjectId('675958f77edaae5261c7aded')]",
            "quantities": [
                2,
                3
            ],
            "status": "待處理",
            "user_id": "675eef76f84cb6f6196af867"
        },
        {
            "_id": "67652d28d229c2f9695437e0",
            "created_at": "Fri, 20 Dec 2024 08:39:04 GMT",
            "payment_method": "Credit Card",
            "product_ids": "[ObjectId('675958f77edaae5261c7adea')]",
            "quantities": [
                "3"
            ],
            "status": "待處理",
            "user_id": "675eef76f84cb6f6196af867"
        },
        {
            "_id": "676537b5e092dbb9efcf3147",
            "created_at": "Fri, 20 Dec 2024 09:24:05 GMT",
            "payment_method": "Credit Card",
            "product_ids": "[ObjectId('67595e27df035ca464ff2dba'), ObjectId('675958f77edaae5261c7adea'), ObjectId('675d8dc570408f66838017d1')]",
            "quantities": [
                "1",
                "1",
                "2"
            ],
            "status": "待處理",
            "user_id": "6763d08a079f7ab34ccd56da"
        }
    ],
    "code": 200,
    "message": "成功取得所有訂單"
}
```

### 用order_id查詢單一訂單
說明：
輸入order_id即可抓取此筆訂單詳細資料

輸入：
`[GET] http://127.0.0.1:8000/orders/GetOrderById?id=6763fe5c3ed3620a55dbdfac`

```
{
    "body": {
        "_id": "6763fe5c3ed3620a55dbdfac",
        "created_at": "Thu, 19 Dec 2024 11:07:08 GMT",
        "payment_method": "Credit Card",
        "product_ids": "[ObjectId('675958f77edaae5261c7adea'), ObjectId('675958f77edaae5261c7aded')]",
        "quantities": [
            2,
            3
        ],
        "status": "待處理",
        "user_id": "675eef76f84cb6f6196af867"
    },
    "code": 200,
    "message": "成功取得訂單"
}
```


### 用user_id查詢特定狀態訂單
說明：
`[POST] http://127.0.0.1:8000/orders/GetOrderByUserId`


輸入：

```
{
    "user_id": "67667a4e363b851f265a10b6",
    "status" : "待處理" //狀態有(待處理、已完成、待評價、已取消)
}
```

回傳：

```
{
    "body": [
        {
            "_id": "67693d3833e26f81d3053569",
            "product_ids": [
                "67595e27df035ca464ff2dba",
                "675958f77edaae5261c7adea",
                "675d8dc570408f66838017d1"
            ],
            "quantities": [
                "1",
                "1",
                "2"
            ]
        },
        {
            "_id": "67693fad00813a83a58257dc",
            "product_ids": [
                "67595e27df035ca464ff2dba",
                "675958f77edaae5261c7adea",
                "675d8dc570408f66838017d1"
            ],
            "quantities": [
                "1",
                "7",
                "2"
            ]
        }
    ],
    "code": 200,
    "message": "成功取得訂單"
}
```
