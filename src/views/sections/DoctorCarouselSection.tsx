import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Doctor, SectionBackground } from '../../models/BackendApi';
import { SectionWrapper } from './SectionWrapper';
import { Colors } from '../../theme/colors';

interface DoctorCarouselSectionProps {
  items: Doctor[];
  background: SectionBackground;
  title?: string;
  onBookDoctor: (doctor: Doctor) => void;
}

export const DoctorCarouselSection: React.FC<DoctorCarouselSectionProps> = ({
  items,
  background,
  title,
  onBookDoctor,
}) => {
  return (
    <SectionWrapper background={background}>
      {title && (
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
        </View>
      )}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carouselContent}
      >
        {(items || []).map((doctor) => (
          <View key={doctor.id} style={styles.card}>
            {/* Top row: Avatar & Rating */}
            <View style={styles.topRow}>
              <Image
                source={{ uri: doctor.photoUrl }}
                style={styles.avatar}
              />
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>⭐ {doctor.rating || 4.9}</Text>
              </View>
            </View>

            {/* Doctor Info */}
            <Text style={styles.name} numberOfLines={1}>
              {doctor.name}
            </Text>
            <Text style={styles.specialty} numberOfLines={1}>
              {doctor.specialty}
            </Text>
            {doctor.clinicName && (
              <Text style={styles.clinicName} numberOfLines={1}>
                📍 {doctor.clinicName}
              </Text>
            )}

            {/* Languages spoken */}
            <View style={styles.languagesRow}>
              {(doctor.languages || []).map((lang) => (
                <View key={lang} style={styles.langPill}>
                  <Text style={styles.langText}>{lang}</Text>
                </View>
              ))}
            </View>

            {/* Bottom Row: Price in INR and Book button */}
            <View style={styles.footerRow}>
              <View>
                <Text style={styles.feeLabel}>Consultation</Text>
                <Text style={styles.feeText}>₹{doctor.feeInr}</Text>
              </View>

              <TouchableOpacity
                style={styles.bookBtn}
                onPress={() => onBookDoctor(doctor)}
                activeOpacity={0.8}
              >
                <Text style={styles.bookBtnText}>Book Slot</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SectionWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  carouselContent: {
    gap: 12,
    paddingVertical: 2,
  },
  card: {
    width: 230,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#F1F5F9',
  },
  ratingBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B45309',
  },
  name: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  specialty: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
    marginBottom: 2,
  },
  clinicName: {
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 8,
  },
  languagesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 10,
  },
  langPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  langText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  feeLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  feeText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  bookBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
  },
  bookBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
