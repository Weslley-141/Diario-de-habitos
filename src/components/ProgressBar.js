import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ProgressBar({ 
  currentXP, 
  nextLevelXP, 
  level, 
  showLabel = true,
  showPercentage = true,
  height = 8,
  color = '#8B5CF6'
}) {
  const progress = nextLevelXP ? (currentXP / nextLevelXP) * 100 : 100;
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const isMaxLevel = level >= 5;

  return (
    <View style={styles.container}>
      {showLabel && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>
            {isMaxLevel ? 'Nível Máximo' : `${currentXP} / ${nextLevelXP} XP`}
          </Text>
          {showPercentage && !isMaxLevel && (
            <Text style={styles.percentage}>
              {Math.round(clampedProgress)}%
            </Text>
          )}
        </View>
      )}
      
      <View style={[styles.barBackground, { height }]}>
        <View 
          style={[
            styles.barFill, 
            { 
              width: `${clampedProgress}%`,
              height,
              backgroundColor: color
            }
          ]} 
        />
      </View>

      {showPercentage && !isMaxLevel && (
        <Text style={styles.progressText}>
          {Math.round(clampedProgress)}% para o próximo nível
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%'
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151'
  },
  percentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B5CF6'
  },
  barBackground: {
    width: '100%',
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden'
  },
  barFill: {
    borderRadius: 4,
    transition: 'width 0.3s ease'
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8
  }
});
