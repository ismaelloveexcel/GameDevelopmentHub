import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { templateLibrary } from '../services/TemplateLibrary';
import { projectService } from '../services/ProjectService';

type NavigationProp = StackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'TemplatePreview'>;

export default function TemplatePreviewScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { templateId } = route.params;

  const template = templateLibrary.getTemplateById(templateId);

  if (!template) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          Template not found
        </Text>
      </View>
    );
  }

  const handleCreateProject = async () => {
    try {
      const project = await projectService.createProject(
        template.name,
        template.description,
        template.category === 'vr' || template.category === 'ar' ? 'vr' : template.category === 'educational' ? 'educational' : 'game',
        template.engine,
        template.id
      );
      Alert.alert(
        'Project Created!',
        `Your project "${project.name}" has been created successfully.`,
        [
          {
            text: 'Open Project',
            onPress: () => navigation.navigate('ProjectEditor', { projectId: project.id }),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create project. Please try again.');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return theme.colors.success;
      case 'intermediate': return theme.colors.warning;
      case 'advanced': return theme.colors.error;
      default: return theme.colors.text;
    }
  };

  const getEngineInfo = (engine: string) => {
    switch (engine) {
      case 'pixi': return { name: 'Pixi.js', description: '2D rendering engine for fast graphics' };
      case 'babylon': return { name: 'Babylon.js', description: '3D engine for immersive experiences' };
      case 'aframe': return { name: 'A-Frame', description: 'VR/AR framework for WebXR' };
      default: return { name: engine, description: '' };
    }
  };

  const engineInfo = getEngineInfo(template.engine);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.card }]}>
        <View style={styles.headerTop}>
          <Text style={[styles.title, { color: theme.colors.text }]}>{template.name}</Text>
          <View
            style={[
              styles.difficultyBadge,
              { backgroundColor: getDifficultyColor(template.difficulty) + '20' },
            ]}
          >
            <Text style={[styles.difficultyText, { color: getDifficultyColor(template.difficulty) }]}>
              {template.difficulty}
            </Text>
          </View>
        </View>
        <Text style={[styles.description, { color: theme.colors.text + '80' }]}>
          {template.description}
        </Text>
      </View>

      {/* Engine Info */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Game Engine</Text>
        <View style={[styles.infoCard, { backgroundColor: theme.colors.card }]}>
          <Icon name="cube-outline" size={32} color={theme.colors.primary} />
          <View style={styles.infoContent}>
            <Text style={[styles.infoTitle, { color: theme.colors.text }]}>{engineInfo.name}</Text>
            <Text style={[styles.infoDescription, { color: theme.colors.text + '80' }]}>
              {engineInfo.description}
            </Text>
          </View>
        </View>
      </View>

      {/* Features */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Features</Text>
        <View style={[styles.featuresContainer, { backgroundColor: theme.colors.card }]}>
          {template.features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Icon name="check-circle" size={20} color={theme.colors.success} />
              <Text style={[styles.featureText, { color: theme.colors.text }]}>{feature}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Template Data */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Template Details</Text>
        <View style={[styles.detailsContainer, { backgroundColor: theme.colors.card }]}>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.colors.text + '80' }]}>Category</Text>
            <Text style={[styles.detailValue, { color: theme.colors.text }]}>
              {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.colors.text + '80' }]}>Scenes</Text>
            <Text style={[styles.detailValue, { color: theme.colors.text }]}>
              {template.data.scenes.length} included
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.colors.text + '80' }]}>Resolution</Text>
            <Text style={[styles.detailValue, { color: theme.colors.text }]}>
              {template.data.settings.resolution.width} x {template.data.settings.resolution.height}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.colors.text + '80' }]}>Orientation</Text>
            <Text style={[styles.detailValue, { color: theme.colors.text }]}>
              {template.data.settings.orientation.charAt(0).toUpperCase() + template.data.settings.orientation.slice(1)}
            </Text>
          </View>
        </View>
      </View>

      {/* Documentation */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Documentation</Text>
        <View style={[styles.docContainer, { backgroundColor: theme.colors.card }]}>
          <Icon name="book-open-page-variant" size={24} color={theme.colors.primary} />
          <Text style={[styles.docText, { color: theme.colors.text }]}>{template.documentation}</Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleCreateProject}
        >
          <Icon name="plus" size={20} color="#fff" />
          <Text style={styles.primaryButtonText}>Create Project</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.secondaryButton, { borderColor: theme.colors.primary }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.secondaryButtonText, { color: theme.colors.primary }]}>
            Back to Templates
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 40,
  },
  header: {
    padding: 20,
    marginBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  infoCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  infoContent: {
    marginLeft: 16,
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 13,
  },
  featuresContainer: {
    padding: 16,
    borderRadius: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 14,
    marginLeft: 12,
  },
  detailsContainer: {
    padding: 16,
    borderRadius: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  detailLabel: {
    fontSize: 14,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  docContainer: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  docText: {
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 12,
    flex: 1,
  },
  actionsContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  primaryButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryButton: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
