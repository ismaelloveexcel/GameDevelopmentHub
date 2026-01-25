import React, { useState } from 'react';
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
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';

type RouteProps = RouteProp<RootStackParamList, 'VREditor'>;

const vrTools = [
  { id: 'objects', name: '3D Objects', icon: 'cube', description: 'Add 3D models and primitives' },
  { id: 'lighting', name: 'Lighting', icon: 'lightbulb-on', description: 'Configure scene lighting' },
  { id: 'interactions', name: 'Interactions', icon: 'hand-pointing-right', description: 'Add VR interactions' },
  { id: 'audio', name: 'Spatial Audio', icon: 'surround-sound', description: '3D audio sources' },
  { id: 'physics', name: 'Physics', icon: 'atom', description: 'Add physics behavior' },
  { id: 'teleport', name: 'Locomotion', icon: 'run', description: 'Movement & teleportation' },
];

const vrPlatforms = [
  { id: 'webxr', name: 'WebXR', icon: 'web', supported: true },
  { id: 'quest', name: 'Meta Quest', icon: 'virtual-reality', supported: true },
  { id: 'psvr', name: 'PlayStation VR', icon: 'sony-playstation', supported: false },
  { id: 'steamvr', name: 'SteamVR', icon: 'steam', supported: false },
];

export default function VREditorScreen() {
  const { theme } = useTheme();
  const route = useRoute<RouteProps>();
  const _projectId = route.params.projectId;
  
  const [activeMode, setActiveMode] = useState<'edit' | 'preview'>('edit');
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const handleToolSelect = (toolId: string) => {
    setSelectedTool(toolId);
    Alert.alert(
      'Tool Selected',
      `${vrTools.find(t => t.id === toolId)?.name} tool activated. In a full implementation, this would open the tool panel.`
    );
  };

  const handlePreview = () => {
    setActiveMode('preview');
    Alert.alert(
      'VR Preview',
      'In a full implementation, this would launch a VR preview using WebXR or a connected headset.'
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>VR Editor</Text>
        <View style={styles.modeToggle}>
          <TouchableOpacity
            style={[
              styles.modeButton,
              activeMode === 'edit' && { backgroundColor: theme.colors.primary },
            ]}
            onPress={() => setActiveMode('edit')}
          >
            <Icon
              name="pencil"
              size={18}
              color={activeMode === 'edit' ? '#fff' : theme.colors.text}
            />
            <Text
              style={[
                styles.modeText,
                { color: activeMode === 'edit' ? '#fff' : theme.colors.text },
              ]}
            >
              Edit
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.modeButton,
              activeMode === 'preview' && { backgroundColor: theme.colors.primary },
            ]}
            onPress={handlePreview}
          >
            <Icon
              name="virtual-reality"
              size={18}
              color={activeMode === 'preview' ? '#fff' : theme.colors.text}
            />
            <Text
              style={[
                styles.modeText,
                { color: activeMode === 'preview' ? '#fff' : theme.colors.text },
              ]}
            >
              Preview
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* VR Scene Preview */}
        <View style={[styles.scenePreview, { backgroundColor: theme.colors.card }]}>
          <Icon name="cube-scan" size={64} color={theme.colors.text + '30'} />
          <Text style={[styles.previewText, { color: theme.colors.text + '60' }]}>
            VR Scene Preview
          </Text>
          <Text style={[styles.previewSubtext, { color: theme.colors.text + '40' }]}>
            3D viewport would render here
          </Text>
        </View>

        {/* VR Tools */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>VR Tools</Text>
          <View style={styles.toolsGrid}>
            {vrTools.map(tool => (
              <TouchableOpacity
                key={tool.id}
                style={[
                  styles.toolCard,
                  { backgroundColor: theme.colors.card },
                  selectedTool === tool.id && { borderColor: theme.colors.primary, borderWidth: 2 },
                ]}
                onPress={() => handleToolSelect(tool.id)}
              >
                <Icon name={tool.icon} size={28} color={theme.colors.primary} />
                <Text style={[styles.toolName, { color: theme.colors.text }]}>{tool.name}</Text>
                <Text style={[styles.toolDescription, { color: theme.colors.text + '60' }]}>
                  {tool.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Target Platforms */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Target Platforms</Text>
          <View style={[styles.platformsContainer, { backgroundColor: theme.colors.card }]}>
            {vrPlatforms.map(platform => (
              <View key={platform.id} style={styles.platformItem}>
                <Icon
                  name={platform.icon}
                  size={24}
                  color={platform.supported ? theme.colors.primary : theme.colors.text + '40'}
                />
                <Text
                  style={[
                    styles.platformName,
                    { color: platform.supported ? theme.colors.text : theme.colors.text + '40' },
                  ]}
                >
                  {platform.name}
                </Text>
                {platform.supported ? (
                  <Icon name="check-circle" size={18} color={theme.colors.success} />
                ) : (
                  <Text style={[styles.comingSoon, { color: theme.colors.warning }]}>Soon</Text>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* VR Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>VR Settings</Text>
          <View style={[styles.settingsContainer, { backgroundColor: theme.colors.card }]}>
            <View style={styles.settingRow}>
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Locomotion</Text>
              <Text style={[styles.settingValue, { color: theme.colors.primary }]}>Teleport</Text>
            </View>
            <View style={styles.settingRow}>
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Hand Tracking</Text>
              <Text style={[styles.settingValue, { color: theme.colors.success }]}>Enabled</Text>
            </View>
            <View style={styles.settingRow}>
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Spatial Audio</Text>
              <Text style={[styles.settingValue, { color: theme.colors.success }]}>Enabled</Text>
            </View>
            <View style={styles.settingRow}>
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Controller Support</Text>
              <Text style={[styles.settingValue, { color: theme.colors.success }]}>Enabled</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modeToggle: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
  },
  modeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  modeText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  content: {
    flex: 1,
  },
  scenePreview: {
    margin: 16,
    height: 200,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
  previewSubtext: {
    fontSize: 13,
    marginTop: 4,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  toolCard: {
    width: '31%',
    margin: '1%',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  toolName: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  toolDescription: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 4,
  },
  platformsContainer: {
    borderRadius: 12,
    padding: 12,
  },
  platformItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  platformName: {
    flex: 1,
    fontSize: 14,
    marginLeft: 12,
  },
  comingSoon: {
    fontSize: 12,
    fontWeight: '600',
  },
  settingsContainer: {
    borderRadius: 12,
    padding: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  settingLabel: {
    fontSize: 14,
  },
  settingValue: {
    fontSize: 14,
    fontWeight: '500',
  },
});
