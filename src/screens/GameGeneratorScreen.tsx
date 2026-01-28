import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../contexts/ThemeContext';
import { RootStackParamList, GameGeneratorCriteria, ArtStyle, TemplateCategory } from '../types';
import { gameGeneratorService } from '../services/GameGeneratorService';
import { projectService } from '../services/ProjectService';
import { templateLibrary } from '../services/TemplateLibrary';

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function GameGeneratorScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();
  
  const [theme_input, setThemeInput] = useState('');
  const [occasion, setOccasion] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [customRequirements, setCustomRequirements] = useState('');
  const [selectedGameType, setSelectedGameType] = useState<TemplateCategory | undefined>();
  const [selectedArtStyle, setSelectedArtStyle] = useState<ArtStyle | undefined>();
  const [selectedDifficulty, setSelectedDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const popularThemes = gameGeneratorService.getPopularThemes();
  
  const gameTypes: Array<{ value: TemplateCategory; label: string; icon: string }> = [
    { value: 'puzzle', label: 'Puzzle', icon: 'puzzle' },
    { value: 'action', label: 'Action', icon: 'run-fast' },
    { value: 'strategy', label: 'Strategy', icon: 'chess-knight' },
    { value: 'educational', label: 'Educational', icon: 'school' },
    { value: 'story', label: 'Story', icon: 'book-open-variant' },
    { value: 'quiz', label: 'Quiz', icon: 'help-circle' },
  ];
  
  const artStyles: Array<{ value: ArtStyle; label: string; icon: string }> = [
    { value: 'pixel', label: 'Pixel Art', icon: 'gamepad-square' },
    { value: 'lowpoly', label: 'Low Poly', icon: 'cube-outline' },
    { value: 'handdrawn', label: 'Hand Drawn', icon: 'draw' },
    { value: 'cyberpunk', label: 'Cyberpunk', icon: 'robot' },
    { value: 'watercolor', label: 'Watercolor', icon: 'brush' },
  ];
  
  const handlePopularThemeSelect = (themeName: string) => {
    setThemeInput(themeName);
    setOccasion(themeName);
  };
  
  const handleGenerate = async () => {
    const criteria: GameGeneratorCriteria = {
      theme: theme_input,
      occasion,
      targetAudience,
      gameType: selectedGameType,
      difficulty: selectedDifficulty,
      artStyle: selectedArtStyle,
      customRequirements,
    };
    
    // Validate criteria
    const validation = gameGeneratorService.validateCriteria(criteria);
    if (!validation.valid) {
      Alert.alert('Validation Error', validation.errors.join('\n'));
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Generate game configuration
      const gameConfig = await gameGeneratorService.generateGame(criteria);
      
      // Get the template
      const template = templateLibrary.getTemplateById(gameConfig.templateId);
      if (!template) {
        throw new Error('Template not found');
      }
      
      // Create project from generated config
      const project = await projectService.createProject(
        gameConfig.name,
        gameConfig.description,
        'game',
        template.engine,
        gameConfig.templateId,
        gameConfig.artStyle
      );
      
      // Success!
      Alert.alert(
        'Game Generated!',
        `Your themed game "${gameConfig.name}" has been created successfully!`,
        [
          {
            text: 'View Project',
            onPress: () => navigation.navigate('ProjectEditor', { projectId: project.id }),
          },
          {
            text: 'Create Another',
            style: 'cancel',
            onPress: () => {
              setThemeInput('');
              setOccasion('');
              setTargetAudience('');
              setCustomRequirements('');
              setSelectedGameType(undefined);
              setSelectedArtStyle(undefined);
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to generate game. Please try again.');
      console.error('Generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Generate Themed Game
        </Text>
      </View>
      
      {/* Description */}
      <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <Icon name="magic-staff" size={32} color={theme.colors.primary} />
        <Text style={[styles.description, { color: theme.colors.text }]}>
          Create custom games for special occasions and situations. Just tell us about your event, and we'll generate the perfect game!
        </Text>
      </View>
      
      {/* Popular Themes */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Popular Themes
        </Text>
        <View style={styles.themesGrid}>
          {popularThemes.map((themeItem, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.themeCard,
                { backgroundColor: theme.colors.card },
                theme_input === themeItem.name && { borderColor: theme.colors.primary, borderWidth: 2 },
              ]}
              onPress={() => handlePopularThemeSelect(themeItem.name)}
            >
              <Icon name={themeItem.icon} size={24} color={theme.colors.primary} />
              <Text style={[styles.themeName, { color: theme.colors.text }]}>
                {themeItem.name}
              </Text>
              <Text style={[styles.themeDescription, { color: theme.colors.text + '80' }]}>
                {themeItem.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      {/* Custom Theme Input */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Theme / Occasion *
        </Text>
        <TextInput
          style={[styles.input, { 
            backgroundColor: theme.colors.card, 
            color: theme.colors.text,
            borderColor: theme.colors.border || theme.colors.text + '20',
          }]}
          placeholder="e.g., Space Adventure, Ocean Party, Medieval Quest"
          placeholderTextColor={theme.colors.text + '60'}
          value={theme_input}
          onChangeText={setThemeInput}
        />
      </View>
      
      {/* Occasion */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Specific Occasion (Optional)
        </Text>
        <TextInput
          style={[styles.input, { 
            backgroundColor: theme.colors.card, 
            color: theme.colors.text,
            borderColor: theme.colors.border || theme.colors.text + '20',
          }]}
          placeholder="e.g., Birthday, Wedding, Holiday Party"
          placeholderTextColor={theme.colors.text + '60'}
          value={occasion}
          onChangeText={setOccasion}
        />
      </View>
      
      {/* Target Audience */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Target Audience (Optional)
        </Text>
        <TextInput
          style={[styles.input, { 
            backgroundColor: theme.colors.card, 
            color: theme.colors.text,
            borderColor: theme.colors.border || theme.colors.text + '20',
          }]}
          placeholder="e.g., Children, Adults, Family"
          placeholderTextColor={theme.colors.text + '60'}
          value={targetAudience}
          onChangeText={setTargetAudience}
        />
      </View>
      
      {/* Game Type */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Game Type (Optional)
        </Text>
        <View style={styles.optionsGrid}>
          {gameTypes.map((type) => (
            <TouchableOpacity
              key={type.value}
              style={[
                styles.optionCard,
                { backgroundColor: theme.colors.card },
                selectedGameType === type.value && { 
                  backgroundColor: theme.colors.primary + '20',
                  borderColor: theme.colors.primary,
                  borderWidth: 2,
                },
              ]}
              onPress={() => setSelectedGameType(type.value)}
            >
              <Icon 
                name={type.icon} 
                size={20} 
                color={selectedGameType === type.value ? theme.colors.primary : theme.colors.text} 
              />
              <Text style={[
                styles.optionText, 
                { color: selectedGameType === type.value ? theme.colors.primary : theme.colors.text }
              ]}>
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      {/* Art Style */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Art Style (Optional)
        </Text>
        <View style={styles.optionsGrid}>
          {artStyles.map((style) => (
            <TouchableOpacity
              key={style.value}
              style={[
                styles.optionCard,
                { backgroundColor: theme.colors.card },
                selectedArtStyle === style.value && { 
                  backgroundColor: theme.colors.primary + '20',
                  borderColor: theme.colors.primary,
                  borderWidth: 2,
                },
              ]}
              onPress={() => setSelectedArtStyle(style.value)}
            >
              <Icon 
                name={style.icon} 
                size={20} 
                color={selectedArtStyle === style.value ? theme.colors.primary : theme.colors.text} 
              />
              <Text style={[
                styles.optionText, 
                { color: selectedArtStyle === style.value ? theme.colors.primary : theme.colors.text }
              ]}>
                {style.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      {/* Difficulty */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Difficulty
        </Text>
        <View style={styles.optionsGrid}>
          {['beginner', 'intermediate', 'advanced'].map((diff) => (
            <TouchableOpacity
              key={diff}
              style={[
                styles.optionCard,
                { backgroundColor: theme.colors.card },
                selectedDifficulty === diff && { 
                  backgroundColor: theme.colors.primary + '20',
                  borderColor: theme.colors.primary,
                  borderWidth: 2,
                },
              ]}
              onPress={() => setSelectedDifficulty(diff as any)}
            >
              <Text style={[
                styles.optionText, 
                { color: selectedDifficulty === diff ? theme.colors.primary : theme.colors.text }
              ]}>
                {diff.charAt(0).toUpperCase() + diff.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      {/* Custom Requirements */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Additional Requirements (Optional)
        </Text>
        <TextInput
          style={[styles.textArea, { 
            backgroundColor: theme.colors.card, 
            color: theme.colors.text,
            borderColor: theme.colors.border || theme.colors.text + '20',
          }]}
          placeholder="Any specific features or requirements for your game..."
          placeholderTextColor={theme.colors.text + '60'}
          value={customRequirements}
          onChangeText={setCustomRequirements}
          multiline
          numberOfLines={4}
        />
      </View>
      
      {/* Generate Button */}
      <View style={styles.section}>
        <TouchableOpacity
          style={[styles.generateButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleGenerate}
          disabled={isGenerating || !theme_input}
        >
          {isGenerating ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <>
              <Icon name="auto-fix" size={24} color="#ffffff" />
              <Text style={styles.generateButtonText}>Generate Game</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  card: {
    margin: 16,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 20,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  themesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  themeCard: {
    width: '48%',
    margin: '1%',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  themeName: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  themeDescription: {
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },
  input: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
    fontSize: 14,
  },
  textArea: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    margin: 4,
    borderRadius: 8,
    minWidth: 100,
  },
  optionText: {
    fontSize: 12,
    marginLeft: 6,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 32,
  },
  generateButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
