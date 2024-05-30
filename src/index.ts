import express from 'express';
import { registerUser, loginUser, authenticateToken, listUsers } from './controllers/authController';
import { addItemToCart, viewCart, removeItemFromCart } from './controllers/cartController';
import { addProduct, deleteProduct, listProducts, updateProduct } from './controllers/productController';
import { completeSale } from './controllers/salesController'; 
import { MongoClient } from 'mongodb';
import { uri, dbName, userCollectionName } from './config/database';

const app = express();
const port = 3000;

// Middleware para lidar com JSON e URL encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Rotas de autenticação
app.post('/register', registerUser);
app.post('/login', loginUser);

// Rotas do carrinho
app.post('/cart', authenticateToken, addItemToCart);
app.get('/cart', authenticateToken, viewCart);
app.delete('/cart/:productId', authenticateToken, removeItemFromCart);

// Rota para concluir uma venda
app.post('/sales', authenticateToken, completeSale);

// Rotas de produtos
app.post('/products', authenticateToken, addProduct);
app.delete('/products/:id', authenticateToken, deleteProduct);
app.get('/products', listProducts); // Rota para listar produtos
app.put('/products/:id', authenticateToken, updateProduct); 

// Rota de listar usuários
app.get('/users', authenticateToken, listUsers);

// Configuração do servidor
const client = new MongoClient(uri);

app.listen(port, async () => {
    try {
        await client.connect();
        console.log(`Server is listening on port ${port}`);
    } catch (error) {
        console.error('Error while connecting to the database:', error);
    }
});
