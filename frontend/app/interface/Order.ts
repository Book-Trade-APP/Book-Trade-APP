import { Product } from "./Product";

export interface Order {
    _id: string;
    product_ids: string[];
    quantities: number[];
    products?: Product[];
}