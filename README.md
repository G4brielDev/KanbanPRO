# KANBAN PRO

KANBAN PRO é um board pessoal de organização de tarefas construído com HTML, CSS e JavaScript puro. O projeto prioriza persistência local robusta, acessibilidade e uma experiência premium.

## Funcionalidades do MVP

- Board Kanban com colunas padrão
- CRUD de tarefas
- Drag and drop entre colunas
- Persistência local via IndexedDB com fallback para LocalStorage
- Dark/Light mode
- Busca, exportação/importação JSON/CSV e calendário básico

## Estrutura

- css/: estilos por responsabilidade
- js/: módulos de domínio e UI
- helpers/: utilidades pequenas
- data/: exemplos de payloads

## Executar localmente

1. Abra a pasta do projeto em um servidor estático.
2. Se preferir, use Python:
   - `python -m http.server 8000`
3. Acesse http://localhost:8000

## Publicar no GitHub

1. Crie um repositório.
2. Envie os arquivos com `git init`, `git add .`, `git commit -m "Initial commit"` e `git push`.

## Publicar no Netlify

1. Conecte o repositório no Netlify.
2. Defina o diretório de publicação como a raiz do projeto.
3. A publicação será tratada como um site estático.

## Futuro backend

A camada de persistência pode ser substituída por uma API REST. A interface esperada é `get`, `set`, `remove` e `clear`.
