# Guia de Inicialização do Projeto

## Pré-requisitos

- Docker e Docker Compose instalados
- Go instalado

## Inicialização do Projeto

### 1. Configurar Variáveis de Ambiente

```bash
cp .env.sample .env
```

Copie o arquivo de exemplo e ajuste as variáveis conforme necessário

### 2. Subir os Containers

```bash
docker compose up -d
```

Este comando inicializa todos os serviços definidos no docker-compose.yml

### 3. Construir a Aplicação

```bash
make docker-build
```

Constrói a imagem Docker do projeto com o nome `globo-challenge:1.0.0`

### 4. Aplicar Migrações

```bash
make migrate-up
```

Aplica todas as migrações necessárias no banco de dados

### 5. Popular o Banco de Dados (Seed)

```bash
make seed
```

## Comandos Adicionais

### Gerenciamento do Banco de Dados

#### Acessar o PostgreSQL

```bash
make psql
```

#### Outros Comandos de Migração

- Criar nova migração: `make migrate name=nome_da_migracao`
- Reverter migrações: `make migrate-down`
- Aplicar próxima migração: `make migrate-next`
- Reverter última migração: `make migrate-previous`

### Logs e Desenvolvimento

```bash
make air-logs
```

Exibe os logs do container Air (hot-reload)

### Executar o Servidor Localmente

```bash
make run
```
