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
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// --- CONFIGURAÇÃO DO EMAILJS ---
const SERVICE_ID = 'service_aehis8f'; 
const TEMPLATE_ID = 'template_uup7b7x';
const PUBLIC_KEY = 'r1OWWHF2bs-FCuTWs';
// ------------------------------

const LoginScreen = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [telaAtiva, setTelaAtiva] = useState('login');
  const [codigoGerado, setCodigoGerado] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const gerarOTP = () => {
    const novoCodigo = Math.floor(100000 + Math.random() * 900000).toString();
    setCodigoGerado(novoCodigo);
    console.log("CÓDIGO OTP GERADO: " + novoCodigo);
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
      if (Platform.OS === 'web') {
        window.alert(`Código enviado para ${email}`);
      } else {
        Alert.alert('Código Enviado', `Um código de 6 dígitos foi enviado para ${email}.`);
      }
    })
    .catch((error) => {
      console.error('Erro ao enviar e-mail:', error.message);
      let alertMessage = 'Não foi possível enviar o código.';
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
      onLoginSuccess();
      setTelaAtiva('login');
      setEmail('');
      setOtpCode('');
    } else {
      Alert.alert('Erro', 'Código OTP inválido. Tente novamente.');
      setOtpCode('');
    }
  };

  // Conteúdo da Tela de Login
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
          colors={isLoading ? ['#999', '#777'] : ['#6A0DAD', '#B200ED']}
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

  // Conteúdo da Tela de OTP
  const renderOTPTela = () => (
    <View style={styles.card}>
      <Text style={styles.title}>Verificação</Text>
      <Text style={styles.subtitle}>
        Digite o código enviado para: 
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
      colors={['#1a1f38', '#0f1220']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          contentContainerStyle={styles.scrollViewContent} 
          showsVerticalScrollIndicator={false}
        >
          {telaAtiva === 'login' ? renderLoginTela() : renderOTPTela()}
        </ScrollView>
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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  card: {
    width: '90%',
    maxWidth: 400, 
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 25,
    padding: 30,
    alignItems: 'center',
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
    color: '#E0BBE4',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#BBF0F3',
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
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 15,
    paddingHorizontal: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    fontSize: 17,
    color: '#fff',
    ...Platform.select({
      web: { outlineStyle: 'none' }
    })
  },
  otpInput: {
    width: '85%',
    height: 65,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 15,
    // paddingHorizontal removido para não brigar com o textAlign
    marginBottom: 25,
    borderWidth: 2,
    borderColor: '#B200ED',
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
    
    // --- LÓGICA DE CENTRALIZAÇÃO ---
    textAlign: 'center',
    letterSpacing: 12, 
    // TRUQUE: Adiciona padding na esquerda igual ao letterSpacing
    // para compensar o espaço vazio que o letterSpacing cria na direita.
    paddingLeft: 12,
    
    ...Platform.select({
      web: { outlineStyle: 'none' }
    })
  },
  buttonContainer: {
    width: '100%',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 6,
  },
  button: {
    width: '100%',
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      web: { cursor: 'pointer' }
    })
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  reenviarText: {
    color: '#BBF0F3',
    fontSize: 15,
    textDecorationLine: 'underline',
    marginTop: 10,
    ...Platform.select({
      web: { cursor: 'pointer' }
    })
  },
  voltarText: {
    color: '#888',
    fontSize: 14,
    marginTop: 15,
    ...Platform.select({
      web: { cursor: 'pointer' }
    })
  }
});

export default LoginScreen;
