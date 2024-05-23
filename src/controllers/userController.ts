import { Request, Response } from 'express';
import { MongoClient } from 'mongodb';
import { uri, dbName, userCollectionName } from '../config/database';

export const listUsers = async (req: Request, res: Response) => {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const database = client.db(dbName);
        const collection = database.collection(userCollectionName);
        const users = await collection.find({}).toArray();
        res.json(users);
    } catch (error) {
        console.error('Erro ao listar usuários:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    } finally {
        await client.close();
    }
};

export const registerUser = async (req: Request, res: Response) => {
    try {
        const client = new MongoClient(uri);
        await client.connect();
        const database = client.db(dbName);
        const collection = database.collection(userCollectionName);

        const { nome, email, senha } = req.body;

        const existingUser = await collection.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'E-mail já cadastrado' });
        }

        const result = await collection.insertOne({ nome, email, senha });
        res.status(201).json({ message: 'Usuário cadastrado com sucesso', userId: result.insertedId });
    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ error: 'E-mail e senha são obrigatórios' });
        }

        const client = new MongoClient(uri);
        await client.connect();
        const database = client.db(dbName);
        const collection = database.collection(userCollectionName);

        const user = await collection.findOne({ email });

        if (!user || user.senha !== senha) {
            return res.status(401).json({ error: 'E-mail ou senha incorretos' });
        }

        res.status(200).json({ message: 'Login bem-sucedido', nome: user.nome });
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};
