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
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types';

type RouteProps = RouteProp<RootStackParamList, 'Publish'>;

const publishPlatforms = [
  {
    id: 'web',
    name: 'Web (GitHub Pages)',
    icon: 'web',
    description: 'Deploy as a web app to GitHub Pages',
    status: 'available',
  },
  {
    id: 'android',
    name: 'Android (APK/AAB)',
    icon: 'android',
    description: 'Build for Android devices via EAS Build',
    status: 'available',
  },
  {
    id: 'ios',
    name: 'iOS (IPA)',
    icon: 'apple',
    description: 'Build for iOS devices via EAS Build',
    status: 'available',
  },
  {
    id: 'webxr',
    name: 'WebXR (VR/AR)',
    icon: 'virtual-reality',
    description: 'Deploy as WebXR experience',
    status: 'coming_soon',
  },
];

const exportFormats = [
  { id: 'json', name: 'Project JSON', icon: 'code-json', description: 'Export project data' },
  { id: 'html', name: 'Standalone HTML', icon: 'language-html5', description: 'Single HTML file' },
  { id: 'zip', name: 'Full Package', icon: 'folder-zip', description: 'All assets included' },
];

export default function PublishScreen() {
  const { theme } = useTheme();
  const route = useRoute<RouteProps>();
  const _navigation = useNavigation();
  const _projectId = route.params.projectId;
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);

  const handlePublish = async (platformId: string) => {
    setPublishing(true);
    
    // Simulate publishing process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setPublishing(false);
    Alert.alert(
      'Build Started!',
      `Your ${platformId} build has been queued. You'll receive a notification when it's ready.`,
      [{ text: 'OK' }]
    );
  };

  const handleExport = (formatId: string) => {
    Alert.alert(
      'Export Started',
      `Exporting project as ${formatId.toUpperCase()}...`,
      [{ text: 'OK' }]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Publish & Export</Text>
        <Text style={[styles.subtitle, { color: theme.colors.text + '80' }]}>
          Deploy your game to multiple platforms
        </Text>
      </View>

      {/* Publish Platforms */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Deploy To</Text>
        {publishPlatforms.map(platform => (
          <TouchableOpacity
            key={platform.id}
            style={[
              styles.platformCard,
              { backgroundColor: theme.colors.card },
              selectedPlatform === platform.id && { borderColor: theme.colors.primary, borderWidth: 2 },
            ]}
            onPress={() => setSelectedPlatform(platform.id)}
            disabled={platform.status === 'coming_soon'}
          >
            <View style={[styles.platformIcon, { backgroundColor: theme.colors.primary + '20' }]}>
              <Icon
                name={platform.icon}
                size={28}
                color={platform.status === 'coming_soon' ? theme.colors.text + '40' : theme.colors.primary}
              />
            </View>
            <View style={styles.platformInfo}>
              <Text
                style={[
                  styles.platformName,
                  { color: platform.status === 'coming_soon' ? theme.colors.text + '40' : theme.colors.text },
                ]}
              >
                {platform.name}
              </Text>
              <Text style={[styles.platformDescription, { color: theme.colors.text + '60' }]}>
                {platform.description}
              </Text>
            </View>
            {platform.status === 'coming_soon' ? (
              <View style={[styles.comingSoonBadge, { backgroundColor: theme.colors.warning + '20' }]}>
                <Text style={[styles.comingSoonText, { color: theme.colors.warning }]}>Soon</Text>
              </View>
            ) : (
              <Icon
                name={selectedPlatform === platform.id ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'}
                size={24}
                color={selectedPlatform === platform.id ? theme.colors.primary : theme.colors.text + '40'}
              />
            )}
          </TouchableOpacity>
        ))}

        {selectedPlatform && (
          <TouchableOpacity
            style={[styles.publishButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => handlePublish(selectedPlatform)}
            disabled={publishing}
          >
            {publishing ? (
              <Text style={styles.publishButtonText}>Building...</Text>
            ) : (
              <>
                <Icon name="rocket-launch" size={20} color="#fff" />
                <Text style={styles.publishButtonText}>Build & Deploy</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Export Options */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Export</Text>
        <View style={styles.exportGrid}>
          {exportFormats.map(format => (
            <TouchableOpacity
              key={format.id}
              style={[styles.exportCard, { backgroundColor: theme.colors.card }]}
              onPress={() => handleExport(format.id)}
            >
              <Icon name={format.icon} size={32} color={theme.colors.secondary} />
              <Text style={[styles.exportName, { color: theme.colors.text }]}>{format.name}</Text>
              <Text style={[styles.exportDescription, { color: theme.colors.text + '60' }]}>
                {format.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Build History */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Recent Builds</Text>
        <View style={[styles.emptyBuilds, { backgroundColor: theme.colors.card }]}>
          <Icon name="history" size={32} color={theme.colors.text + '40'} />
          <Text style={[styles.emptyText, { color: theme.colors.text + '60' }]}>
            No recent builds
          </Text>
          <Text style={[styles.emptySubtext, { color: theme.colors.text + '40' }]}>
            Build history will appear here
          </Text>
        </View>
      </View>

      {/* Footer Info */}
      <View style={styles.infoSection}>
        <View style={[styles.infoCard, { backgroundColor: theme.colors.card }]}>
          <Icon name="information-outline" size={24} color={theme.colors.primary} />
          <View style={styles.infoContent}>
            <Text style={[styles.infoTitle, { color: theme.colors.text }]}>Build Requirements</Text>
            <Text style={[styles.infoText, { color: theme.colors.text + '80' }]}>
              • Web builds deploy to GitHub Pages automatically{'\n'}
              • Mobile builds require EAS credentials{'\n'}
              • iOS builds require Apple Developer account
            </Text>
          </View>
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
    padding: 20,
    paddingTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  platformCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  platformIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  platformInfo: {
    flex: 1,
    marginLeft: 12,
  },
  platformName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  platformDescription: {
    fontSize: 13,
  },
  comingSoonBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  comingSoonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  publishButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
  },
  publishButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  exportGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  exportCard: {
    width: '31%',
    margin: '1%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  exportName: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  exportDescription: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
  },
  emptyBuilds: {
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  emptySubtext: {
    fontSize: 12,
    marginTop: 4,
  },
  infoSection: {
    padding: 16,
    paddingBottom: 32,
  },
  infoCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 20,
  },
});
