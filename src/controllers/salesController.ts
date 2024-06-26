import { Request, Response } from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import nodemailer from 'nodemailer';
import { Sale, SaleItem } from "../types/types"
import { uri, dbName, cartCollectionName, salesCollectionName, userCollectionName, collectionName } from '../config/database';
import { RequestHandler } from 'express';
import { User } from '../types/types'; // Importar a interface User
import { authenticateToken } from './authController'; // Importar a função de autenticação

const client = new MongoClient(uri);

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'seu_email@gmail.com',
        pass: 'sua_senha'
    }
});

// Concluir uma venda para um usuário específico
export const completeSale = async (req: Request & { user: User }, res: Response) => { // Adicionar tipagem para req.user
    const { paymentMethod } = req.body;

    try {
        const userId = req.user.userId; // Obter userId do token

        await client.connect();
        const database = client.db(dbName);
        const cartCollection = database.collection(cartCollectionName);
        const productsCollection = database.collection(collectionName);
        const salesCollection = database.collection(salesCollectionName);
        const userCollection = database.collection(userCollectionName);

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

        const user: any = await userCollection.findOne({ _id: new ObjectId(userId) });

        const sale = {
            userId: new ObjectId(userId),
            userName: user.nome,
            userEmail: user.email,
            timestamp: new Date(),
            items: saleDetails,
            paymentMethod: paymentMethod
        };

        const result = await salesCollection.insertOne(sale);
        await cartCollection.deleteMany({ userId: new ObjectId(userId) });

        const emailMessage = `Olá ${user.nome}, espero que esteja bem!!\n\nSua compra foi realizada com sucesso! Já vamos preparar seu pedido para envio.\n\nDetalhes da compra:\nVocê adquiriu o(s) produto(s):\n${saleDetails.map(item => `${item.productName}`).join(', ')}\nValor: R$${saleDetails.reduce((acc, item) => acc + item.price, 0).toFixed(2)}\nMétodo de Pagamento: ${paymentMethod}\n\nObrigado por comprar com a TurminhaDoAgro!`;

        const mailOptions = {
            from: 'turminhadoagro9@gmail.com',
            to: user.email,
            subject: 'Confirmação de Compra - TurminhaDoAgro',
            text: emailMessage
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Erro ao enviar email:', error);
                return res.status(500).json({ error: 'Erro ao enviar email de confirmação' });
            } else {
                console.log('Email enviado:', info.response);
                res.json({
                    message: 'Compra realizada com sucesso',
                    saleId: result.insertedId
                });
            }
        });
    } catch (error) {
        console.error('Erro ao concluir a venda:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    } finally {
        await client.close();
    }
};

// Obter o histórico de compras de um usuário
export const getSalesHistory = async (req: Request & { user: User }, res: Response) => { // Adicionar tipagem para req.user
    const userId = req.user.userId; // Obter userId do token

    try {
        await client.connect();
        const database = client.db(dbName);
        const salesCollection = database.collection<Sale>('sales');

        const sales = await salesCollection.find({ userId: new ObjectId(userId) }).toArray();

        const salesHistory = sales.map(sale => ({
            saleId: sale._id.toHexString(),
            timestamp: sale.timestamp.toLocaleString(),
            items: sale.items.map((item: SaleItem) => ({
                productName: item.productName,
                quantity: item.quantity,
                price: item.price,
                status: 'Enviado'
            })),
            paymentMethod: sale.paymentMethod
        }));

        res.json(salesHistory);
    } catch (error) {
        console.error('Erro ao obter o histórico de compras:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    } finally {
        await client.close();
    }
};
