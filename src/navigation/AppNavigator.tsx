import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import HomeScreen from '../screens/HomeScreen';
import ProjectListScreen from '../screens/ProjectListScreen';
import ProjectEditorScreen from '../screens/ProjectEditorScreen';
import TemplateSelectorScreen from '../screens/TemplateSelectorScreen';
import TemplatePreviewScreen from '../screens/TemplatePreviewScreen';
import GenieAssistantScreen from '../screens/GenieAssistantScreen';
import AssetLibraryScreen from '../screens/AssetLibraryScreen';
import MarketingDashboardScreen from '../screens/MarketingDashboardScreen';
import VREditorScreen from '../screens/VREditorScreen';
import SettingsScreen from '../screens/SettingsScreen';
import PublishScreen from '../screens/PublishScreen';
import RouletteScreen from '../screens/RouletteScreen';
import GiftWrapScreen from '../screens/GiftWrapScreen';
import EmojiInputScreen from '../screens/EmojiInputScreen';
import GiftCreationScreen from '../screens/GiftCreationScreen';
import GiftReceivedScreen from '../screens/GiftReceivedScreen';
import BrandingStudioScreen from '../screens/BrandingStudioScreen';

import { RootStackParamList } from '../types';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Projects':
              iconName = focused ? 'folder' : 'folder-outline';
              break;
            case 'Templates':
              iconName = focused ? 'view-grid' : 'view-grid-outline';
              break;
            case 'Genie':
              iconName = focused ? 'robot' : 'robot-outline';
              break;
            default:
              iconName = 'help-circle-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: '#9ca3af',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Projects" component={ProjectListScreen} />
      <Tab.Screen name="Templates" component={TemplateSelectorScreen} />
      <Tab.Screen name="Genie" component={GenieAssistantScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1a1a2e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="MainTabs" 
        component={MainTabs} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="ProjectEditor" 
        component={ProjectEditorScreen}
        options={{ title: 'Project Editor' }}
      />
      <Stack.Screen 
        name="TemplatePreview" 
        component={TemplatePreviewScreen}
        options={{ title: 'Template Preview' }}
      />
      <Stack.Screen 
        name="AssetLibrary" 
        component={AssetLibraryScreen}
        options={{ title: 'Asset Library' }}
      />
      <Stack.Screen 
        name="MarketingDashboard" 
        component={MarketingDashboardScreen}
        options={{ title: 'Marketing Dashboard' }}
      />
      <Stack.Screen 
        name="VREditor" 
        component={VREditorScreen}
        options={{ title: 'VR Editor' }}
      />
      <Stack.Screen 
        name="Publish" 
        component={PublishScreen}
        options={{ title: 'Publish Game' }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
      <Stack.Screen 
        name="Roulette" 
        component={RouletteScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="GiftWrap" 
        component={GiftWrapScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="EmojiInput" 
        component={EmojiInputScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="GiftCreation" 
        component={GiftCreationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="GiftReceived" 
        component={GiftReceivedScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="BrandingStudio" 
        component={BrandingStudioScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
