import React, { useRef } from 'react';
import { 
  TouchableWithoutFeedback, 
  Text, 
  StyleSheet, 
  ViewStyle, 
  TextStyle,
  View,
  Animated,
  Easing
} from 'react-native';

interface CustomButtonProps {
  onPress: () => void;
  text: string;
  variant?: 'true' | 'false' | 'blue';
  style?: ViewStyle;
  textStyle?: TextStyle;
  scale?: Animated.Value;
  disabled?: boolean;
}

const getButtonColors = (variant: string) => {
  switch (variant) {
    case 'true':
      return {
        background: '#1D9D00',
        border: '#005E16',
        shadow: '#202020',
      };
    case 'false':
      return {
        background: '#E70004',
        border: '#6B0002',
        shadow: '#000000',
      };
    case 'blue':
      return {
        background: '#0094E7',
        border: '#006DAB',
        shadow: '#202020',
      };
    default:
      return {
        background: '#0094E7',
        border: '#006DAB',
        shadow: '#202020',
      };
  }
};

const CustomButton: React.FC<CustomButtonProps> = ({
  onPress,
  text,
  variant = 'blue',
  style,
  textStyle,
  disabled = false,
}) => {
  const colors = getButtonColors(variant);
  const pressAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.timing(pressAnim, {
      toValue: 1,
      duration: 25,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(pressAnim, {
      toValue: 0,
      duration: 25,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    if (!disabled) {
      onPress();
    }
  };

  const animatedStyle = {
    transform: [
      {
        translateY: pressAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 4],
        }),
      },
    ],
    shadowOpacity: pressAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    }),
  };

  return (
    <TouchableWithoutFeedback
      onPressIn={!disabled ? handlePressIn : undefined}
      onPressOut={!disabled ? handlePressOut : undefined}
      onPress={handlePress}
    >
      <Animated.View
        style={[
          styles.button,
          {
            backgroundColor: colors.background,
            borderColor: colors.border,
            shadowColor: colors.shadow,
          },
          animatedStyle,
          style,
        ]}
      >
        <View style={styles.buttonInnerBorder}>
          <Text style={[styles.buttonText, textStyle]}>{text}</Text>
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 18,
    borderRadius: 16,
    minWidth: 150,
    minHeight: 65,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  buttonInnerBorder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    fontFamily: 'fredoka',
    textAlign: 'center',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});

export default CustomButton;
