import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function LevelBadge({ 
  level, 
  size = 'medium',
  showLabel = true,
  onPress,
  color = '#8B5CF6'
}) {
  const sizeConfig = {
    small: {
      badge: 48,
      number: 20,
      label: 9
    },
    medium: {
      badge: 64,
      number: 24,
      label: 10
    },
    large: {
      badge: 80,
      number: 36,
      label: 12
    }
  };

  const config = sizeConfig[size] || sizeConfig.medium;
  const badgeSize = config.badge;
  const radius = badgeSize / 2;

  const BadgeContent = (
    <View style={styles.container}>
      <View 
        style={[
          styles.badge, 
          { 
            width: badgeSize, 
            height: badgeSize, 
            borderRadius: radius,
            backgroundColor: color 
          }
        ]}
      >
        <Text style={[styles.number, { fontSize: config.number }]}>
          {level}
        </Text>
      </View>
      
      {showLabel && (
        <Text style={[styles.label, { fontSize: config.label }]}>
          Nível
        </Text>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {BadgeContent}
      </TouchableOpacity>
    );
  }

  return BadgeContent;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  badge: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8
  },
  number: {
    fontWeight: 'bold',
    color: '#FFFFFF'
  },
  label: {
    color: '#6B7280',
    marginTop: 4,
    fontWeight: '500'
  }
});
