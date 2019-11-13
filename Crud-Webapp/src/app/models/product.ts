import { Department } from './department';
export interface Product {
    id ?: string;
    name: string;
    stock: number;
    price: number;
    departments: Department[] | string[];
}
