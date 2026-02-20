# Maison Senna

Um conceito de uma loja luxuosa e elegante que recebe pessoas de alta classe, que procuram itens de alta produção.

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

Ao criar o superuser, você estará logado automaticamente. Você pode criar novos produtos e categorias na página admin (clique no icone de user na navbar, e entre em admin page).
