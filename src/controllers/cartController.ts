import { Request, Response } from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import { uri, dbName, cartCollectionName, collectionName } from '../config/database';
import { RequestHandler } from 'express';
import { User } from '../types/types';

const client = new MongoClient(uri);

// Adicionar Item ao Carrinho
export const addItemToCart = async (req: Request, res: Response) => {
    try {
        await client.connect();
        const database = client.db(dbName);
        const productsCollection = database.collection(collectionName);
        const cartCollection = database.collection(cartCollectionName);
        const { productId, quantity } = req.body;

        const userId = req.user?.userId; // Obter userId do token

        if (!ObjectId.isValid(productId) || !Number.isInteger(quantity) || quantity <= 0) {
            return res.status(400).json({ error: "Dados inválidos" });
        }

        const product = await productsCollection.findOne({ _id: new ObjectId(productId) });
        if (!product) {
            return res.status(404).json({ error: "Produto não encontrado no estoque" });
        }

        if (product.stock < quantity) {
            return res.status(400).json({ error: "Estoque insuficiente" });
        }

        await cartCollection.insertOne({ userId: new ObjectId(userId), productId: new ObjectId(productId), quantity });
        res.json({ message: `Produto adicionado ao carrinho do ${userId} com sucesso` });
    } catch (error) {
        console.error('Erro ao adicionar item ao carrinho:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    } finally {
        await client.close();
    }
};

// Visualizar Carrinho do Usuário
export const viewCart = async (req: Request, res: Response) => {
    try {
        await client.connect();
        const database = client.db(dbName);
        const cartCollection = database.collection(cartCollectionName);
        const productsCollection = database.collection(collectionName);

        const userId = req.user?.userId; // Obter userId do token

        const items = await cartCollection.find({ userId: new ObjectId(userId) }).toArray();
        const cart = [];

        for (const item of items) {
            const product = await productsCollection.findOne({ _id: new ObjectId(item.productId) });
            if (product) {
                cart.push({
                    productId: item.productId,
                    name: product.name,
                    price: product.price,
                    quantity: item.quantity
                });
            } else {
                console.error(`Produto com ID ${item.productId} não encontrado no estoque.`);
            }
        }

        res.json(cart);
    } catch (error) {
        console.error('Erro ao visualizar carrinho do usuário:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    } finally {
        await client.close();
    }
};

// Remover Quantidade Específica do Item do Carrinho do Usuário
export const removeItemFromCart = async (req: Request, res: Response) => {
    try {
        await client.connect();
        const database = client.db(dbName);
        const cartCollection = database.collection(cartCollectionName);
        const { productId } = req.params;

        const userId = req.user?.userId; // Obter userId do token

        if (!ObjectId.isValid(productId)) {
            return res.status(400).json({ error: "ID do produto inválido" });
        }

        const result = await cartCollection.deleteOne({ userId: new ObjectId(userId), productId: new ObjectId(productId) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Produto não encontrado no carrinho do usuário" });
        }

        res.json({ message: "Produto removido do carrinho com sucesso" });
    } catch (error) {
        console.error('Erro ao remover item do carrinho:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    } finally {
        await client.close();
    }
};
