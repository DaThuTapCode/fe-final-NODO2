export interface ProductSearchResponse {
    id: number;
    name: string;
    img: string;
    productCode: string;
    description: string;
    price: number;
    quantity: number;
    status: string;
    createdDate: Date;
    modifiedDate: Date;
    createdBy: string;
    modifiedBy: string;
    categories: string;
}