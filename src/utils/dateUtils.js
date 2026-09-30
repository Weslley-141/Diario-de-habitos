export const formatDateLong = (date) => {
  const dateObj = new Date(date);
  
  return dateObj.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });
};

export const formatDateShort = (date) => {
  const dateObj = new Date(date);
  
  return dateObj.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const formatTime = (date) => {
  const dateObj = new Date(date);
  
  return dateObj.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const isSameDay = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

export const isToday = (date) => {
  return isSameDay(date, new Date());
};

export const isYesterday = (date) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return isSameDay(date, yesterday);
};

export const getDaysDifference = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);
  
  const diffTime = Math.abs(d2 - d1);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

export const getStartOfDay = (date = new Date()) => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  return startOfDay;
};

export const getEndOfDay = (date = new Date()) => {
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  return endOfDay;
};

export const shouldResetDailyProgress = (lastDate) => {
  if (!lastDate) return false;
  
  const today = getStartOfDay();
  const lastDay = getStartOfDay(new Date(lastDate));
  
  return today > lastDay;
};

export const getWeekdayName = (date) => {
  const dateObj = new Date(date);
  
  return dateObj.toLocaleDateString('pt-BR', {
    weekday: 'long'
  });
};

export const getMonthName = (date) => {
  const dateObj = new Date(date);
  
  return dateObj.toLocaleDateString('pt-BR', {
    month: 'long'
  });
};

export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const subtractDays = (date, days) => {
  return addDays(date, -days);
};

export const getLastNDays = (n) => {
  const days = [];
  const today = new Date();
  
  for (let i = n - 1; i >= 0; i--) {
    const day = subtractDays(today, i);
    days.push(getStartOfDay(day));
  }
  
  return days;
};

export const parseNotificationTime = (timeString) => {
  const [hours, minutes] = timeString.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
};

export const hasNotificationTimePassed = (timeString) => {
  const notificationTime = parseNotificationTime(timeString);
  const now = new Date();
  return now > notificationTime;
};

export const getNextNotificationTime = (timeString) => {
  const notificationTime = parseNotificationTime(timeString);
  
  if (hasNotificationTimePassed(timeString)) {
    return addDays(notificationTime, 1);
  }
  
  return notificationTime;
};

export const formatRelativeDate = (date) => {
  if (isToday(date)) return 'hoje';
  if (isYesterday(date)) return 'ontem';
  
  const days = getDaysDifference(date, new Date());
  
  if (days === 0) return 'hoje';
  if (days === 1) return 'ontem';
  if (days < 7) return `${days} dias atrás`;
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return weeks === 1 ? '1 semana atrás' : `${weeks} semanas atrás`;
  }
  
  const months = Math.floor(days / 30);
  return months === 1 ? '1 mês atrás' : `${months} meses atrás`;
};
