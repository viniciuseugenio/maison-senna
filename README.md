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
- **React.js** + **Vite**
- **Tailwind** - Estilização inline
- **Tanstack Query** - Cache de queries e mutations otimizadas
- **Sonner** - Notificações toast, com estilização customizada
- **Lucide** - Icons
- **Motion** - Animações
- **Docker** - Facilitar instalação e analisar o projeto


## Instalação

### Pré-requisitos
- Docker instalado
- Python 3.12+ e pip (caso vá rodar manualmente)

### Passo a passo
1. Clone o repositório
   ```
   git clone <url-do-repositorio>
   cd maison-senna
   ```
   
2. Crie os arquivos .env
   ```
   cp .env-example .env && cp backend/.env-example backend/.env && cp frontend/.env-example frontend/.env
   ```

3. Ao copiar, rode o seguinte comando para criar o container do mysql, rodar as migrations automaticamente, e preencher o banco de dados automaticamente:
   ```
   docker compose --profile init run --rm db-seed
   ```

3. Após ver a mensagem "Banco de dados carregado com sucesso", rode o seguinte comando:
   ```
   docker compose up --build -d
   ```
   
Agora, o servidor está rodando. O back-end estará acessível em `http://localhost:8000` e o front-end em `http://localhost:3000`.

5. Finalmente, para criar um superuser, rode esse comando e preencha os campos:
   ```
   docker compose exec backend python manage.py createsuperuser
   ```

Ao criar o superuser, faça o login em `http://localhost:3000/login`. Você pode criar novos produtos e categorias na página admin (clique no icone de user na navbar, e entre em admin page).


