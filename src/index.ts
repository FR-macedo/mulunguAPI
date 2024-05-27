import app from './config/express';
import { addProduct, deleteProduct, listProducts, updateProduct } from './controllers/productController';
import { addItemToCart, viewCart, removeItemFromCart } from './controllers/cartController';
import { listUsers, registerUser, loginUser } from './controllers/userController';
import { completeSale, getSalesHistory } from './controllers/salesController';

const port = 3000;

//products
app.post('/api/products', addProduct);
app.delete('/api/products/:id', deleteProduct);
app.get('/api/products', listProducts);
app.put('/api/products/:id', updateProduct);

//cart
app.post('/api/cart/add', addItemToCart);
app.get('/api/cart/:userId', viewCart);
app.delete('/api/cart/remove/:userId/:productId', removeItemFromCart);

//users
app.get('/api/users', listUsers);
app.post('/api/cadastro', registerUser);
app.post('/api/login', loginUser);


//sales
app.post('/api/sales/complete/:userId', completeSale);
app.get('/api/sales/history/:userId', getSalesHistory);

app.listen(port, () => {
    console.log(`Servidor iniciado na porta ${port}`);
});
