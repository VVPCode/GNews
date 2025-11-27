
---

# 📱 GNews Reader & OTP Auth (Expo)

Um aplicativo **multiplataforma** (Android, iOS e Web) que combina **autenticação segura via OTP** com um **leitor de notícias moderno**.
Este projeto demonstra um fluxo completo de autenticação (Login → E-mail OTP → Acesso) e consumo de API de Notícias, com design *glassmorphism* e compatibilidade total com navegadores e dispositivos móveis.

---

## 📸 Funcionalidades

### 🔐 Autenticação & Segurança

* [x] Login via OTP com geração de código de 6 dígitos.
* [x] Envio real de e-mail usando **EmailJS**.
* [x] Validação segura entre código gerado e digitado.
* [x] Feedback visual com loaders e mensagens de erro/sucesso.

### 📰 Feed de Notícias

* [x] Consumo da **GNews API** para notícias em tempo real.
* [x] Filtros por categoria (Tecnologia, Esportes, Negócios, Saúde…).
* [x] Campo de busca com palavras-chave.
* [x] Sistema de favoritos salvo localmente.
* [x] Web Proxy configurado para evitar erros de CORS no navegador.

### 🎨 UI/UX (Interface)

* [x] Design moderno utilizando **LinearGradient** e glassmorphism.
* [x] Layout 100% responsivo para Web, Android e iOS.

---

## 🛠 Tecnologias Utilizadas

* **React Native**
* **Expo**
* **Expo Linear Gradient**
* **EmailJS**
* **GNews API**
* **EAS (Expo Application Services)**

---

## 📦 Instalação e Configuração

### 🔧 1. Clonar e instalar dependências

```bash
git clone https://github.com/SEU_USUARIO/NOME_DO_REPO.git
cd NOME_DO_REPO

npm install
```

### 🔧 2. Dependências críticas (Web e UI)

Execute:

```bash
npm install @emailjs/browser

npx npx expo install react-native-web react-dom @expo/metro-runtime

### 🔑 3. Configurar Chaves de API (Obrigatório)

| Serviço | Arquivo              | Variáveis                           |
| ------- | -------------------- | ----------------------------------- |
| EmailJS | `src/Login.js` | SERVICE_ID, TEMPLATE_ID, PUBLIC_KEY, API_PUBLIC_KEY |
| GNews   | `src/News.js`  | GNEWS_API_KEY                       |

---

## ▶️ Como Rodar (Ambiente de Desenvolvimento)

Inicie o servidor:

```bash
npx expo start
```

**Opções de execução:**

* 📱 **Celular**: usar app Expo Go e escanear o QR Code.
* 💻 **Web**: Pressione `w` no terminal.
* 🤖 **Android Emulator**: Pressione `a`.
* 🍎 **iOS Emulator**: Pressione `i`.

---

## 📲 Guia para Gerar APK (Android)

### 🔧 1. Instalar EAS CLI

```bash
npm install -g eas-cli
eas login
```

### 🔧 2. Configurar Build

Se ainda não configurou:

```bash
eas build:configure
```

Substitua o conteúdo de **eas.json** por:

```json
{
  "cli": { "version": ">= 7.0.0" },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  },
  "submit": { "production": {} }
}
```

### 🔧 3. Gerar o APK

```bash
eas build -p android --profile preview
```

Após concluir, o terminal exibirá um link para baixar o arquivo APK.

---

## ❓ Problemas Comuns

* 🌐 **"Network request failed"** → rede bloqueada, proxy, VPN ou firewall.
* 📱 **APK avisando segurança** → ocorre por não ser assinado pela Play Store.
* 🖼️ **Ícones antigos/mudanças não aparecem** → limpar cache:
  `expo start -c`

---

## 📂 Estrutura do Projeto

```
/
├── assets/              # Ícones e imagens
├── src/
│   ├── LoginScreen.js   # Autenticação e envio de OTP
│   └── NewsScreen.js    # Feed de notícias e favoritos
├── App.js               # Navegação principal
├── app.json             # Configurações do Expo
├── eas.json             # Configuração de build para APK
└── README.md            # Documentação
```

---

## 📄 Licença

Este projeto é de livre uso para fins **educacionais** e de **portfólio**.
Licença **MIT**.

---