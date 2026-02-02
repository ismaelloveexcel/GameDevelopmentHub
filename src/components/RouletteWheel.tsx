/**
 * RouletteWheel Component
 * 
 * Animated spinning wheel for Game Roulette feature.
 * Spins template, style, and wild card simultaneously.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../contexts/ThemeContext';
import { rouletteService } from '../services/RouletteService';
import { templateLibrary } from '../services/TemplateLibrary';
import { artStyleService } from '../services/ArtStyleService';
import { wildCardService } from '../services/WildCardService';
import { RouletteResult, RouletteConfig } from '../types/gift';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface RouletteWheelProps {
  onSpinComplete: (result: RouletteResult) => void;
  onSpinStart?: () => void;
  config?: RouletteConfig;
  disabled?: boolean;
}

interface SlotItemProps {
  items: Array<{ id: string; name: string; icon: string }>;
  spinDuration: number;
  delay: number;
  onSpinComplete: (item: { id: string; name: string; icon: string }) => void;
  isSpinning: boolean;
  label: string;
}

const SlotItem: React.FC<SlotItemProps> = ({
  items,
  spinDuration,
  delay,
  onSpinComplete,
  isSpinning,
  label,
}) => {
  const { theme } = useTheme();
  const spinAnim = useRef(new Animated.Value(0)).current;
  const [displayIndex, setDisplayIndex] = useState(0);
  const [finalItem, setFinalItem] = useState(items[0]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isSpinning) {
      // Start rapid cycling through items
      let currentIndex = 0;
      intervalRef.current = setInterval(() => {
        currentIndex = (currentIndex + 1) % items.length;
        setDisplayIndex(currentIndex);
      }, 80);

      // Animate the spin
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: spinDuration,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Stop cycling and set final item
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        const randomIndex = Math.floor(Math.random() * items.length);
        setDisplayIndex(randomIndex);
        setFinalItem(items[randomIndex]);
        onSpinComplete(items[randomIndex]);
        spinAnim.setValue(0);
      });
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isSpinning]);

  const currentItem = items[displayIndex];

  return (
    <View style={styles.slotContainer}>
      <Text style={[styles.slotLabel, { color: theme.colors.text + '80' }]}>
        {label}
      </Text>
      <Animated.View
        style={[
          styles.slotWindow,
          {
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.primary,
            transform: [
              {
                scale: spinAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [1, 1.1, 1],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={styles.slotIcon}>{currentItem?.icon || '?'}</Text>
        <Text
          style={[styles.slotName, { color: theme.colors.text }]}
          numberOfLines={1}
        >
          {currentItem?.name || 'Spinning...'}
        </Text>
      </Animated.View>
    </View>
  );
};

export const RouletteWheel: React.FC<RouletteWheelProps> = ({
  onSpinComplete,
  onSpinStart,
  config,
  disabled = false,
}) => {
  const { theme } = useTheme();
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<RouletteResult | null>(null);
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;
  const resultOpacityAnim = useRef(new Animated.Value(0)).current;

  // Prepare slot items
  const templateItems = templateLibrary.getAllTemplates().map(t => ({
    id: t.id,
    name: t.name,
    icon: getTemplateIcon(t.category),
  }));

  const styleItems = artStyleService.getAllStyles().map(s => ({
    id: s.id,
    name: s.name,
    icon: getStyleIcon(s.id),
  }));

  const wildCardItems = wildCardService.getAllWildCards().map(w => ({
    id: w.id,
    name: w.name,
    icon: w.icon,
  }));

  // Track completed slots
  const completedSlots = useRef(0);

  const handleSpin = async () => {
    if (isSpinning || disabled) return;

    completedSlots.current = 0;
    setIsSpinning(true);
    onSpinStart?.();

    // Hide previous result
    Animated.timing(resultOpacityAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();

    // Animate button
    Animated.sequence([
      Animated.timing(buttonScaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Get actual result from service
    const spinResult = await rouletteService.spinRoulette(config);
    setResult(spinResult);
  };

  const handleSlotComplete = () => {
    completedSlots.current += 1;
    if (completedSlots.current === 3 && result) {
      // All slots done
      setIsSpinning(false);
      
      // Show result with animation
      Animated.timing(resultOpacityAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        onSpinComplete(result);
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <View style={styles.header}>
        <Icon name="slot-machine" size={32} color={theme.colors.primary} />
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Game Roulette
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.text + '80' }]}>
          Spin to discover your unique combo!
        </Text>
      </View>

      {/* Slot Machine */}
      <View style={[styles.slotsContainer, { backgroundColor: theme.colors.card }]}>
        <SlotItem
          items={templateItems}
          spinDuration={2000}
          delay={0}
          onSpinComplete={handleSlotComplete}
          isSpinning={isSpinning}
          label="Game Type"
        />
        <View style={styles.plusSign}>
          <Text style={[styles.plusText, { color: theme.colors.primary }]}>+</Text>
        </View>
        <SlotItem
          items={styleItems}
          spinDuration={2500}
          delay={200}
          onSpinComplete={handleSlotComplete}
          isSpinning={isSpinning}
          label="Art Style"
        />
        <View style={styles.plusSign}>
          <Text style={[styles.plusText, { color: theme.colors.primary }]}>+</Text>
        </View>
        <SlotItem
          items={wildCardItems}
          spinDuration={3000}
          delay={400}
          onSpinComplete={handleSlotComplete}
          isSpinning={isSpinning}
          label="Wild Card"
        />
      </View>

      {/* Spin Button */}
      <Animated.View style={{ transform: [{ scale: buttonScaleAnim }] }}>
        <TouchableOpacity
          style={[
            styles.spinButton,
            {
              backgroundColor: isSpinning
                ? theme.colors.text + '40'
                : theme.colors.primary,
            },
          ]}
          onPress={handleSpin}
          disabled={isSpinning || disabled}
          activeOpacity={0.8}
        >
          <Icon
            name={isSpinning ? 'loading' : 'refresh'}
            size={24}
            color="#fff"
            style={isSpinning ? styles.spinningIcon : undefined}
          />
          <Text style={styles.spinButtonText}>
            {isSpinning ? 'Spinning...' : 'SPIN!'}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Result Display */}
      {result && (
        <Animated.View
          style={[
            styles.resultContainer,
            {
              backgroundColor: result.rarity.color + '20',
              borderColor: result.rarity.color,
              opacity: resultOpacityAnim,
            },
          ]}
        >
          <View style={styles.resultHeader}>
            <View
              style={[styles.rarityBadge, { backgroundColor: result.rarity.color }]}
            >
              <Icon name="star" size={14} color="#fff" />
              <Text style={styles.rarityText}>{result.rarity.label}</Text>
            </View>
            <Text style={[styles.countText, { color: theme.colors.text + '80' }]}>
              1 of {result.globalCount} in the world
            </Text>
          </View>
          <Text style={[styles.resultTitle, { color: theme.colors.text }]}>
            {result.templateName}
          </Text>
          <Text style={[styles.resultSubtitle, { color: theme.colors.text + '80' }]}>
            in {result.artStyleName} style with {result.wildCard.icon} {result.wildCard.name}
          </Text>
        </Animated.View>
      )}

      {/* Stats */}
      <View style={styles.statsContainer}>
        <Text style={[styles.statsText, { color: theme.colors.text + '60' }]}>
          {rouletteService.getStatistics().totalPossibleCombinations.toLocaleString()} possible combinations
        </Text>
      </View>
    </View>
  );
};

