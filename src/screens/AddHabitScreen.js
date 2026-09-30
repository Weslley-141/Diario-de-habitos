import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { createHabit } from '../services/api';
import { loadHabitsLocal, saveHabitsLocal } from '../services/storage';

export default function AddHabitScreen({ navigation }) {
  const [habitName, setHabitName] = useState('');
  const [loading, setLoading] = useState(false);

  const suggestions = [
    '💧 Beber 2L de água',
    '📚 Ler 30 minutos',
    '🏃 Exercícios físicos',
    '🧘 Meditar 10 minutos',
    '🥗 Comer salada',
    '😴 Dormir antes das 23h',
    '📝 Escrever no diário',
    '🎨 Praticar hobby',
    '📱 Menos redes sociais',
    '🧹 Organizar ambiente'
  ];

  const validateHabitName = (name) => {
    if (!name.trim()) {
      Alert.alert('Atenção', 'Digite um nome para o hábito');
      return false;
    }

    if (name.trim().length < 3) {
      Alert.alert('Atenção', 'O nome deve ter no mínimo 3 caracteres');
      return false;
    }

    if (name.trim().length > 50) {
      Alert.alert('Atenção', 'O nome deve ter no máximo 50 caracteres');
      return false;
    }

    return true;
  };

  const handleSaveHabit = async () => {
    if (!validateHabitName(habitName)) return;

    setLoading(true);

    try {
      const newHabit = await createHabit({ name: habitName.trim() });

      const localHabits = await loadHabitsLocal();
      localHabits.push(newHabit);
      await saveHabitsLocal(localHabits);

      Alert.alert(
        '✅ Hábito criado!',
        `"${habitName.trim()}" foi adicionado aos seus hábitos`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      console.error('Erro ao criar hábito:', error);
      Alert.alert(
        'Erro',
        'Não foi possível criar o hábito. Tente novamente.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const useSuggestion = (suggestion) => {
    const cleanName = suggestion.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim();
    setHabitName(cleanName);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Novo Hábito</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.label}>Nome do Hábito</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Ler 30 minutos por dia"
            placeholderTextColor="#9CA3AF"
            value={habitName}
            onChangeText={setHabitName}
            maxLength={50}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleSaveHabit}
          />
          <Text style={styles.counter}>
            {habitName.length}/50 caracteres
          </Text>

          <View style={styles.infoBox}>
            <Text style={styles.infoIcon}>ℹ️</Text>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>Hábitos Diários</Text>
              <Text style={styles.infoText}>
                Todos os hábitos são diários e devem ser marcados a cada dia.
                Mantenha sua streak ativa para ganhar bônus de XP!
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.suggestionsSection}>
          <Text style={styles.suggestionsTitle}>💡 Sugestões Populares</Text>
          <Text style={styles.suggestionsSubtitle}>
            Toque em uma sugestão para usar
          </Text>

          <View style={styles.suggestionsGrid}>
            {suggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionChip}
                onPress={() => useSuggestion(suggestion)}
                activeOpacity={0.7}
              >
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>✨ Dicas para Bons Hábitos</Text>
          
          <View style={styles.tip}>
            <Text style={styles.tipNumber}>1</Text>
            <Text style={styles.tipText}>
              <Text style={styles.tipBold}>Seja específico:</Text> "Ler 30 minutos" é melhor que "Ler mais"
            </Text>
          </View>

          <View style={styles.tip}>
            <Text style={styles.tipNumber}>2</Text>
            <Text style={styles.tipText}>
              <Text style={styles.tipBold}>Comece pequeno:</Text> É melhor fazer pouco todo dia do que muito de vez em quando
            </Text>
          </View>

          <View style={styles.tip}>
            <Text style={styles.tipNumber}>3</Text>
            <Text style={styles.tipText}>
              <Text style={styles.tipBold}>Consistência é chave:</Text> Mantenha sua streak ativa para ganhar bônus a cada 5 dias
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.saveButton,
            (!habitName.trim() || loading) && styles.saveButtonDisabled
          ]}
          onPress={handleSaveHabit}
          disabled={!habitName.trim() || loading}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'Salvando...' : 'Criar Hábito'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  backIcon: {
    fontSize: 28,
    color: '#111827'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827'
  },
  placeholder: {
    width: 40
  },
  content: {
    flex: 1
  },
  scrollContent: {
    paddingBottom: 100
  },
  card: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#111827'
  },
  counter: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'right'
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#EEF2FF',
    padding: 16,
    borderRadius: 12,
    marginTop: 20
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 12
  },
  infoTextContainer: {
    flex: 1
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4338CA',
    marginBottom: 4
  },
  infoText: {
    fontSize: 13,
    color: '#6366F1',
    lineHeight: 18
  },
  suggestionsSection: {
    paddingHorizontal: 20,
    marginTop: 8
  },
  suggestionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4
  },
  suggestionsSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16
  },
  suggestionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  suggestionChip: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1
  },
  suggestionText: {
    fontSize: 14,
    color: '#374151'
  },
  tipsSection: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    marginTop: 24,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16
  },
  tip: {
    flexDirection: 'row',
    marginBottom: 16
  },
  tipNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#8B5CF6',
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 12
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20
  },
  tipBold: {
    fontWeight: '600',
    color: '#111827'
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB'
  },
  saveButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6
  },
  saveButtonDisabled: {
    backgroundColor: '#D1D5DB',
    shadowOpacity: 0
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold'
  }
});
