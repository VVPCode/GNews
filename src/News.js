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
  TextInput,
  ScrollView,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// --- CONFIGURAÇÃO DA API DE NOTÍCIAS (GNEWS) ---
const GNEWS_API_KEY = '7a3d59a5900abad884aa0e963c80ccb0'; 
// ----------------------------------------------

const CATEGORIES = [
  { id: 'general', label: 'Geral' },
  { id: 'world', label: 'Mundo' },
  { id: 'nation', label: 'Brasil' },
  { id: 'technology', label: 'Tecnologia' },
  { id: 'business', label: 'Negócios' },
  { id: 'sports', label: 'Esportes' },
  { id: 'entertainment', label: 'Entretenimento' },
  { id: 'health', label: 'Saúde' },
  { id: 'science', label: 'Ciência' },
];

// Componente do Card de Notícia
const NewsCard = ({ article, onToggleFavorite, isFavorite }) => (
  <TouchableOpacity 
    style={styles.card} 
    onPress={() => Linking.openURL(article.url)}
    activeOpacity={0.9}
  >
    {/* Imagem da notícia */}
    <Image 
      source={{ uri: article.image || 'https://placehold.co/600x400/2a2f4a/E0BBE4?text=Sem+Imagem' }} 
      style={styles.cardImage} 
      resizeMode="cover"
    />
    
    {/* Botão de Favoritar (Sobreposto à imagem) */}
    <TouchableOpacity 
      style={styles.favoriteButton} 
      onPress={(e) => {
        // Impede que o clique no coração abra a notícia
        e.stopPropagation(); 
        onToggleFavorite(article);
      }}
    >
      <Text style={styles.favoriteIcon}>{isFavorite ? '❤️' : '🤍'}</Text>
    </TouchableOpacity>

    <View style={styles.cardContent}>
      <Text style={styles.cardDate}>
        {new Date(article.publishedAt).toLocaleDateString('pt-BR')}
      </Text>
      <Text style={styles.cardTitle} numberOfLines={3}>{article.title}</Text>
      <View style={styles.sourceContainer}>
        <Text style={styles.cardSource}>{article.source.name}</Text>
        <Text style={styles.readMore}>Ler mais ›</Text>
      </View>
    </View>
  </TouchableOpacity>
);

// Componente de Chip de Categoria
const CategoryChip = ({ category, isActive, onPress }) => (
  <TouchableOpacity 
    style={[styles.chip, isActive && styles.chipActive]} 
    onPress={() => onPress(category.id)}
  >
    <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
      {category.label}
    </Text>
  </TouchableOpacity>
);

