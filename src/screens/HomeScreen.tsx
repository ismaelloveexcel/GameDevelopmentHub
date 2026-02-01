import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../contexts/ThemeContext';
import { RootStackParamList } from '../types';

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();

  const features = [
    {
      icon: 'slot-machine',
      title: 'Game Roulette',
      description: 'Spin for a random unique combo!',
      onPress: () => navigation.navigate('Roulette'),
      highlight: true,
    },
    {
      icon: 'creation',
      title: 'Create Games',
      description: '15 ready-to-use game templates',
      onPress: () => navigation.navigate('Templates'),
    },
    {
      icon: 'robot',
      title: 'AI Assistant',
      description: '4 specialized personalities',
      onPress: () => navigation.navigate('Genie'),
    },
    {
      icon: 'palette',
      title: 'Art Styles',
      description: '5 signature visual styles',
      onPress: () => navigation.navigate('Templates'),
    },
    {
      icon: 'virtual-reality',
      title: 'VR Support',
      description: 'Create immersive VR experiences',
      onPress: () => navigation.navigate('Templates'),
    },
  ];

  const quickActions = [
    {
      icon: 'gift',
      title: 'Create Gift',
      color: '#e74c3c',
      onPress: () => navigation.navigate('GiftCreation'),
    },
    {
      icon: 'slot-machine',
      title: 'Roulette',
      color: '#f39c12',
      onPress: () => navigation.navigate('Roulette'),
    },
    {
      icon: 'view-grid',
      title: 'Templates',
      color: theme.colors.primary,
      onPress: () => navigation.navigate('Templates'),
    },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          GameForge Mobile
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.text + '80' }]}>
          AI-Powered Game Creation Platform
        </Text>
      </View>

      {/* Hero Card */}
      <View style={[styles.heroCard, { backgroundColor: theme.colors.card }]}>
        <Icon name="rocket-launch" size={48} color={theme.colors.primary} />
        <Text style={[styles.heroTitle, { color: theme.colors.text }]}>
          Create Without Coding
        </Text>
        <Text style={[styles.heroText, { color: theme.colors.text + '80' }]}>
          Build professional games, VR experiences, and educational content with zero coding required
        </Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Quick Actions
        </Text>
        <View style={styles.quickActions}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.quickAction, { backgroundColor: theme.colors.card }]}
              onPress={action.onPress}
            >
              <Icon name={action.icon} size={32} color={action.color} />
              <Text style={[styles.quickActionText, { color: theme.colors.text }]}>
                {action.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Features */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Platform Features
        </Text>
        {features.map((feature, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.featureCard, { backgroundColor: theme.colors.card }]}
            onPress={feature.onPress}
          >
            <View style={[styles.featureIcon, { backgroundColor: theme.colors.primary + '20' }]}>
              <Icon name={feature.icon} size={28} color={theme.colors.primary} />
            </View>
            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: theme.colors.text }]}>
                {feature.title}
              </Text>
              <Text style={[styles.featureDescription, { color: theme.colors.text + '80' }]}>
                {feature.description}
              </Text>
            </View>
            <Icon name="chevron-right" size={24} color={theme.colors.text + '40'} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Stats */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Platform Stats
        </Text>
        <View style={styles.statsContainer}>
          {[
            { label: 'Templates', value: '15' },
            { label: 'Art Styles', value: '5' },
            { label: 'AI Personalities', value: '4' },
          ].map((stat, index) => (
            <View
              key={index}
              style={[styles.statCard, { backgroundColor: theme.colors.card }]}
            >
              <Text style={[styles.statValue, { color: theme.colors.primary }]}>
                {stat.value}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.text }]}>
                {stat.label}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  heroCard: {
    margin: 16,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  heroText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAction: {
    flex: 1,
    margin: 4,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  quickActionText: {
    marginTop: 8,
    fontSize: 12,
    textAlign: 'center',
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    margin: 4,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
});
