# PerfilUser Backend - NestJS

Backend moderno construído com **NestJS**, **Prisma ORM**, **MySQL**, **JWT Authentication** e **Docker** para o sistema de perfil de usuário.

## 🚀 Tecnologias

- **NestJS** - Framework Node.js progressivo
- **Prisma** - ORM moderna e type-safe
- **MySQL** - Banco de dados relacional
- **JWT** - Autenticação baseada em tokens
- **Docker** - Containerização do banco de dados
- **bcryptjs** - Hash de senhas
- **class-validator** - Validação de dados
- **Passport** - Estratégias de autenticação

## 🏗️ Arquitetura

```
src/
├── auth/                    # Módulo de autenticação
│   ├── dto/                # DTOs de login e registro
│   ├── guards/             # Guards de autenticação
│   ├── strategies/         # Estratégias JWT e Local
│   ├── auth.controller.ts  # Controller de auth
│   ├── auth.service.ts     # Service de auth
│   └── auth.module.ts      # Módulo de auth
├── user/                   # Módulo de usuários
│   ├── dto/               # DTOs de usuário
│   ├── user.controller.ts # Controller de users
│   ├── user.service.ts    # Service de users
│   └── user.module.ts     # Módulo de users
├── prisma/                # Configuração do Prisma
│   ├── prisma.service.ts  # Service do Prisma
│   └── prisma.module.ts   # Módulo do Prisma
├── app.module.ts          # Módulo principal
└── main.ts               # Ponto de entrada
```

## 📦 Instalação

### 1. Clone o repositório
```bash
git clone <repository-url>
cd PerfilUser-BackEnd-NestJS
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o ambiente
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite as variáveis de ambiente conforme necessário
```

### 4. Inicie o banco de dados com Docker
```bash
# Inicia MySQL e phpMyAdmin
docker-compose up -d

# Aguarde alguns segundos para o MySQL inicializar completamente
```

### 5. Configure o banco de dados
```bash
# Gera o cliente Prisma
npx prisma generate

# Cria as tabelas no banco
npx prisma db push

# (Opcional) Visualize o banco no Prisma Studio
npx prisma studio
```

### 6. Inicie a aplicação
```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod
```

## 🔧 Configuração

### Variáveis de Ambiente (.env)

```env
# Database
DATABASE_URL="mysql://perfil_user:userpassword@localhost:3306/perfil_user_db"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# App Configuration
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN="http://localhost:8080,http://localhost:3000"

# Security
BCRYPT_SALT_ROUNDS=12
```

### Docker Services

O arquivo `docker-compose.yml` configura:

