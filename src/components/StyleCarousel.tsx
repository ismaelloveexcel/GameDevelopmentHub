/**
 * StyleCarousel Component
 * 
 * Horizontal carousel for browsing and selecting art styles.
 * Shows live preview of each style with smooth transitions.
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../contexts/ThemeContext';
import { artStyleService } from '../services/ArtStyleService';
import { ArtStyle, ArtStyleConfig } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.7;
const CARD_MARGIN = 10;

interface StyleCarouselProps {
  selectedStyleId?: ArtStyle;
  onStyleSelect: (styleId: ArtStyle) => void;
  showPremiumBadge?: boolean;
  disabled?: boolean;
}

interface StyleCardProps {
  style: ArtStyleConfig;
  isSelected: boolean;
  isPremium: boolean;
  showPremiumBadge: boolean;
  onPress: () => void;
  disabled: boolean;
}

const StyleCard: React.FC<StyleCardProps> = ({
  style,
  isSelected,
  isPremium,
  showPremiumBadge,
  onPress,
  disabled,
}) => {
  const { theme } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const getStyleIcon = (id: ArtStyle): string => {
    const icons: Record<ArtStyle, string> = {
      pixel: 'gamepad-square',
      lowpoly: 'cube-outline',
      handdrawn: 'brush',
      cyberpunk: 'neon',
      watercolor: 'palette',
    };
    return icons[id] || 'palette';
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor: style.colors.background,
            borderColor: isSelected ? style.colors.primary : 'transparent',
            borderWidth: isSelected ? 3 : 0,
            opacity: disabled ? 0.6 : 1,
          },
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={0.9}
      >
        {/* Color Preview Section */}
        <View style={styles.colorPreview}>
          <View
            style={[styles.colorSwatch, { backgroundColor: style.colors.primary }]}
          />
          <View
            style={[styles.colorSwatch, { backgroundColor: style.colors.secondary }]}
          />
          <View
            style={[styles.colorSwatch, { backgroundColor: style.colors.accent }]}
          />
        </View>

        {/* Icon */}
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: style.colors.primary + '30' },
          ]}
        >
          <Icon
            name={getStyleIcon(style.id)}
            size={40}
            color={style.colors.primary}
          />
        </View>

        {/* Style Name */}
        <Text style={[styles.styleName, { color: style.colors.text }]}>
          {style.name}
        </Text>

        {/* Description */}
        <Text
          style={[styles.styleDescription, { color: style.colors.text + '80' }]}
          numberOfLines={2}
        >
          {style.description}
        </Text>

        {/* Custom Colors Preview */}
        <View style={styles.customColorsRow}>
          {style.colors.custom.slice(0, 5).map((color, index) => (
            <View
              key={index}
              style={[styles.miniSwatch, { backgroundColor: color }]}
            />
          ))}
        </View>

        {/* Badges */}
        <View style={styles.badgeContainer}>
          {isSelected && (
            <View style={[styles.badge, { backgroundColor: style.colors.primary }]}>
              <Icon name="check" size={12} color="#fff" />
              <Text style={styles.badgeText}>Selected</Text>
            </View>
          )}
          {showPremiumBadge && isPremium && (
            <View style={[styles.badge, { backgroundColor: '#f1c40f' }]}>
              <Icon name="crown" size={12} color="#000" />
              <Text style={[styles.badgeText, { color: '#000' }]}>Premium</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const StyleCarousel: React.FC<StyleCarouselProps> = ({
  selectedStyleId,
  onStyleSelect,
  showPremiumBadge = true,
  disabled = false,
}) => {
  const { theme } = useTheme();
  const styles_list = artStyleService.getAllStyles();
  const scrollViewRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(
    styles_list.findIndex(s => s.id === selectedStyleId) || 0
  );

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / (CARD_WIDTH + CARD_MARGIN * 2));
    setActiveIndex(Math.max(0, Math.min(index, styles_list.length - 1)));
  };

  const scrollToIndex = (index: number) => {
    scrollViewRef.current?.scrollTo({
      x: index * (CARD_WIDTH + CARD_MARGIN * 2),
      animated: true,
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Choose Art Style
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.text + '80' }]}>
          {styles_list.length} styles available
        </Text>
      </View>

      {/* Carousel */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled={false}
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + CARD_MARGIN * 2}
        snapToAlignment="center"
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {styles_list.map((style, index) => (
          <StyleCard
            key={style.id}
            style={style}
            isSelected={style.id === selectedStyleId}
            isPremium={artStyleService.isPremiumStyle(style.id)}
            showPremiumBadge={showPremiumBadge}
            onPress={() => onStyleSelect(style.id)}
            disabled={disabled}
          />
        ))}
      </ScrollView>

      {/* Dot Indicators */}
      <View style={styles.dotsContainer}>
        {styles_list.map((style, index) => (
          <TouchableOpacity
            key={style.id}
            onPress={() => {
              scrollToIndex(index);
              onStyleSelect(style.id);
            }}
          >
            <View
              style={[
                styles.dot,
                {
                  backgroundColor:
                    index === activeIndex
                      ? style.colors.primary
                      : theme.colors.text + '30',
                  width: index === activeIndex ? 24 : 8,
                },
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Quick Select Buttons */}
      <View style={styles.quickSelectContainer}>
        <Text style={[styles.quickSelectLabel, { color: theme.colors.text + '60' }]}>
          Quick select:
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {styles_list.map((style) => (
            <TouchableOpacity
              key={style.id}
              style={[
                styles.quickSelectButton,
                {
                  backgroundColor:
                    style.id === selectedStyleId
                      ? style.colors.primary
                      : theme.colors.card,
                  borderColor: style.colors.primary,
                  borderWidth: 1,
                },
              ]}
              onPress={() => onStyleSelect(style.id)}
              disabled={disabled}
            >
              <Text
                style={[
                  styles.quickSelectText,
                  {
                    color:
                      style.id === selectedStyleId
                        ? '#fff'
                        : style.colors.primary,
                  },
                ]}
              >
                {style.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  scrollContent: {
    paddingHorizontal: (SCREEN_WIDTH - CARD_WIDTH) / 2 - CARD_MARGIN,
  },
  card: {
    width: CARD_WIDTH,
    marginHorizontal: CARD_MARGIN,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  colorPreview: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  colorSwatch: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginLeft: -8,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  styleName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  styleDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  customColorsRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  miniSwatch: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 6,
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  quickSelectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  quickSelectLabel: {
    fontSize: 12,
    marginRight: 10,
  },
  quickSelectButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  quickSelectText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default StyleCarousel;
