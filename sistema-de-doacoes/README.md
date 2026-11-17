# 💻 Sistema de Gestão de Doações FMP — Front-end (React + Vite)

Interface web moderna desenvolvida em **React 19**, **Vite** e **React Router DOM**, integrada via **Axios** com a API RESTful do Sistema de Doações da Faculdade Municipal de Palhoça (FMP).

> **Status da Aplicação:** 🟢 **Integrada à API de Produção no Render** (`https://sistemadedoacoesback.onrender.com`).

---

## 🔗 Links Oficiais do Projeto

| Recurso | Descrição | Link de Acesso |
|---|---|---|
| 🌐 **API em Produção (Render)** | Web Service REST online no Render | [https://sistemadedoacoesback.onrender.com/](https://sistemadedoacoesback.onrender.com/) |
| 💻 **Repositório Front-end** | Repositório oficial do front-end React | [DaviAravechiaFMP/Front-sistema-de-doa-es](https://github.com/DaviAravechiaFMP/Front-sistema-de-doa-es.git) |
| ⚙️ **Repositório Back-end** | Repositório oficial da API Node.js | [DaviAravechiaFMP/sistemaDeDoacoesBack](https://github.com/DaviAravechiaFMP/sistemaDeDoacoesBack.git) |
| 📮 **Coleção Postman** | Workspace oficial compartilhado no Postman | [Acessar Coleção Postman](https://go.postman.co/collection/59258389-769418dd-3d80-42ce-bae7-2d9c7be3bb03?source=collection_link) |

---

## 👥 Integrantes do grupo

| Integrante |
|---|
| Davi Aravechia |
| Eduardo Silva |
| Lucas Alexandre Vieira Schutz |

---

## 🚀 Funcionalidades Principais

- 🔐 **Autenticação JWT Segura:**
  - Login integrado (`POST /api/auth/login`) com armazenamento de token e dados do usuário no `localStorage` e no `AuthContext`.
  - Cadastro de Aluno (`POST /api/auth/registrar`) com login automático imediato.
  - Interceptor Axios que anexa automaticamente o cabeçalho `Authorization: Bearer <token>` em todas as requisições protegidas.
  - Interceptor de resposta que captura erros `401 Unauthorized`, limpa a sessão e redireciona para `/login`.

- 🛡️ **Proteção de Rotas com `useNavigate` e `RotaPrivada`:**
  - Rotas protegidas exigem autenticação ativa. Se o usuário tentar acessar sem token ou com sessão expirada, é redirecionado para `/login`.
  - Redirecionamento inteligente após login/cadastro diretamente para o painel principal (`/home`).

- 📊 **Listagem Real de Dados com `.map()`:**
  - **Saldo de Horas Complementares:** Consulta `GET /api/auth/perfil` exibindo nome, matrícula, curso e o saldo de horas real do aluno nos cartões de métricas e cabeçalhos.
  - **Campanhas Institucionais:** Consulta `GET /api/campanhas` exibindo cards com título, descrição, prazos, regras de conversão e link direto para doação vinculada.
  - **Gestão de Doações:** Consulta `GET /api/doacoes` com tabela dinâmica, selos visuais de status (`Pendente`, `Aprovada`, `Reprovada`), formatação de data brasileira (`pt-BR`) e filtro por status.
  - **Cadastro de Doação:** Select dinâmico carregando as campanhas ativas da API e permitindo também doações gerais sem campanha específica.

---

## 🧰 Tecnologias Utilizadas

| Tecnologia | Função no projeto |
|---|---|
| **React 19** | Biblioteca para construção de interfaces reativas baseadas em componentes |
| **Vite 8** | Ferramenta de build ultrarrápida com Hot Module Replacement (HMR) |
| **React Router DOM 7** | Gerenciamento de rotas declarativas e navegação SPA |
| **Axios** | Cliente HTTP com interceptors de requisição e resposta |
| **Context API** | Gerenciamento de estado global de autenticação e perfil do usuário |
| **CSS3** | Estilização responsiva com variáveis CSS e layout em Grid e Flexbox |
| **ESLint** | Validação estática de código com regras do React Hooks e Fast Refresh |

---

## 📁 Estrutura do Front-end

```text
front/sistema-de-doacoes/
├── public/                      ← Favicons e ícones SVG
├── src/
│   ├── assets/                  ← Imagens e logotipos
│   ├── constants/
│   │   ├── App.jsx              ← Roteador principal e definição de rotas
│   │   ├── Home.jsx             ← Painel do aluno com métricas, saldo e campanhas
│   │   ├── Login.jsx            ← Formulário de login com feedback de tentativas
│   │   └── RotaPrivada.jsx      ← Wrapper para proteção de rotas autenticadas
│   ├── contexts/
│   │   └── AuthContext.jsx      ← Provedor global de autenticação, login e perfil
│   ├── pages/
│   │   ├── CadastroDoacao.jsx   ← Formulário de cadastro de nova doação
│   │   ├── CadastroUsuario.jsx  ← Formulário de registro de novo aluno
│   │   ├── ListaCampanhas.jsx   ← Catálogo de campanhas institucionais (.map)
│   │   └── ListaDoacoes.jsx     ← Tabela de doações com filtros e saldo (.map)
│   ├── services/
│   │   ├── api.jsx              ← Instância Axios com baseURL e interceptors JWT
│   │   └── api.js               ← Re-exportação para compatibilidade
│   ├── styles/
│   │   ├── index.css            ← Estilos globais e reset
│   │   └── style.css            ← Variáveis de tema, cards, formulários e tabelas
│   └── main.jsx                 ← Ponto de entrada (StrictMode + BrowserRouter + AuthProvider)
├── .env.example                 ← Template das variáveis de ambiente
├── .env                         ← Configuração da URL da API
├── package.json                 ← Scripts e dependências
├── vite.config.js               ← Configuração do Vite
└── README.md                    ← Documentação do front-end
```

---

## ⚙️ Configuração das Variáveis de Ambiente (`.env`)

Crie o arquivo `.env` na raiz de `front/sistema-de-doacoes`:

```env
# URL base do back-end Node.js no Render
VITE_API_URL=https://sistemadedoacoesback.onrender.com
```

---

## 💻 Como Executar o Front-end

### 1. Clonar o repositório
```bash
git clone https://github.com/DaviAravechiaFMP/Front-sistema-de-doa-es.git
cd Front-sistema-de-doa-es
```
*(ou navegue até a pasta `front/sistema-de-doacoes` no projeto consolidado)*

### 2. Instalar as dependências
```bash
npm install
```

### 3. Iniciar o servidor de desenvolvimento
```bash
npm run dev
```
Acesse a aplicação no seu navegador em: `http://localhost:5173/`

### 4. Construir para produção
```bash
npm run build
```
Os arquivos otimizados serão gerados na pasta `dist/`.

### 5. Executar o linter
```bash
npm run lint
```

---

## 📄 Observação

Projeto acadêmico desenvolvido para o **Projeto Integrador** do curso de Análise e Desenvolvimento de Sistemas da **Faculdade Municipal de Palhoça (FMP)**.
