import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../contexts/ThemeContext';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { assetService } from '../services/AssetService';

type RouteProps = RouteProp<RootStackParamList, 'AssetLibrary'>;

const assetCategories = [
  { id: 'all', name: 'All', icon: 'folder-multiple' },
  { id: 'pixel', name: 'Pixel Art', icon: 'grid' },
  { id: 'lowpoly', name: 'Low Poly', icon: 'cube-outline' },
  { id: 'handdrawn', name: 'Hand-Drawn', icon: 'pencil' },
  { id: 'cyberpunk', name: 'Cyberpunk', icon: 'flash' },
  { id: 'watercolor', name: 'Watercolor', icon: 'water' },
];

export default function AssetLibraryScreen() {
  const { theme } = useTheme();
  const route = useRoute<RouteProps>();
  const _projectId = route.params?.projectId;

  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const sampleAssets = assetService.getSampleAssets();
  
  const getAllAssets = () => {
    const allAssets: typeof sampleAssets[keyof typeof sampleAssets] = [];
    Object.values(sampleAssets).forEach(assets => {
      allAssets.push(...assets);
    });
    return allAssets;
  };

  const filteredAssets = selectedCategory === 'all' 
    ? getAllAssets() 
    : sampleAssets[selectedCategory as keyof typeof sampleAssets] || [];

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'image': return 'image';
      case '3dmodel': return 'cube';
      case 'audio': return 'music-note';
      case 'video': return 'video';
      case 'font': return 'format-font';
      case 'script': return 'code-tags';
      default: return 'file';
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Asset Library</Text>
        <Text style={[styles.subtitle, { color: theme.colors.text + '80' }]}>
          Browse and manage your game assets
        </Text>
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContainer}
      >
        {assetCategories.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryChip,
              {
                backgroundColor: selectedCategory === category.id
                  ? theme.colors.primary
                  : theme.colors.card,
              },
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Icon
              name={category.icon}
              size={18}
              color={selectedCategory === category.id ? '#fff' : theme.colors.text}
            />
            <Text
              style={[
                styles.categoryText,
                {
                  color: selectedCategory === category.id ? '#fff' : theme.colors.text,
                },
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Assets List */}
      {filteredAssets.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="folder-open-outline" size={64} color={theme.colors.text + '40'} />
          <Text style={[styles.emptyText, { color: theme.colors.text }]}>
            No assets in this category
          </Text>
          <Text style={[styles.emptySubtext, { color: theme.colors.text + '60' }]}>
            Add assets to your project or browse sample assets
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredAssets}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.assetsList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.assetCard, { backgroundColor: theme.colors.card }]}
            >
              <View style={[styles.assetIcon, { backgroundColor: theme.colors.primary + '20' }]}>
                <Icon name={getAssetIcon(item.type)} size={24} color={theme.colors.primary} />
              </View>
              <View style={styles.assetInfo}>
                <Text style={[styles.assetName, { color: theme.colors.text }]}>
                  {item.name}
                </Text>
                <View style={styles.assetMeta}>
                  <Text style={[styles.assetType, { color: theme.colors.text + '60' }]}>
                    {item.type.toUpperCase()}
                  </Text>
                  <Text style={[styles.assetSize, { color: theme.colors.text + '60' }]}>
                    {formatSize(item.size)}
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={styles.assetAction}>
                <Icon name="dots-vertical" size={24} color={theme.colors.text + '60'} />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Add Asset Button */}
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
      >
        <Icon name="plus" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
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
  categoryScroll: {
    maxHeight: 50,
  },
  categoryContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  assetsList: {
    padding: 16,
  },
  assetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  assetIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  assetInfo: {
    flex: 1,
    marginLeft: 12,
  },
  assetName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  assetMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assetType: {
    fontSize: 12,
    marginRight: 12,
  },
  assetSize: {
    fontSize: 12,
  },
  assetAction: {
    padding: 8,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
