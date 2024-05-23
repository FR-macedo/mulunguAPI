// src/controllers/productController.ts

import { Request, Response } from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import { uri, dbName, collectionName } from '../config/database';

// Adicionar Produto
export const addProduct = async (req: Request, res: Response) => {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db(dbName);
        const collection = database.collection(collectionName);

        const result = await collection.insertOne(req.body);
        res.json({ message: "Produto adicionado com sucesso", productId: result.insertedId });
    } catch (error) {
        console.error('Erro ao adicionar produto:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    } finally {
        await client.close();
    }
};

// Excluir Produto
export const deleteProduct = async (req: Request, res: Response) => {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db(dbName);
        const collection = database.collection(collectionName);

        const result = await collection.deleteOne({ _id: new ObjectId(req.params.id) });

        if (result.deletedCount === 1) {
            res.json({ message: "Produto excluído com sucesso" });
        } else {
            res.status(404).json({ error: "Produto não encontrado" });
        }
    } catch (error) {
        console.error('Erro ao excluir produto:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    } finally {
        await client.close();
    }
};

// Listar Produtos
export const listProducts = async (req: Request, res: Response) => {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db(dbName);
        const collection = database.collection(collectionName);

        const products = await collection.find({}).toArray();
        res.json(products);
    } catch (error) {
        console.error('Erro ao listar produtos:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    } finally {
        await client.close();
    }
};

// Atualizar Produto
export const updateProduct = async (req: Request, res: Response) => {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db(dbName);
        const collection = database.collection(collectionName);

        const productId = req.params.id;
        const updatedProduct = req.body;

        const result = await collection.findOneAndUpdate(
            { _id: new ObjectId(productId) },
            { $set: updatedProduct },
            { returnDocument: 'after' } // Corrigido para 'returnDocument'
        );

        const updatedDocument = result ? result.value : null;

        if (updatedDocument) {
            res.status(200).json({ message: "Produto atualizado com sucesso", updatedProduct: updatedDocument });
        } else {
            res.status(404).json({ error: "Produto não encontrado após edição" });
        }
    } catch (error) {
        console.error('Erro ao editar produto:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    } finally {
        await client.close();
    }
};
