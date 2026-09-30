export const LEVEL_THRESHOLDS = [
  { level: 1, minXP: 0, maxXP: 99 },
  { level: 2, minXP: 100, maxXP: 249 },
  { level: 3, minXP: 250, maxXP: 499 },
  { level: 4, minXP: 500, maxXP: 999 },
  { level: 5, minXP: 1000, maxXP: Infinity }
];

export const XP_PER_HABIT = 10;
export const XP_BONUS_STREAK = 5;
export const STREAK_BONUS_INTERVAL = 5;

export const MAX_LEVEL = 5;

export const LEVEL_MESSAGES = {
  1: 'Iniciante - Comece sua jornada!',
  2: 'Aprendiz - Continue assim!',
  3: 'Dedicado - Você está evoluindo!',
  4: 'Experiente - Quase no topo!',
  5: 'Mestre - Nível máximo alcançado!'
};

export const LEVEL_COLORS = {
  1: '#6B7280',
  2: '#3B82F6',
  3: '#8B5CF6',
  4: '#F59E0B',
  5: '#EF4444'
};

export const LEVEL_ICONS = {
  1: '🌱',
  2: '🌿',
  3: '🌳',
  4: '⭐',
  5: '👑'
};

export const getLevelConfig = (level) => {
  const threshold = LEVEL_THRESHOLDS.find(t => t.level === level);
  
  return {
    level,
    threshold: threshold || LEVEL_THRESHOLDS[0],
    message: LEVEL_MESSAGES[level] || 'Nível desconhecido',
    color: LEVEL_COLORS[level] || '#6B7280',
    icon: LEVEL_ICONS[level] || '❓'
  };
};

export const getTotalXPForLevel = (level) => {
  const threshold = LEVEL_THRESHOLDS.find(t => t.level === level);
  return threshold ? threshold.minXP : 0;
};
