import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  HABITS: '@habits',
  USER_PROGRESS: '@user_progress',
  LAST_SYNC: '@last_sync',
  NOTIFICATION_TIME: '@notification_time'
};

export const saveHabitsLocal = async (habits) => {
  try {
    const cleanedHabits = habits.map(({ completedToday, ...rest }) => rest);
    await AsyncStorage.setItem(KEYS.HABITS, JSON.stringify(cleanedHabits));
    return true;
  } catch (error) {
    console.error('Erro ao salvar hábitos:', error);
    return false;
  }
};

export const loadHabitsLocal = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(KEYS.HABITS);
    return jsonValue ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Erro ao carregar hábitos:', error);
    return [];
  }
};

export const saveUserProgress = async (progress) => {
  try {
    await AsyncStorage.setItem(KEYS.USER_PROGRESS, JSON.stringify(progress));
    return true;
  } catch (error) {
    console.error('Erro ao salvar progresso:', error);
    return false;
  }
};

export const loadUserProgress = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(KEYS.USER_PROGRESS);
    return jsonValue ? JSON.parse(jsonValue) : { xp: 0, level: 1 };
  } catch (error) {
    console.error('Erro ao carregar progresso:', error);
    return { xp: 0, level: 1 };
  }
};

export const saveLastSync = async () => {
  try {
    const timestamp = new Date().toISOString();
    await AsyncStorage.setItem(KEYS.LAST_SYNC, timestamp);
    return true;
  } catch (error) {
    console.error('Erro ao salvar última sync:', error);
    return false;
  }
};

export const loadLastSync = async () => {
  try {
    const timestamp = await AsyncStorage.getItem(KEYS.LAST_SYNC);
    return timestamp;
  } catch (error) {
    console.error('Erro ao carregar última sync:', error);
    return null;
  }
};

export const saveNotificationTime = async (time) => {
  try {
    await AsyncStorage.setItem(KEYS.NOTIFICATION_TIME, time);
    return true;
  } catch (error) {
    console.error('Erro ao salvar horário de notificação:', error);
    return false;
  }
};

export const loadNotificationTime = async () => {
  try {
    const time = await AsyncStorage.getItem(KEYS.NOTIFICATION_TIME);
    return time || '20:00';
  } catch (error) {
    console.error('Erro ao carregar horário de notificação:', error);
    return '20:00';
  }
};

export const clearAllData = async () => {
  try {
    await AsyncStorage.multiRemove([
      KEYS.HABITS,
      KEYS.USER_PROGRESS,
      KEYS.LAST_SYNC,
      KEYS.NOTIFICATION_TIME
    ]);
    return true;
  } catch (error) {
    console.error('Erro ao limpar dados:', error);
    return false;
  }
};

export const hasStoredData = async () => {
  try {
    const habits = await AsyncStorage.getItem(KEYS.HABITS);
    return habits !== null;
  } catch (error) {
    console.error('Erro ao verificar dados:', error);
    return false;
  }
};
