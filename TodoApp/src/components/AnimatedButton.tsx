import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { COLORS, SIZES, FONTS } from '../constants';

interface AnimatedButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  style,
  textStyle,
  icon,
}) => {
  const animatedValue = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(animatedValue, {
      toValue: 0.95,
      useNativeDriver: true,
      friction: 8,
      tension: 100,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(animatedValue, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
      tension: 100,
    }).start();
  };

  const getButtonColors = () => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: COLORS.surface,
          borderColor: COLORS.border,
          textColor: COLORS.text,
        };
      case 'danger':
        return {
          backgroundColor: COLORS.danger,
          borderColor: COLORS.danger,
          textColor: COLORS.surface,
        };
      case 'success':
        return {
          backgroundColor: COLORS.success,
          borderColor: COLORS.success,
          textColor: COLORS.surface,
        };
      default:
        return {
          backgroundColor: COLORS.primary,
          borderColor: COLORS.primary,
          textColor: COLORS.surface,
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingHorizontal: SIZES.base,
          paddingVertical: SIZES.base / 2,
          borderRadius: SIZES.base / 2,
        };
      case 'large':
        return {
          paddingHorizontal: SIZES.padding * 2,
          paddingVertical: SIZES.padding,
          borderRadius: SIZES.radius,
        };
      default:
        return {
          paddingHorizontal: SIZES.padding,
          paddingVertical: SIZES.base,
          borderRadius: SIZES.radius,
        };
    }
  };

  const colors = getButtonColors();
  const sizeStyles = getSizeStyles();

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale: animatedValue }],
        },
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={0.8}
        style={[
          styles.button,
          {
            backgroundColor: disabled ? COLORS.border : colors.backgroundColor,
            borderColor: colors.borderColor,
            borderWidth: variant === 'secondary' ? 1 : 0,
            ...sizeStyles,
          },
          style,
        ]}
      >
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <Text
          style={[
            styles.text,
            {
              color: disabled ? COLORS.textSecondary : colors.textColor,
              fontSize: size === 'small' ? 12 : size === 'large' ? 18 : 14,
            },
            textStyle,
          ]}
        >
          {title}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  iconContainer: {
    marginRight: SIZES.base / 2,
  },
});

export default AnimatedButton;
