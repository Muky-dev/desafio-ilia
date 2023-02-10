# Desafio Ília | Controle de ponto | 2023

![node-current](https://img.shields.io/node/v/latest)

O projeto utiliza NestJS 9, Prisma, Sqlite, e Docker.

O Sqlite foi utilizado para facilitar a execução do projeto, mas poderia ser utilizado qualquer outro banco de dados.

## 1. Começando

### 1.1 Pré-requisitos

Tenha instalado em sua máquina:

- [Node v18.14](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

Recomendo o uso do [NVM](https://github.com/nvm-sh/nvm) para gerenciar as versões do Node.

### 1.2 Configuração

```bash
# Comece clonando o repositório:
$ git clone https://github.com/Muky-dev/desafio-ilia

# Entre no diretório do projeto:
$ cd desafio-ilia

# Copie o arquivo .env.example para .env
$ cp .env.example .env
```

### 1.3 Instalação

```bash
# Instale as dependências
$ yarn install

# Rode as migrations
$ yarn migrate

# Inicie o servidor
$ yarn start:dev
```

Caso haja algum problema para rodar o projeto (ou se preferir mesmo), sugiro utilizar o docker-compose.

```bash
# Inicie o docker-compose
$ docker-compose up
```

O servidor iniciará na porta:3000 - acesse <http://localhost:3000>
A documentação da API estará disponível em <http://localhost:3000/swagger>

## 2. Testes

Certifique-se der ter instalado as dependências antes de executar os testes.

```bash
# Execute os testes
$ yarn test

# Execute os testes com coverage
$ yarn test:cov
```

Feito com ♥