- **MySQL 8.0** na porta `3306`
- **phpMyAdmin** na porta `8080` (http://localhost:8080)

Credenciais do banco:
- **Host**: localhost:3306
- **Database**: perfil_user_db
- **Username**: perfil_user
- **Password**: userpassword
- **Root Password**: rootpassword

## 🛠️ API Endpoints

### Autenticação

| Método | Endpoint | Descrição | Body |
|--------|----------|-----------|------|
| POST | `/api/auth/register` | Registrar usuário | `{ name, email, password }` |
| POST | `/api/auth/login` | Login | `{ email, password }` |
| POST | `/api/auth/refresh` | Renovar token | `{ refresh_token }` |
| POST | `/api/auth/logout` | Logout | `{ refresh_token }` |

### Usuários (Protegidas - JWT Required)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/users` | Listar usuários |
| GET | `/api/users/:id` | Buscar usuário |
| PATCH | `/api/users/:id` | Atualizar usuário |
| DELETE | `/api/users/:id` | Deletar usuário |

## 🧪 Testando a API

### 📱 Usando Insomnia (Recomendado)

Para uma experiência completa de teste da API:

1. **Importe a coleção**: `insomnia-collection.json`
2. **Siga o guia completo**: `INSOMNIA_SETUP.md`
3. **Configure ambientes**: Development/Production
4. **Teste todas as rotas**: Com variáveis automáticas

### 🌐 Usando curl

Para testes rápidos via terminal:

1. **Exemplos completos**: `curl-examples.md`
2. **Scripts automatizados**: Incluídos na documentação
3. **Fluxo completo**: Registro → Login → Rotas protegidas

### 🚀 Teste Rápido

```bash
# Registro
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "123456",
    "confirmPassword": "123456"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "123456"
  }'

# Listar usuários (substitua YOUR_TOKEN pelo token recebido)
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🔒 Segurança

### Autenticação JWT
- Tokens JWT para autenticação stateless
- Refresh tokens para renovação segura
- Tokens expiram em 7 dias (configurável)
- Refresh tokens expiram em 30 dias

### Hash de Senhas
- bcryptjs com salt rounds configurável
- Senhas nunca retornadas nas APIs
- Hash automático no registro

### Validação
- class-validator para validação de entrada
- DTOs tipados para todas as operações
- Sanitização automática de dados

### CORS
- Configuração flexível de origens
- Suporte a credenciais
- Headers específicos permitidos

## 🗄️ Banco de Dados

### Modelo de Dados

```prisma
model User {
  id           String         @id @default(uuid())
  email        String         @unique
  name         String
  password     String
  createdAt    DateTime       @default(now())
  updatedAt    DateTime       @updatedAt
  refreshTokens RefreshToken[]
}

model RefreshToken {
  id        String   @id @default(uuid())
  token     String   @unique
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  expiresAt DateTime
  createdAt DateTime @default(now())
}
```

### Comandos Úteis do Prisma

```bash
# Visualizar banco no browser
npx prisma studio

# Reset completo do banco
npx prisma db push --force-reset

# Gerar nova migração
npx prisma migrate dev --name nome_da_migração

# Aplicar migrações em produção
npx prisma migrate deploy
```

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes e2e
npm run test:e2e

# Coverage
npm run test:cov
```

## 📊 Monitoramento

### Logs
- Logs estruturados em desenvolvimento
- Request/Response logging automático
- Error tracking com stack traces

### Health Check
```bash
curl http://localhost:3000/api
```

### Métricas do Banco
- Acesse phpMyAdmin: http://localhost:8080
- Monitore performance das queries
- Visualize estrutura das tabelas

## 🚀 Deploy

### Produção

1. **Configure variáveis de ambiente**
```bash
NODE_ENV=production
JWT_SECRET=strong-production-secret
DATABASE_URL=production-database-url
```

2. **Build e start**
```bash
npm run build
npm run start:prod
```

3. **Migração do banco**
```bash
npx prisma migrate deploy
```

### Docker (Produção)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
```

## 🤝 Integração com Frontend

### Configuração do Frontend
No seu frontend Vue.js, configure a API base URL:

```javascript
// Frontend .env
VUE_APP_API_BASE_URL=http://localhost:3000/api
```

### Headers Necessários
```javascript
// Headers obrigatórios
{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer ' + token, // Para rotas protegidas
}
```

## 📚 Recursos Adicionais

- [Documentação NestJS](https://nestjs.com/)
- [Documentação Prisma](https://prisma.io/docs)
- [JWT.io](https://jwt.io/) - Decodificador de tokens
- [MySQL Documentation](https://dev.mysql.com/doc/)

## 🐛 Troubleshooting

### Problemas Comuns

1. **Erro de conexão com MySQL**
   - Verifique se o Docker está rodando
   - Confirme as credenciais no .env
   - Aguarde o MySQL inicializar completamente

2. **Erro de JWT_SECRET**
   - Defina JWT_SECRET no .env
   - Use uma string forte e única

3. **Erro de CORS**
   - Configure CORS_ORIGIN no .env
   - Adicione o domínio do frontend

4. **Erro de validação**
   - Verifique os DTOs
   - Confirme os dados enviados

### Debug Mode
```bash
# Ative logs detalhados
DEBUG=* npm run start:dev
```

## 📄 Licença

Este projeto está sob a licença MIT.

---

**Desenvolvido com ❤️ usando NestJS + Prisma + MySQL**
