import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../contexts/ThemeContext';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { marketingService } from '../services/MarketingService';

type RouteProps = RouteProp<RootStackParamList, 'MarketingDashboard'>;

export default function MarketingDashboardScreen() {
  const { theme } = useTheme();
  const route = useRoute<RouteProps>();
  const { projectId } = route.params;

  const dashboard = marketingService.getAnalyticsDashboard(projectId);
  const segments = marketingService.getUserSegments(projectId);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return 'trending-up';
      case 'down': return 'trending-down';
      default: return 'minus';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return theme.colors.success;
      case 'down': return theme.colors.error;
      default: return theme.colors.text + '60';
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Overview Cards */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Overview</Text>
        <View style={styles.overviewGrid}>
          <View style={[styles.overviewCard, { backgroundColor: theme.colors.card }]}>
            <Icon name="account-group" size={24} color={theme.colors.primary} />
            <Text style={[styles.overviewValue, { color: theme.colors.text }]}>
              {formatNumber(dashboard.overview.users)}
            </Text>
            <Text style={[styles.overviewLabel, { color: theme.colors.text + '60' }]}>
              Total Users
            </Text>
          </View>
          <View style={[styles.overviewCard, { backgroundColor: theme.colors.card }]}>
            <Icon name="cellphone" size={24} color={theme.colors.secondary} />
            <Text style={[styles.overviewValue, { color: theme.colors.text }]}>
              {formatNumber(dashboard.overview.sessions)}
            </Text>
            <Text style={[styles.overviewLabel, { color: theme.colors.text + '60' }]}>
              Sessions
            </Text>
          </View>
          <View style={[styles.overviewCard, { backgroundColor: theme.colors.card }]}>
            <Icon name="currency-usd" size={24} color={theme.colors.success} />
            <Text style={[styles.overviewValue, { color: theme.colors.text }]}>
              ${formatNumber(dashboard.overview.revenue)}
            </Text>
            <Text style={[styles.overviewLabel, { color: theme.colors.text + '60' }]}>
              Revenue
            </Text>
          </View>
          <View style={[styles.overviewCard, { backgroundColor: theme.colors.card }]}>
            <Icon name="account-check" size={24} color={theme.colors.accent} />
            <Text style={[styles.overviewValue, { color: theme.colors.text }]}>
              {Math.round(dashboard.overview.retention * 100)}%
            </Text>
            <Text style={[styles.overviewLabel, { color: theme.colors.text + '60' }]}>
              Retention
            </Text>
          </View>
        </View>
      </View>

      {/* Metrics */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Key Metrics</Text>
        <View style={[styles.metricsContainer, { backgroundColor: theme.colors.card }]}>
          {dashboard.metrics.map((metric, index) => (
            <View
              key={index}
              style={[
                styles.metricRow,
                index < dashboard.metrics.length - 1 && styles.metricBorder,
                { borderBottomColor: theme.colors.border },
              ]}
            >
              <View style={styles.metricInfo}>
                <Text style={[styles.metricTitle, { color: theme.colors.text }]}>
                  {metric.title}
                </Text>
                <View style={styles.metricChange}>
                  <Icon
                    name={getTrendIcon(metric.trend)}
                    size={16}
                    color={getTrendColor(metric.trend)}
                  />
                  <Text style={[styles.metricChangeText, { color: getTrendColor(metric.trend) }]}>
                    {Math.abs(metric.change)}%
                  </Text>
                </View>
              </View>
              <Text style={[styles.metricValue, { color: theme.colors.primary }]}>
                {metric.value}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* User Segments */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>User Segments</Text>
        {segments.map((segment, index) => (
          <View
            key={index}
            style={[styles.segmentCard, { backgroundColor: theme.colors.card }]}
          >
            <View style={styles.segmentHeader}>
              <Text style={[styles.segmentName, { color: theme.colors.text }]}>
                {segment.name}
              </Text>
              <Text style={[styles.segmentCount, { color: theme.colors.primary }]}>
                {formatNumber(segment.count)} users
              </Text>
            </View>
            <View style={styles.characteristicsList}>
              {segment.characteristics.slice(0, 3).map((char, charIndex) => (
                <View key={charIndex} style={styles.characteristicItem}>
                  <Icon name="check" size={14} color={theme.colors.success} />
                  <Text style={[styles.characteristicText, { color: theme.colors.text + '80' }]}>
                    {char}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Marketing Tools</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={[styles.actionCard, { backgroundColor: theme.colors.card }]}>
            <Icon name="bullhorn" size={28} color={theme.colors.primary} />
            <Text style={[styles.actionText, { color: theme.colors.text }]}>
              Create Campaign
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionCard, { backgroundColor: theme.colors.card }]}>
            <Icon name="email-outline" size={28} color={theme.colors.secondary} />
            <Text style={[styles.actionText, { color: theme.colors.text }]}>
              Email Marketing
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionCard, { backgroundColor: theme.colors.card }]}>
            <Icon name="share-variant" size={28} color={theme.colors.accent} />
            <Text style={[styles.actionText, { color: theme.colors.text }]}>
              Social Media
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionCard, { backgroundColor: theme.colors.card }]}>
            <Icon name="bell-ring-outline" size={28} color={theme.colors.warning} />
            <Text style={[styles.actionText, { color: theme.colors.text }]}>
              Push Notifications
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  overviewCard: {
    width: '47%',
    margin: '1.5%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  overviewValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  overviewLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  metricsContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  metricBorder: {
    borderBottomWidth: 1,
  },
  metricInfo: {
    flex: 1,
  },
  metricTitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  metricChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricChangeText: {
    fontSize: 12,
    marginLeft: 4,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  segmentCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  segmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  segmentName: {
    fontSize: 16,
    fontWeight: '600',
  },
  segmentCount: {
    fontSize: 14,
    fontWeight: '500',
  },
  characteristicsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  characteristicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 4,
  },
  characteristicText: {
    fontSize: 12,
    marginLeft: 4,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  actionCard: {
    width: '47%',
    margin: '1.5%',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionText: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
});
