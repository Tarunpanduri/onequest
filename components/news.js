import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const NewsSection = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  const fetchNews = async () => {
    const apiUrl = "https://mocki.io/v1/dea4180b-8530-4932-9427-fd71227ea027";
    try {
      setLoading(true);
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();

      const formattedData = data.map((item, index) => ({
        ...item,
        id: item.id || index,
      }));

      setNews(formattedData);
      setLoading(false);
    } catch (error) {
      setError("Failed to load news. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.newsCard}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.newsCardContent}>
        <Text style={styles.headline}>{item.headline}</Text>
        <Text style={styles.area}>{item.area}</Text>
        <Text style={styles.time}>Updated: {item.updated}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#009688"

      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image source={require('../assets/back.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.heading}>News</Text>
        <View style={styles.emptyView}></View>
      </View>


      {/* Main Content */}
      {loading ? (
        <ActivityIndicator size="large" color="#009688" style={styles.loader} />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.error}>{error}</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={fetchNews}>
            <Text style={styles.refreshText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={news}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.newsSection}
          ListEmptyComponent={<Text style={styles.noNews}>No news available</Text>}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <NavIcon title="Home" iconSource={require('../assets/home.png')} />
        <NavIcon title="Notifications" iconSource={require('../assets/bell.png')} />
        <NavIcon title="Offers" iconSource={require('../assets/offer.png')} />
        <NavIcon title="Favorites" iconSource={require('../assets/heart.png')} />
      </View>
    </View>
  );
};

const NavIcon = ({ title, iconSource }) => (
  <TouchableOpacity style={styles.navItem}>
    <Image source={iconSource} style={styles.navIcon} resizeMode="contain" />
    <Text style={styles.navText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#009688',
    paddingHorizontal: 15,
    paddingVertical: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 22 : 70,
  },
  backIcon: { width: 30, height: 30, tintColor: '#ffffff' },
  heading: { fontSize: 18, fontWeight: 'bold', color: '#ffffff', flex: 1, paddingLeft: 20 },
  content: { paddingBottom: 80 },
  newsSection: { paddingHorizontal: 15, paddingBottom: 80 ,marginTop:10},
  newsCard: {
    backgroundColor: '#fcfcfc',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 4,
    marginBottom: 15,
  },
  image: { width: '100%', height: 200, resizeMode: 'cover' },
  newsCardContent: { padding: 15 },
  headline: { fontSize: 20, fontWeight: 'bold', color: '#141212', marginBottom: 8 },
  area: { fontSize: 16, color: '#141212', marginBottom: 8 },
  time: { fontSize: 12, color: '#555' },
  error: { color: 'red', fontSize: 16, textAlign: 'center', paddingBottom: 10 },
  noNews: { color: '#555', fontSize: 16, textAlign: 'center', paddingTop: 20 },
  refreshButton: {
    backgroundColor: '#009688',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  refreshText: { color: '#ffffff', fontSize: 16, textAlign: 'center' },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#009688',
    paddingVertical: 10,
    bottom:0,
  },
  navItem: {
    alignItems: 'center',
  },
  navIcon: {
    width: 24,
    height: 24,
  },
  navText: {
    color: '#ffffff',
    fontSize: 12,
    marginTop: 5,
  },
});

export default NewsSection;
