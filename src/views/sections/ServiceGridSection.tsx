import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SectionBackground } from '../../models/BackendApi';
import { SectionWrapper } from './SectionWrapper';
import { Colors } from '../../theme/colors';

export interface ServiceGridItem {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  duration: string;
  rating: number;
  badge?: string;
  image: string;
}

interface ServiceGridSectionProps {
  items: ServiceGridItem[];
  background: SectionBackground;
  title?: string;
  onBookService: (service: ServiceGridItem) => void;
}

export const ServiceGridSection: React.FC<ServiceGridSectionProps> = ({
  items,
  background,
  title,
  onBookService,
}) => {
  const isThreeColumn = (items || []).length === 3;
  const colWidth = isThreeColumn ? '31.3%' : '48%';

  return (
    <SectionWrapper background={background}>
      {title && (
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
        </View>
      )}

      <View style={styles.gridContainer}>
        {(items || []).map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.card, { width: colWidth as any }]}
            onPress={() => onBookService(item)}
            activeOpacity={0.85}
          >
            <View style={styles.imageContainer}>
              <Image source={{ uri: item.image }} style={styles.cardImage} />
              {item.badge && (
                <View style={styles.badgePill}>
                  <Text style={styles.badgeText}>{item.badge}</Text>
                </View>
              )}
            </View>

            <View style={styles.cardBody}>
              <Text style={styles.categoryText}>{item.category}</Text>
              <Text
                style={[
                  styles.serviceName,
                  isThreeColumn && styles.serviceNameCompact,
                ]}
                numberOfLines={2}
              >
                {item.name}
              </Text>

              <View style={styles.priceRow}>
                <Text style={styles.priceText}>₹{item.price}</Text>
                {item.originalPrice && (
                  <Text style={styles.originalPriceText}>
                    ₹{item.originalPrice}
                  </Text>
                )}
              </View>

              <TouchableOpacity
                style={styles.bookBtn}
                onPress={() => onBookService(item)}
              >
                <Text style={styles.bookBtnText}>Book +</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </SectionWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: 14,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    width: '100%',
    height: 90,
    position: 'relative',
    backgroundColor: '#F1F5F9',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  badgePill: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    color: '#FBBF24',
    fontSize: 9,
    fontWeight: '800',
  },
  cardBody: {
    padding: 10,
  },
  categoryText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  serviceName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 17,
    marginVertical: 4,
    minHeight: 34,
  },
  serviceNameCompact: {
    fontSize: 11,
    lineHeight: 15,
    minHeight: 30,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginBottom: 8,
  },
  priceText: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  originalPriceText: {
    fontSize: 11,
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },
  bookBtn: {
    backgroundColor: Colors.primarySubtle,
    borderRadius: 8,
    paddingVertical: 5,
    alignItems: 'center',
  },
  bookBtnText: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: '800',
  },
});
