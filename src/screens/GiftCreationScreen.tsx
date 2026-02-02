/**
 * GiftCreationScreen
 * 
 * Main wizard for creating a game gift.
 * Offers three modes: Standard, Roulette, Emoji Story
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../contexts/ThemeContext';
import { RootStackParamList, GiftCreationMode } from '../types';

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface ModeOption {
  id: GiftCreationMode;
  title: string;
  subtitle: string;
  icon: string;
  emoji: string;
  color: string;
  description: string;
}

const MODE_OPTIONS: ModeOption[] = [
  {
    id: 'roulette',
    title: 'Game Roulette',
    subtitle: 'Let fate decide!',
    icon: 'slot-machine',
    emoji: '🎰',
    color: '#f39c12',
    description: 'Spin for a random unique combination of game type, art style, and wild card twist.',
  },
  {
    id: 'standard',
    title: 'Choose Your Own',
    subtitle: 'Pick every detail',
    icon: 'tune',
    emoji: '🎨',
    color: '#3498db',
    description: 'Select from 15 templates, 5 art styles, and customize everything yourself.',
  },
  {
    id: 'blind_date',
    title: 'Blind Date',
    subtitle: 'Surprise yourself!',
    icon: 'eye-off',
    emoji: '🎁',
    color: '#9b59b6',
    description: "Answer questions but don't see the game until it's done. AI adds secret Easter eggs!",
  },
];

const ModeCard: React.FC<{
  option: ModeOption;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ option, isSelected, onSelect }) => {
  const { theme } = useTheme();
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
    onSelect();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[
          styles.modeCard,
          {
            backgroundColor: isSelected ? option.color + '20' : theme.colors.card,
            borderColor: isSelected ? option.color : 'transparent',
            borderWidth: isSelected ? 3 : 0,
          },
        ]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <View style={[styles.modeIconContainer, { backgroundColor: option.color + '20' }]}>
          <Text style={styles.modeEmoji}>{option.emoji}</Text>
        </View>
        <View style={styles.modeInfo}>
          <Text style={[styles.modeTitle, { color: theme.colors.text }]}>
            {option.title}
          </Text>
          <Text style={[styles.modeSubtitle, { color: option.color }]}>
            {option.subtitle}
          </Text>
          <Text style={[styles.modeDescription, { color: theme.colors.text + '70' }]}>
            {option.description}
          </Text>
        </View>
        {isSelected && (
          <View style={[styles.checkCircle, { backgroundColor: option.color }]}>
            <Icon name="check" size={16} color="#fff" />
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function GiftCreationScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();

  const [recipientName, setRecipientName] = useState('');
  const [selectedMode, setSelectedMode] = useState<GiftCreationMode>('roulette');

  const canProceed = recipientName.trim().length >= 2;

  const handleContinue = () => {
    if (!canProceed) return;

    switch (selectedMode) {
      case 'roulette':
        navigation.navigate('Roulette');
        break;
      case 'standard':
        navigation.navigate('Templates');
        break;
      case 'blind_date':
        navigation.navigate('Roulette'); // Will be EmojiInput in full implementation
        break;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="close" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Create a Gift 🎁
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Step 1: Recipient */}
        <View style={styles.section}>
          <View style={styles.stepHeader}>
            <View style={[styles.stepNumber, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={[styles.stepTitle, { color: theme.colors.text }]}>
              Who is this for?
            </Text>
          </View>
          <TextInput
            style={[
              styles.nameInput,
              {
                backgroundColor: theme.colors.card,
                color: theme.colors.text,
                borderColor: recipientName.length >= 2 ? theme.colors.primary : 'transparent',
              },
            ]}
            placeholder="Enter their name..."
            placeholderTextColor={theme.colors.text + '50'}
            value={recipientName}
            onChangeText={setRecipientName}
            autoCapitalize="words"
            autoFocus
          />
          {recipientName.length > 0 && recipientName.length < 2 && (
            <Text style={[styles.hint, { color: theme.colors.warning }]}>
              Please enter at least 2 characters
            </Text>
          )}
        </View>

        {/* Step 2: Choose Mode */}
        <View style={styles.section}>
          <View style={styles.stepHeader}>
            <View style={[styles.stepNumber, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={[styles.stepTitle, { color: theme.colors.text }]}>
              How do you want to create?
            </Text>
          </View>
          
          <View style={styles.modesContainer}>
            {MODE_OPTIONS.map((option) => (
              <ModeCard
                key={option.id}
                option={option}
                isSelected={selectedMode === option.id}
                onSelect={() => setSelectedMode(option.id)}
              />
            ))}
          </View>
        </View>

        {/* Spacer */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Continue Button */}
      <View style={[styles.bottomBar, { backgroundColor: theme.colors.background }]}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            {
              backgroundColor: canProceed 
                ? MODE_OPTIONS.find(m => m.id === selectedMode)?.color || theme.colors.primary
                : theme.colors.text + '30',
            },
          ]}
          onPress={handleContinue}
          disabled={!canProceed}
        >
          <Text style={styles.continueText}>
            {selectedMode === 'roulette' && '🎰 Spin the Roulette'}
            {selectedMode === 'standard' && '🎨 Choose a Template'}
            {selectedMode === 'blind_date' && '🎁 Start Blind Date'}
          </Text>
          <Icon name="arrow-right" size={24} color="#fff" />
        </TouchableOpacity>
        
        {recipientName && (
          <Text style={[styles.previewText, { color: theme.colors.text + '60' }]}>
            Creating a game for {recipientName}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 32,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  nameInput: {
    padding: 18,
    borderRadius: 16,
    fontSize: 18,
    borderWidth: 2,
  },
  hint: {
    fontSize: 12,
    marginTop: 8,
    marginLeft: 4,
  },
  modesContainer: {
    gap: 12,
  },
  modeCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  modeIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  modeEmoji: {
    fontSize: 28,
  },
  modeInfo: {
    flex: 1,
  },
  modeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  modeSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  modeDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 32,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 16,
    gap: 10,
  },
  continueText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  previewText: {
    textAlign: 'center',
    marginTop: 12,
    fontSize: 14,
  },
});
