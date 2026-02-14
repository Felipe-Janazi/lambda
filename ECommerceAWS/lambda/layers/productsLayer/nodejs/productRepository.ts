import { DocumentClient } from "aws-sdk/clients/dynamodb"


export interface Product {
    id: string;
    productName: string;
    code: string;
    price: string;
    model: string;
}

export class ProductRepository {

}