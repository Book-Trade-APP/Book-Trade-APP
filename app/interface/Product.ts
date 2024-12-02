export interface Product {
    id: number; //產品編號
    image: any; //圖片位址
    title: string; //書名
    price: number; //價格
    ISBN: number; 
    quantity: number; //數量
    author: string; //作者
    publishes: string; //出版社
    date: string; //出版日期
    details: string; //書本介紹
}