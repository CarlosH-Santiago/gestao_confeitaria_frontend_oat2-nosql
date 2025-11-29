# Documentação da API — Gestão de Confeitaria

Base URL padrão: `http://localhost:3000/api`

## Autenticação
- Não há autenticação configurada nas rotas atuais.

## Convenções
- Todas as respostas são JSON.
- Datas aceitas: ISO (`YYYY-MM-DD` ou `YYYY-MM-DDTHH:mm:ssZ`) ou timestamp.
- IDs são `ObjectId` do MongoDB.

---

## Catálogo
Endpoint base: `/catalogo`

- GET `/catalogo`
  - Descrição: Lista itens do catálogo.
  - Query: `page` (opcional), `limit` (opcional)
  - Resposta 200: `[{ _id, nome, categoria, precoVenda, ... }]`

- GET `/catalogo/:id`
  - Descrição: Busca item por ID.
  - Params: `id`
  - Resposta 200: `{ _id, nome, categoria, precoVenda, ... }`
  - Resposta 404: `{ error }`

- POST `/catalogo`
  - Descrição: Cria item no catálogo.
  - Body: `{ nome, categoria, precoVenda, custoProducao, ... }`
  - Resposta 201: `{ _id, ... }`

- PUT `/catalogo/:id`
  - Descrição: Atualiza item inteiro.
  - Params: `id`
  - Body: campos do item
  - Resposta 200: `{ _id, ... }`

- DELETE `/catalogo/:id`
  - Descrição: Remove item do catálogo.
  - Params: `id`
  - Resposta 200: `{ success: true }`

---

## Insumos
Endpoint base: `/insumos`

- GET `/insumos`
  - Descrição: Lista insumos.
  - Resposta 200: `[{ _id, nome, unidade, estoque, ... }]`

- GET `/insumos/:id`
  - Descrição: Busca insumo por ID.
  - Params: `id`
  - Resposta 200: `{ _id, nome, unidade, estoque, ... }`

- POST `/insumos`
  - Descrição: Cria novo insumo.
  - Body: `{ nome, unidade, estoqueInicial, ... }`
  - Resposta 201: `{ _id, ... }`

- PUT `/insumos/:id`
  - Descrição: Atualiza insumo por ID.
  - Params: `id`
  - Body: campos do insumo
  - Resposta 200: `{ _id, ... }`

- PATCH `/insumos/:id/estoque`
  - Descrição: Atualiza apenas o estoque do insumo.
  - Params: `id`
  - Body: `{ quantidade: number }` (positivo para entrada, negativo para saída)
  - Resposta 200: `{ _id, estoque }`

- DELETE `/insumos/:id`
  - Descrição: Remove insumo.
  - Params: `id`
  - Resposta 200: `{ success: true }`

---

## Encomendas (Vendas)
Endpoint base: `/encomendas`

- POST `/encomendas`
  - Descrição: Cria uma venda (encomenda).
  - Body exemplo:
    ```json
    {
      "cliente": { "nome": "Maria" },
      "itens": [
        { "produto": "<produtoId>", "quantidade": 2, "precoUnitarioSnapshot": 25.9 }
      ],
      "valorTotal": 51.8
    }
    ```
  - Resposta 201: `{ _id, status, itens, valorTotal, createdAt }`

- GET `/encomendas`
  - Descrição: Lista vendas.
  - Query: `page`, `limit`, `status`
  - Resposta 200: `[{ _id, status, valorTotal, createdAt, ... }]`

- PUT `/encomendas/:id/status`
  - Descrição: Atualiza status da venda (avança o pedido).
  - Params: `id`
  - Body: `{ status: "NOVO_STATUS" }`
  - Resposta 200: `{ _id, status }`

---

## Balanço
Endpoint base: `/balanco`

- GET `/balanco`
  - Descrição: Retorna dados para o dashboard.
  - Resposta 200: `{ receitaTotal, pedidosHoje, topProdutos, ... }`

---

## Relatórios
Endpoint base: `/relatorios`

- GET `/relatorios/gerar`
  - Descrição: Gera relatório via query params.
  - Query obrigatória:
    - `tipo`: `vendas` | `produtos` | `estoque`
    - `inicio`: data inicial
    - `fim`: data final
  - Query opcional:
    - `salvar`: `true` | `false` (default `false`) — salva histórico se modelo estiver habilitado
  - Exemplo:
    `GET http://localhost:3000/api/relatorios/gerar?tipo=vendas&inicio=2024-01-01&fim=2024-12-31&salvar=true`
  - Respostas:
    - 200 (tipo `vendas`):
      ```json
      {
        "periodo": { "dataInicio": "2024-01-01", "dataFim": "2024-12-31" },
        "tipo": "vendas",
        "resumoFinanceiro": { "receitaTotal": 1000, "custoProducao": 0, "lucroLiquido": 0, "margemMedia": 0 },
        "metricas": { "totalEncomendas": 20, "ticketMedio": 50 },
        "topProdutos": [
          { "produtoId": "<id>", "nome": "Bolo de Chocolate", "quantidadeVendida": 10, "receitaGerada": 250 }
        ]
      }
      ```
    - 200 (tipo `produtos`):
      ```json
      {
        "periodo": { "dataInicio": "2024-01-01", "dataFim": "2024-12-31" },
        "tipo": "produtos",
        "produtos": [
          { "produtoId": "<id>", "nome": "Bolo", "categoria": "Doces", "precoVenda": 30, "custoProducao": 18, "margemLucro": 40 }
        ],
        "totalProdutos": 12
      }
      ```
    - 200 (tipo `estoque`):
      ```json
      {
        "periodo": { "dataInicio": "2024-01-01", "dataFim": "2024-12-31" },
        "tipo": "estoque",
        "saidasPorProduto": [
          { "produtoId": "<id>", "nome": "Bolo", "quantidadeSaida": 42 }
        ],
        "movimentacoes": [
          { "tipo": "ENTRADA", "produto": "<id>", "quantidade": 5, "descricao": "Reposição" }
        ]
      }
      ```
    - 400: `{ error: "Parâmetro 'tipo' é obrigatório..." }`
    - 500: `{ error: "Erro ao gerar relatório" }`

- POST `/relatorios/gerar`
  - Descrição: Gera relatório via body.
  - Body:
    ```json
    {
      "tipo": "vendas",
      "inicio": "2024-01-01",
      "fim": "2024-12-31",
      "salvar": true
    }
    ```
  - Respostas: iguais ao GET.

---

## Erros Comuns
- 400: parâmetros obrigatórios ausentes.
- 404: recurso não encontrado (quando aplicável).
- 500: erro interno do servidor.

## Observações de Integração
- Para `tipo=vendas`, `topProdutos` pode retornar produtos removidos com nome "Produto removido".
- `salvar=true` depende do `RelatorioModel` estar configurado; caso falhe, o relatório ainda é retornado.
- Campos retornados podem variar conforme dados existentes no banco.

## Exemplos de uso com curl
```bash
# Listar catálogo
curl -s http://localhost:3000/api/catalogo

# Criar insumo
curl -s -X POST http://localhost:3000/api/insumos \
  -H 'Content-Type: application/json' \
  -d '{"nome":"Farinha","unidade":"kg","estoqueInicial":10}'

# Gerar relatório de vendas
curl -s "http://localhost:3000/api/relatorios/gerar?tipo=vendas&inicio=2024-01-01&fim=2024-12-31"
```
