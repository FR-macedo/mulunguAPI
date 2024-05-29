# Mulungu API

## Descrição
Esta é uma API para um sistema de e-commerce, desenvolvida com Node.js e TypeScript. Ela oferece endpoints para manipulação de produtos, usuários, carrinho de compras e vendas.

## Dependências
- **express**: Framework web para Node.js.
- **body-parser**: Middleware para fazer o parsing dos corpos das requisições HTTP.
- **mongodb**: Cliente MongoDB para Node.js.
- **cors**: Middleware para habilitar o CORS (Cross-Origin Resource Sharing).
- **nodemailer**: O Nodemailer simplifica o processo de envio de e-mails, fornecendo uma API intuitiva e fácil de usar.

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
- **POST /products:** Adiciona um novo produto.
- **GET /products:** Retorna todos os produtos.
- **GET /products:** Retorna um produto específico pelo ID.
- **PUT /products:** Atualiza um produto existente pelo ID.
- **DELETE /products:** Exclui um produto pelo ID.

### Usuários
- **GET /users:** Retorna todos os usuários.
- **POST /register:** Registra um novo usuário.
- **POST /login:** Realiza o login de um usuário.

### Carrinho
- **POST /cart/: Adiciona um item ao carrinho de um usuário.
- **GET //cart/: Retorna o carrinho de um usuário.
- **DELETE /cart/: Remove uma quantidade específica de um item do carrinho de um usuário.

###  COMO CRIAR OS REQUESTS

## Rotas para autenticação

- **POST http://localhost:3000//register**

```
header:

Content-Type - application/json

{
    "nome": "Nome do Usuário",
    "email": "email@exemplo.com",
    "senha": "senhaSegura"
}
```

- **POST http://localhost:3000//login**

```
header:

Content-Type - application/json

{
    "email": "email@exemplo.com",
    "senha": "senhaSegura"
}
```

## Rotas para produtos

- **POST http://localhost:3000//products**

```
header: 

authorization - bearer tokem = token gerado ao fazer o login do usuário
Content-Type - application/json

{
  "name": "Boneco do kaka",
  "description": "um boneco em tamanho real do kaka (baterias inclusas)",
  "price": 100.0,
  "stock": 50
}
```

- **PUT http://localhost:3000//products/productId**

- substitua o "/productId" pelo id do produto que será deletado 

```
header: 

authorization - bearer tokem = token gerado ao fazer o login do usuário
Content-Type: application/json

body:
{
  "name": "Nome Atualizado do Produto",
  "description": "Descrição Atualizada do Produto",
  "price": 150.0,
  "stock": 30
} 
```

- **DELETE http://localhost:3000//products/productId**

- substitua o "/productId" pelo id do produto que será deletado 

```
header: 

authorization - bearer tokem = token gerado ao fazer o login do usuário

```

## Rotas para o carrinho

- **POST http://localhost:3000//cart**

```
header: 

authorization - bearer tokem = token gerado ao fazer o login do usuário
content-type -application/json

body:

{
  "productId": "ID_DO_PRODUTO",
  "quantity": 1
}
```

- **GET http://localhost:3000//cart**

```
header: 

authorization - bearer tokem = token gerado ao fazer o login do usuário


```


- **DELETE http://localhost:3000//cart/productId**

- substitua o "/productId" pelo id do produto que será deletado 

```
header: 

authorization - bearer tokem = token gerado ao fazer o login do usuário

```



## Licença
Este projeto está licenciado sob a [MIT License](LICENSE).
