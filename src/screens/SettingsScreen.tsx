import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../contexts/ThemeContext';

export default function SettingsScreen() {
  const { theme, toggleTheme, isDark } = useTheme();

  const handleClearProjects = () => {
    Alert.alert(
      'Clear All Projects',
      'Are you sure you want to delete all projects? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
          // Would call projectService.clearAllProjects()
          Alert.alert('Projects Cleared', 'All projects have been deleted.');
        }},
      ]
    );
  };

  const settingSections = [
    {
      title: 'Appearance',
      items: [
        {
          icon: 'theme-light-dark',
          label: 'Dark Mode',
          type: 'switch' as const,
          value: isDark,
          onToggle: toggleTheme,
        },
      ],
    },
    {
      title: 'General',
      items: [
        {
          icon: 'bell-outline',
          label: 'Notifications',
          type: 'switch' as const,
          value: true,
          onToggle: () => {},
        },
        {
          icon: 'auto-fix',
          label: 'Auto-save Projects',
          type: 'switch' as const,
          value: true,
          onToggle: () => {},
        },
      ],
    },
    {
      title: 'Data',
      items: [
        {
          icon: 'download',
          label: 'Export All Projects',
          type: 'action' as const,
          onPress: () => Alert.alert('Export', 'Export functionality coming soon!'),
        },
        {
          icon: 'upload',
          label: 'Import Projects',
          type: 'action' as const,
          onPress: () => Alert.alert('Import', 'Import functionality coming soon!'),
        },
        {
          icon: 'trash-can-outline',
          label: 'Clear All Projects',
          type: 'action' as const,
          destructive: true,
          onPress: handleClearProjects,
        },
      ],
    },
    {
      title: 'About',
      items: [
        {
          icon: 'information-outline',
          label: 'Version',
          type: 'info' as const,
          value: '1.0.0',
        },
        {
          icon: 'license',
          label: 'License',
          type: 'info' as const,
          value: 'MIT',
        },
        {
          icon: 'github',
          label: 'GitHub Repository',
          type: 'action' as const,
          onPress: () => Alert.alert('GitHub', 'Visit our GitHub repository for more information.'),
        },
      ],
    },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Settings</Text>
      </View>

      {settingSections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text + '80' }]}>
            {section.title}
          </Text>
          <View style={[styles.sectionContent, { backgroundColor: theme.colors.card }]}>
            {section.items.map((item, itemIndex) => (
              <View
                key={itemIndex}
                style={[
                  styles.settingItem,
                  itemIndex < section.items.length - 1 && styles.settingItemBorder,
                  { borderBottomColor: theme.colors.border },
                ]}
              >
                <View style={styles.settingLeft}>
                  <Icon
                    name={item.icon}
                    size={24}
                    color={item.type === 'action' && 'destructive' in item && item.destructive
                      ? theme.colors.error
                      : theme.colors.primary}
                  />
                  <Text
                    style={[
                      styles.settingLabel,
                      {
                        color: item.type === 'action' && 'destructive' in item && item.destructive
                          ? theme.colors.error
                          : theme.colors.text,
                      },
                    ]}
                  >
                    {item.label}
                  </Text>
                </View>
                {item.type === 'switch' && (
                  <Switch
                    value={item.value}
                    onValueChange={item.onToggle}
                    trackColor={{ false: theme.colors.border, true: theme.colors.primary + '80' }}
                    thumbColor={item.value ? theme.colors.primary : '#f4f3f4'}
                  />
                )}
                {item.type === 'info' && (
                  <Text style={[styles.settingValue, { color: theme.colors.text + '80' }]}>
                    {item.value}
                  </Text>
                )}
                {item.type === 'action' && (
                  <TouchableOpacity onPress={item.onPress}>
                    <Icon name="chevron-right" size={24} color={theme.colors.text + '40'} />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        </View>
      ))}

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: theme.colors.text + '60' }]}>
          GameForge Mobile v1.0.0
        </Text>
        <Text style={[styles.footerText, { color: theme.colors.text + '40' }]}>
          AI-Powered Game Creation Platform
        </Text>
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
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 8,
    paddingLeft: 4,
  },
  sectionContent: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingItemBorder: {
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    marginLeft: 12,
  },
  settingValue: {
    fontSize: 14,
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    marginBottom: 4,
  },
});
