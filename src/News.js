import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Image,
  Linking,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// --- CONFIGURAÇÃO DA API DE NOTÍCIAS (GNEWS) ---
// Obtenha sua chave gratuita em https://gnews.io/
const GNEWS_API_KEY = '7a3d59a5900abad884aa0e963c80ccb0';
// ----------------------------------------------

// Componente para um item da lista de notícias
const NewsCard = ({ article }) => (
  <TouchableOpacity 
    style={styles.card} 
    onPress={() => Linking.openURL(article.url)}
  >
    {/* Imagem da notícia */}
    <Image 
      source={{ uri: article.image || 'https://placehold.co/600x400/2a2f4a/E0BBE4?text=Notícia' }} 
      style={styles.cardImage} 
    />
    <View style={styles.cardContent}>
      {/* Título da notícia */}
      <Text style={styles.cardTitle}>{article.title}</Text>
      {/* Fonte (Source) */}
      <Text style={styles.cardSource}>{article.source.name}</Text>
    </View>
  </TouchableOpacity>
);

const NewsScreen = ({ onLogout }) => {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // useEffect para buscar as notícias quando o componente carregar
  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = () => {
    // REMOVIDO o bloco if que verificava a chave
    // if (GNEWS_API_KEY === '7a3d59a5900abad884aa0e963c80ccb0') { ... }

    setIsLoading(true);
    // MODIFICADO: Garantindo que a constante GNEWS_API_KEY seja usada na URL
    const url = `https://gnews.io/api/v4/top-headlines?lang=pt&country=br&token=${GNEWS_API_KEY}`;
    
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.articles) {
          setNews(data.articles);
        } else {
          Alert.alert('Erro ao buscar notícias', data.message || 'Ocorreu um erro.');
        }
      })
      .catch(error => {
        console.error("Erro ao buscar notícias:", error);
        Alert.alert('Erro de Rede', 'Não foi possível buscar as notícias. Verifique sua conexão.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <LinearGradient
      colors={['#1a1f38', '#0f1220']} // Mesmo gradiente de fundo
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#1a1f38" />
        
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Últimas Notícias</Text>
          <TouchableOpacity onPress={onLogout}>
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        </View>

        {/* Conteúdo (Lista ou Loading) */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#E0BBE4" />
            <Text style={styles.loadingText}>Buscando notícias...</Text>
          </View>
        ) : (
          <FlatList
            data={news}
            renderItem={({ item }) => <NewsCard article={item} />}
            keyExtractor={(item) => item.url} // Usa a URL como ID único
            contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 20 }}
            onRefresh={fetchNews} // Permite "puxar para atualizar"
            refreshing={isLoading}
          />
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E0BBE4', // Cor vibrante
  },
  logoutText: {
    color: '#BBF0F3',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#BBF0F3',
    fontSize: 16,
  },
  // Estilo do Card de Notícia
  card: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.08)', // Fundo translúcido
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden', // Garante que a imagem não vaze
    // Sombra (mesma estética)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#2a2f4a', // Cor de fundo enquanto a imagem carrega
  },
  cardContent: {
    padding: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  cardSource: {
    fontSize: 14,
    color: '#BBF0F3',
    fontStyle: 'italic',
  },
});

export default NewsScreen;