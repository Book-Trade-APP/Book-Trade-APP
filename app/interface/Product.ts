export interface Product {
    id: number; //產品編號
    name: string; //書名
    language: string; //書籍語言
    category: string;//書籍類別
    condiction: string; //書籍狀態
    author: string; //作者
    publisher: string; //出版社
    publishDate: string; //出版日期
    ISBN: number;
    price: number; //價格
    description: string; //書本介紹
    photouri: any; //圖片位址

    selected: boolean; //被加到購物車
    collected: boolean; //被按收藏
}