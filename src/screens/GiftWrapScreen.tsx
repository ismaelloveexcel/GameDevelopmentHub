/**
 * GiftWrapScreen
 * 
 * Screen for selecting gift wrapping theme and adding a personal note.
 * Part of the gift creation flow.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../contexts/ThemeContext';
import { 
  GiftWrap, 
  GiftWrapTheme, 
  GiftWrapOption, 
  GIFT_WRAP_OPTIONS,
  GiftNote,
} from '../types/gift';
import { giftService } from '../services/GiftService';
import { RootStackParamList } from '../types';

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface GiftWrapScreenParams {
  templateId: string;
  artStyleId: string;
  recipientName: string;
  mode?: 'standard' | 'roulette' | 'blind_date';
}

const WrapOptionCard: React.FC<{
  option: GiftWrapOption;
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

  // Check if seasonally available
  const isAvailable = () => {
    if (!option.seasonalAvailability) return true;
    const currentMonth = new Date().getMonth() + 1;
    const { startMonth, endMonth } = option.seasonalAvailability;
    if (startMonth <= endMonth) {
      return currentMonth >= startMonth && currentMonth <= endMonth;
    }
    return currentMonth >= startMonth || currentMonth <= endMonth;
  };

  const available = isAvailable();

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[
          styles.wrapCard,
          {
            backgroundColor: option.colors.primary + '15',
            borderColor: isSelected ? option.colors.primary : 'transparent',
            borderWidth: isSelected ? 3 : 0,
            opacity: available ? 1 : 0.5,
          },
        ]}
        onPress={handlePress}
        disabled={!available}
        activeOpacity={0.8}
      >
        {/* Color Bar */}
        <View style={styles.colorBar}>
          <View style={[styles.colorDot, { backgroundColor: option.colors.primary }]} />
          <View style={[styles.colorDot, { backgroundColor: option.colors.secondary }]} />
          <View style={[styles.colorDot, { backgroundColor: option.colors.accent }]} />
        </View>

        {/* Icon */}
        <Text style={styles.wrapIcon}>{option.icon}</Text>

        {/* Name */}
        <Text style={[styles.wrapName, { color: theme.colors.text }]}>
          {option.name}
        </Text>

        {/* Badges */}
        <View style={styles.badgeRow}>
          {isSelected && (
            <View style={[styles.selectedBadge, { backgroundColor: option.colors.primary }]}>
              <Icon name="check" size={12} color="#fff" />
            </View>
          )}
          {option.isPremium && (
            <View style={[styles.premiumBadge, { backgroundColor: '#f1c40f' }]}>
              <Icon name="crown" size={10} color="#000" />
            </View>
          )}
          {!available && (
            <View style={[styles.unavailableBadge, { backgroundColor: theme.colors.text + '40' }]}>
              <Text style={styles.unavailableText}>Seasonal</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function GiftWrapScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();
  
  // For now, using default values - in production, get from route params
  const templateId = 'match3';
  const artStyleId = 'pixel';
  const recipientName = 'Friend';

  const [selectedWrap, setSelectedWrap] = useState<GiftWrapTheme>('classic');
  const [noteText, setNoteText] = useState('');
  const [noteType, setNoteType] = useState<'text' | 'voice'>('text');
  const [isCreating, setIsCreating] = useState(false);

  const selectedOption = GIFT_WRAP_OPTIONS.find(o => o.id === selectedWrap);

  const handleCreateGift = async () => {
    if (isCreating) return;
    setIsCreating(true);

    try {
      const wrap: GiftWrap = {
        theme: selectedWrap,
        animation: selectedOption?.animation || 'wrap_classic',
        colors: selectedOption?.colors || GIFT_WRAP_OPTIONS[0].colors,
      };

      const note: Omit<GiftNote, 'createdAt'> | undefined = noteText.trim()
        ? { type: noteType, content: noteText.trim() }
        : undefined;

      const gift = await giftService.createGift({
        recipient: { name: recipientName },
        mode: 'standard',
        templateId,
        artStyleId,
        wrap,
        note,
      });

      Alert.alert(
        '🎁 Gift Created!',
        `Your gift is ready to share!\n\nShare link: ${gift.shortCode}`,
        [
          { 
            text: 'Share Now', 
            onPress: () => {
              // In production: open share sheet
              console.log('Share:', gift.shareLink);
            }
          },
          { text: 'Done', onPress: () => navigation.navigate('Home') },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create gift. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          🎁 Wrap Your Gift
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Recipient Preview */}
        <View style={[styles.recipientCard, { backgroundColor: theme.colors.card }]}>
          <Icon name="account-heart" size={24} color={theme.colors.primary} />
          <Text style={[styles.recipientText, { color: theme.colors.text }]}>
            Creating a gift for <Text style={styles.recipientName}>{recipientName}</Text>
          </Text>
        </View>

        {/* Wrap Selection */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Choose Wrapping
        </Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.wrapScrollContent}
        >
          {GIFT_WRAP_OPTIONS.map((option) => (
            <WrapOptionCard
              key={option.id}
              option={option}
              isSelected={selectedWrap === option.id}
              onSelect={() => setSelectedWrap(option.id)}
            />
          ))}
        </ScrollView>

        {/* Selected Wrap Preview */}
        {selectedOption && (
          <View 
            style={[
              styles.previewCard, 
              { 
                backgroundColor: selectedOption.colors.primary + '20',
                borderColor: selectedOption.colors.primary,
              }
            ]}
          >
            <Text style={styles.previewIcon}>{selectedOption.icon}</Text>
            <View style={styles.previewInfo}>
              <Text style={[styles.previewName, { color: theme.colors.text }]}>
                {selectedOption.name}
              </Text>
              <Text style={[styles.previewDesc, { color: theme.colors.text + '80' }]}>
                {selectedOption.description}
              </Text>
            </View>
          </View>
        )}

        {/* Note Section */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Add a Personal Note
        </Text>

        {/* Note Type Toggle */}
        <View style={styles.noteTypeToggle}>
          <TouchableOpacity
            style={[
              styles.noteTypeButton,
              {
                backgroundColor: noteType === 'text' ? theme.colors.primary : theme.colors.card,
              },
            ]}
            onPress={() => setNoteType('text')}
          >
            <Icon 
              name="text" 
              size={20} 
              color={noteType === 'text' ? '#fff' : theme.colors.text} 
            />
            <Text 
              style={[
                styles.noteTypeText,
                { color: noteType === 'text' ? '#fff' : theme.colors.text },
              ]}
            >
              Text
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.noteTypeButton,
              {
                backgroundColor: noteType === 'voice' ? theme.colors.primary : theme.colors.card,
              },
            ]}
            onPress={() => setNoteType('voice')}
          >
            <Icon 
              name="microphone" 
              size={20} 
              color={noteType === 'voice' ? '#fff' : theme.colors.text} 
            />
            <Text 
              style={[
                styles.noteTypeText,
                { color: noteType === 'voice' ? '#fff' : theme.colors.text },
              ]}
            >
              Voice
            </Text>
          </TouchableOpacity>
        </View>

        {/* Text Input */}
        {noteType === 'text' && (
          <View style={[styles.noteInputContainer, { backgroundColor: theme.colors.card }]}>
            <TextInput
              style={[styles.noteInput, { color: theme.colors.text }]}
              placeholder="Write a heartfelt message..."
              placeholderTextColor={theme.colors.text + '60'}
              value={noteText}
              onChangeText={setNoteText}
              multiline
              maxLength={500}
            />
            <Text style={[styles.charCount, { color: theme.colors.text + '40' }]}>
              {noteText.length}/500
            </Text>
          </View>
        )}

        {/* Voice Recording (Placeholder) */}
        {noteType === 'voice' && (
          <TouchableOpacity 
            style={[styles.voiceRecordButton, { backgroundColor: theme.colors.card }]}
          >
            <Icon name="microphone" size={48} color={theme.colors.primary} />
            <Text style={[styles.voiceRecordText, { color: theme.colors.text }]}>
              Tap to Record
            </Text>
            <Text style={[styles.voiceRecordHint, { color: theme.colors.text + '60' }]}>
              Up to 30 seconds
            </Text>
          </TouchableOpacity>
        )}

        {/* Spacer for button */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Create Button */}
      <View style={[styles.bottomBar, { backgroundColor: theme.colors.background }]}>
        <TouchableOpacity
          style={[
            styles.createButton,
            { backgroundColor: theme.colors.primary },
            isCreating && { opacity: 0.7 },
          ]}
          onPress={handleCreateGift}
          disabled={isCreating}
        >
          <Icon name="gift" size={24} color="#fff" />
          <Text style={styles.createButtonText}>
            {isCreating ? 'Creating...' : 'Create & Share Gift'}
          </Text>
        </TouchableOpacity>
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
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  recipientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 12,
  },
  recipientText: {
    fontSize: 16,
  },
  recipientName: {
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  wrapScrollContent: {
    paddingRight: 16,
    gap: 12,
  },
  wrapCard: {
    width: 100,
    padding: 12,
    borderRadius: 16,
    alignItems: 'center',
  },
  colorBar: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 8,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  wrapIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  wrapName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 8,
  },
  selectedBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unavailableBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  unavailableText: {
    fontSize: 8,
    color: '#fff',
  },
  previewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    marginTop: 16,
    marginBottom: 24,
    gap: 16,
  },
  previewIcon: {
    fontSize: 40,
  },
  previewInfo: {
    flex: 1,
  },
  previewName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  previewDesc: {
    fontSize: 14,
  },
  noteTypeToggle: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  noteTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 12,
    gap: 8,
  },
  noteTypeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  noteInputContainer: {
    borderRadius: 16,
    padding: 16,
    minHeight: 150,
  },
  noteInput: {
    fontSize: 16,
    lineHeight: 24,
    flex: 1,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 8,
  },
  voiceRecordButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    borderRadius: 16,
  },
  voiceRecordText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
  },
  voiceRecordHint: {
    fontSize: 12,
    marginTop: 4,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 32,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 16,
    gap: 12,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
