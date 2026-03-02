# Maison Senna

Um conceito de uma plataforma e-commerce de luxo, feita para uma clientela exigente que procura produtos premium com variações sofisticadas.

## Funcionalidades

Este projeto está atualmente em desenvolvimento. Até agora temos as seguintes funcionalidades:

- **Autenticação JWT**: Autenticação customizada com tokens armazenados em HTTPOnly cookies para maior segurança.
- **Gerenciamento de produtos**: Criação de produtos com duas etapas, com opções de variações.
- **Dashboard Admin**: Visão geral da plataforma, com gerenciamento de categorias, variações e opções
- **Hooks de autenticação**: Fluxo de autenticação completo com React Context para autenticação e autorização de usuários.

Mais funcionalidades vindo...

## Tech Stack

### Backend
- **Python 3.14.2** com **Django 5.1.8**
- **Django REST Framework** para desenvolvimento da API
- **SimpleJWT** com views customizadas para armazenamento de HTTPOnly cookies com tokens
- Banco de dados **MySQL** 
- **UV** package manager (alternativa rápida e moderna para o pip)

### Frontend
- **React 19** com **Vite** para desenvolvimento rápido
- **TypeScript** para type safety
- **Tailwind CSS 4** para estilização
- **TanStack Query** para obteção de dados e caching otimizados
- **React Hook Form** com validação Zod
- **Sonner** para notificações toast elegantes
- **Lucide React** para icons
- **Motion** para animações suaves

### DevOps
- **Docker** e **Docker Compose** para conteinerização
- **Make** para execução dos comandos de maneira simplificada

## Pré-requisitos

Escolha o melhor método de setup para você:

### Option 1: Docker (Recomendado)
- [Docker](https://docs.docker.com/get-docker/) (versão 20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (versão 2.0+)

### Option 2: Instalação manual
- [Python 3.12+](https://www.python.org/downloads/)
- [Gerenciador de pacotes UV](https://docs.astral.sh/uv/) - Instale com: `curl -LsSf https://astral.sh/uv/install.sh | sh`
- [Node.js 18+](https://nodejs.org/) com npm
- [MySQL 8.0+](https://dev.mysql.com/downloads/mysql/)

## Inícialização

<details>
<summary>Com Docker (~5 minutos)</summary>

**1. Clone o repositório**
```bash
git clone <repository-url>
cd maison-senna
```

**2. Crie as variáveis de ambiente**
```bash
make env
```

Esse comando copiará os arquivos `.env-example` para `.env` nos diretórios root, backend, e frontend. Atualize estes arquivos com a sua configuração se for preciso.

**3. Rode a aplicação**
```bash
make up
```

Esse comando vai:
- Construir as imagens do Docker utilizadas para o projeto
- Inicializar os serviços do mysql, back-end e front-end
- Rodar as migrations
- Carregar os dados iniciais para o banco (fixtures do Django)
- Iniciar os servidores dev

Os serviços estarão disponíveis em:
- **Frontend**: http://localhost:3000
- **API Backend**: http://localhost:8000
- **MySQL**: localhost:3307

**4. Crie um superuser**
```bash
make superuser
```

Siga os prompts para criar a conta de admin no back-end.

**5. Acesse a aplicação**

Vá até a URL http://localhost:3000/login e faça login com as credenciais criadas. Clique no icone de user na navbar para acessar o painel de admin do front-end.

**6. Pare a aplicação**
```bash
make down
```

Esse comando irá parar todos os containers e removerá os volumes.
</details>

<details>
<summary>Sem Docker (Setup manual)</summary>

#### Parte 1: Setup do back-end

**1. Clone o repositório**
```bash
git clone <repository-url>
cd maison-senna
```

**2. Crie as variáveis de ambiente**
```bash
make env
```

**3. Configura o seu banco de dados**

Edite o arquivo `backend/.env` e atualize as configurações da base de dados:
```env
DB_NAME=maison_senna
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_HOST=127.0.0.1
DB_PORT=3306
```

**4. Crie a base no MySQL**
```bash
mysql -u root -p
```

No shell do MySQL:
```sql
CREATE DATABASE maison_senna CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

**5. Navegue até o diretório do back-end**
```bash
cd backend
```

**6. Instale o UV (se não estiver instalado ainda)**
```bash
# Linux/macOS
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows (PowerShell)
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

**7. Instale as dependências**
```bash
uv sync
```

Esse comando criará o ambiente virtual automaticamente e instalar as dependências do arquivo `pyproject.toml`.

**8. Rode as migrations**
```bash
uv run manage.py migrate
```

**9. (Opcional) Carregue as fixtures**
```bash
uv run manage.py loaddata fixtures/initialdata
```

**10. Crie um superuser**
```bash
uv run manage.py createsuperuser
```

**11. Inicie o servidor do Django**
```bash
uv run manage.py runserver
```

A API estará dispoível em http://localhost:8000
E o front-end em http://localhost:3000

#### Parte 2: Setup do front-end

**1. Abra um novo terminal e vá até o diretório do front-end**
```bash
cd frontend
```

**2. Instale as dependências do Node.js**
```bash
npm install
```

**3. Configure as variáveis de ambiente**

Edite `frontend/.env` e tenha certeza de que a URL do back-end está correta:
```env
VITE_BACKEND_URL=http://localhost:8000/api/v1
```

**4. Inicie o servidor Vite**
```bash
npm run dev
```

O frontend estará dispoível em http://localhost:3000

**5. Acesse a aplicação**

Abra seu navegador e vá até http://localhost:3000/login

Logue com as suas credenciais criadas e explore a plataforma!
</details>

### Comandos "make" disponíveis

| Comando | Descrição |
|---------|-------------|
| `make env` | Cria os arquivos .env com os exemplos |
| `make up` | Roda todos os serviços e carrega as fixtures do Django |
| `make down` | Para os serviços e remove os volumes |
| `make superuser` | Cria um superuser no Django |
| `make seed` | Roda as migrations e carrega as fixtures |

---

## Estrutura do projeto

```
maison-senna/
├── backend/              # Django REST API
│   ├── apps/            # Aplicações Django
│   ├── CORE/            # Configurações e ajustes principais
│   ├── fixtures/        # Fixtures
│   ├── media/           # Arquivos media carregados pelos usuários
│   ├── manage.py        # Arquivo do Django
│   └── pyproject.toml   # Dependências do projeto
├── frontend/            # Aplicação React
│   ├── src/            # Código-fonte
│   ├── public/         # Arquivos estáticos
│   └── package.json    # Dependências do Node.js
├── docker-compose.yml   # Configuração dos serviços Docker
├── Makefile            # Comandos make
└── README.md           # Este arquivo kkk
```

**Nota**: Esse projeto utiliza a biblioteca UV como gerenciador de pacotes. Se você ficou interessado no por quê do UV ser utilizado no lugar do pip, dê uma olhada na [documentação da ferramenta](https://docs.astral.sh/uv/) para ver sobre os seus benefícios.

