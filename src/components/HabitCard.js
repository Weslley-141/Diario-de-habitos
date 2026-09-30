import React from "react";
import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';
export default function HabitCard ({ habit, onComplete, disabled }){
    const isComplete = habit.completedToday || false;
    const streak = habit.streak || 0;
    const hasStreakBonus = streak > 0 && streak % 5 === 0;
    
    return (
        <TouchableOpacity
          style={[styles.card, isComplete && styles.cardCompleted]}
          onPress={() => !disabled && !isComplete && onComplete(habit)}
          disabled={disabled || isComplete}
          activeOpacity={0.7}
        >
            <View style={styles.info}>
                <Text style={[styles.name, isComplete && styles.nameCompleted]}>
                    {habit.name}
                </Text>

                <View style={styles.streakContainer}>
                    <Text style={styles.streakIcon}>🔥</Text>
                    <Text style={styles.streakText}>{streak} dias</Text>

                    {hasStreakBonus && (
                        <View style={styles.bonusBadge}>
                            <Text style={styles.bonusBadgeText}>Bônus +5 XP</Text>
                        </View>
                    )}
                </View>
            </View>

            <View style={[
                styles.checkButton,
                isComplete && styles.checkButtonCompleted 
            ]}>
                <Text style={styles.checkIcon}>
                    {isComplete ? '✓' : '○'}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
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

    cardCompleted: {
        opacity: 0.7,
        backgroundColor: '#F3F4F6'
    },

    info: {
        flex: 1
    },

    name: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 6
    },
    nameCompleted: {
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
    bonusBadge: {
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
        marginLeft: 8
    },
    bonusBadgeText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#92400E'
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
    }
});
