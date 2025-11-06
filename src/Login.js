import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  Platform,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';


// --- CONFIGURAÇÃO DO EMAILJS ---
const SERVICE_ID = 'service_4o879cp';
const TEMPLATE_ID = 'template_uup7b7x';
const PUBLIC_KEY = 'r1OWWHF2bs-FCuTWs';
// ------------------------------

// MODIFICAÇÃO: Recebemos 'onLoginSuccess' como prop
const LoginScreen = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [telaAtiva, setTelaAtiva] = useState('login');
  const [codigoGerado, setCodigoGerado] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const gerarOTP = () => {
    const novoCodigo = Math.floor(100000 + Math.random() * 900000).toString();
    setCodigoGerado(novoCodigo);
    console.log("CÓDIGO OTP GERADO (simulação): " + novoCodigo);
    return novoCodigo;
  };

  const handleEnviarCodigo = () => {
    if (!email || !email.includes('@')) {
      Alert.alert('Erro', 'Por favor, digite um e-mail válido.');
      return;
    }

    setIsLoading(true);
    const codigo = gerarOTP();
    const templateParams = {
      to_email: email,
      codigo: codigo,
    };

    const data = {
      service_id: SERVICE_ID,
      template_id: TEMPLATE_ID,
      user_id: PUBLIC_KEY,
      template_params: templateParams
    };

    fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(async (response) => {
      if (response.ok) {
        return response.text();
      }
      const errorText = await response.text();
      console.error("Erro da API EmailJS:", errorText);
      throw new Error(`Falha na requisição: ${response.status} - ${errorText}`);
    })
    .then((responseText) => {
      console.log('E-mail enviado com sucesso!', responseText);
      setTelaAtiva('otp');
      Alert.alert(
        'Código Enviado',
        `Um código de 6 dígitos foi enviado para ${email}.`
      );
    })
    .catch((error) => {
      console.error('Erro ao enviar e-mail:', error.message);
      let alertMessage = 'Não foi possível enviar o código. Verifique suas credenciais EmailJS e a conexão.';
      const errorMessage = error.message || '';
      if (errorMessage.includes("The user_id is required")) {
          alertMessage = 'Erro: A Public Key (user_id) do EmailJS está faltando ou é inválida.';
      } else if (errorMessage.includes("The service_id is required")) {
          alertMessage = 'Erro: O Service ID do EmailJS está faltando ou é inválido.';
      } else if (errorMessage.includes("The template_id is required")) {
          alertMessage = 'Erro: O Template ID do EmailJS está faltando ou é inválido.';
      } else if (errorMessage.includes("Network request failed")) {
          alertMessage = 'Erro de rede. Verifique sua conexão com a internet.';
      } else if (errorMessage.includes("401")) { // Possível erro de autorização se a API não estiver permitida
          alertMessage = 'Erro de autorização. Verifique se "Allow EmailJS API for non-browser applications" está marcado nas configurações de segurança do EmailJS.';
      }
      Alert.alert('Erro no Envio', alertMessage);
    })
    .finally(() => {
      setIsLoading(false);
    });
  };

  const handleVerificarCodigo = () => {
    if (otpCode.length !== 6) {
      Alert.alert('Erro', 'O código deve ter 6 dígitos.');
      return;
    }

    if (otpCode === codigoGerado) {
      // MODIFICAÇÃO: Em vez de um alerta, chamamos a função
      // Alert.alert('Sucesso!', 'Login realizado com sucesso! Bem-vindo(a)!');
      onLoginSuccess(); // <-- ISSO NOS LOGA NO APP
      
      // Limpamos os campos (opcional, mas bom)
      setTelaAtiva('login');
      setEmail('');
      setOtpCode('');
    } else {
      Alert.alert('Erro', 'Código OTP inválido. Tente novamente.');
      setOtpCode('');
    }
  };

  const renderLoginTela = () => (
    <View style={styles.card}>
      <Text style={styles.title}>Acesse sua Conta</Text>
      <Text style={styles.subtitle}>Informe seu e-mail para receber o código de acesso.</Text>

      <TextInput
        style={styles.input}
        placeholder="Seu e-mail"
        placeholderTextColor="#999"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      
      <TouchableOpacity
        onPress={handleEnviarCodigo}
        disabled={isLoading}
        style={styles.buttonContainer}
      >
        <LinearGradient
          colors={isLoading ? ['#999', '#777'] : ['#6A0DAD', '#B200ED']} // Gradiente para o botão
          style={[styles.button, isLoading && styles.buttonDisabled]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Receber Código OTP</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const renderOTPTela = () => (
    <View style={styles.card}>
      <Text style={styles.title}>Verificação de Código</Text>
      <Text style={styles.subtitle}>
        Digite o código de 6 dígitos enviado para: 
      </Text>
      <Text style={styles.emailText}>{email}</Text>

      <TextInput
        style={styles.otpInput}
        placeholder="------"
        placeholderTextColor="#ccc"
        keyboardType="numeric"
        maxLength={6}
        value={otpCode}
        onChangeText={setOtpCode}
        textAlign='center'
      />

      <TouchableOpacity
        onPress={handleVerificarCodigo}
        style={styles.buttonContainer}
      >
        <LinearGradient
          colors={['#6A0DAD', '#B200ED']}
          style={styles.button}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.buttonText}>Verificar e Entrar</Text>
        </LinearGradient>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => handleEnviarCodigo()}>
        <Text style={styles.reenviarText}>Reenviar Código</Text>
      </TouchableOpacity>
      
       <TouchableOpacity onPress={() => setTelaAtiva('login')}>
        <Text style={styles.voltarText}>Trocar e-mail</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient
      colors={['#1a1f38', '#0f1220']} // Gradiente para o background geral
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#1a1f38" />
        {telaAtiva === 'login' ? renderLoginTela() : renderOTPTela()}
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeArea: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  card: {
    width: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.08)', // Fundo translúcido
    borderRadius: 25, // Bordas mais arredondadas
    padding: 30,
    alignItems: 'center',
    // Estilo "glassmorphic" com sombra interna/externa
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#E0BBE4', // Cor vibrante
  },
  subtitle: {
    fontSize: 16,
    color: '#BBF0F3', // Cor suave
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  emailText: {
    fontSize: 18,
    color: '#BBF0F3',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 55,
    backgroundColor: 'rgba(255, 255, 255, 0.15)', // Fundo do input translúcido
    borderRadius: 15,
    paddingHorizontal: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    fontSize: 17,
    color: '#fff', // Texto do input branco
    // Sombra interna para dar efeito de "rebaixo"
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  otpInput: {
    width: '85%',
    height: 65,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: 25,
    borderWidth: 2,
    borderColor: '#B200ED', // Cor da borda mais vibrante
    fontSize: 32,
    letterSpacing: 12,
    color: '#fff',
    fontWeight: 'bold',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonContainer: {
    width: '100%',
    borderRadius: 15,
    overflow: 'hidden', // Importante para o gradiente e borda
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  button: {
    width: '100%',
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7, // Menos opaco quando desabilitado
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.2)', // Sombra no texto
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  reenviarText: {
    color: '#BBF0F3',
    fontSize: 15,
    textDecorationLine: 'underline',
    marginTop: 10,
  },
  voltarText: {
    color: '#888',
    fontSize: 14,
    marginTop: 15,
  }
});

export default LoginScreen;