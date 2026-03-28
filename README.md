# 👕 Guerreiros Fitness — Sistema de Gestão

Projeto pronto para deploy no **Vercel** com banco de dados permanente.

---

## 📁 Estrutura

```
guerreiros/
├── api/
│   └── db.js          ← Banco de dados (Vercel KV / Redis)
├── public/
│   ├── index.html     ← Loja pública (site_da_loja)
│   └── admin.html     ← Painel de gestão (protegido por senha)
├── package.json
└── vercel.json
```

---

## 🚀 Deploy no Vercel — Passo a passo

### 1. Instale a CLI do Vercel
```bash
npm install -g vercel
```

### 2. Faça login
```bash
vercel login
```

### 3. Entre na pasta do projeto
```bash
cd guerreiros
```

### 4. Instale as dependências
```bash
npm install
```

### 5. Primeiro deploy
```bash
vercel
```
Siga as perguntas na tela. Escolha as opções padrão.

---

## 🗄️ Configurar o Banco de Dados (Vercel KV)

O banco de dados usa **Vercel KV** (Redis gerenciado). É gratuito no plano Hobby.

### No painel do Vercel:
1. Acesse seu projeto em **vercel.com/dashboard**
2. Clique na aba **"Storage"**
3. Clique em **"Create Database"** → escolha **"KV"**
4. Dê um nome (ex: `guerreiros-db`) e clique **Create**
5. Na aba **"Settings"** do KV, clique **"Connect to Project"** e selecione seu projeto
6. As variáveis de ambiente (`KV_URL`, `KV_REST_API_URL`, `KV_REST_API_TOKEN`) são adicionadas automaticamente

### Deploy final (com banco ativo):
```bash
vercel --prod
```

---

## 🌐 URLs após o deploy

| Página | URL |
|--------|-----|
| Loja pública | `https://seu-projeto.vercel.app/` |
| Painel de gestão | `https://seu-projeto.vercel.app/admin` |
| API do banco | `https://seu-projeto.vercel.app/api/db` |

---

## 🔐 Credenciais padrão do painel

| Campo | Valor |
|-------|-------|
| Usuário | `nicolas` |
| Senha | `1107/Nic` |

> Para alterar, edite as constantes `AUTH_USER` e `AUTH_PASS` no arquivo `public/admin.html`.

---

## 📡 Como o banco de dados funciona

A API em `api/db.js` é um endpoint simples de chave-valor:

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/db?key=s24_products` | Lê um valor |
| `POST` | `/api/db` com `{key, value}` | Salva um valor |
| `DELETE` | `/api/db?key=s24_products` | Remove um valor |

Os dados ficam salvos permanentemente no Redis (Vercel KV) e sincronizam automaticamente entre dispositivos.

---

## 🔒 Segurança extra (opcional)

Defina a variável de ambiente `API_SECRET` no Vercel com um valor secreto.
O painel já envia o header automaticamente.

---

## 🛠️ Desenvolvimento local

```bash
# Instale a CLI do Vercel
npm install -g vercel

# Linka ao projeto remoto (para puxar as env vars do KV)
vercel link

# Puxa as variáveis de ambiente
vercel env pull .env.local

# Inicia o servidor local
vercel dev
```

Acesse em `http://localhost:3000`
