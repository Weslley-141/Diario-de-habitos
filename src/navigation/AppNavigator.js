import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import AddHabitScreen from '../screens/AddHabitScreen';
import ProgressScreen from '../screens/ProgressScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: '#F9FAFB' }
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            title: 'Meus Hábitos'
          }}
        />

        <Stack.Screen 
          name="AddHabit" 
          component={AddHabitScreen}
          options={{
            title: 'Novo Hábito',
            animation: 'slide_from_bottom' 
          }}
        />

        <Stack.Screen 
          name="Progress" 
          component={ProgressScreen}
          options={{
            title: 'Meu Progresso'
          }}
        />

        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{
            title: 'Configurações'
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
