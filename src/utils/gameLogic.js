const LEVEL_THRESHOLDS = [
  { level: 1, minXP: 0, maxXP: 99 },
  { level: 2, minXP: 100, maxXP: 249 },
  { level: 3, minXP: 250, maxXP: 499 },
  { level: 4, minXP: 500, maxXP: 999 },
  { level: 5, minXP: 1000, maxXP: Infinity }
];

const XP_PER_HABIT = 10;
const XP_BONUS_STREAK = 5;
const STREAK_BONUS_INTERVAL = 5;

export const calculateLevel = (xp) => {
  const level = LEVEL_THRESHOLDS.find(
    threshold => xp >= threshold.minXP && xp <= threshold.maxXP
  );
  return level ? level.level : 1;
};

export const calculateXPGain = (currentStreak) => {
  const baseXP = XP_PER_HABIT;
  const newStreak = currentStreak + 1;
  
  const bonusXP = newStreak % STREAK_BONUS_INTERVAL === 0 ? XP_BONUS_STREAK : 0;
  
  return {
    baseXP,
    bonusXP,
    totalXP: baseXP + bonusXP,
    newStreak
  };
};

export const getXPForNextLevel = (currentLevel) => {
  if (currentLevel >= 5) return null;
  
  const nextLevel = LEVEL_THRESHOLDS.find(t => t.level === currentLevel + 1);
  return nextLevel ? nextLevel.minXP : null;
};

export const getLevelProgress = (xp, currentLevel) => {
  if (currentLevel >= 5) return 100;
  
  const currentThreshold = LEVEL_THRESHOLDS.find(t => t.level === currentLevel);
  const nextThreshold = LEVEL_THRESHOLDS.find(t => t.level === currentLevel + 1);
  
  if (!currentThreshold || !nextThreshold) return 0;
  
  const xpInCurrentLevel = xp - currentThreshold.minXP;
  const xpNeededForNextLevel = nextThreshold.minXP - currentThreshold.minXP;
  
  return Math.min((xpInCurrentLevel / xpNeededForNextLevel) * 100, 100);
};

export const isSameDay = (date1, date2) => {
  if (!date1 || !date2) return false;
  
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

export const canCompleteHabit = (lastCompletedDate) => {
  if (!lastCompletedDate) return true;
  
  const today = new Date();
  const lastCompleted = new Date(lastCompletedDate);
  
  return !isSameDay(today, lastCompleted);
};

export const shouldResetStreak = (lastCompletedDate) => {
  if (!lastCompletedDate) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const lastCompleted = new Date(lastCompletedDate);
  lastCompleted.setHours(0, 0, 0, 0);
  
  const diffTime = today.getTime() - lastCompleted.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays >= 2;
};

export const GAME_CONSTANTS = {
  XP_PER_HABIT,
  XP_BONUS_STREAK,
  STREAK_BONUS_INTERVAL,
  LEVEL_THRESHOLDS
};
