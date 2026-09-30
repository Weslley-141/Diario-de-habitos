import React, { memo, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const getLocalDateKey = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const MiniCalendar = ({ habitId, dailyRecords = [] }) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const todayKey = getLocalDateKey(today);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const emptyDays = Array.from({ length: firstDayOfMonth });
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const markedDays = useMemo(() => {
    return new Set(
      dailyRecords
        .filter(r => String(r.habitId) === String(habitId))
        .map(r => getLocalDateKey(r.date))
    );
  }, [dailyRecords, habitId]);

  const monthName = today.toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <View style={styles.container}>
      <Text style={styles.monthTitle}>{monthName}</Text>

      <View style={styles.weekHeader}>
        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(d => (
          <Text key={d} style={styles.weekDay}>{d}</Text>
        ))}
      </View>

      <View style={styles.divider} />

      <View style={styles.calendar}>
        {emptyDays.map((_, index) => (
          <View key={`empty-${index}`} style={styles.dayCell} />
        ))}

        {daysArray.map(day => {
          const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const isMarked = markedDays.has(dateKey);
          const isToday = dateKey === todayKey;

          return (
            <View
              key={day}
              style={[
                styles.dayCell,
                isToday && styles.todayCell
              ]}
            >
              <Text
                style={[
                  styles.dayNumber,
                  isToday && styles.todayNumber
                ]}
              >
                {day}
              </Text>

              <View
                style={[
                  styles.statusBox,
                  isMarked ? styles.statusMarked : styles.statusNotMarked,
                  isToday && styles.todayStatusBox
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    isMarked ? styles.statusTextMarked : styles.statusTextNotMarked
                  ]}
                >
                  {isMarked ? '✅' : '❌'}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default memo(MiniCalendar);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginTop: 8
  },

  monthTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
    textTransform: 'capitalize'
  },

  weekHeader: {
    flexDirection: 'row',
    marginBottom: 8
  },

  weekDay: {
    width: '14.28%',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280'
  },

  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginBottom: 10
  },

  calendar: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },

  dayCell: {
    width: '14.28%',
    alignItems: 'center',
    marginBottom: 14
  },

  dayNumber: {
    fontSize: 12,
    color: '#374151',
    marginBottom: 4
  },

  statusBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center'
  },

  statusMarked: {
    backgroundColor: '#DCFCE7'
  },

  statusNotMarked: {
    backgroundColor: '#F3F4F6'
  },

  statusText: {
    fontSize: 12,
    fontWeight: '700'
  },

  statusTextMarked: {
    color: '#16A34A'
  },

  statusTextNotMarked: {
    color: '#9CA3AF'
  },

  todayCell: {
    backgroundColor: '#EEF2FF',
    borderRadius: 8,
    paddingVertical: 4
  },

  todayNumber: {
    fontWeight: '700',
    color: '#4F46E5'
  },

  todayStatusBox: {
    borderWidth: 1,
    borderColor: '#4F46E5'
  }
});
