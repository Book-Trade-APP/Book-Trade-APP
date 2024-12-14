# 資料庫
##### users(使用者)
```ts
username: string    // 使用者名稱
email: string       // E-mail
password: string    // 密碼
info: string        // 自我介紹
gender: string      //*性別     男生 | 女生
birthday: Date      // 生日
phone: string       // 手機號碼
```

##### products(商品)
```ts
name: string        // 商品名稱
language: string    //*語言    中文 | 英文
category: string    //*類別    全新 | 二手
condiction: string  //*書籍狀態
                    // 文學 | 藝術 | 哲學宗教 | 人文史地 | 自然科普
                    // 社會科學 | 商業理財 | 語言學習 | 醫療保健 | 旅遊休閒
                    // 電腦資訊 | 考試用書 | 動畫/遊戲
author: string      // 作者
publisher: string   // 出版社
publishDate: Date   // 出版日期
ISBN: number        // ISBN編碼
price: number       // 價格
description: string // 書本簡介
photouri: string    // 書籍照片
```

##### cart(購物車)、favorites(收藏)
```ts
user_id: ObjectId       // 使用者id  為users中的_id
product_id: ObjectId    // 商品id    為products中的_id 
```

##### orders(訂單狀態)
```ts
user_id: ObjectId       // 使用者id  為users中的_id
product_id: ObjectId    // 商品id    為products中的_id 
status: string          //*訂單狀態 待交易 | 已完成 | 待評價
```

##### notification(通知)
```ts
user_id: ObjectId   // 使用者id  為users中的_id
title: string       // 通知標題
content: string     // 通知內容
time: Date          // 此通知時間
```