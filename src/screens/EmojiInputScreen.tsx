/**
 * EmojiInputScreen
 * 
 * Emoji Story Mode - describe the recipient using emojis
 * and let AI interpret their personality.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../contexts/ThemeContext';
import { EmojiPicker } from '../components/EmojiPicker';
import { EmojiStory, EmojiInterpretation } from '../types/gift';
import { RootStackParamList } from '../types';
import { aiService } from '../services/AIService';

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function EmojiInputScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();

  const [recipientName, setRecipientName] = useState('');
  const [emojiStory, setEmojiStory] = useState<EmojiStory>({
    personality: [],
    hobbies: [],
    mood: [],
  });
  const [isInterpreting, setIsInterpreting] = useState(false);

  const getTotalEmojis = () => {
    return emojiStory.personality.length + 
           emojiStory.hobbies.length + 
           emojiStory.mood.length;
  };

  const canProceed = () => {
    return recipientName.trim().length > 0 && getTotalEmojis() >= 3;
  };

  const handleContinue = async () => {
    if (!canProceed()) return;

    setIsInterpreting(true);

    try {
      // Use Grok AI to interpret emojis
      const interpretation: EmojiInterpretation = await aiService.interpretEmojis(emojiStory);
      
      console.log('AI Interpretation:', interpretation);
      console.log(`Suggested: ${interpretation.suggestedTemplateId} in ${interpretation.suggestedStyleId} style`);
      console.log(`Description: ${interpretation.description}`);

      // Navigate to roulette with the interpretation context
      // In a full implementation, we'd pass this data
      navigation.navigate('Roulette');
    } catch (error) {
      console.error('Interpretation failed:', error);
      // Still navigate even if AI fails
      navigation.navigate('Roulette');
    } finally {
      setIsInterpreting(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          📱 Emoji Story
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Recipient Name */}
      <View style={styles.nameSection}>
        <Text style={[styles.label, { color: theme.colors.text }]}>
          Who is this gift for?
        </Text>
        <TextInput
          style={[
            styles.nameInput,
            { 
              backgroundColor: theme.colors.card,
              color: theme.colors.text,
              borderColor: recipientName ? theme.colors.primary : 'transparent',
            },
          ]}
          placeholder="Enter their name..."
          placeholderTextColor={theme.colors.text + '60'}
          value={recipientName}
          onChangeText={setRecipientName}
          autoCapitalize="words"
        />
      </View>

      {/* Info Card */}
      <View style={[styles.infoCard, { backgroundColor: theme.colors.primary + '15' }]}>
        <Icon name="lightbulb-outline" size={20} color={theme.colors.primary} />
        <Text style={[styles.infoText, { color: theme.colors.text + '80' }]}>
          Describe {recipientName || 'them'} using emojis! Select at least 3.
        </Text>
      </View>

      {/* Emoji Picker */}
      <View style={styles.pickerContainer}>
        <EmojiPicker
          value={emojiStory}
          onChange={setEmojiStory}
          maxPerCategory={5}
        />
      </View>

      {/* Continue Button */}
      <View style={[styles.bottomBar, { backgroundColor: theme.colors.background }]}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            {
              backgroundColor: canProceed() ? theme.colors.primary : theme.colors.text + '30',
            },
            isInterpreting && { opacity: 0.7 },
          ]}
          onPress={handleContinue}
          disabled={!canProceed() || isInterpreting}
        >
          {isInterpreting ? (
            <>
              <Icon name="loading" size={24} color="#fff" />
              <Text style={styles.continueText}>Interpreting...</Text>
            </>
          ) : (
            <>
              <Icon name="arrow-right" size={24} color="#fff" />
              <Text style={styles.continueText}>
                Continue ({getTotalEmojis()} emojis)
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    fontSize: 20,
    fontWeight: 'bold',
  },
  nameSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  nameInput: {
    padding: 16,
    borderRadius: 12,
    fontSize: 18,
    borderWidth: 2,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    padding: 12,
    borderRadius: 12,
    gap: 10,
    marginBottom: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
  },
  pickerContainer: {
    flex: 1,
  },
  bottomBar: {
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
});
