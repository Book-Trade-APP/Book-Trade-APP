import { Product } from "../interface/Product";
import { fake_products } from "./fakeProudctList";

/*
 * 目前用假資料的id去判斷書籍是否有被收藏
 * 需改用Product selected去判斷
 * 連接資料庫會出現的問題:
 * 全部人的購物車會相同
 * 除非每個人都有自己的資料表?
 */
export let cartIds: number[] = [1, 3, 5, 7, 9, 11];

// 根據ID提取資料
export const fake_cartItems: Product[] = cartIds.map(id => {
    const product = fake_products.find(item => item.id === id);
    if (!product) throw new Error(`Product with ID ${id} not found`);
    
    return {
        ...product,
        selected: true,
    };
});
