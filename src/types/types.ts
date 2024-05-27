import { Request, Response } from 'express';
import { MongoClient, ObjectId } from 'mongodb'

export interface SaleItem {
    productName: string;
    quantity: number;
    price: number;
}

export interface Sale {
    _id: ObjectId;
    userId: ObjectId;
    timestamp: Date;
    items: SaleItem[];
    paymentMethod: string;
}