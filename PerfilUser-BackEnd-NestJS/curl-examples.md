# 🌐 Exemplos de Curl para Testar a API

Alternativa ao Insomnia para testar a API via terminal/linha de comando.

## 📋 Pré-requisitos

- API rodando em `http://localhost:3000`
- Banco de dados configurado

## 🔧 Testando os Endpoints

### 1. Registrar Usuário

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "123456",
    "confirmPassword": "123456"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "123456"
  }'
```

**⚠️ IMPORTANTE**: Salve o `accessToken` e `refreshToken` da resposta para usar nas próximas requisições.

### 3. Listar Usuários (Requer Token)

```bash
# Substitua YOUR_ACCESS_TOKEN pelo token recebido no login
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 4. Buscar Usuário por ID (Requer Token)

```bash
# Substitua USER_ID pelo ID do usuário e YOUR_ACCESS_TOKEN pelo token
curl -X GET http://localhost:3000/api/users/USER_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 5. Atualizar Usuário (Requer Token)

```bash
# Substitua USER_ID pelo ID do usuário e YOUR_ACCESS_TOKEN pelo token
curl -X PATCH http://localhost:3000/api/users/USER_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "name": "João Silva Atualizado",
    "email": "joao.atualizado@example.com"
  }'
```

### 6. Deletar Usuário (Requer Token)

```bash
# Substitua USER_ID pelo ID do usuário e YOUR_ACCESS_TOKEN pelo token
curl -X DELETE http://localhost:3000/api/users/USER_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 7. Renovar Token

```bash
# Substitua YOUR_REFRESH_TOKEN pelo refresh token recebido no login
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

### 8. Logout (Requer Token)

```bash
# Substitua os tokens pelos valores corretos
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

## 🚀 Exemplo Completo de Fluxo

```bash
# 1. Registrar usuário
echo "=== Registrando usuário ==="
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "123456",
    "confirmPassword": "123456"
  }' | json_pp

echo -e "\n=== Fazendo login ==="
# 2. Fazer login e salvar resposta
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "123456"
  }')

echo $LOGIN_RESPONSE | json_pp

# 3. Extrair tokens (requer jq)
ACCESS_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.accessToken')
REFRESH_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.refreshToken')
USER_ID=$(echo $LOGIN_RESPONSE | jq -r '.user.id')

echo -e "\n=== Listando usuários ==="
# 4. Listar usuários
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer $ACCESS_TOKEN" | json_pp

echo -e "\n=== Buscando usuário por ID ==="
# 5. Buscar usuário por ID
curl -X GET http://localhost:3000/api/users/$USER_ID \
  -H "Authorization: Bearer $ACCESS_TOKEN" | json_pp
```

## 🔧 Ferramentas Úteis

### Instalação de Ferramentas

```bash
# Ubuntu/Debian
sudo apt install jq

# macOS
brew install jq

# Windows (via Chocolatey)
choco install jq
```

### Melhorando a Saída

```bash
# Formato JSON prettificado
curl ... | json_pp

# Usando jq para formatação
curl ... | jq

# Salvando resposta em arquivo
curl ... > response.json

# Mostrando headers da resposta
curl -i ...

# Modo verboso (para debug)
curl -v ...
```

## 🎯 Script de Teste Automatizado

Crie um arquivo `test-api.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:3000/api"

echo "=== Testando API Perfil User ==="

# 1. Registrar usuário
echo "1. Registrando usuário..."
curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste User",
    "email": "teste@example.com",
    "password": "123456",
    "confirmPassword": "123456"
  }' > /dev/null

# 2. Login
echo "2. Fazendo login..."
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "password": "123456"
  }')

if [ $? -eq 0 ]; then
    echo "✅ Login realizado com sucesso!"
    
    # Extrair token
    ACCESS_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.accessToken')
    
    # 3. Testar rota protegida
    echo "3. Testando rota protegida..."
    curl -s -X GET $BASE_URL/users \
      -H "Authorization: Bearer $ACCESS_TOKEN" > /dev/null
    
    if [ $? -eq 0 ]; then
        echo "✅ Rota protegida funcionando!"
    else
        echo "❌ Erro na rota protegida"
    fi
else
    echo "❌ Erro no login"
fi

echo "=== Teste concluído ==="
```

Execute o script:

```bash
chmod +x test-api.sh
./test-api.sh
```

## 📝 Dicas Importantes

1. **Sempre use variáveis** para tokens em scripts
2. **Substitua os placeholders** pelos valores reais
3. **Use jq** para processar JSON
4. **Salve tokens** para reutilização
5. **Verifique se a API está rodando** antes de testar

---

Esta documentação fornece uma alternativa completa ao Insomnia para testar a API via linha de comando! 🚀 