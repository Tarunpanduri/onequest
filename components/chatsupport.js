import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert,Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getDatabase, ref, push, set, onValue, serverTimestamp } from 'firebase/database';
import { auth } from './firebaseConfig';

const ChatScreen = () => {
  const [tickets, setTickets] = useState([]); // Stores all user tickets
  const [selectedTicket, setSelectedTicket] = useState(null); // Current open ticket
  const [messages, setMessages] = useState([]); // Stores chat messages for selected ticket
  const [message, setMessage] = useState('');

  const user = auth.currentUser;
  if (!user) {
    Alert.alert("Error", "User is not logged in!");
    return null;
  }

  const db = getDatabase();
  const userId = user.uid;
  const userTicketsRef = ref(db, `Chats/${userId}/tickets`);

  // ✅ Fetch user tickets from Realtime Database
  useEffect(() => {
    const unsubscribe = onValue(userTicketsRef, (snapshot) => {
      const ticketsData = snapshot.val();
      if (ticketsData) {
        const userTickets = Object.keys(ticketsData).map((key) => ({
          id: key,
          ...ticketsData[key],
        }));
        
        setTickets(userTickets);

        // ✅ Check if there are any open tickets, otherwise reset selection
        const openTickets = userTickets.filter(ticket => ticket.status === "open");
        if (openTickets.length > 0) {
          setSelectedTicket(openTickets[0]); // Auto-select the first open ticket
        } else {
          setSelectedTicket(null); // Reset selection if no open tickets
        }
      } else {
        setTickets([]);
        setSelectedTicket(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // ✅ Fetch messages when the selected ticket changes
  useEffect(() => {
    if (!selectedTicket) return;

    const messagesRef = ref(db, `Chats/${userId}/tickets/${selectedTicket.id}/messages`);

    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const messagesData = snapshot.val();
      if (messagesData) {
        const messagesList = Object.keys(messagesData).map((key) => ({
          id: key,
          ...messagesData[key],
        }));
        setMessages(messagesList);
      } else {
        setMessages([]);
      }
    });

    return () => unsubscribe();
  }, [selectedTicket]);

  // ✅ Create a new ticket
  const createTicket = async () => {
    try {
      const newTicketRef = push(userTicketsRef);
      await set(newTicketRef, {
        status: "open",
        createdAt: serverTimestamp(),
      });

      setSelectedTicket({ id: newTicketRef.key, status: "open" });

      // ✅ Add a welcome message from admin
      await push(ref(db, `Chats/${userId}/tickets/${newTicketRef.key}/messages`), {
        text: "Hello! How can I assist you?",
        sender: "admin",
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error creating ticket:", error);
    }
  };

  // ✅ Send a message
  const sendMessage = async () => {
    if (!selectedTicket || message.trim().length === 0) return;

    try {
      await push(ref(db, `Chats/${userId}/tickets/${selectedTicket.id}/messages`), {
        text: message,
        sender: "user",
        timestamp: serverTimestamp(),
      });

      setMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.Mheader} >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image source={require('../assets/back.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Rina</Text>
      </View>
      <Text style={styles.subHeaderText}>OneQuest Support Executive</Text>
      </View>



      {selectedTicket ? (
        <>
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={[styles.messageContainer, item.sender === 'user' ? styles.userMessage : styles.adminMessage]}>
                <Text style={styles.messageText}>{item.text}</Text>
              </View>
            )}
            contentContainerStyle={styles.chatContainer}
          />

          {selectedTicket.status !== "closed" && (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Type your message here..."
                value={message}
                onChangeText={setMessage}
              />
              <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                <Ionicons name="send" size={20} color="white" />
              </TouchableOpacity>
            </View>
          )}
        </>
      ) : (
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>No Ongoing tickets found. Need help?</Text>
          <TouchableOpacity onPress={createTicket} style={styles.createTicketButton}>
            <Text style={styles.createTicketText}>Create a Ticket</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 50,  },
  Mheader:{
    padding: 5,borderBottomWidth: 1, borderColor: '#ddd', backgroundColor: '#fff',
  },
  header: { 
     flexDirection: 'row', alignItems: 'center', 
  },
  headerText: { fontSize: 20, fontWeight: 'bold', marginLeft: 10 ,top:-5},
  subHeaderText: { fontSize: 14, color: 'gray', marginLeft: 37, top:-5},
  backIcon: { width: 25, height: 25, },
  welcomeContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  welcomeText: { fontSize: 18, marginBottom: 20 },
  createTicketButton: { backgroundColor: '#009688', padding: 10, borderRadius: 10 },
  createTicketText: { color: 'white', fontSize: 16 },
  chatContainer: { paddingHorizontal: 15, paddingBottom: 10 },
  messageContainer: { padding: 10, borderRadius: 10, marginVertical: 5, maxWidth: '80%' },
  userMessage: { alignSelf: 'flex-end', backgroundColor: '#E5E5EA' },
  adminMessage: { alignSelf: 'flex-start', backgroundColor: '#56c7bd' },
  messageText: { fontSize: 16 },
  inputContainer: { flexDirection: 'row', padding: 10, borderTopWidth: 1, borderColor: '#ddd', backgroundColor: '#fff' },
  input: { flex: 1, padding: 10, borderRadius: 20, backgroundColor: '#F0F0F0' },
  sendButton: { marginLeft: 10, backgroundColor: '#009688', padding: 10, borderRadius: 50 },
});

export default ChatScreen;