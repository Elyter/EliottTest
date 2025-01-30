import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import CustomButton from '../components/CustomButton';

type ResultsScreenProps = {
  navigation: any;
  route: {
    params: {
      score: number;
      answeredQuestions: Array<{
        text: string;
        isCorrect: boolean;
      }>;
    };
  };
};

const ResultsScreen = ({ navigation, route }: ResultsScreenProps) => {
  const { score, answeredQuestions } = route.params;

  const restartGame = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Résultats</Text>
      <Text style={styles.scoreText}>Score final: {score}/10</Text>
      <ScrollView style={styles.questionsContainer}>
        {answeredQuestions.map((question, index) => (
          <View
            key={index}
            style={[
              styles.questionItem,
              { backgroundColor: question.isCorrect ? '#E8F5E9' : '#FFEBEE' }
            ]}
          >
            <Text style={styles.questionText}>{question.text}</Text>
            <Text 
              style={[
                styles.resultIndicator, 
                { color: question.isCorrect ? '#1D9D00' : '#E70004' }
              ]}
            >
              {question.isCorrect ? '✓' : '✗'}
            </Text>
          </View>
        ))}
      </ScrollView>
      
      <CustomButton
        text="Recommencer"
        onPress={restartGame}
        variant="blue"
        style={styles.restartButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingBottom: 40,
  },
  titleText: {
    fontSize: 32,
    fontFamily: 'fredoka',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  scoreText: {
    fontSize: 24,
    fontFamily: 'fredoka',
    textAlign: 'center',
    marginBottom: 30,
    color: '#0094E7',
    fontWeight: '500',
  },
  questionsContainer: {
    flex: 1,
    marginBottom: 24,
  },
  questionItem: {
    padding: 16,
    marginVertical: 6,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  questionText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'fredoka',
    color: '#333',
    marginRight: 10,
  },
  resultIndicator: {
    fontSize: 24,
    fontFamily: 'fredoka',
    fontWeight: '600',
  },
  restartButton: {
    width: '100%',
    marginTop: 10,
  },
});

export default ResultsScreen;