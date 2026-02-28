# Maison Senna

Um conceito de uma loja luxuosa e elegante que recebe pessoas de alta classe, que procuram itens de alta produção.

## Funcionalidades
O projeto está em andamento e faltam diversas funcionalidades a serem incluidas ainda. Até agora temos:
- **Autenticação JWT**: Sistema customizado e completo com tokens armazenados em HTTPOnly cookies
- **Gestão de produtos**: Formulário de dois passos onde você cria também as opções de variação daquele produto
- **Página admin**: Nesta página, é possível ver um resumo geral do e-commerce, gerenciar as categorias, os tipos de variaçõe e as opções
- **Hooks de autenticação**:  Para facilitar a identificação, autorização e autenticação do user, montei um flow completo de autenticação e verificação com Context.
  
Muito mais coisas por vir...

## Tecnologias utilizadas
- **Python 3.14.2** + **Django 5.1.8**
- **Django REST Framework**
- **SimpleJWT** - Com views customizadas para armazenar tokens em HTTPOnly cookies
- **MySQL**
- **React.js** + **Vite** + **Tailwind**
- **Tanstack Query** - Cache de queries e mutations otimizadas
- **Sonner** - Notificações toast, com estilização customizada
- **Docker** - Facilitar instalação e analisar o projeto


## Instalação

Na construção do projeto, utilizei [uv](https://github.com/astral-sh/uv) como package manager, ao invés de usar o `pip` nativo. Caso vá rodar o projeto manualmente, as instruções irão guiá-lo, mas recomendo que dê uma olhada em sua [documentação](https://docs.astral.sh/uv/), onde também encontrará excelentes motivos para começar a utilizá-lo em seus próprios projetos.

### Pré-requisitos
- Docker instalado
  
  **OU**
  
- Python 3.12+ e [uv](https://docs.astral.sh/uv/)
- Node 22+
- MySQL

### Opção 1 (Docker)
1. Clone o repositório
   ```
   git clone <url-do-repositorio>
   cd maison-senna
   ```
   
2. Crie os arquivos .env
   ```
   make env
   ```

3. Ao copiar, o seguinte comando preencherá a base de dados e iniciará os dois servidores automaticamente. Levará alguns segundos/minutos.
   ```
   make up
   ```

Quando terminar, o servidor está rodando. O back-end estará acessível em `http://localhost:8000` e o front-end em `http://localhost:3000`.

4. Finalmente, para criar um superuser, rode esse comando e preencha os campos:
   ```
   make superuser
   ```

Ao criar o superuser, faça o login em `http://localhost:3000/login`. Você pode criar novos produtos e categorias na página admin (clique no icone de user na navbar, e entre em admin page).

5. Caso deseje parar o servidor, rode o seguinte comando (removerá automaticamente o volume):
    ```
    make down
    ```

### Opção 2 (Manualmente)

1. Clone o repositório
   ```
   git clone <url-do-repositorio>
   cd maison-senna
   ```

2. Crie os arquivos .env
   ```
   make env
   ```

#### Back-end (Django)
3. Instale as dependências com UV:
   ```
   cd backend
   uv sync
   ```

Antes de rodar as migrations, você terá que configurar as variáveis de ambiente, onde a crucial para este passo é `DATABASE_URL`. Você precisará configurar o banco de dados também.

4. Rode as migrations:
   ```
   uv run manage.py migrate
   ```

5. Rode o servidor:
   ```
   uv run manage.py runserver
   ```

6. Caso deseje criar um superuser:
   ```
   uv run manage.py createsuperuser
   ```

#### Front-end (React)
4. Instale as dependências:
   ```
   cd frontend
   npm run install
   ```

5. Rode o servidor:
   ```
   npm run dev
   ```
