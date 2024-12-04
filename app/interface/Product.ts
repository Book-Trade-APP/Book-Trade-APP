export interface Product {
    id: number; //產品編號
    name: string; //書名
    language: "中文" | "英文"; //書籍語言
    category: "文學" | "藝術" | "哲學宗教" | "人文史地" | "自然科普" | "社會科學" | "商業理財" | "語言學習" | "醫療保健" | "旅遊休閒" | "電腦資訊" | "考試用書" | "動畫/遊戲";//書籍類別
    condiction: "全新" | "二手"; //書籍狀態
    author: string; //作者
    publisher: string; //出版社
    publishDate: string; //出版日期
    ISBN: number;
    price: number; //價格
    description: string; //書本介紹
    photouri: any; //圖片位址
}