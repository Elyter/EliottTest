import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { 
  Text, 
  View,  
  StyleSheet, 
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import flashCardsData from '../assets/flashCards.json';
import CustomButton from '../components/CustomButton';

const { height: screenHeight } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answerStatus, setAnswerStatus] = useState(null);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const bottomSheetRef = useRef(null);
  const [isButtonsDisabled, setIsButtonsDisabled] = useState(false);

  const questions = flashCardsData.flashcards;

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setScore(0);
      setCurrentQuestionIndex(0);
      setAnswerStatus(null);
      setAnsweredQuestions([]);
      setIsButtonsDisabled(false);
    });

    return unsubscribe;
  }, [navigation]);

  const handleAnswer = (userAnswer: string) => {
    if (isButtonsDisabled) return;
    setIsButtonsDisabled(true);

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = userAnswer === currentQuestion.answer;
    
    setAnswerStatus(isCorrect);
    if (isCorrect) setScore(score + 1);

    setAnsweredQuestions([...answeredQuestions, {
      text: currentQuestion.question,
      isCorrect
    }]);

    setTimeout(() => {
      bottomSheetRef.current?.snapToIndex(1);
    }, 150);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsButtonsDisabled(false); 
      bottomSheetRef.current?.close();
    } else {
      navigation.navigate('Results', { score, answeredQuestions });
      setIsButtonsDisabled(false);
    }
  };

  const snapPoints = useMemo(() => ['60%'], []); 

  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        pressBehavior={null}
        enableTouchThrough={true}
      />
    ),
    []
  );

  return (
    <GestureHandlerRootView style={styles.rootContainer}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.questionText}>Question {currentQuestionIndex + 1}/10</Text>
          <Text style={styles.scoreText}>Score: {score}</Text>
        </View>
        
        <View style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.cardText}>{questions[currentQuestionIndex].question}</Text>
          </View>
          
          <View style={styles.buttonsContainer}>
            <CustomButton
              text="VRAI"
              onPress={() => handleAnswer('vrai')}
              variant="true"
              disabled={isButtonsDisabled}
            />
            <CustomButton
              text="FAUX"
              onPress={() => handleAnswer('faux')}
              variant="false"
              disabled={isButtonsDisabled}
            />
          </View>
        </View>

        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          enablePanDownToClose={false}
          enableContentPanningGesture={false}
          enableHandlePanningGesture={false}
          enableOverDrag={false}
          index={-1}
          backdropComponent={renderBackdrop}
          style={styles.bottomSheet}
          backgroundStyle={styles.bottomSheetBackground}
          handleComponent={null}
        >
          <BottomSheetView style={styles.bottomSheetContent}>
            <View style={styles.bottomSheetInner}>
              <Text style={[
                styles.resultText,
                { color: answerStatus ? '#1D9D00' : '#E70004' }
              ]}>
                {answerStatus ? '✓ Correct !' : '✗ Faux !'}
              </Text>
              
              <View style={styles.resultContainer}>
                <Text style={styles.explanationText}>
                  {questions[currentQuestionIndex].explanation}
                </Text>
              </View>
              
              <CustomButton
                text={currentQuestionIndex < questions.length - 1 ? 'Suivant' : 'Voir les résultats'}
                onPress={handleNext}
                variant="blue"
                style={{ width: '100%' }}
              />
            </View>
          </BottomSheetView>
        </BottomSheet>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingVertical: 10,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
    },
    questionText: {
        fontSize: 18,
        width: "50%",
        fontFamily: 'fredoka',
        textTransform: 'uppercase',
        fontWeight: '500',
    },
    scoreText: {
        fontSize: 18,
        width: "auto",
        fontFamily: 'fredoka',
        textTransform: 'uppercase',
        fontWeight: '500',
    },
    card: {
        width: '85%',
        height: screenHeight * 0.6,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0094E7',
        borderRadius: 42,
        padding: 20,
        marginBottom: 30,
    },
    cardText: {
        fontSize: 25,
        fontFamily: 'fredoka',
        color: 'white',
        textAlign: 'center',
        lineHeight: 28,
        fontWeight: '500',
        letterSpacing: -0.2,
        textTransform: 'uppercase',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 25,
        marginTop: 30,
    },
    bottomSheet: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: -4,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 8,
    },
    bottomSheetBackground: {
      backgroundColor: '#fff',
      borderTopLeftRadius: 29,
      borderTopRightRadius: 29,
    },
    bottomSheetContent: {
      flex: 1,
      padding: 24,
    },
    bottomSheetInner: {
      flex: 1,
      justifyContent: 'space-between',
      paddingBottom: 20,
    },
    resultContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    resultText: {
      fontSize: 32,
      fontFamily: 'fredoka',
      fontWeight: '600',
      textAlign: 'center',
      marginTop: 10,
      marginBottom: 30,
    },
    explanationText: {
      fontSize: 25,
      fontFamily: 'fredoka',
      textAlign: 'center',
      lineHeight: 24,
      color: '#333',
      maxWidth: '90%',
      fontWeight: '500',
      textTransform: 'uppercase',
    },
    nextButton: {
      backgroundColor: '#0094E7',
      borderColor: '#006DAB',
      marginTop: 20,
      width: '100%',
    },
});

export default HomeScreen;
