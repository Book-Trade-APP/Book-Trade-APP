export interface CartItem {
    id: number; //根據ProductList的id
    image: any; //商品圖片
    title: String; //商品名稱
    selected: boolean //是否選取
    price: number //商品價格
    quantity: number; //選取數量
}
