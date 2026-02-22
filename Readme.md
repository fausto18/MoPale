# 🏠 Mopale API - Gestão Imobiliária

Mopale é uma API REST desenvolvida com **NestJS** para a gestão de propriedades, usuários e avaliações. O projecto utiliza **PostgreSQL** via Docker e possui um sistema de autenticação customizado com **JWT**.

## 🚀 Tecnologias Utilizadas

* **Framework:** [NestJS](https://nestjs.com/)
* **Banco de Dados:** [PostgreSQL](https://www.postgresql.org/)
* **ORM:** [TypeORM](https://typeorm.io/)
* **Containerização:** [Docker](https://www.docker.com/)
* **Segurança:** JWT (JSON Web Tokens) & Bcrypt

---

## 🛠️ Configuração do Ambiente

### 1. Requisitos
* Node.js (v18 ou superior)
* Docker & Docker Compose

### 2. Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto e configure as seguintes variáveis:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=mopale

JWT_ACCESS_SECRET=MOPALE_SECRET_TESTE
3. Executando o Projeto
Primeiro, suba o banco de dados:

Bash
docker-compose up -d
Depois, instale as dependências e inicie a API:

Bash
npm install
npm run start:dev
A API estará disponível em: http://localhost:3000

🔐 Autenticação
A API utiliza um AuthGuard customizado. Para acessar rotas protegidas, siga os passos:

Registro: Crie um usuário em POST /users/register.

Login: Autentique-se em POST /auth/login para receber seu accessToken.

Uso: Em rotas protegidas, adicione o header:
Authorization: Bearer <seu_token_aqui>

📍 Rotas Principais
Usuários (/users)
POST /users/register - Cadastra um novo usuário.

GET /users - Lista todos os usuários (🔒 Requer Token).

GET /users/:id - Detalhes de um usuário.

Propriedades (/properties)
GET /properties - Lista todos os imóveis cadastrados.

POST /properties - Cadastra um novo imóvel (🔒 Requer Token).

GET /properties/city/:city - Filtra imóveis por cidade.

GET /properties/category/:category - Filtra por categoria (ex: Casa, Apartamento).

Avaliações (/reviews)
POST /reviews - Adiciona um comentário e nota a um imóvel.

🗄️ Estrutura do Banco de Dados
A base de dados mopale contém as seguintes tabelas principais:

user: Armazena credenciais e perfis.

property: Armazena dados dos imóveis (título, preço, localização).

review: Relaciona usuários a comentários sobre propriedades.

🛠️ Comandos de Debug (Docker)
Caso precise consultar o banco manualmente:

Bash
docker exec -it mopale_postgres psql -U postgres -d mopale
Comandos úteis dentro do psql:

\dt : Lista todas as tabelas.

SELECT * FROM "user"; : Lista usuários cadastrados.

Feito com ❤️ por Fausto Sacufundala


---

### Dica para o README:
Eu incluí uma seção de **Debug do Docker** porque, como vimos, às vezes é necessário checar os IDs diretamente no banco para entender o funcionamento dos tokens.

🛡️ Implementação do AuthGuard Customizado
Diferente da abordagem padrão do NestJS com Passport, este projeto utiliza um AuthGuard manual para garantir maior controlo e simplicidade na validação de tokens JWT.

Como funciona:
Extração: O Guard interseta a requisição e extrai o token do Header Authorization via padrão Bearer.

Validação: Utiliza o JwtService injetado para verificar a assinatura do token usando a chave secreta configurada no .env (JWT_ACCESS_SECRET).

Injeção de Contexto: Após a validação com sucesso, o payload (dados do usuário) é anexado diretamente ao objeto request, ficando disponível em todos os Controllers através de request['user'].

Tratamento de Erros: O Guard está configurado para emitir mensagens de erro claras (UnauthorizedException) caso o token esteja malformado, expirado ou com assinatura inválida.

Benefícios desta abordagem:
Performance: Menos camadas de abstração e processamento.

Transparência: Facilidade em depurar erros de validação diretamente no código do Guard.

Flexibilidade: Permite personalizar facilmente a lógica de extração de tokens para diferentes tipos de clientes.

🚀 Exemplo de Uso nos Controllers
Para proteger qualquer rota, basta utilizar o decorator @UseGuards:

TypeScript
@Controller('minha-rota')
export class MeuController {
  
  @UseGuards(AuthGuard) // Protege esta rota específica
  @Get('protegido')
  findData(@Req() request: Request) {
    const user = request['user']; // Acede aos dados do usuário logado
    return { message: `Bem-vindo, ID: ${user.sub}` };
  }
}