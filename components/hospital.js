import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card, Button } from '@rneui/themed';

const HospitalPage = () => {
  const navigation = useNavigation();

  // State to control dropdown expansion
  const [expandedCategories, setExpandedCategories] = useState({
    Cardiology: false,
    Cancer: false,
    'CT Surgery': false,
    Liver: false,
    'Mother & Child Care': false,
    Nephrology: false,
  });

  const toggleCategory = (category) => {
    setExpandedCategories((prevState) => ({
      ...prevState,
      [category]: !prevState[category],
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#029791" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>{'< Back'}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Hospital</Text>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Hospital Info Section */}
        <Card containerStyle={styles.hospitalCard}>
          <View style={styles.hospitalInfoRow}>
            <View style={styles.hospitalDetails}>
              <Text style={styles.hospitalName}>Yashoda Hospitals</Text>
              <Text style={styles.hospitalDescription}>
                Multi-Speciality Hospital in Hyderabad, Telangana
              </Text>
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingText}>Rating - </Text>
                {[...Array(5)].map((_, index) => (
                  <Text key={index} style={styles.star}>★</Text>
                ))}
              </View>
              <Text style={styles.timings}>Timings: Open 24 Hours</Text>
              <Text style={styles.address}>
                Address: 6-3-905, Raj Bhavan Rd, Matha Nagar, Somajiguda, Hyderabad, Telangana 500082
              </Text>
            </View>
            <Image
              source={require('../assets/rr.png')}
              style={styles.hospitalImage}
            />
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Know Our Top Specialists</Text>

        {Object.keys(expandedCategories).map((category) => (
          <View key={category}>
            <TouchableOpacity
              onPress={() => toggleCategory(category)}
              style={styles.categoryHeader}
            >
              <Text style={styles.categoryTitle}>{category}</Text>
              <Text style={styles.expandIcon}>
                {expandedCategories[category] ? '-' : '+'}
              </Text>
            </TouchableOpacity>

            {expandedCategories[category] && (
              <View style={styles.categoryContent}>
                <Image
                  source={require(`../assets/rr.png`)}
                  style={styles.categoryImage}
                />
                <View style={styles.consultantDetails}>
                  <Text style={styles.consultantName}>Dr. K. Nageswara Rao</Text>
                  <Text style={styles.consultantInfo}>M.S, M.Ch (Cardio-Thoracic & Vascular Surgery) FIACS</Text>
                  <Text style={styles.experience}>Experience: 27 Years</Text>
                  <Text style={styles.hospitalInfo}>Hospital: Yashoda Hospital</Text>
                  <Text style={styles.position}>Consultant Cardiothoracic Surgeon</Text>
                  <Button
                    buttonStyle={styles.buttonStyle}
                    title="Check for Other Consultants"
                    onPress={() => navigation.navigate('ConsultantsPage')}
                  />
                </View>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EAF4F4' },
  header: { backgroundColor: '#029791', padding: 16, flexDirection: 'row', alignItems: 'center' },
  backButton: { color: 'white', fontSize: 16, marginRight: 10 },
  title: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  contentContainer: { padding: 16 },
  hospitalCard: { borderRadius: 12, padding: 16 },
  hospitalInfoRow: { flexDirection: 'row', alignItems: 'flex-start' },
  hospitalDetails: { flex: 2 },
  hospitalName: { fontSize: 18, fontWeight: 'bold' },
  hospitalDescription: { fontSize: 12, color: 'gray' },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  ratingText: { fontSize: 12, fontWeight: 'bold' },
  star: { color: 'gold' },
  timings: { fontSize: 10, fontWeight: 'bold', marginTop: 5 },
  address: { fontSize: 10, marginTop: 5 },
  hospitalImage: { width: 90, height: 90, marginLeft: 10, borderRadius: 8 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#029791', textAlign: 'center', marginVertical: 10 },
  categoryHeader: { backgroundColor: '#029791', borderRadius: 12, padding: 12, flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  categoryTitle: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  expandIcon: { color: 'white', fontSize: 18 },
  categoryContent: { backgroundColor: '#029791', padding: 16, borderRadius: 12, marginTop: 8 },
  categoryImage: { width: 90, height: 90, borderRadius: 8, marginBottom: 8 },
  consultantDetails: { flex: 1, marginLeft: 12 },
  consultantName: { color: 'yellow', fontSize: 17, fontWeight: 'bold' },
  consultantInfo: { color: 'white', fontSize: 10, marginTop: 4 },
  experience: { color: '#FFCF00', fontSize: 14, fontWeight: 'bold', marginTop: 6 },
  hospitalInfo: { color: '#FFCF00', fontSize: 12 },
  position: { color: 'white', fontSize: 10, fontWeight: 'bold', marginTop: 4 },
  buttonStyle: { backgroundColor: 'orange', borderRadius: 35, marginTop: 10 },
});

export default HospitalPage;
