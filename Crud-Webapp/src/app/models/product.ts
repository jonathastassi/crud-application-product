import { Department } from './department';
export interface Product {
    _id ?: string;
    name: string;
    stock: number;
    price: number;
    departments: Department[] | string[];
}
