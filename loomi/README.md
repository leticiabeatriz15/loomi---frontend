# 📱 Loomi - App Mobile com Expo

Aplicativo mobile para gerenciar sua estante virtual de livros, desenvolvido com Expo e React Native, com integração completa ao backend.

## 🚀 Como Executar

### 1. Instalar Dependências

```bash
cd loomi-app
npm install
```

### 2. Configurar Conexão com o Backend

Edite o arquivo `services/api.ts` e configure o IP do seu backend:

```typescript
// Para emulador Android (padrão)
const API_BASE_URL = 'http://10.0.2.2:8080';

// Para iOS Simulator
// const API_BASE_URL = 'http://localhost:8080';

// Para dispositivo físico (use o IP da sua máquina)
// const API_BASE_URL = 'http://192.168.1.100:8080';
```

**Como descobrir o IP da sua máquina:**
- **Windows**: Abra o CMD e digite `ipconfig`, procure por "IPv4"
- **Linux/Mac**: Abra o terminal e digite `ifconfig` ou `ip addr`

### 3. Iniciar o Backend

Certifique-se de que o backend Java está rodando na porta 8080:

```bash
# No diretório do backend
./mvnw spring-boot:run
```

### 4. Iniciar o App

```bash
npm start
```

Depois escolha uma das opções:
- Pressione `a` para Android
- Pressione `i` para iOS (apenas no Mac)
- Pressione `w` para Web
- Escaneie o QR Code com o app Expo Go no seu celular

## 📱 Funcionalidades

### ✅ Autenticação
- **Login** com usuário e senha
- **Cadastro** de novos usuários
- **Logout** seguro
- Persistência de sessão com AsyncStorage

### 📚 Gestão de Livros
- **Listar** todos os livros da sua estante
- **Adicionar** novos livros (ISBN, título, status)
- **Remover** livros
- **Buscar** por título ou ISBN
- **Filtrar** por status (Lendo, Lido, Quero Ler)
- **Atualizar** progresso de leitura

### 🎨 Interface
- Design moderno com tema dark
- Estatísticas da estante
- Refresh para atualizar dados
- Feedback visual em todas as ações
- Ícones com Lucide React Native

## 🔧 Tecnologias Utilizadas

- **Expo** - Framework React Native
- **Expo Router** - Navegação file-based
- **TypeScript** - Tipagem estática
- **Axios** - Requisições HTTP
- **AsyncStorage** - Armazenamento local
- **Lucide React Native** - Ícones

## 📂 Estrutura do Projeto

```
loomi-app/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx          # Estante de livros
│   │   ├── profile.tsx        # Perfil do usuário
│   │   └── _layout.tsx        # Layout das tabs
│   ├── add-book.tsx           # Adicionar livro
│   ├── login.tsx              # Tela de login
│   ├── register.tsx           # Tela de cadastro
│   ├── index.tsx              # Rota inicial
│   └── _layout.tsx            # Layout raiz
├── contexts/
│   └── AuthContext.tsx        # Contexto de autenticação
├── services/
│   └── api.ts                 # Serviços de API
└── package.json
```

## 🐛 Troubleshooting

### Erro de Conexão

Se você receber erro "ERR_NETWORK" ou "Timeout":

1. **Verifique se o backend está rodando:**
   ```bash
   curl http://localhost:8080/livro
   ```

2. **Para Android Emulator:** Use `10.0.2.2` ao invés de `localhost`

3. **Para dispositivo físico:** Use o IP da sua máquina na mesma rede Wi-Fi

4. **Firewall:** Certifique-se que a porta 8080 está aberta

### Erro de Dependências

```bash
rm -rf node_modules package-lock.json
npm install
```

### Limpar Cache do Expo

```bash
npm start -- --clear
```

## 📝 Endpoints da API

O app consome os seguintes endpoints do backend:

### Autenticação
- `POST /auth/login` - Fazer login
- `POST /usuario` - Criar novo usuário

### Livros
- `GET /livro` - Listar todos os livros
- `POST /livro` - Criar novo livro
- `DELETE /livro/{id}` - Deletar livro

## 🎯 Próximos Passos

- [ ] Edição de livros
- [ ] Upload de capas
- [ ] Compartilhamento de estantes
- [ ] Estatísticas de leitura
- [ ] Notificações push

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais.

---

**Desenvolvido com ❤️ por Christian David, Emanuelle de Carvalho e Letícia Beatriz**
