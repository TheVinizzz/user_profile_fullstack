# 🚀 Configuração do Insomnia para Perfil User API

Este guia explica como importar e usar a coleção do Insomnia para testar todas as rotas da API NestJS.

## 📥 Importando a Coleção

### 1. Abra o Insomnia
- Baixe e instale o [Insomnia](https://insomnia.rest/download) se ainda não tiver
- Abra o aplicativo

### 2. Importe a Coleção
- Clique em **"Create"** → **"Import from File"**
- Selecione o arquivo `insomnia-collection.json` desta pasta
- A coleção **"Perfil User API - NestJS"** será importada

### 3. Configure o Ambiente
- Clique em **"No Environment"** no topo da tela
- Selecione **"Development"** para testes locais
- Ou **"Production"** para testes em produção

## 🏗️ Configuração Inicial

### 1. Inicie o Banco de Dados
```bash
# Na pasta do projeto NestJS
docker-compose up -d
```

### 2. Configure o Banco
```bash
# Execute as migrações
npx prisma migrate dev

# (Opcional) Visualize o banco
npx prisma studio
```

### 3. Inicie a API
```bash
# Modo desenvolvimento
npm run start:dev

# A API estará disponível em http://localhost:3000
```

## 🔧 Testando as Rotas

### 1. Registrar Usuário
- **Rota**: `POST /auth/register`
- **Descrição**: Cria um novo usuário
- **Payload**:
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "123456",
  "confirmPassword": "123456"
}
```

### 2. Fazer Login
- **Rota**: `POST /auth/login`
- **Descrição**: Autentica o usuário e retorna tokens
- **Payload**:
```json
{
  "email": "joao@example.com",
  "password": "123456"
}
```

**⚠️ IMPORTANTE**: Após o login, copie o `accessToken` e `refreshToken` da resposta e atualize nas variáveis de ambiente:

1. Clique em **"Development"** (ambiente)
2. Edite as variáveis:
   - `accessToken`: Cole o token JWT recebido
   - `refreshToken`: Cole o refresh token recebido
   - `userId`: Cole o ID do usuário (se precisar)

### 3. Testar Rotas Protegidas
Após configurar os tokens, você pode testar:

#### Listar Usuários
- **Rota**: `GET /users`
- **Headers**: Authorization já configurado automaticamente

#### Buscar Usuário por ID
- **Rota**: `GET /users/:id`
- **Configure**: Atualize a variável `userId` com um ID válido

#### Atualizar Usuário
- **Rota**: `PATCH /users/:id`
- **Payload**:
```json
{
  "name": "João Silva Atualizado",
  "email": "joao.atualizado@example.com"
}
```

#### Deletar Usuário
- **Rota**: `DELETE /users/:id`
- **Cuidado**: Esta ação é irreversível!

### 4. Renovar Token
- **Rota**: `POST /auth/refresh`
- **Descrição**: Renova o access token usando refresh token
- **Uso**: Quando o access token expirar (7 dias)

### 5. Logout
- **Rota**: `POST /auth/logout`
- **Descrição**: Invalida o refresh token
- **Resultado**: Usuário precisará fazer login novamente

## 🌍 Ambientes Disponíveis

### Development (Padrão)
- **Base URL**: `http://localhost:3000/api`
- **Uso**: Desenvolvimento local
- **Cor**: Roxo

### Production
- **Base URL**: `https://api.perfiluser.com/api`
- **Uso**: Ambiente de produção
- **Cor**: Vermelho
- **Nota**: Altere a URL conforme sua configuração

## 🔄 Fluxo de Teste Recomendado

1. **Registrar** um novo usuário
2. **Fazer login** com as credenciais
3. **Copiar tokens** para as variáveis de ambiente
4. **Testar rotas protegidas** (users)
5. **Renovar token** quando necessário
6. **Fazer logout** ao terminar

## 📋 Variáveis de Ambiente

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `baseUrl` | URL base da API | `http://localhost:3000/api` |
| `accessToken` | Token JWT de autenticação | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `refreshToken` | Token para renovação | `refresh_token_string` |
| `userId` | ID do usuário para testes | `uuid-do-usuario` |

## 🐛 Troubleshooting

### Erro 401 - Unauthorized
- Verifique se o `accessToken` está configurado corretamente
- O token pode ter expirado (7 dias) - use refresh token
- Certifique-se de que o usuário foi autenticado

### Erro 404 - Not Found
- Verifique se a API está rodando (`npm run start:dev`)
- Confirme se a `baseUrl` está correta
- Verifique se o endpoint existe

### Erro 500 - Internal Server Error
- Verifique se o banco de dados está rodando
- Confira os logs da API no terminal
- Certifique-se de que as migrações foram executadas

### Token Expirado
- Use a rota `/auth/refresh` para renovar
- Ou faça login novamente

## 📝 Dicas Importantes

1. **Sempre atualize os tokens** após fazer login
2. **Use variáveis de ambiente** para não repetir valores
3. **Teste em ordem** (registro → login → rotas protegidas)
4. **Mantenha o banco rodando** durante os testes
5. **Verifique os logs** da API em caso de erros

---

## 🎯 Exemplo de Uso Completo

```bash
# 1. Prepare o ambiente
docker-compose up -d
npm run start:dev

# 2. No Insomnia:
# - Registre um usuário
# - Faça login
# - Copie os tokens
# - Teste as rotas protegidas

# 3. Para parar
docker-compose down
```

Agora você está pronto para testar toda a API usando o Insomnia! 🚀 