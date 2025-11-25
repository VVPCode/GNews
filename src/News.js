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
  Alert,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// --- CONFIGURAÇÃO DA API DE NOTÍCIAS (GNEWS) ---
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
      resizeMode="cover"
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

  // Obter largura da tela para ajustes
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = () => {
    setIsLoading(true);

    // 1. Montamos a URL original da GNews
    let url = `https://gnews.io/api/v4/top-headlines?lang=pt&country=br&token=${GNEWS_API_KEY}`;
    
    // 2. CORREÇÃO PARA WEB (CORS):
    if (Platform.OS === 'web') {
      url = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
    }
    
    console.log("Buscando notícias em:", url); // Log para ajudar a debugar

    fetch(url)
      .then(response => {
        if (!response.ok) {
           throw new Error(`Erro HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        // A API GNews retorna { articles: [...] }
        // Se usarmos proxy, o retorno é o mesmo JSON.
        if (data.articles) {
          setNews(data.articles);
        } else if (data.errors) {
           // GNews às vezes retorna erros dentro do JSON
           Alert.alert('Erro da API', JSON.stringify(data.errors));
        } else {
          Alert.alert('Aviso', 'Nenhuma notícia encontrada ou formato inesperado.');
        }
      })
      .catch(error => {
        console.error("Erro ao buscar notícias:", error);
        // Na web, mostramos um alerta mais descritivo
        const msg = Platform.OS === 'web' 
          ? 'Erro de CORS ou Rede. Veja o Console (F12) para detalhes.' 
          : 'Não foi possível buscar as notícias.';
        Alert.alert('Erro de Rede', msg);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <LinearGradient
      colors={['#1a1f38', '#0f1220']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#1a1f38" />
        
        {/* Container centralizado para limitar largura na Web */}
        <View style={styles.webContainer}>
          
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
              keyExtractor={(item, index) => item.url ? item.url + index : String(index)}
              contentContainerStyle={{ paddingBottom: 20 }}
              onRefresh={fetchNews}
              refreshing={isLoading}
              showsVerticalScrollIndicator={false}
              // Empty Component para quando não houver notícias
              ListEmptyComponent={
                <Text style={{color: 'white', textAlign: 'center', marginTop: 20}}>
                  Nenhuma notícia disponível no momento.
                </Text>
              }
            />
          )}
        </View>
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
  webContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 800, 
    alignSelf: 'center', 
    paddingHorizontal: 15, 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E0BBE4',
  },
  logoutText: {
    color: '#BBF0F3',
    fontSize: 16,
    textDecorationLine: 'underline',
    ...Platform.select({
      web: { cursor: 'pointer' }
    })
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
  card: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    ...Platform.select({
      web: { cursor: 'pointer' }
    })
  },
  cardImage: {
    width: '100%',
    height: 200, 
    backgroundColor: '#2a2f4a',
  },
  cardContent: {
    padding: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  cardSource: {
    fontSize: 14,
    color: '#BBF0F3',
    fontStyle: 'italic',
  },
});

export default NewsScreen;