// Helper functions for icons
function getTemplateIcon(category: string): string {
  const icons: Record<string, string> = {
    puzzle: '🧩',
    action: '⚡',
    strategy: '🏰',
    racing: '🏎️',
    educational: '📚',
    vr: '🥽',
    ar: '📱',
    idle: '💰',
    rhythm: '🎵',
    story: '📖',
  };
  return icons[category] || '🎮';
}

function getStyleIcon(styleId: string): string {
  const icons: Record<string, string> = {
    pixel: '👾',
    lowpoly: '🔷',
    handdrawn: '✏️',
    cyberpunk: '🌃',
    watercolor: '🎨',
  };
  return icons[styleId] || '🎨';
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
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
  slotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 20,
    marginBottom: 24,
    width: '100%',
  },
  slotContainer: {
    alignItems: 'center',
    flex: 1,
  },
  slotLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  slotWindow: {
    width: 80,
    height: 100,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  slotIcon: {
    fontSize: 32,
    marginBottom: 4,
  },
  slotName: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  plusSign: {
    paddingHorizontal: 4,
  },
  plusText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  spinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 30,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  spinButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  spinningIcon: {
    // Would add rotation animation in production
  },
  resultContainer: {
    marginTop: 24,
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    width: '100%',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  rarityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  rarityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  countText: {
    fontSize: 12,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  resultSubtitle: {
    fontSize: 14,
  },
  statsContainer: {
    marginTop: 20,
  },
  statsText: {
    fontSize: 12,
  },
});

export default RouletteWheel;
