/**
 * GiftReceivedScreen
 * 
 * Screen shown when a recipient opens a gift link.
 * Features the unwrap animation and game reveal.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../contexts/ThemeContext';
import { Gift, GIFT_WRAP_OPTIONS } from '../types/gift';
import { giftService } from '../services/GiftService';
import { templateLibrary } from '../services/TemplateLibrary';
import { artStyleService } from '../services/ArtStyleService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface GiftReceivedScreenProps {
  giftId?: string;
  shortCode?: string;
}

type RevealState = 'loading' | 'wrapped' | 'unwrapping' | 'revealed';

export default function GiftReceivedScreen({ giftId, shortCode }: GiftReceivedScreenProps) {
  const { theme } = useTheme();
  const [gift, setGift] = useState<Gift | null>(null);
  const [state, setState] = useState<RevealState>('loading');
  const [error, setError] = useState<string | null>(null);

  // Animations
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const revealOpacity = useRef(new Animated.Value(0)).current;
  const confettiAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadGift();
  }, [giftId, shortCode]);

  const loadGift = async () => {
    try {
      let loadedGift: Gift | null = null;
      
      if (giftId) {
        loadedGift = await giftService.getGiftById(giftId);
      } else if (shortCode) {
        loadedGift = await giftService.getGiftByShortCode(shortCode);
      }

      if (loadedGift) {
        setGift(loadedGift);
        setState('wrapped');
        
        // Fade in the gift
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();

        // Start gentle shake to indicate interactivity
        startIdleAnimation();
      } else {
        setError('Gift not found');
      }
    } catch (err) {
      setError('Failed to load gift');
    }
  };

  const startIdleAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
      ])
    ).start();
  };

  const handleUnwrap = async () => {
    if (!gift) return;
    
    setState('unwrapping');
    shakeAnim.stopAnimation();

    // Unwrap animation sequence
    Animated.sequence([
      // Shake vigorously
      Animated.timing(shakeAnim, { toValue: 15, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -15, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      
      // Scale down and fade out
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start(async () => {
      // Mark as opened
      await giftService.markAsOpened(gift.id);
      
      // Reveal the game
      setState('revealed');
      
      Animated.parallel([
        Animated.spring(revealOpacity, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(confettiAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handlePlayGame = async () => {
    if (!gift) return;
    await giftService.markAsPlayed(gift.id);
    // In production: navigate to game or web view
    console.log('Playing game:', gift.gameId);
  };

  const handleReact = (emoji: string) => {
    if (!gift) return;
    giftService.addReaction(gift.id, {
      type: 'emoji',
      content: emoji,
    });
  };

  if (state === 'loading') {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.colors.background }]}>
        <Icon name="loading" size={48} color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>
          Loading your gift...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.colors.background }]}>
        <Icon name="gift-off" size={64} color={theme.colors.error} />
        <Text style={[styles.errorText, { color: theme.colors.text }]}>
          {error}
        </Text>
      </View>
    );
  }

  const wrapOption = GIFT_WRAP_OPTIONS.find(o => o.id === gift?.wrap.theme);
  const template = gift ? templateLibrary.getTemplateById(gift.templateId) : null;
  const style = gift ? artStyleService.getStyleById(gift.artStyleId as any) : null;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.fromText, { color: theme.colors.text + '80' }]}>
          A gift from
        </Text>
        <Text style={[styles.creatorName, { color: theme.colors.text }]}>
          {gift?.creatorName || 'Someone special'} 💝
        </Text>
      </View>

      {/* Wrapped State */}
      {state === 'wrapped' && (
        <Animated.View
          style={[
            styles.giftContainer,
            {
              opacity: opacityAnim,
              transform: [
                { rotate: shakeAnim.interpolate({
                    inputRange: [-15, 0, 15],
                    outputRange: ['-5deg', '0deg', '5deg'],
                  })
                },
                { scale: scaleAnim },
              ],
            },
          ]}
        >
          <View
            style={[
              styles.giftBox,
              { 
                backgroundColor: wrapOption?.colors.primary || '#e74c3c',
                borderColor: wrapOption?.colors.secondary || '#c0392b',
              },
            ]}
          >
            {/* Ribbon */}
            <View style={[styles.ribbonH, { backgroundColor: wrapOption?.colors.accent || '#f1c40f' }]} />
            <View style={[styles.ribbonV, { backgroundColor: wrapOption?.colors.accent || '#f1c40f' }]} />
            
            {/* Bow */}
            <View style={[styles.bow, { backgroundColor: wrapOption?.colors.accent || '#f1c40f' }]}>
              <Text style={styles.bowEmoji}>{wrapOption?.icon || '🎀'}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.tapPrompt} onPress={handleUnwrap}>
            <Text style={[styles.tapText, { color: theme.colors.text }]}>
              Tap to unwrap! 🎉
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Unwrapping State */}
      {state === 'unwrapping' && (
        <View style={styles.unwrappingContainer}>
          <Text style={[styles.unwrappingText, { color: theme.colors.text }]}>
            ✨ Unwrapping... ✨
          </Text>
        </View>
      )}

      {/* Revealed State */}
      {state === 'revealed' && gift && (
        <Animated.View style={[styles.revealContainer, { opacity: revealOpacity }]}>
          {/* Confetti would go here */}
          
          <View style={[styles.gameCard, { backgroundColor: theme.colors.card }]}>
            <Text style={styles.gameEmoji}>🎮</Text>
            <Text style={[styles.gameTitle, { color: theme.colors.text }]}>
              {template?.name || 'Custom Game'}
            </Text>
            <Text style={[styles.gameStyle, { color: style?.colors.primary || theme.colors.primary }]}>
              in {style?.name || 'Custom'} style
            </Text>
            
            {gift.rouletteResult && (
              <View style={styles.wildCardBadge}>
                <Text style={styles.wildCardEmoji}>
                  {gift.rouletteResult.wildCard.icon}
                </Text>
                <Text style={[styles.wildCardText, { color: theme.colors.text + '80' }]}>
                  with {gift.rouletteResult.wildCard.name}!
                </Text>
              </View>
            )}

            {gift.note && (
              <View style={[styles.noteCard, { backgroundColor: theme.colors.background }]}>
                <Icon name="format-quote-open" size={20} color={theme.colors.text + '40'} />
                <Text style={[styles.noteText, { color: theme.colors.text }]}>
                  {gift.note.content}
                </Text>
              </View>
            )}
          </View>

          {/* Play Button */}
          <TouchableOpacity
            style={[styles.playButton, { backgroundColor: theme.colors.primary }]}
            onPress={handlePlayGame}
          >
            <Icon name="play" size={28} color="#fff" />
            <Text style={styles.playButtonText}>Play Now!</Text>
          </TouchableOpacity>

          {/* Reactions */}
          <View style={styles.reactionsContainer}>
            <Text style={[styles.reactLabel, { color: theme.colors.text + '80' }]}>
              React:
            </Text>
            <View style={styles.reactButtons}>
              {['😍', '😂', '🥹', '❤️', '🔥'].map((emoji) => (
                <TouchableOpacity
                  key={emoji}
                  style={[styles.reactButton, { backgroundColor: theme.colors.card }]}
                  onPress={() => handleReact(emoji)}
                >
                  <Text style={styles.reactEmoji}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
  },
  header: {
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 20,
  },
  fromText: {
    fontSize: 16,
  },
  creatorName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  giftContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  giftBox: {
    width: SCREEN_WIDTH * 0.6,
    height: SCREEN_WIDTH * 0.6,
    borderRadius: 20,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  ribbonH: {
    position: 'absolute',
    width: '100%',
    height: 30,
    top: '50%',
    marginTop: -15,
  },
  ribbonV: {
    position: 'absolute',
    width: 30,
    height: '100%',
    left: '50%',
    marginLeft: -15,
  },
  bow: {
    position: 'absolute',
    top: -20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bowEmoji: {
    fontSize: 36,
  },
  tapPrompt: {
    marginTop: 40,
    padding: 16,
  },
  tapText: {
    fontSize: 18,
    fontWeight: '600',
  },
  unwrappingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unwrappingText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  revealContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  gameCard: {
    padding: 24,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  gameEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  gameTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  gameStyle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  wildCardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  wildCardEmoji: {
    fontSize: 24,
  },
  wildCardText: {
    fontSize: 16,
  },
  noteCard: {
    padding: 16,
    borderRadius: 12,
    width: '100%',
    flexDirection: 'row',
    gap: 8,
  },
  noteText: {
    flex: 1,
    fontSize: 16,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 20,
    gap: 12,
    marginBottom: 24,
  },
  playButtonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  reactionsContainer: {
    alignItems: 'center',
  },
  reactLabel: {
    fontSize: 14,
    marginBottom: 12,
  },
  reactButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  reactButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reactEmoji: {
    fontSize: 24,
  },
});
