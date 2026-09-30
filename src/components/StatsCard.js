import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function StatsCard({ 
  icon, 
  value, 
  label, 
  color = '#8B5CF6',
  size = 'medium'
}) {
  const sizeStyles = {
    small: {
      container: styles.containerSmall,
      icon: styles.iconSmall,
      value: styles.valueSmall,
      label: styles.labelSmall
    },
    medium: {
      container: styles.containerMedium,
      icon: styles.iconMedium,
      value: styles.valueMedium,
      label: styles.labelMedium
    },
    large: {
      container: styles.containerLarge,
      icon: styles.iconLarge,
      value: styles.valueLarge,
      label: styles.labelLarge
    }
  };

  const currentSize = sizeStyles[size] || sizeStyles.medium;

  return (
    <View style={[styles.card, currentSize.container]}>
      <Text style={[styles.icon, currentSize.icon]}>{icon}</Text>
      <Text style={[styles.value, currentSize.value, { color }]}>
        {value}
      </Text>
      <Text style={[styles.label, currentSize.label]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2
  },
  containerSmall: {
    padding: 12,
    minWidth: 80
  },
  containerMedium: {
    padding: 16,
    minWidth: 100
  },
  containerLarge: {
    padding: 20,
    minWidth: 120
  },
  icon: {
    marginBottom: 8
  },
  iconSmall: {
    fontSize: 20
  },
  iconMedium: {
    fontSize: 28
  },
  iconLarge: {
    fontSize: 36
  },
  value: {
    fontWeight: 'bold',
    marginBottom: 4
  },
  valueSmall: {
    fontSize: 18
  },
  valueMedium: {
    fontSize: 24
  },
  valueLarge: {
    fontSize: 32
  },
  label: {
    color: '#6B7280',
    textAlign: 'center'
  },
  labelSmall: {
    fontSize: 10
  },
  labelMedium: {
    fontSize: 11
  },
  labelLarge: {
    fontSize: 13
  }
});
