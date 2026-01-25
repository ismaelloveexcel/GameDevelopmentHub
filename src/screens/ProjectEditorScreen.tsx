import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Project } from '../types';
import { projectService } from '../services/ProjectService';

type NavigationProp = StackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'ProjectEditor'>;

export default function ProjectEditorScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { projectId } = route.params;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');

  useEffect(() => {
    const loadProject = async () => {
      setLoading(true);
      const loadedProject = await projectService.getProject(projectId);
      if (loadedProject) {
        setProject(loadedProject);
        setProjectName(loadedProject.name);
        setProjectDescription(loadedProject.description);
      }
      setLoading(false);
    };
    loadProject();
  }, [projectId]);

  const handleSave = async () => {
    if (!project) return;
    
    try {
      await projectService.updateProject(projectId, {
        name: projectName,
        description: projectDescription,
      });
      Alert.alert('Saved', 'Project saved successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save project.');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Project',
      'Are you sure you want to delete this project? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await projectService.deleteProject(projectId);
            navigation.goBack();
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>Loading project...</Text>
      </View>
    );
  }

  if (!project) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.colors.background }]}>
        <Icon name="alert-circle-outline" size={64} color={theme.colors.error} />
        <Text style={[styles.errorText, { color: theme.colors.text }]}>Project not found</Text>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const menuItems = [
    {
      icon: 'image-multiple',
      title: 'Scenes',
      subtitle: `${project.data.scenes.length} scene(s)`,
      color: theme.colors.primary,
      onPress: () => Alert.alert('Scenes', 'Scene editor coming soon!'),
    },
    {
      icon: 'folder-multiple-image',
      title: 'Assets',
      subtitle: `${project.data.assets.length} asset(s)`,
      color: theme.colors.secondary,
      onPress: () => navigation.navigate('AssetLibrary', { projectId }),
    },
    {
      icon: 'code-tags',
      title: 'Scripts',
      subtitle: `${project.data.scripts.length} script(s)`,
      color: theme.colors.accent,
      onPress: () => Alert.alert('Scripts', 'Script editor coming soon!'),
    },
    {
      icon: 'cog-outline',
      title: 'Settings',
      subtitle: `${project.data.settings.resolution.width}x${project.data.settings.resolution.height}`,
      color: theme.colors.warning,
      onPress: () => Alert.alert('Settings', 'Project settings coming soon!'),
    },
    {
      icon: 'chart-line',
      title: 'Marketing',
      subtitle: 'Analytics & campaigns',
      color: theme.colors.success,
      onPress: () => navigation.navigate('MarketingDashboard', { projectId }),
    },
    {
      icon: 'publish',
      title: 'Publish',
      subtitle: 'Export & deploy',
      color: theme.colors.error,
      onPress: () => navigation.navigate('Publish', { projectId }),
    },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Project Info */}
      <View style={[styles.infoSection, { backgroundColor: theme.colors.card }]}>
        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: theme.colors.text + '80' }]}>Project Name</Text>
          <TextInput
            style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
            value={projectName}
            onChangeText={setProjectName}
            placeholder="Enter project name"
            placeholderTextColor={theme.colors.text + '40'}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: theme.colors.text + '80' }]}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea, { color: theme.colors.text, borderColor: theme.colors.border }]}
            value={projectDescription}
            onChangeText={setProjectDescription}
            placeholder="Enter project description"
            placeholderTextColor={theme.colors.text + '40'}
            multiline
            numberOfLines={3}
          />
        </View>
        <View style={styles.metaInfo}>
          <View style={styles.metaItem}>
            <Icon name="cube-outline" size={16} color={theme.colors.primary} />
            <Text style={[styles.metaText, { color: theme.colors.text + '80' }]}>
              {project.engine.toUpperCase()}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Icon name="tag-outline" size={16} color={theme.colors.primary} />
            <Text style={[styles.metaText, { color: theme.colors.text + '80' }]}>
              {project.type}
            </Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Editor Tools</Text>
        <View style={styles.menuGrid}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, { backgroundColor: theme.colors.card }]}
              onPress={item.onPress}
            >
              <View style={[styles.menuIcon, { backgroundColor: item.color + '20' }]}>
                <Icon name={item.icon} size={24} color={item.color} />
              </View>
              <Text style={[styles.menuTitle, { color: theme.colors.text }]}>{item.title}</Text>
              <Text style={[styles.menuSubtitle, { color: theme.colors.text + '60' }]}>
                {item.subtitle}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Actions */}
      <View style={styles.section}>
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleSave}
        >
          <Icon name="content-save" size={20} color="#fff" />
          <Text style={styles.saveButtonText}>Save Project</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.deleteButton, { borderColor: theme.colors.error }]}
          onPress={handleDelete}
        >
          <Icon name="trash-can-outline" size={20} color={theme.colors.error} />
          <Text style={[styles.deleteButtonText, { color: theme.colors.error }]}>Delete Project</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  errorText: {
    fontSize: 18,
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  infoSection: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  metaInfo: {
    flexDirection: 'row',
    marginTop: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    fontSize: 13,
    marginLeft: 6,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  menuItem: {
    width: '47%',
    margin: '1.5%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 12,
    textAlign: 'center',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 24,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
