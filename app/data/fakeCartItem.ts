import { CartItem } from "../interface/CartItem";
import { fake_products } from "./fakeProudctList";

const cartIds: number[] = [1, 3, 5, 7, 9, 11];

// 根據ID提取資料
export const fake_cartItems: CartItem[] = cartIds.map(id => {
    const product = fake_products.find(item => item.id === id);
    if (!product) throw new Error(`Product with ID ${id} not found`);
    
    return {
        id: product.id,
        photouri: product.photouri,
        name: product.name,
        author: product.author,
        selected: false,
        price: product.price,
        quantity: 1, //預設選取數量為1個
    };
});
