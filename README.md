# Creatus Hub - Sistema de Gerenciamento de Produtos

Sistema web desenvolvido com Vue 3 + TypeScript que permite aos usuários cadastrar, listar e gerenciar produtos de forma eficiente, com autenticação de usuários e interface responsiva.

## Funcionalidades

### Autenticação
- Registro de novos usuários com nome, email e senha
- Login com email e senha
- Logout seguro

### Gestão de Produtos
- Cadastro de produtos com validações:
  - Nome com máximo de 50 caracteres
  - Descrição com máximo de 200 caracteres
  - Valor positivo obrigatório
  - Data de validade futura
  - Upload e renomeação de imagens
  - Categorização dos produtos
- Listagem de produtos cadastrados

### Interface
- Design responsivo para desktop e mobile
- Sidebar com navegação intuitiva
- Menu de produtos organizado em dropdown
- Feedback visual para interações do usuário

## Stack Tecnológica
- Vue.js 3 com Composition API
- TypeScript para tipagem estática
- Vue Router para navegação
- Tailwind CSS para estilização
- Vite como bundler

## Configuração do Projeto

```sh
npm install
npm run dev
```