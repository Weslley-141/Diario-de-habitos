import React, { useState, memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MiniCalendar from './MiniCalendar';

const HabitMonthlyPanel = ({ habit, dailyRecords }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <View style={styles.container}>
            <TouchableOpacity
              style={styles.header}
              onPress={() => setExpanded(prev => !prev)}
              activeOpacity={0.7}
            >
                <Text style={styles.habitName}>{habit.name}</Text>
                <Text style={styles.arrow}>{expanded ? '▲' : '▼'}</Text>
            </TouchableOpacity>

            {expanded && (
                <MiniCalendar
                  habitId={habit.id}
                  dailyRecords={dailyRecords}
                />
            )}
        </View>
    );
};

export default memo(HabitMonthlyPanel);

const styles = StyleSheet.create({
    container: {
        marginBottom: 12,
        borderRadius: 8,
        backgroundColor: '#999999',
        overflow: 'hidden'
    },

    header: {
        padding: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    habitName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#FFFFFF',
    },

    arrow: {
        fontSize: 14,
        color: '#AAAAAA'
    }
});
