import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
  Modal,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { db } from '../components/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import * as Animatable from 'react-native-animatable';
import LottieView from 'lottie-react-native';

const TestContainer = () => {
  const navigation = useNavigation();
  const route = useRoute(); // Get route params
  const { Aptitude } = route.params; // Extract subjectName from params
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const questionsRef = collection(db, 'questions');
        const q = query(questionsRef, where('subject', '==', Aptitude)); // Filter by subject
        const querySnapshot = await getDocs(q);
        const fetchedQuestions = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setQuestions(fetchedQuestions);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, [Aptitude]);

  useEffect(() => {
    // Check if all questions have been answered
    const allAnswered = questions.every((question) => selectedAnswers[question.id]);
    setIsSubmitEnabled(allAnswered);
  }, [selectedAnswers, questions]);

  const handleAnswerSelect = (questionId, selectedOption) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: selectedOption,
    }));
  };

  const calculateScore = () => {
    let newScore = 0;
    questions.forEach((question) => {
      if (selectedAnswers[question.id] === question.answer) {
        newScore += 1;
      }
    });
    setScore(newScore);
    setShowScoreModal(true);
  };

  const renderQuestion = ({ item, index }) => (
    <View style={styles.questionContainer} key={item.id}>
      <Text style={styles.questionText}>
        {index + 1}. {item.question}
      </Text>
      {item.options.map((option, idx) => (
        <TouchableOpacity
          key={idx}
          style={[
            styles.option,
            selectedAnswers[item.id] === option && styles.selectedOption,
          ]}
          onPress={() => handleAnswerSelect(item.id, option)}
        >
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <StatusBar barStyle="light-content" backgroundColor="#009688" translucent={true} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image source={require('../assets/back.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.heading}>{Aptitude} Test</Text>
        <View style={styles.emptyView}></View>
      </View>

      {/* Questions List */}
      <FlatList
        data={questions}
        renderItem={renderQuestion}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
      />

      {/* Footer */}
      <View style={styles.footer}>
  <TouchableOpacity
    style={[
      styles.submitButton,
      !isSubmitEnabled && styles.disabledSubmitButton, // Apply disabled styling
    ]}
    onPress={calculateScore}
    disabled={!isSubmitEnabled} // Disable button when not all questions are answered
  >
    <Text
      style={[
        styles.submitText,
        !isSubmitEnabled && styles.disabledSubmitText, // Apply disabled text styling
      ]}
    >
      Submit
    </Text>
  </TouchableOpacity>
</View>


      {/* Score Modal */}
      <Modal
        transparent={true}
        visible={showScoreModal}
        animationType="fade"
        onRequestClose={() => setShowScoreModal(false)}
      >
        <View style={styles.modalContainer}>
          <Animatable.View animation="zoomIn" duration={500} style={styles.modalContent}>
            <LottieView
              source={require('../assets/ggg.json')}
              autoPlay
              loop
              style={styles.gifImage}
            />
            <Text style={styles.modalText}>
              Your Score: {score}/{questions.length}
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowScoreModal(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </Modal>
    </View>
  );
};

export default TestContainer;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#009688',
    paddingHorizontal: 15,
    paddingVertical: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 22 : 70,
  },
  backIcon: {
    width: 30,
    height: 30,
    tintColor: '#ffffff',
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
    textAlign: 'center',
  },
  emptyView: { width: 30 },
  questionContainer: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop:2,
  },
  questionText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  option: {
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dddddd',
    marginBottom: 10,
  },
  selectedOption: {
    backgroundColor: '#009688',
    borderColor: '#00796b',
  },
  optionText: {
    fontSize: 14,
    color: '#000',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#009688',
    padding: 11,
  },
  submitButton: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
    width: '70%',
    alignItems: 'center',
  },
  disabledSubmitButton: {
    backgroundColor: '#cccccc', // Light gray for disabled state
    opacity: 0.6, // Reduce opacity
    borderColor: '#aaaaaa', // Lighter border color
  },
  submitText: {
    textAlign: 'center',
    color: '#009688',
    fontWeight: 'bold',
  },
  disabledSubmitText: {
    color: '#000000', // Light gray text for disabled state
  },

  scoreText: {
    color: '#ffffff',
    fontSize: 19,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#7fcbc1', // Keep this style
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  gifImage: {
    width: 230,
    height: 170,
    marginBottom: 10,
    borderRadius: 10,
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00000', // Keep this style
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  closeButtonText: {
    color: '#000000',
    fontSize: 16,
  },
});
