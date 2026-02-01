/**
 * RouletteScreen
 * 
 * Game Roulette screen where users spin to get a random game combination.
 * Features:
 * - Animated roulette wheel
 * - Template + Style + Wild Card combination
 * - Rarity display
 * - Share/continue options
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../contexts/ThemeContext';
import { RouletteWheel } from '../components/RouletteWheel';
import { RouletteResult } from '../types/gift';
import { rouletteService } from '../services/RouletteService';
import { RootStackParamList } from '../types';

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function RouletteScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();
  const [lastResult, setLastResult] = useState<RouletteResult | null>(null);
  const [spinCount, setSpinCount] = useState(0);

  const handleSpinComplete = (result: RouletteResult) => {
    setLastResult(result);
    setSpinCount(prev => prev + 1);
  };

  const handleCreateGame = () => {
    if (!lastResult) return;

    // Navigate to template preview with the selected combo
    navigation.navigate('TemplatePreview', {
      templateId: lastResult.templateId,
    });

    // TODO: Pass the full roulette result to customize the game
    // This would include artStyleId and wildCard
  };

  const handleShare = () => {
    if (!lastResult) return;

    const displayInfo = rouletteService.formatResultForDisplay(lastResult);
    
    Alert.alert(
      'Share Your Combo!',
      displayInfo.shareText,
      [
        { text: 'Copy', onPress: () => console.log('Copy to clipboard') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleSpinAgain = () => {
    // Reset to allow another spin - the wheel component handles the rest
    setLastResult(null);
  };

  const stats = rouletteService.getStatistics();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            🎰 Game Roulette
          </Text>
        </View>
        <View style={styles.spinCounter}>
          <Icon name="refresh" size={16} color={theme.colors.primary} />
          <Text style={[styles.spinCountText, { color: theme.colors.text }]}>
            {spinCount}
          </Text>
        </View>
      </View>

      {/* Info Card */}
      <View style={[styles.infoCard, { backgroundColor: theme.colors.card }]}>
        <Icon name="lightbulb-outline" size={20} color={theme.colors.primary} />
        <Text style={[styles.infoText, { color: theme.colors.text + '80' }]}>
          Can't decide? Let fate choose! Spin to get a unique combination of game type, art style, and wild card twist.
        </Text>
      </View>

      {/* Roulette Wheel */}
      <RouletteWheel
        onSpinComplete={handleSpinComplete}
        onSpinStart={() => {}}
      />

      {/* Action Buttons (show after spin) */}
      {lastResult && (
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleCreateGame}
          >
            <Icon name="gamepad-variant" size={24} color="#fff" />
            <Text style={styles.primaryButtonText}>Create This Game</Text>
          </TouchableOpacity>

          <View style={styles.secondaryActions}>
            <TouchableOpacity
              style={[styles.secondaryButton, { backgroundColor: theme.colors.card }]}
              onPress={handleSpinAgain}
            >
              <Icon name="refresh" size={20} color={theme.colors.text} />
              <Text style={[styles.secondaryButtonText, { color: theme.colors.text }]}>
                Spin Again
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.secondaryButton, { backgroundColor: theme.colors.card }]}
              onPress={handleShare}
            >
              <Icon name="share-variant" size={20} color={theme.colors.text} />
              <Text style={[styles.secondaryButtonText, { color: theme.colors.text }]}>
                Share Combo
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Stats Footer */}
      <View style={[styles.statsFooter, { backgroundColor: theme.colors.card }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.colors.primary }]}>
            {stats.templateCount}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.text + '60' }]}>
            Templates
          </Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.colors.primary }]}>
            {stats.styleCount}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.text + '60' }]}>
            Styles
          </Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.colors.primary }]}>
            {stats.wildCardCount}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.text + '60' }]}>
            Wild Cards
          </Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.colors.primary }]}>
            {stats.totalPossibleCombinations}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.text + '60' }]}>
            Combos
          </Text>
        </View>
      </View>

      {/* Legend */}
      <View style={styles.legendContainer}>
        <Text style={[styles.legendTitle, { color: theme.colors.text }]}>
          Rarity Guide
        </Text>
        <View style={styles.legendItems}>
          {[
            { label: 'Legendary', color: '#f1c40f', max: '1-3' },
            { label: 'Epic', color: '#9b59b6', max: '4-10' },
            { label: 'Rare', color: '#3498db', max: '11-25' },
            { label: 'Uncommon', color: '#2ecc71', max: '26-50' },
            { label: 'Common', color: '#95a5a6', max: '50+' },
          ].map((rarity, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: rarity.color }]} />
              <Text style={[styles.legendLabel, { color: theme.colors.text }]}>
                {rarity.label}
              </Text>
              <Text style={[styles.legendMax, { color: theme.colors.text + '60' }]}>
                ({rarity.max})
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
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
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  spinCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  spinCountText: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  actionsContainer: {
    paddingHorizontal: 20,
    marginTop: 8,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 16,
    gap: 12,
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 12,
    gap: 8,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statsFooter: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 24,
    padding: 16,
    borderRadius: 16,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  legendContainer: {
    marginHorizontal: 20,
    marginTop: 24,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  legendItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  legendMax: {
    fontSize: 10,
  },
});
