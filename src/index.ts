import express from 'express';
import { registerUser, loginUser, authenticateToken } from './controllers/authController';
import { addItemToCart, viewCart, removeItemFromCart } from './controllers/cartController';
import { addProduct, deleteProduct, listProducts, updateProduct } from './controllers/productController';
import { completeSale, getSalesHistory } from './controllers/salesController';
import { MongoClient } from 'mongodb';
import { uri} from './config/database';


const app = express();
const port = 3000;

// Middleware para lidar com JSON e URL encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Definindo as rotas

// Rotas de autenticação
app.post('/register', registerUser);
app.post('/login', loginUser);

// Rotas do carrinho
app.post('/cart', authenticateToken, addItemToCart);
app.get('/cart', authenticateToken, viewCart);
app.delete('/cart/:productId', authenticateToken, removeItemFromCart);

// Rotas de vendas
// app.post('/sales', authenticateToken, completeSale);
// app.get('/sales/history', authenticateToken, getSalesHistory);

// Rotas de produtos
app.post('/products', authenticateToken, addProduct);
app.delete('/products/:id', authenticateToken, deleteProduct);
app.get('/products', listProducts);
app.put('/products/:id', authenticateToken, updateProduct); 

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
