import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
  ActivityIndicator
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect } from '@react-navigation/native';
import { loadHabitsLocal, saveHabitsLocal, loadUserProgress, saveUserProgress } from '../services/storage';
import { fetchHabits, updateHabit, saveDailyRecord } from '../services/api';
import { calculateXPGain, calculateLevel, canCompleteHabit, shouldResetStreak } from '../utils/gameLogic';

export default function HomeScreen({ navigation }) {
  const [habits, setHabits] = useState([]);
  const [userProgress, setUserProgress] = useState({ xp: 0, level: 1 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      const localHabits = await loadHabitsLocal();
      const localProgress = await loadUserProgress();
      
      const normalizedHabits = normalizeHabitsForToday(localHabits);
      setHabits(normalizedHabits);
      await saveHabitsLocal(normalizedHabits);

      setUserProgress(localProgress);

      try {
        const apiHabits = await fetchHabits();
        
       if (apiHabits && apiHabits.length > 0) {
       const normalizedHabits = normalizeHabitsForToday(apiHabits);
       setHabits(normalizedHabits);
       await saveHabitsLocal(normalizedHabits);
       }

        setIsOnline(true);
      } catch (error) {
        setIsOnline(false);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const normalizeHabitsForToday = (habits) => {
  const today = new Date();

  return habits.map(habit => {
    if (!habit.lastCompletedDate) {
      return {
        ...habit,
        completedToday: false
      };
    }

    const lastCompleted = new Date(habit.lastCompletedDate);

    const completedToday =
      lastCompleted.getFullYear() === today.getFullYear() &&
      lastCompleted.getMonth() === today.getMonth() &&
      lastCompleted.getDate() === today.getDate();

    if (shouldResetStreak(habit.lastCompletedDate)) {
      return {
        ...habit,
        streak: 0,
        completedToday: false
      };
    }

    return {
      ...habit,
      completedToday
    };
  });
};

 const completeHabit = async (habit) => {
  if (!canCompleteHabit(habit.lastCompletedDate)) {
    setTimeout(() => {
      Alert.alert('Atenção', 'Você já marcou este hábito hoje!');
    }, 0);
    return;
  }

  try {
    const currentStreak = habit.streak || 0;
    const xpGain = calculateXPGain(currentStreak);
    const newXP = userProgress.xp + xpGain.totalXP;
    const newLevel = calculateLevel(newXP);

    const updatedHabits = habits.map(h => {
      if (h.id === habit.id) {
        return {
          ...h,
          streak: xpGain.newStreak,
          lastCompletedDate: new Date().toISOString(),
          completedToday: true
        };
      }
      return h;
    });

    const updatedProgress = { xp: newXP, level: newLevel };

    setHabits(updatedHabits);
    setUserProgress(updatedProgress);

    setTimeout(() => {
      if (xpGain.bonusXP > 0) {
        Alert.alert(
          '🎉 Bônus de Streak!',
          `+${xpGain.baseXP} XP + ${xpGain.bonusXP} XP de bônus!
${xpGain.newStreak} dias consecutivos!`
        );
      } else {
        Alert.alert(
          '✅ Hábito Concluído!',
          `+${xpGain.baseXP} XP
Streak: ${xpGain.newStreak} dias`
        );
      }
    }, 0);

    saveHabitsLocal(updatedHabits);
    saveUserProgress(updatedProgress);

    (async () => {
      try {
        await updateHabit(habit.id, {
          streak: xpGain.newStreak,
          lastCompletedDate: new Date().toISOString(),
          completedToday: true
        });

        await saveDailyRecord({
          habitId: habit.id,
          date: new Date().toISOString(),
          xpGained: xpGain.totalXP
        });
      } catch (error) {
        console.log('Erro ao sincronizar, salvo localmente');
      }
    })();

  } catch (error) {
    console.error('Erro ao completar hábito:', error);

    setTimeout(() => {
      Alert.alert('Erro', 'Não foi possível marcar o hábito');
    }, 0);
  }
};

  const renderHabit = ({ item }) => {
    const completedToday = item.completedToday || false;
    const streak = item.streak || 0;
    
    return (
      <TouchableOpacity
        style={[styles.habitCard, completedToday && styles.habitCardCompleted]}
        onPress={() => !completedToday && completeHabit(item)}
        disabled={completedToday}
        activeOpacity={0.7}
      >
        <View style={styles.habitInfo}>
          <Text style={[styles.habitName, completedToday && styles.habitNameCompleted]}>
            {item.name}
          </Text>
          <View style={styles.streakContainer}>
            <Text style={styles.streakIcon}>🔥</Text>
            <Text style={styles.streakText}>{streak} dias</Text>
          </View>
        </View>
        
        <View style={[
          styles.checkButton,
          completedToday && styles.checkButtonCompleted
        ]}>
          <Text style={styles.checkIcon}>
            {completedToday ? '✓' : '○'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const completedCount = habits.filter(h => h.completedToday).length;
  const totalHabits = habits.length;
  const longestStreak = habits.length > 0 
    ? Math.max(...habits.map(h => h.streak || 0)) 
    : 0;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={styles.loadingText}>Carregando seus hábitos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View>
            <Text style={styles.title}>Meus Hábitos</Text>
            <Text style={styles.subtitle}>
              {new Date().toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long' 
              })}
            </Text>
          </View>
        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.levelBadge}
            onPress={() => navigation.navigate('Progress')}
          >
            <Text style={styles.levelNumber}>{userProgress.level}</Text>
            <Text style={styles.levelLabel}>Nível</Text>
          </TouchableOpacity>
        </View>
      </View>

      {!isOnline && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>📡 Modo Offline</Text>
        </View>
      )}

      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{completedCount}/{totalHabits}</Text>
          <Text style={styles.statLabel}>Hoje</Text>
        </View>
        
        <View style={styles.statDivider} />
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{longestStreak}</Text>
          <Text style={styles.statLabel}>Melhor Streak</Text>
        </View>
        
        <View style={styles.statDivider} />
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{userProgress.xp}</Text>
          <Text style={styles.statLabel}>XP Total</Text>
        </View>
      </View>

      {habits.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📝</Text>
          <Text style={styles.emptyTitle}>Nenhum hábito ainda</Text>
          <Text style={styles.emptyText}>
            Toque no botão + para adicionar seu primeiro hábito!
          </Text>
        </View>
      ) : (
        <FlatList
          data={habits}
          renderItem={renderHabit}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#8B5CF6']}
            />
          }
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddHabit')}
        activeOpacity={0.8}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB'
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF'
  },
  headerLeft: {
    flex: 1
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center'
  },
  settingsIcon: {
    fontSize: 20
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827'
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    textTransform: 'capitalize'
  },
  levelBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8
  },
  levelNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF'
  },
  levelLabel: {
    fontSize: 10,
    color: '#FFFFFF',
    marginTop: 2
  },
  offlineBanner: {
    backgroundColor: '#FEF3C7',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#FCD34D'
  },
  offlineText: {
    fontSize: 13,
    color: '#92400E',
    textAlign: 'center'
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3
  },
  statItem: {
    flex: 1,
    alignItems: 'center'
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B5CF6'
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100
  },
  habitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2
  },
  habitCardCompleted: {
    opacity: 0.7,
    backgroundColor: '#F3F4F6'
  },
  habitInfo: {
    flex: 1
  },
  habitName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6
  },
  habitNameCompleted: {
    textDecorationLine: 'line-through',
    color: '#6B7280'
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  streakIcon: {
    fontSize: 14,
    marginRight: 4
  },
  streakText: {
    fontSize: 14,
    color: '#6B7280'
  },
  checkButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12
  },
  checkButtonCompleted: {
    backgroundColor: '#10B981'
  },
  checkIcon: {
    fontSize: 24,
    color: '#6B7280',
    fontWeight: 'bold'
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center'
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8
  },
  addButtonText: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: '400',
    lineHeight: 32,
    textAlign: 'center',
    textAlignVertical: 'center',
    marginTop: -1
  }
});
