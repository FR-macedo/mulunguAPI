import { Request, Response } from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import { uri, dbName, cartCollectionName, collectionName } from '../config/database';

export const completeSale = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
        const client = new MongoClient(uri);
        await client.connect();
        const database = client.db(dbName);
        const salesCollection = database.collection('sales');
        const productsCollection = database.collection(collectionName);
        const cartCollection = database.collection(cartCollectionName);

        const items = await cartCollection.find({ userId: new ObjectId(userId) }).toArray();

        if (items.length === 0) {
            return res.status(400).json({ error: "Carrinho vazio. Não é possível concluir a venda." });
        }

        const saleDetails = [];

        for (const item of items) {
            const product = await productsCollection.findOne({ _id: new ObjectId(item.productId) });

            if (!product) {
                return res.status(404).json({ error: "Produto não encontrado no estoque" });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({ error: `Estoque insuficiente para ${product.name}` });
            }

            await productsCollection.updateOne(
                { _id: new ObjectId(item.productId) },
                { $inc: { stock: -item.quantity } }
            );

            saleDetails.push({
                productId: item.productId,
                productName: product.name,
                quantity: item.quantity,
                price: product.price * item.quantity
            });
        }

        const sale = {
            userId: new ObjectId(userId),
            timestamp: new Date(),
            items: saleDetails
        };

        const result = await salesCollection.insertOne(sale);
        await cartCollection.deleteMany({ userId: new ObjectId(userId) });

        res.json({ message: "Venda concluída com sucesso", saleId: result.insertedId });
    } catch (error) {
        console.error('Erro ao concluir a venda:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};
