/**
 * EmojiPicker Component
 * 
 * Category-based emoji selector for describing gift recipients.
 * Used in Emoji Story Mode.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../contexts/ThemeContext';
import { EmojiStory } from '../types/gift';

interface EmojiPickerProps {
  value: EmojiStory;
  onChange: (story: EmojiStory) => void;
  maxPerCategory?: number;
}

type EmojiCategory = 'personality' | 'hobbies' | 'mood';

const EMOJI_DATA: Record<EmojiCategory, { title: string; icon: string; emojis: string[] }> = {
  personality: {
    title: 'Who are they?',
    icon: 'account-heart',
    emojis: [
      '🎨', '🤓', '💪', '🧘', '🤪', '😎', '🥰', '🤔',
      '😊', '🙃', '😇', '🥳', '🤩', '😌', '🧐', '🤗',
      '💃', '🕺', '👑', '🦋', '🌟', '✨', '💖', '🔥',
    ],
  },
  hobbies: {
    title: 'What do they love?',
    icon: 'heart-multiple',
    emojis: [
      '☕', '📚', '🎮', '🎵', '⚽', '🏃', '🍳', '🎬',
      '📸', '✈️', '🏖️', '🎪', '🎭', '🎨', '🧩', '♟️',
      '🐕', '🐱', '🌱', '🍕', '🍷', '🎸', '💻', '🏋️',
    ],
  },
  mood: {
    title: "What's their vibe?",
    icon: 'emoticon-happy',
    emojis: [
      '😂', '🥹', '😍', '🤣', '😭', '🥺', '😤', '🙈',
      '💀', '🔥', '✨', '💯', '🎉', '❤️', '💪', '🙌',
    ],
  },
};

const EmojiButton: React.FC<{
  emoji: string;
  isSelected: boolean;
  onPress: () => void;
}> = ({ emoji, isSelected, onPress }) => {
  const { theme } = useTheme();
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.3,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    onPress();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[
          styles.emojiButton,
          {
            backgroundColor: isSelected ? theme.colors.primary + '30' : 'transparent',
            borderColor: isSelected ? theme.colors.primary : 'transparent',
          },
        ]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <Text style={styles.emoji}>{emoji}</Text>
        {isSelected && (
          <View style={[styles.checkMark, { backgroundColor: theme.colors.primary }]}>
            <Icon name="check" size={8} color="#fff" />
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

export const EmojiPicker: React.FC<EmojiPickerProps> = ({
  value,
  onChange,
  maxPerCategory = 5,
}) => {
  const { theme } = useTheme();
  const [activeCategory, setActiveCategory] = useState<EmojiCategory>('personality');

  const toggleEmoji = (category: EmojiCategory, emoji: string) => {
    const currentList = value[category];
    let newList: string[];

    if (currentList.includes(emoji)) {
      // Remove emoji
      newList = currentList.filter(e => e !== emoji);
    } else {
      // Add emoji (respecting max limit)
      if (currentList.length >= maxPerCategory) {
        // Replace the oldest one
        newList = [...currentList.slice(1), emoji];
      } else {
        newList = [...currentList, emoji];
      }
    }

    onChange({
      ...value,
      [category]: newList,
    });
  };

  const getTotalSelected = () => {
    return value.personality.length + value.hobbies.length + value.mood.length;
  };

  const categoryData = EMOJI_DATA[activeCategory];

  return (
    <View style={styles.container}>
      {/* Category Tabs */}
      <View style={styles.tabsContainer}>
        {(Object.keys(EMOJI_DATA) as EmojiCategory[]).map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.tab,
              {
                backgroundColor: activeCategory === cat 
                  ? theme.colors.primary 
                  : theme.colors.card,
              },
            ]}
            onPress={() => setActiveCategory(cat)}
          >
            <Icon
              name={EMOJI_DATA[cat].icon}
              size={20}
              color={activeCategory === cat ? '#fff' : theme.colors.text}
            />
            <Text
              style={[
                styles.tabText,
                { color: activeCategory === cat ? '#fff' : theme.colors.text },
              ]}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Text>
            {value[cat].length > 0 && (
              <View style={[styles.badge, { backgroundColor: activeCategory === cat ? '#fff' : theme.colors.primary }]}>
                <Text style={[styles.badgeText, { color: activeCategory === cat ? theme.colors.primary : '#fff' }]}>
                  {value[cat].length}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Category Title */}
      <View style={styles.categoryHeader}>
        <Text style={[styles.categoryTitle, { color: theme.colors.text }]}>
          {categoryData.title}
        </Text>
        <Text style={[styles.categoryHint, { color: theme.colors.text + '60' }]}>
          Select up to {maxPerCategory}
        </Text>
      </View>

      {/* Selected Emojis Preview */}
      {value[activeCategory].length > 0 && (
        <View style={[styles.selectedPreview, { backgroundColor: theme.colors.card }]}>
          <Text style={styles.selectedEmojis}>
            {value[activeCategory].join(' ')}
          </Text>
          <TouchableOpacity
            onPress={() => onChange({ ...value, [activeCategory]: [] })}
            style={styles.clearButton}
          >
            <Icon name="close-circle" size={20} color={theme.colors.text + '60'} />
          </TouchableOpacity>
        </View>
      )}

      {/* Emoji Grid */}
      <ScrollView style={styles.emojiGrid} showsVerticalScrollIndicator={false}>
        <View style={styles.emojiRow}>
          {categoryData.emojis.map((emoji) => (
            <EmojiButton
              key={emoji}
              emoji={emoji}
              isSelected={value[activeCategory].includes(emoji)}
              onPress={() => toggleEmoji(activeCategory, emoji)}
            />
          ))}
        </View>
      </ScrollView>

      {/* Summary */}
      <View style={[styles.summary, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.summaryLabel, { color: theme.colors.text + '80' }]}>
          Your emoji story:
        </Text>
        <View style={styles.summaryEmojis}>
          {value.personality.length > 0 && (
            <Text style={styles.summaryText}>{value.personality.join('')}</Text>
          )}
          {value.hobbies.length > 0 && (
            <>
              <Text style={[styles.summaryDivider, { color: theme.colors.text + '40' }]}>+</Text>
              <Text style={styles.summaryText}>{value.hobbies.join('')}</Text>
            </>
          )}
          {value.mood.length > 0 && (
            <>
              <Text style={[styles.summaryDivider, { color: theme.colors.text + '40' }]}>+</Text>
              <Text style={styles.summaryText}>{value.mood.join('')}</Text>
            </>
          )}
        </View>
        <Text style={[styles.totalCount, { color: theme.colors.primary }]}>
          {getTotalSelected()} selected
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    gap: 6,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
  },
  badge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  categoryHint: {
    fontSize: 12,
  },
  selectedPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
  },
  selectedEmojis: {
    flex: 1,
    fontSize: 24,
    letterSpacing: 4,
  },
  clearButton: {
    padding: 4,
  },
  emojiGrid: {
    flex: 1,
    paddingHorizontal: 16,
  },
  emojiRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  emojiButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    margin: 4,
    borderWidth: 2,
  },
  emoji: {
    fontSize: 28,
  },
  checkMark: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summary: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
  },
  summaryLabel: {
    fontSize: 12,
    marginBottom: 8,
  },
  summaryEmojis: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 20,
  },
  summaryDivider: {
    fontSize: 16,
    marginHorizontal: 8,
  },
  totalCount: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default EmojiPicker;
