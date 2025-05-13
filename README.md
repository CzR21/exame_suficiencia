# 📋 Sistema de Controle de Feedback

Este projeto é um sistema simples de controle de feedback desenvolvido em **Node.js com TypeScript** e banco de dados **PostgreSQL**, sem uso de frameworks. O objetivo é coletar sugestões, bugs ou reclamações dos usuários, permitindo o gerenciamento básico via painel protegido por autenticação.

## 🚀 Tecnologias Utilizadas

- Node.js
- TypeScript
- PostgreSQL
- pgAdmin (opcional, para gerenciamento do banco)
- npm (gerenciador de pacotes)
- Mecanismo de rotas customizado (sem frameworks)

## ✅ Pré-requisitos

Antes de rodar o projeto, certifique-se de que os seguintes requisitos estejam instalados e configurados no seu ambiente:

### 🐘 PostgreSQL + pgAdmin

- Instale o [PostgreSQL](https://www.postgresql.org/download/) (recomenda-se versão 12 ou superior)
- Configure a senha para o usuário `postgres`
- Utilize o [pgAdmin](https://www.pgadmin.org/) para gerenciamento visual do banco de dados
- Crie um banco de dados chamado `feedbackdb`
- Utilize o script SQL fornecido abaixo para criar a tabela necessária

### 🟢 Node.js + npm

- Instale o [Node.js](https://nodejs.org/) (versão 18.x ou superior recomendada)
- O `npm` (Node Package Manager) será instalado automaticamente com o Node

### 🟦 TypeScript

- Após instalar o Node, instale o TypeScript globalmente:

```
npm install -g typescript
```

- Instale também o `ts-node` para rodar arquivos TypeScript diretamente:

```
npm install -g ts-node
```


### 📦 Clonar o projeto

Para clone o repositório, execute:

```
https://github.com/CzR21/exame_suficiencia.git
```

Após clonado, navegue para a pasta da a aplicação:

```
cd exame_suficiencia
```


### 🔧 Configurar arquivo `.env`

Antes de rodar a aplicação, altere o arquivo `.env` para que ele aponte para o banco de dados na sua máquina local. 

Abra o arquivo `.env` e configure as variáveis de ambiente para o banco de dados PostgreSQL com os seguintes valores:

### 📦 Instalar dependências do projeto

Clone o repositório e, dentro da pasta do projeto, execute:

```
npm install
```

Para rodar a aplicação:

```
npm start
```


## 🔐 Autenticação

- A única rota pública é `/`, onde está o formulário de feedback.
- As demais rotas são protegidas por autenticação simples (usuário: `admin`, senha: `123456`).
- Caso não esteja autenticado, será exibido um formulário de login.

## 📦 Funcionalidades e Rotas

| Rota                  | Método | Descrição |
|-----------------------|--------|-----------|
| `/`                   | GET    | Exibe formulário de envio de feedback |
| `/feedbacks`          | GET    | Lista todos os feedbacks (autenticado) |
| `/feedbacks/{id}`     | GET    | Exibe detalhes de um feedback (autenticado) |
| `/feedback/cadastrar` | POST   | Cadastra novo feedback |
| `/feedback/atualizar` | PUT    | Atualiza status de um feedback (autenticado) |

## 🧾 Modelo da Tabela (SQL)

```sql
    CREATE TABLE IF NOT EXISTS feedbacks (
        id SERIAL PRIMARY KEY,
        titulo TEXT NOT NULL,
        descricao TEXT NOT NULL,
        tipo TEXT CHECK (tipo IN ('bug', 'sugestão', 'reclamação', 'feedback')) NOT NULL,
        status TEXT CHECK (status IN ('recebido', 'em análise', 'em desenvolvimento', 'finalizado')) NOT NULL DEFAULT 'recebido',
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
```

## 📝 Observações

- A interface é simples e funcional, com foco em usabilidade básica.
- O sistema segue o padrão MVC e foi desenvolvido sem uso de frameworks.