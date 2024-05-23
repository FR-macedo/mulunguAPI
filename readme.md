# Mulungu API

## Descrição
Esta é uma API para um sistema de e-commerce, desenvolvida com Node.js e TypeScript. Ela oferece endpoints para manipulação de produtos, usuários, carrinho de compras e vendas.

## Dependências
- **express**: Framework web para Node.js.
- **body-parser**: Middleware para fazer o parsing dos corpos das requisições HTTP.
- **mongodb**: Cliente MongoDB para Node.js.
- **cors**: Middleware para habilitar o CORS (Cross-Origin Resource Sharing).

## Estrutura do Projeto
O projeto está estruturado da seguinte forma:
- **src/**
  - **controllers/**: Contém os controladores para cada entidade da aplicação.
  - **config/**: Contém o arquivo de conexão com o banco de dados.
  - **index.ts**: Arquivo principal que inicializa a aplicação.

## Instalação
1. Clone este repositório para sua máquina local.
2. Instale as dependências executando o seguinte comando: npm install
3. Inicie a aplicação com o comando: npm run start

## Endpoints

### Produtos
- **POST /api/products**: Adiciona um novo produto.
- **GET /api/products**: Retorna todos os produtos.
- **GET /api/products/:id**: Retorna um produto específico pelo ID.
- **PUT /api/products/:id**: Atualiza um produto existente pelo ID.
- **DELETE /api/products/:id**: Exclui um produto pelo ID.

### Usuários
- **GET /api/users**: Retorna todos os usuários.
- **POST /api/register**: Registra um novo usuário.
- **POST /api/login**: Realiza o login de um usuário.

### Carrinho
- **POST /api/cart/add**: Adiciona um item ao carrinho de um usuário.
- **GET /api/cart/:userId**: Retorna o carrinho de um usuário.
- **DELETE /api/cart/remove/:userId/:productId**: Remove uma quantidade específica de um item do carrinho de um usuário.

### Vendas
- **POST /api/sales/complete/:userId**: Completa uma venda para um usuário específico.

## Licença
Este projeto está licenciado sob a [MIT License](LICENSE).
