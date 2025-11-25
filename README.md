📱 App de Notícias & Login OTP (Expo)

Um aplicativo moderno e multiplataforma desenvolvido com React Native (Expo). Este projeto demonstra um fluxo completo de autenticação via código OTP (One-Time Password) integrado a serviços de e-mail reais e uma interface de consumo de notícias em tempo real.

O diferencial deste projeto é a sua estética Glassmorphism (efeito de vidro) e a compatibilidade total com Android, iOS e Web.

📸 Funcionalidades

🔐 Autenticação e Segurança

Login via OTP: Geração lógica de códigos de 6 dígitos.

Envio Real de E-mail: Integração com a API REST do EmailJS para enviar o código ao usuário.

Validação: Verificação de segurança para garantir que o código digitado corresponde ao enviado.

📰 Feed de Notícias

Consumo de API: Integração com GNews API para buscar as últimas manchetes do Brasil.

Suporte Web (CORS): Implementação de Proxy reverso para contornar bloqueios de CORS em navegadores, garantindo funcionamento na Web.

Navegação Externa: Links diretos para ler as notícias completas.

🎨 UI/UX (Interface)

Glassmorphism: Uso de gradientes lineares, transparências e sombras para criar profundidade e visual moderno.

Responsividade:

Layout adaptável para dispositivos móveis.

Limitação de largura (maxWidth) para visualização elegante em Desktops/Web.

Feedback Visual: Indicadores de carregamento (ActivityIndicator) e alertas nativos/web.

🛠 Tecnologias Utilizadas

React Native - Framework principal.

Expo - Plataforma de desenvolvimento.

Expo Linear Gradient - Para os fundos e botões gradientes.

EmailJS - Serviço de envio de e-mails transacionais (via API REST).

GNews API - Fonte de dados das notícias.

📦 Pré-requisitos

Para rodar este projeto localmente, você precisará de:

Node.js (Versão LTS v20 ou superior recomendada).

Git.

Aplicativo Expo Go instalado no celular (para testes físicos).

🚀 Como Rodar o Projeto

1. Clone o repositório

git clone [https://github.com/SEU_USUARIO/NOME_DO_REPO.git](https://github.com/SEU_USUARIO/NOME_DO_REPO.git)
cd NOME_DO_REPO


2. Instale as dependências

npm install
# Ou, se preferir usar o comando do expo:
npx expo install


3. Configuração das Chaves de API 🔑

Por segurança, as chaves de API não estão incluídas no repositório. Você deve configurar as suas:

Passo A: EmailJS (Login)

Crie uma conta no EmailJS.

Habilite a opção "Allow EmailJS API for non-browser applications" nas configurações de segurança da sua conta.

No arquivo src/LoginScreen.js, substitua as variáveis:

const SERVICE_ID = 'SEU_SERVICE_ID';
const TEMPLATE_ID = 'SEU_TEMPLATE_ID';
const PUBLIC_KEY = 'SUA_PUBLIC_KEY';


Passo B: GNews (Notícias)

Obtenha uma chave gratuita no GNews.io.

No arquivo src/NewsScreen.js, substitua a variável:

const GNEWS_API_KEY = 'SUA_API_KEY_GNEWS';


4. Inicie o App

npx expo start


Para Celular: Escaneie o QR Code com o app Expo Go.

Para Web: Pressione a tecla w no terminal.

📂 Estrutura do Projeto

/
├── App.js              # Controlador principal (Gerencia se mostra Login ou Notícias)
├── metro.config.js     # Configuração para compatibilidade Web (Polyfill Node v20)
├── src/
│   ├── LoginScreen.js  # Tela de Login, OTP e integração EmailJS
│   └── NewsScreen.js   # Tela de lista de notícias e integração GNews
├── assets/             # Imagens e ícones
└── app.json            # Configurações do Expo


📄 Licença

Este projeto é de livre uso para fins de estudo e portfólio.