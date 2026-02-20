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

3. Rode o docker compose
   ```
   docker compose up --build -d
   ```

4. Após terminar todos os processos e estar rodando, rode as migrations:
   ```
   docker compose exec backend python manage.py migrate
   ```

5. Finalmente, para criar um superuser, rode esse comando e preencha os campos:
   ```
   docker compose exec backend python manage.py createsuperuser
   ```

O front-end estará acessível em `http://localhost:3000`. Faça o login, e aproveite o site. Você pode criar novos produtos e categorias na página admin (clique no icone de user na navbar, e entre em admin page)
