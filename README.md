# Pain Discovery - Pesquisa de Desafios Profissionais

Formulário para descobrir dores e desafios profissionais da sua rede do LinkedIn.

## Stack
- **Next.js 16** (App Router)
- **PostgreSQL** (via Prisma ORM)
- **Tailwind CSS 4**
- **Railway** para deploy

## Páginas
- `/` — Formulário multi-step para coletar respostas
- `/obrigado` — Página de agradecimento após envio
- `/admin` — Painel protegido para visualizar todas as respostas com métricas

---

## Deploy no Railway (passo a passo)

### 1. Suba o código para o GitHub
```bash
git init
git add .
git commit -m "primeiro commit"
gh repo create pain-discovery --public --push --source=.
```

### 2. Crie o projeto no Railway
1. Acesse [railway.app](https://railway.app) e faça login
2. Clique em **New Project** → **Deploy from GitHub repo**
3. Selecione o repositório `pain-discovery`

### 3. Adicione o PostgreSQL
1. No projeto do Railway, clique em **+ New** → **Database** → **PostgreSQL**
2. O Railway vai criar automaticamente e conectar

### 4. Configure as variáveis de ambiente
No serviço do seu app (não no PostgreSQL), vá em **Variables** e adicione:

```
DATABASE_URL=${{Postgres.DATABASE_URL}}
ADMIN_SECRET=sua-senha-secreta-aqui
```

> A variável `DATABASE_URL` com `${{Postgres.DATABASE_URL}}` faz o Railway puxar automaticamente a URL do banco.

### 5. Rode a migration do banco
No Railway, vá no serviço do app → **Settings** → **Custom Build Command**:
```
npx prisma db push && npm run build
```

Ou após o primeiro deploy, use o terminal do Railway:
```bash
npx prisma db push
```

### 6. Pronto!
O Railway vai fazer o deploy automaticamente. Acesse a URL gerada.

---

## Desenvolvimento local

```bash
# Instale as dependências
npm install

# Copie o .env
cp .env.example .env
# Edite o .env com sua DATABASE_URL local

# Crie as tabelas no banco
npm run db:push

# Rode o projeto
npm run dev
```

Acesse `http://localhost:3000`

## Acessar o painel admin
Acesse `/admin` e use a senha definida em `ADMIN_SECRET`.
