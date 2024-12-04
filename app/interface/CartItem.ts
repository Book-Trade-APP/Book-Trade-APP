export interface CartItem {
    id: number; //根據ProductList的id
    photouri: any; //商品圖片
    name: String; //商品名稱
    author: String; //作者
    selected: boolean //是否選取
    price: number //商品價格
}
