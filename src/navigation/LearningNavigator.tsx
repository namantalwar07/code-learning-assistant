import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AppColors } from '../theme';
import { ErrorExplainerScreen } from '../screens/ErrorExplainerScreen';
import { HintModeScreen } from '../screens/HintModeScreen';
import { LearningHistoryScreen } from '../screens/LearningHistoryScreen';
import { CodePlaygroundScreen } from '../screens/CodePlaygroundScreen';
import { SmartChatScreen } from '../screens/SmartChatScreen';

const Tab = createBottomTabNavigator();

export const LearningNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: AppColors.surfaceCard,
          borderTopColor: AppColors.textMuted + '1A',
        },
        tabBarActiveTintColor: AppColors.accentCyan,
        tabBarInactiveTintColor: AppColors.textMuted,
        headerStyle: {
          backgroundColor: AppColors.primaryDark,
        },
        headerTintColor: AppColors.textPrimary,
      }}
    >
      <Tab.Screen 
        name="ErrorExplainer" 
        component={ErrorExplainerScreen}
        options={{
          title: 'Error Helper',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🐛</Text>,
        }}
      />
      <Tab.Screen 
        name="HintMode" 
        component={HintModeScreen}
        options={{
          title: 'Hint Mode',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>💡</Text>,
        }}
      />
      <Tab.Screen 
        name="History" 
        component={LearningHistoryScreen}
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>📚</Text>,
        }}
      />
      <Tab.Screen 
        name="Playground" 
        component={CodePlaygroundScreen}
        options={{
          title: 'Playground',
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>⚡</Text>,
        }}
      />

      <Tab.Screen 
        name="Chat" 
        component={SmartChatScreen}
        options={{
          title: 'Ask AI',
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>💬</Text>,
        }}
       />
    </Tab.Navigator>
  );
};