const NewsScreen = ({ onLogout }) => {
  const [news, setNews] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // Filtros e Controle
  const [activeCategory, setActiveCategory] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('news'); // 'news' ou 'favorites'
  const [page, setPage] = useState(1);

  // Inicialização
  useEffect(() => {
    fetchNews(1, true); // Busca página 1 e reseta lista
  }, [activeCategory]); // Recarrega se mudar a categoria

  // Função Principal de Busca
  const fetchNews = (pageNum = 1, shouldReset = false) => {
    // Se estiver vendo favoritos, não busca na API
    if (viewMode === 'favorites') return;

    if (shouldReset) setIsLoading(true);
    else setIsLoadingMore(true);

    // Constrói a URL base
    let baseUrl = 'https://gnews.io/api/v4/top-headlines';
    let params = `lang=pt&country=br&token=${GNEWS_API_KEY}&page=${pageNum}`;

    // Se tiver busca digitada, muda para endpoint de busca
    if (searchQuery.trim()) {
      baseUrl = 'https://gnews.io/api/v4/search';
      params = `q=${encodeURIComponent(searchQuery)}&lang=pt&token=${GNEWS_API_KEY}&page=${pageNum}`;
    } else {
      // Se não for busca, usa categoria
      params += `&topic=${activeCategory}`;
    }

    let url = `${baseUrl}?${params}`;

    // Proxy para Web (CORS)
    if (Platform.OS === 'web') {
      url = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
    }

    fetch(url)
      .then(r => r.json())
      .then(data => {
        if (data.articles) {
          if (shouldReset) {
            setNews(data.articles);
          } else {
            // Adiciona novas notícias à lista existente (sem duplicar URLs)
            setNews(prev => [...prev, ...data.articles.filter(n => !prev.find(p => p.url === n.url))]);
          }
        } else {
           console.warn("API Error:", data);
        }
      })
      .catch(err => console.error(err))
      .finally(() => {
        setIsLoading(false);
        setIsLoadingMore(false);
      });
  };

  // Carregar mais notícias (Paginação)
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNews(nextPage, false);
  };

  // Função de Busca (acionada pelo botão ou enter)
  const handleSearch = () => {
    setPage(1);
    fetchNews(1, true);
  };

  // Gerenciar Favoritos
  const toggleFavorite = (article) => {
    if (favorites.find(f => f.url === article.url)) {
      setFavorites(prev => prev.filter(f => f.url !== article.url));
    } else {
      setFavorites(prev => [article, ...prev]);
    }
  };

  // Renderização
  return (
    <LinearGradient
      colors={['#1a1f38', '#0f1220']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#1a1f38" />

        <View style={styles.webContainer}>
          
          {/* --- CABEÇALHO --- */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>GNews Reader</Text>
              <Text style={styles.headerSubtitle}>
                {viewMode === 'favorites' ? 'Meus Favoritos' : 'Últimas Notícias'}
              </Text>
            </View>
            <TouchableOpacity onPress={onLogout}>
              <Text style={styles.logoutText}>Sair</Text>
            </TouchableOpacity>
          </View>

          {/* --- BARRA DE BUSCA --- */}
          {viewMode === 'news' && (
            <View style={styles.searchContainer}>
              <TextInput 
                style={styles.searchInput}
                placeholder="Buscar"
                placeholderTextColor="#aaa"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch} // Busca ao dar Enter
              />
              <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                <Text style={styles.searchButtonText}>🔍</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* --- CATEGORIAS E ABAS --- */}
          <View style={styles.tabsContainer}>
            {/* Botão de Alternar Modo (Notícias vs Favoritos) */}
            <TouchableOpacity 
              style={[styles.modeButton, viewMode === 'favorites' && styles.modeButtonActive]}
              onPress={() => setViewMode(viewMode === 'news' ? 'favorites' : 'news')}
            >
              <Text style={styles.modeButtonText}>
                {viewMode === 'news' ? '❤️ Ver Favoritos' : '📰 Ver Notícias'}
              </Text>
            </TouchableOpacity>

            {/* Lista Horizontal de Categorias (Só aparece no modo Notícias e sem busca) */}
            {viewMode === 'news' && searchQuery === '' && (
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesList}
              >
                {CATEGORIES.map(cat => (
                  <CategoryChip 
                    key={cat.id} 
                    category={cat} 
                    isActive={activeCategory === cat.id}
                    onPress={(id) => {
                      setActiveCategory(id);
                      setPage(1); // Reseta página ao trocar categoria
                    }}
                  />
                ))}
              </ScrollView>
            )}
          </View>

          {/* --- LISTA DE CONTEÚDO --- */}
          {isLoading ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color="#E0BBE4" />
              <Text style={styles.loadingText}>Atualizando feed...</Text>
            </View>
          ) : (
            <FlatList
              data={viewMode === 'favorites' ? favorites : news}
              renderItem={({ item }) => (
                <NewsCard 
                  article={item} 
                  isFavorite={!!favorites.find(f => f.url === item.url)}
                  onToggleFavorite={toggleFavorite}
                />
              )}
              keyExtractor={(item, index) => item.url + index}
              contentContainerStyle={{ paddingBottom: 30 }}
              showsVerticalScrollIndicator={false}
              
              // Pull to Refresh (Só funciona no modo Notícias)
              onRefresh={viewMode === 'news' ? () => fetchNews(1, true) : null}
              refreshing={isLoading}

              // Empty Component
              ListEmptyComponent={
                <View style={styles.centerContainer}>
                  <Text style={styles.emptyText}>
                    {viewMode === 'favorites' 
                      ? 'Você ainda não salvou nenhuma notícia.' 
                      : 'Nenhuma notícia encontrada.'}
                  </Text>
                </View>
              }

              // Footer (Botão Carregar Mais)
              ListFooterComponent={
                viewMode === 'news' && news.length > 0 && !searchQuery && (
                  <View style={styles.footer}>
                    {isLoadingMore ? (
                      <ActivityIndicator color="#E0BBE4" />
                    ) : (
                      <TouchableOpacity style={styles.loadMoreButton} onPress={handleLoadMore}>
                        <Text style={styles.loadMoreText}>Carregar Mais Notícias</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )
              }
            />
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  // --- HEADER ---
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 5,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#E0BBE4',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#BBF0F3',
    opacity: 0.8,
  },
  logoutText: {
    color: '#FF6B6B',
    fontSize: 15,
    fontWeight: 'bold',
    ...Platform.select({ web: { cursor: 'pointer' } })
  },
  
  // --- SEARCH ---
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: 12,
    color: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginRight: 10,
    ...Platform.select({ web: { outlineStyle: 'none' } })
  },
  searchButton: {
    backgroundColor: '#6A0DAD',
    borderRadius: 10,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({ web: { cursor: 'pointer' } })
  },
  searchButtonText: { fontSize: 20 },

  // --- TABS & CATEGORIES ---
  tabsContainer: {
    marginBottom: 15,
  },
  modeButton: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    ...Platform.select({ web: { cursor: 'pointer' } })
  },
  modeButtonActive: {
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    borderColor: '#FF6B6B',
  },
  modeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  categoriesList: {
    paddingBottom: 5,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    ...Platform.select({ web: { cursor: 'pointer' } })
  },
  chipActive: {
    backgroundColor: '#6A0DAD',
    borderColor: '#B200ED',
  },
  chipText: {
    color: '#aaa',
    fontSize: 14,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#fff',
  },

  // --- CARD ---
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    position: 'relative', // Para posicionar o coração
    ...Platform.select({ web: { cursor: 'pointer' } })
  },
  cardImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#2a2f4a',
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    ...Platform.select({ web: { cursor: 'pointer' } })
  },
  favoriteIcon: { fontSize: 20 },
  cardContent: { padding: 16 },
  cardDate: {
    color: '#BBF0F3',
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    lineHeight: 24,
  },
  sourceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  cardSource: {
    color: '#E0BBE4',
    fontSize: 13,
    fontWeight: '600',
  },
  readMore: {
    color: '#aaa',
    fontSize: 13,
  },

  // --- UTILS ---
  centerContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#aaa',
    marginTop: 10,
  },
  emptyText: {
    color: '#aaa',
    fontSize: 16,
    textAlign: 'center',
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadMoreButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    ...Platform.select({ web: { cursor: 'pointer' } })
  },
  loadMoreText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default NewsScreen;
