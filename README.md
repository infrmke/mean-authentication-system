# Full-Stack Auth System (Angular Evolution)

Uma aplicação de autenticação desenvolvida com a stack **MEAN** (MongoDB, Express.js, Angular e Node.js), focada em segurança, reatividade e arquitetura escalável.

## Visão Geral Técnica

O projeto implementa um sistema completo de autenticação e autorização que possui foco em estabelecer fluxos seguros de autenticação e gestão de usuários.

- **Front-end**: Angular 21.1;
- **Back-end**: Classes Singleton e funções modulares;
- **E-mail Service**: SMTP via Brevo para notificações transacionais;
- **Database**: MongoDB Atlas com indexação TTL para expiração automática de tokens OTP.

## Arquitetura e Padrões de Design

O projeto é **híbrido**, tendo classes (Singleton) para camadas que mantêm responsabilidades fixas (Controllers/Services/Repositories) e também tendo funções modulares para lógica auxiliar.

- **Monólito Modular**: Back-end organizado em módulos desacoplados, facilitando a manutenção;
- **Controller-Service-Repository**:
  - _Controllers_: Responsáveis pelo roteamento e parsing das requisições;
  - _Services_: Camada de lógica de negócio, permitindo interação Service-to-Service (S2S);
  - _Repositories_: Abstração da camada de dados (Mongoose), centralizando as queries ao MongoDB;
- **Global Error Handling**: Middleware centralizado para tratamento de erros, garantindo respostas padronizadas em toda a API;
- **Middleware-Chain**: Uso intensivo de camadas para sanitização de dados, proteção de rotas JWT (JSON Web Token) e controle de fluxo.

## Tech Stack e Bibliotecas

**Back-end**

- **Core**: Node.js & Express.js;
- **Database**: MongoDB (via mongoose);
- **Security**:
  - _bcrypt_: Hashing e validação de senhas;
  - _jsonwebtoken_: Autenticação Stateless;
  - _express-rate-limit_: Limites para navegação normal e proteção contra ataques brute force;
  - _express-validator_: Validação de inputs.
- **Communication**: `nodemailer` para integração SMTP;
- **Utils**: `cookie-parser` para manipulação de cookies (HttpOnly) e `cors` para a segurança do navegador.

**Front-end**

- **Core**: Angular (v19+);
- **Reatividade**: Signals & Observables (RxJS)
- **Forms**: Reactive Forms para validações detalhadas;
- **Dependency Injection**: Uso extensivo da função `inject()` em vez de constructors;
- **Security**: Guards de rota para gestão de navegação;
- **Styling e UI/UX**: SASS (SCSS) como pré-processador de estilos e `lucide-angular` para ícones;
- **Client**: `HttpClient` nativo (substituindo o Axios).

## Funcionalidades

- **Segmento de autenticação**: Cadastro, login e exclusão de conta;
- **OTP**: Verificação de e-mail e recuperação de senha por meio de códigos One-Time Password;
- **Security-First**:
  - Tokens JWT armazenados em cookies `HttpOnly` e `secure`;
  - Expiração customizada de tokens e expiração automática no banco de dados (MongoDB TTL).
- **RESTful API**:
  - Paginação via limit e offset;
  - Endpoints semânticos;
  - Sanitização de inputs.

## Como rodar o projeto

Os pré-requisitos são os seguintes:

- Node.js (18 ou superior);
- npm ou yarn;
- Uma conta no MongoDB Atlas (ou MongoDB instalado localmente);
- Uma conta na Brevo (para envio de e-mails).

**Back-end**

1. Clone o repositório:

```bash
    git clone https://github.com/seu-usuario/seu-repositorio.git
    cd seu-repositorio
```

2. Navegue até a pasta do servidor e instale as dependências:

```bash
    npm install
    cd backend
```

3. Crie um arquivo .env na raiz da pasta _backend_ e preencha com as variáveis listadas na seção "Variáveis de Ambiente".

4. Inicie o servidor em modo de desenvolvimento:

```bash
    npm run dev
```

---

**Front-end**

1. Abra um novo terminal, navegue até a pasta do cliente e instale as dependências.

```bash
    cd frontend
    npm install
```

2. O Angular utiliza o diretório `src/environments/` para configurações de API. Realiza as alterações necessárias e então inicie a aplicação:

```bash
    npm run start
```

---

**Full-stack**

Para agilizar um pouco, o projeto utiliza a biblioteca `concurrently`, que permite rodar o servidor e o cliente simultaneamente com um único comando a partir da raiz do projeto.

1. Na _raiz_ do projeto, instale as dependências (o concurrently):

```bash
    npm install
```

2. Execute o comando abaixo para subir o backend e o frontend de uma só vez:

```bash
    npm run dev
```

**Atenção**: certifique-se de que todas as variáveis de ambiente foram configuradas corretamente antes de iniciar!

## Variáveis de Ambiente

Para rodar o projeto, você vai precisar adicionar as seguintes variáveis de ambiente no ".env" do seu back-end:

- `NODE_ENV`
- `SERVER_PORT`
- `CLIENT_PORT`
- `MONGODB_URI`
- `DB_NAME`
- `JWT_ACCESS_SECRET`
- `JWT_RESET_SECRET`
- `SMTP_MAILER`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PWD`

## Planos Futuros

- [ ] **Recuperação de Senha**: Criar o fluxo de redefinição de senha;
- [ ] **Feedback Visual**: Implementar o uso de notificações "toast" com `ngx-toastr` ou o `hot-toast`.

## Créditos

A inspiração inicial para o começo do projeto foi o Youtuber [GreatStack](https://www.youtube.com/@GreatStackDev), por meio do seu próprio projeto de autenticação MERN.

Com essa base, tive a oportunidade de reestruturar o projeto original como um todo e me desafiar a aprimorá-lo.

No final de tudo isso, eu aprendi a...

- Implementar o padrão Controller-Service-Repository;
- Como garantir segurança em um API com autenticação, cors, rate limiting e input validation;
- Construir e-mails XHTML e gerenciar fluxos de e-mail automatizados; e
- Utilizar índices compostos no MongoDB.
