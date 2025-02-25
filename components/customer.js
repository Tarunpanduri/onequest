import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getDatabase, ref, onValue } from 'firebase/database';
import { auth } from './firebaseConfig'; // Ensure firebaseConfig is properly set up

const Tab = createMaterialTopTabNavigator();

const TicketList = ({ tickets, onPress }) => (
  <FlatList
    data={tickets}
    keyExtractor={(item) => item.id}
    ListEmptyComponent={() => (
      <View style={styles.emptyContainer}>
        <Image source={require('../assets/tickets.png')} style={styles.ticketImage} />
        <Text style={styles.emptyText}>No tickets available</Text>
      </View>
    )}
    renderItem={({ item }) => (
      <TouchableOpacity style={styles.ticketItem} onPress={() => onPress && onPress(item)}>
        <Text style={styles.ticketText}>Ticket ID: {item.id}</Text>
        <Text>Ticket Created : {new Date(item.createdAt).toLocaleString()}</Text>
      </TouchableOpacity>
    )}
  />
);

// 🎟️ Ongoing Tickets (Only "open" status)
const OngoingTicketsScreen = ({ tickets, onPress }) => (
  <TicketList tickets={tickets.filter(ticket => ticket.status === 'open')} onPress={onPress} />
);

// 🎟️ Ticket History (Only "closed" status)
const TicketHistoryScreen = ({ tickets }) => (
  <TicketList tickets={tickets.filter(ticket => ticket.status === 'closed')} />
);

// 🏠 Main Ticket Screen with Tabs
const YourTicketsScreen = () => {
  const navigation = useNavigation();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = auth.currentUser;
  if (!user) return null;

  const userId = user.uid;
  const db = getDatabase();
  const ticketsRef = ref(db, `Chats/${userId}/tickets`);

  useEffect(() => {
    const unsubscribe = onValue(ticketsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const ticketArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setTickets(ticketArray);
      } else {
        setTickets([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#009688" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image source={require('../assets/back.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Customer Support & FAQ</Text>
      </View>

      <Tab.Navigator
        screenOptions={{
          tabBarStyle: { backgroundColor: '#fff' },
          tabBarIndicatorStyle: { backgroundColor: '#009688' },
          tabBarLabelStyle: { color: 'black', fontWeight: 'bold' },
        }}
      >
        <Tab.Screen name="Ongoing">
          {() => <OngoingTicketsScreen tickets={tickets} onPress={(ticket) => navigation.navigate('ChatSupport', { ticketId: ticket.id })} />}
        </Tab.Screen>
        <Tab.Screen name="History">
          {() => <TicketHistoryScreen tickets={tickets} />}
        </Tab.Screen>
      </Tab.Navigator>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('ChatSupport')}>
          <Ionicons name="chatbubble-outline" size={20} color="black" />
          <Text style={styles.optionText}>Need help? Chat with us</Text>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity style={styles.option}>
          <Ionicons name="information-circle-outline" size={20} color="black" />
          <Text style={styles.optionText}>Terms and conditions</Text>
        </TouchableOpacity>
        <Text style={styles.branding}>OneQuest</Text>
      </View>
    </View>
  );
};

// 📌 Export the Screen
export default YourTicketsScreen;

// 🎨 Styles
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  ticketImage: { width: 100, height: 100,marginTop: 60 },
  emptyText: { color: 'black', fontSize: 16, marginTop: 10 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: '#fff', marginTop: 40 },
  backIcon: { width: 30, height: 30 },
  headerTitle: { color: 'black', fontWeight: '600', fontSize: 18, marginLeft: 10 },
  footer: { padding: 15, borderTopWidth: 1, borderColor: '#ddd', backgroundColor: '#fff' },
  option: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  optionText: { color: 'black', fontSize: 16, marginLeft: 10 },
  separator: { height: 1, backgroundColor: '#ddd', marginVertical: 5 },
  branding: { color: 'black', fontSize: 18, fontWeight: 'bold', marginTop: 20, textAlign: 'center' },
  ticketItem: { padding: 15, borderBottomWidth: 1, borderColor: '#ddd' },
  ticketText: { fontSize: 16, fontWeight: 'bold', color: 'black' },
});
