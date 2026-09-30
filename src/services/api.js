import AsyncStorage from '@react-native-async-storage/async-storage';

const simulateNetworkDelay = () =>
  new Promise(resolve => setTimeout(resolve, 300));

const STORAGE_KEYS = {
  HABITS: '@api_habits',
  USER_PROGRESS: '@api_user_progress',
  DAILY_RECORDS: '@api_daily_records'
};

export const fetchHabits = async () => {
  try {
    await simulateNetworkDelay();
    const data = await AsyncStorage.getItem(STORAGE_KEYS.HABITS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Erro ao buscar hábitos:', error);
    throw error;
  }
};

export const createHabit = async (habitData) => {
  try {
    await simulateNetworkDelay();

    const habits = await fetchHabits();

    const newHabit = {
      id: Date.now().toString(),
      name: habitData.name,
      streak: 0,
      active: true,
      createdAt: new Date().toISOString(),
      lastCompletedDate: null
    };

    habits.push(newHabit);
    await AsyncStorage.setItem(
      STORAGE_KEYS.HABITS,
      JSON.stringify(habits)
    );

    return newHabit;
  } catch (error) {
    console.error('Erro ao criar hábito:', error);
    throw error;
  }
};

export const updateHabit = async (habitId, updates) => {
  try {
    await simulateNetworkDelay();

    const habits = await fetchHabits();
    const index = habits.findIndex(
      h => h.id.toString() === habitId.toString()
    );

    if (index === -1) {
      throw new Error('Hábito não encontrado');
    }

    const { completedToday, ...safeUpdates } = updates;

    habits[index] = {
      ...habits[index],
      ...safeUpdates
    };

    await AsyncStorage.setItem(
      STORAGE_KEYS.HABITS,
      JSON.stringify(habits)
    );

    return habits[index];
  } catch (error) {
    console.error('Erro ao atualizar hábito:', error);
    throw error;
  }
};

export const deleteHabit = async (habitId) => {
  try {
    await simulateNetworkDelay();

    const habits = await fetchHabits();
    const filtered = habits.filter(
      h => h.id.toString() !== habitId.toString()
    );

    await AsyncStorage.setItem(
      STORAGE_KEYS.HABITS,
      JSON.stringify(filtered)
    );

    return { success: true };
  } catch (error) {
    console.error('Erro ao deletar hábito:', error);
    throw error;
  }
};

export const fetchUserProgress = async () => {
  try {
    await simulateNetworkDelay();
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
    return data ? JSON.parse(data) : { xp: 0, level: 1 };
  } catch (error) {
    console.error('Erro ao buscar progresso:', error);
    throw error;
  }
};

export const saveProgressToAPI = async (progress) => {
  try {
    await simulateNetworkDelay();

    const progressData = {
      xp: progress.xp,
      level: progress.level,
      updatedAt: new Date().toISOString()
    };

    await AsyncStorage.setItem(
      STORAGE_KEYS.USER_PROGRESS,
      JSON.stringify(progressData)
    );

    return progressData;
  } catch (error) {
    console.error('Erro ao salvar progresso:', error);
    throw error;
  }
};

export const saveDailyRecord = async (record) => {
  try {
    await simulateNetworkDelay();

    const data = await AsyncStorage.getItem(STORAGE_KEYS.DAILY_RECORDS);
    const records = data ? JSON.parse(data) : [];

    const dailyRecord = {
      id: Date.now().toString(),
      habitId: record.habitId,
      date: record.date,
      xpGained: record.xpGained,
      streakAtCompletion: record.streakAtCompletion || 0,
      completedAt: new Date().toISOString()
    };

    records.push(dailyRecord);

    await AsyncStorage.setItem(
      STORAGE_KEYS.DAILY_RECORDS,
      JSON.stringify(records)
    );

    return dailyRecord;
  } catch (error) {
    console.error('Erro ao salvar registro diário:', error);
    throw error;
  }
};

export const fetchDailyRecords = async (startDate, endDate) => {
  try {
    await simulateNetworkDelay();

    const data = await AsyncStorage.getItem(STORAGE_KEYS.DAILY_RECORDS);
    const records = data ? JSON.parse(data) : [];

    if (startDate || endDate) {
      return records.filter(record => {
        const recordDate = new Date(record.date);
        const afterStart = !startDate || recordDate >= startDate;
        const beforeEnd = !endDate || recordDate <= endDate;
        return afterStart && beforeEnd;
      });
    }

    return records;
  } catch (error) {
    console.error('Erro ao buscar registros diários:', error);
    throw error;
  }
};

export const clearAPIData = async () => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.HABITS,
      STORAGE_KEYS.USER_PROGRESS,
      STORAGE_KEYS.DAILY_RECORDS
    ]);
    return true;
  } catch (error) {
    console.error('Erro ao limpar dados:', error);
    return false;
  }
};
