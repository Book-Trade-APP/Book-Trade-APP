import { Product } from "../interface/Product";
import { fake_products } from "./fakeProudctList";

/*
 * 目前用假資料的id去判斷書籍是否有被收藏
 * 需改用Product Interface的collected去判斷
 * 連接資料庫會出現的問題:
 * 全部人的購物車會相同
 * 除非每個人都有自己的資料表?
 */
let collectionIds = [1,2,3,4,5,6,7,8,9,10,11];

export const fake_collections: Product[] = collectionIds.map(id => {
    const product = fake_products.find(item => item.id === id);
    if (!product) throw new Error(`Product with ID ${id} not found`);
    
    return {
        ...product,
        collected: true,
    };
});