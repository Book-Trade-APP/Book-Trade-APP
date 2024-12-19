import { Product } from "../interface/Product";
import { fake_products } from "./fakeProudctList";

const editIds: number[] = [2,4,5];

export const fake_editItems: Product[] = editIds.map(id => {
    const product = fake_products.find(item => item.id === id);
    if (!product) throw new Error(`Product with ID ${id} not found`);
    
    return {
        ...product,
    };
});