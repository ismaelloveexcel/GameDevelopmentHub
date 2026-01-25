import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { templateLibrary } from '../services/TemplateLibrary';
import { RootStackParamList } from '../types';

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function TemplateSelectorScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const templates = templateLibrary.getAllTemplates();
  const categories = ['all', 'puzzle', 'action', 'strategy', 'racing', 'educational', 'vr'];

  const filteredTemplates = selectedCategory === 'all'
    ? templates
    : templates.filter(t => t.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return theme.colors.success;
      case 'intermediate': return theme.colors.warning;
      case 'advanced': return theme.colors.error;
      default: return theme.colors.text;
    }
  };

  const getEngineIcon = (engine: string) => {
    switch (engine) {
      case 'pixi': return 'image-area';
      case 'babylon': return 'cube-outline';
      case 'aframe': return 'virtual-reality';
      default: return 'gamepad-variant';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Game Templates</Text>
        <Text style={[styles.subtitle, { color: theme.colors.text + '80' }]}>
          Choose from 15 complete templates
        </Text>
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContainer}
      >
        {categories.map(category => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              {
                backgroundColor: selectedCategory === category
                  ? theme.colors.primary
                  : theme.colors.card,
              },
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                {
                  color: selectedCategory === category
                    ? '#fff'
                    : theme.colors.text,
                },
              ]}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Templates Grid */}
      <ScrollView style={styles.templatesContainer}>
        {filteredTemplates.map(template => (
          <TouchableOpacity
            key={template.id}
            style={[styles.templateCard, { backgroundColor: theme.colors.card }]}
            onPress={() => navigation.navigate('TemplatePreview', { templateId: template.id })}
          >
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleRow}>
                <Icon
                  name={getEngineIcon(template.engine)}
                  size={24}
                  color={theme.colors.primary}
                />
                <Text style={[styles.templateName, { color: theme.colors.text }]}>
                  {template.name}
                </Text>
              </View>
              <View
                style={[
                  styles.difficultyBadge,
                  { backgroundColor: getDifficultyColor(template.difficulty) + '20' },
                ]}
              >
                <Text
                  style={[
                    styles.difficultyText,
                    { color: getDifficultyColor(template.difficulty) },
                  ]}
                >
                  {template.difficulty}
                </Text>
              </View>
            </View>

            <Text style={[styles.templateDescription, { color: theme.colors.text + '80' }]}>
              {template.description}
            </Text>

            <View style={styles.featuresList}>
              {template.features.slice(0, 3).map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Icon name="check-circle" size={16} color={theme.colors.success} />
                  <Text style={[styles.featureText, { color: theme.colors.text }]}>
                    {feature}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.cardFooter}>
              <View style={styles.engineBadge}>
                <Text style={[styles.engineText, { color: theme.colors.text + '80' }]}>
                  {template.engine.toUpperCase()}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.useButton, { backgroundColor: theme.colors.primary }]}
                onPress={() => navigation.navigate('TemplatePreview', { templateId: template.id })}
              >
                <Text style={styles.useButtonText}>Use Template</Text>
                <Icon name="arrow-right" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  categoryScroll: {
    maxHeight: 50,
  },
  categoryContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  templatesContainer: {
    flex: 1,
    padding: 16,
  },
  templateCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  templateName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
    flex: 1,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  templateDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  featuresList: {
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  featureText: {
    fontSize: 13,
    marginLeft: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  engineBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  engineText: {
    fontSize: 12,
    fontWeight: '600',
  },
  useButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  useButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
});
