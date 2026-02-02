/**
 * BrandingStudioScreen
 * 
 * AI-powered branding and asset generation studio.
 * Uses Grok AI to generate logos, characters, and backgrounds.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../contexts/ThemeContext';
import { assetGeneratorService, GeneratedAsset, LogoGenerationRequest } from '../services/AssetGeneratorService';

type AssetType = 'logo' | 'character' | 'background';
type LogoStyle = 'neon' | 'pixel' | 'modern' | 'playful' | 'elegant';

const LOGO_STYLES: { id: LogoStyle; name: string; icon: string }[] = [
  { id: 'neon', name: 'Neon Glow', icon: 'lightbulb-on' },
  { id: 'pixel', name: 'Pixel Art', icon: 'gamepad-square' },
  { id: 'modern', name: 'Modern', icon: 'vector-square' },
  { id: 'playful', name: 'Playful', icon: 'emoticon-happy' },
  { id: 'elegant', name: 'Elegant', icon: 'crown' },
];

const COLOR_PRESETS = [
  { primary: '#FF4081', secondary: '#00E5FF', name: 'Neon Pink' },
  { primary: '#6C63FF', secondary: '#FF6584', name: 'Purple Dream' },
  { primary: '#00BFA5', secondary: '#FFD54F', name: 'Tropical' },
  { primary: '#FF5722', secondary: '#FFC107', name: 'Sunset' },
  { primary: '#2196F3', secondary: '#4CAF50', name: 'Ocean' },
];

export const BrandingStudioScreen: React.FC = () => {
  const { theme } = useTheme();
  const [assetType, setAssetType] = useState<AssetType>('logo');
  const [appName, setAppName] = useState('PlayGift');
  const [tagline, setTagline] = useState('Personalized Game Gifts');
  const [selectedStyle, setSelectedStyle] = useState<LogoStyle>('neon');
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAsset, setGeneratedAsset] = useState<GeneratedAsset | null>(null);
  const [generationHistory, setGenerationHistory] = useState<GeneratedAsset[]>([]);

  const handleGenerate = async () => {
    if (!appName.trim()) {
      Alert.alert('Missing Name', 'Please enter an app name');
      return;
    }

    setIsGenerating(true);

    try {
      const colors = COLOR_PRESETS[selectedColorIndex];
      
      const request: LogoGenerationRequest = {
        appName: appName.trim(),
        style: selectedStyle,
        primaryColor: colors.primary,
        secondaryColor: colors.secondary,
        includeIcon: true,
        includeTagline: tagline.trim() || undefined,
        theme: 'gaming',
      };

      const asset = await assetGeneratorService.generateLogo(request);
      setGeneratedAsset(asset);
      setGenerationHistory(prev => [asset, ...prev.slice(0, 9)]); // Keep last 10
    } catch (error) {
      Alert.alert('Generation Failed', 'Could not generate asset. Please try again.');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGeneratePlayGift = async () => {
    setIsGenerating(true);
    setAppName('PlayGift');
    setTagline('Personalized Game Gifts');
    setSelectedStyle('neon');
    setSelectedColorIndex(0);

    try {
      const asset = await assetGeneratorService.generatePlayGiftLogo();
      setGeneratedAsset(asset);
      setGenerationHistory(prev => [asset, ...prev.slice(0, 9)]);
    } catch (error) {
      Alert.alert('Generation Failed', 'Could not generate PlayGift logo.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Header */}
      <View style={styles.header}>
        <Icon name="palette" size={32} color="#FF4081" />
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Branding Studio
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.text + '80' }]}>
          AI-Powered Logo & Asset Generation
        </Text>
      </View>

      {/* Quick Generate PlayGift */}
      <TouchableOpacity
        style={styles.quickGenerateBtn}
        onPress={handleGeneratePlayGift}
        disabled={isGenerating}
      >
        <Icon name="auto-fix" size={24} color="#fff" />
        <Text style={styles.quickGenerateText}>
          Generate PlayGift Logo with AI
        </Text>
      </TouchableOpacity>

      {/* Asset Type Selector */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Asset Type
        </Text>
        <View style={styles.typeRow}>
          {(['logo', 'character', 'background'] as AssetType[]).map(type => (
            <TouchableOpacity
              key={type}
              style={[
                styles.typeBtn,
                assetType === type && styles.typeBtnActive,
              ]}
              onPress={() => setAssetType(type)}
            >
              <Icon 
                name={type === 'logo' ? 'image-filter-vintage' : type === 'character' ? 'account' : 'image'}
                size={24}
                color={assetType === type ? '#fff' : '#888'}
              />
              <Text style={[
                styles.typeBtnText,
                assetType === type && styles.typeBtnTextActive,
              ]}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* App Name Input */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          App Name
        </Text>
        <TextInput
          style={[styles.input, { 
            backgroundColor: theme.colors.card,
            color: theme.colors.text,
            borderColor: theme.colors.border,
          }]}
          value={appName}
          onChangeText={setAppName}
          placeholder="Enter app name..."
          placeholderTextColor="#888"
        />
      </View>

      {/* Tagline Input */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Tagline (Optional)
        </Text>
        <TextInput
          style={[styles.input, { 
            backgroundColor: theme.colors.card,
            color: theme.colors.text,
            borderColor: theme.colors.border,
          }]}
          value={tagline}
          onChangeText={setTagline}
          placeholder="Enter tagline..."
          placeholderTextColor="#888"
        />
      </View>

      {/* Style Selector */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Logo Style
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.styleRow}>
            {LOGO_STYLES.map(style => (
              <TouchableOpacity
                key={style.id}
                style={[
                  styles.styleBtn,
                  { backgroundColor: theme.colors.card },
                  selectedStyle === style.id && styles.styleBtnActive,
                ]}
                onPress={() => setSelectedStyle(style.id)}
              >
                <Icon 
                  name={style.icon}
                  size={28}
                  color={selectedStyle === style.id ? '#FF4081' : '#888'}
                />
                <Text style={[
                  styles.styleBtnText,
                  { color: theme.colors.text },
                  selectedStyle === style.id && styles.styleBtnTextActive,
                ]}>
                  {style.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Color Presets */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Color Scheme
        </Text>
        <View style={styles.colorRow}>
          {COLOR_PRESETS.map((preset, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.colorBtn,
                selectedColorIndex === index && styles.colorBtnActive,
              ]}
              onPress={() => setSelectedColorIndex(index)}
            >
              <View style={styles.colorPreview}>
                <View style={[styles.colorHalf, { backgroundColor: preset.primary }]} />
                <View style={[styles.colorHalf, { backgroundColor: preset.secondary }]} />
              </View>
              <Text style={[styles.colorName, { color: theme.colors.text }]}>
                {preset.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Generate Button */}
      <TouchableOpacity
        style={[styles.generateBtn, isGenerating && styles.generateBtnDisabled]}
        onPress={handleGenerate}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <>
            <ActivityIndicator color="#fff" size="small" />
            <Text style={styles.generateBtnText}>Generating with AI...</Text>
          </>
        ) : (
          <>
            <Icon name="creation" size={24} color="#fff" />
            <Text style={styles.generateBtnText}>Generate Logo</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Generated Result */}
      {generatedAsset && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Generated Result
          </Text>
          <View style={[styles.resultCard, { backgroundColor: theme.colors.card }]}>
            <Image 
              source={{ uri: generatedAsset.imageUrl }}
              style={styles.resultImage}
              resizeMode="contain"
            />
            <View style={styles.resultInfo}>
              <Text style={[styles.resultPrompt, { color: theme.colors.text + '80' }]}>
                Prompt: {generatedAsset.prompt.slice(0, 100)}...
              </Text>
              <View style={styles.resultActions}>
                <TouchableOpacity style={styles.actionBtn}>
                  <Icon name="download" size={20} color="#00E5FF" />
                  <Text style={styles.actionBtnText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}>
                  <Icon name="refresh" size={20} color="#FF4081" />
                  <Text style={styles.actionBtnText}>Regenerate</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}>
                  <Icon name="share" size={20} color="#C6FF00" />
                  <Text style={styles.actionBtnText}>Share</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Generation History */}
      {generationHistory.length > 1 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            History
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.historyRow}>
              {generationHistory.slice(1).map((asset, index) => (
                <TouchableOpacity
                  key={asset.id}
                  style={styles.historyItem}
                  onPress={() => setGeneratedAsset(asset)}
                >
                  <Image 
                    source={{ uri: asset.imageUrl }}
                    style={styles.historyImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      {/* API Key Notice */}
      {!assetGeneratorService.isConfigured() && (
        <View style={[styles.notice, { backgroundColor: '#FF408120' }]}>
          <Icon name="information" size={20} color="#FF4081" />
          <Text style={[styles.noticeText, { color: '#FF4081' }]}>
            Set your Grok API key to enable AI generation:{'\n'}
            assetGeneratorService.setApiKey('your-key')
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  quickGenerateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6C63FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 10,
  },
  quickGenerateText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  typeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  typeBtn: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#2a2a3e',
    gap: 8,
  },
  typeBtnActive: {
    backgroundColor: '#FF4081',
  },
  typeBtnText: {
    color: '#888',
    fontSize: 12,
    fontWeight: '600',
  },
  typeBtnTextActive: {
    color: '#fff',
  },
  input: {
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
  },
  styleRow: {
    flexDirection: 'row',
    gap: 12,
  },
  styleBtn: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    minWidth: 90,
    gap: 8,
  },
  styleBtnActive: {
    borderWidth: 2,
    borderColor: '#FF4081',
  },
  styleBtnText: {
    fontSize: 12,
    fontWeight: '500',
  },
  styleBtnTextActive: {
    color: '#FF4081',
  },
  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorBtn: {
    alignItems: 'center',
    gap: 6,
  },
  colorBtnActive: {
    transform: [{ scale: 1.1 }],
  },
  colorPreview: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  colorHalf: {
    flex: 1,
  },
  colorName: {
    fontSize: 10,
    fontWeight: '500',
  },
  generateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF4081',
    padding: 18,
    borderRadius: 14,
    gap: 10,
    marginBottom: 24,
  },
  generateBtnDisabled: {
    opacity: 0.7,
  },
  generateBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  resultImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#1a1a2e',
  },
  resultInfo: {
    padding: 16,
  },
  resultPrompt: {
    fontSize: 12,
    marginBottom: 12,
  },
  resultActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionBtn: {
    alignItems: 'center',
    gap: 4,
  },
  actionBtnText: {
    color: '#888',
    fontSize: 12,
  },
  historyRow: {
    flexDirection: 'row',
    gap: 12,
  },
  historyItem: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
  },
  historyImage: {
    width: '100%',
    height: '100%',
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  noticeText: {
    flex: 1,
    fontSize: 12,
  },
});

export default BrandingStudioScreen;
