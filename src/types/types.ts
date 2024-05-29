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

// Interface do usuário
export interface User {
    userId: string;
    nome: string;
    email: string;
}

// Interface para o usuário durante o cadastro
export interface NewUser {
    nome: string;
    email: string;
    senha: string;
}

// Extender a interface Request do Express para incluir a propriedade user
declare module 'express-serve-static-core' {
    interface Request {
        user?: User;
    }
}