import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  SafeAreaView,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { usePrescriptionViewModel } from '../../viewmodels/usePrescriptionViewModel';
import { Prescription } from '../../models/BackendApi';
import { Colors } from '../../theme/colors';
import { Header } from '../components/Header';
import { EmptyState } from '../components/EmptyState';

export const PrescriptionsScreen: React.FC = () => {
  const {
    prescriptions,
    selectedPrescription,
    isDetailModalVisible,
    doseStats,
    isLoading,
    openPrescription,
    closePrescription,
    toggleDose,
    refreshPrescriptions,
  } = usePrescriptionViewModel();

  const getTimingLabel = (t: 'morning' | 'afternoon' | 'night') => {
    switch (t) {
      case 'morning':
        return { label: '🌅 Morning (08:30 AM)', key: 'morning' as const };
      case 'afternoon':
        return { label: '☀️ Afternoon (01:30 PM)', key: 'afternoon' as const };
      case 'night':
        return { label: '🌙 Night (09:00 PM)', key: 'night' as const };
    }
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return iso;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <Header
        title="Prescriptions"
        subtitle={`${prescriptions.length} verified hospital records`}
      />

      <View style={styles.container}>
        {/* Daily Medication Adherence Progress Bar */}
        <View style={styles.adherenceCard}>
          <View style={styles.adherenceTop}>
            <View>
              <Text style={styles.adherenceTitle}>Today's Medication Schedule</Text>
              <Text style={styles.adherenceSub}>
                {doseStats.taken} of {doseStats.total} doses taken today
              </Text>
            </View>
            <View style={styles.percentBadge}>
              <Text style={styles.percentText}>{doseStats.percentage}%</Text>
            </View>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${doseStats.percentage}%` },
              ]}
            />
          </View>
        </View>

        {/* Prescriptions List (GET /prescriptions) */}
        <FlatList
          data={prescriptions}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refreshPrescriptions}
              colors={[Colors.primary]}
            />
          }
          ListEmptyComponent={
            <EmptyState
              icon="💊"
              title="No Prescriptions Found"
              description="No active prescriptions found from Hyderabad or Vijayawada clinics."
            />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.rxCard}
              onPress={() => openPrescription(item)}
              activeOpacity={0.85}
            >
              <View style={styles.cardHeader}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarText}>{item.doctorName.charAt(4) || 'D'}</Text>
                </View>
                <View style={styles.headerInfo}>
                  <Text style={styles.doctorName}>{item.doctorName}</Text>
                  <Text style={styles.clinicText} numberOfLines={1}>
                    📍 {item.clinicName}
                  </Text>
                </View>
                <View style={styles.datePill}>
                  <Text style={styles.datePillText}>{formatDate(item.issuedAt)}</Text>
                </View>
              </View>

              {item.diagnosis && (
                <View style={styles.diagnosisBox}>
                  <Text style={styles.diagnosisLabel}>DIAGNOSIS</Text>
                  <Text style={styles.diagnosisValue}>{item.diagnosis}</Text>
                </View>
              )}

              <View style={styles.medsSummaryRow}>
                <Text style={styles.medsCount}>
                  💊 {item.medicines.length} Medicines Prescribed
                </Text>
                <Text style={styles.viewScheduleText}>View Schedule →</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* DETAIL MODAL: Morning / Afternoon / Night Dose Schedule */}
      <Modal
        visible={isDetailModalVisible && !!selectedPrescription}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closePrescription}
      >
        {selectedPrescription && (
          <SafeAreaView style={styles.modalSafeArea}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Daily Dose Schedule</Text>
                <Text style={styles.modalSubtitle} numberOfLines={1}>
                  {selectedPrescription.doctorName} • {selectedPrescription.clinicName}
                </Text>
              </View>
              <TouchableOpacity
                onPress={closePrescription}
                style={styles.modalCloseBtn}
              >
                <Text style={styles.modalCloseIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalScroll}
              contentContainerStyle={styles.modalScrollContent}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.scheduleHeaderTitle}>Prescribed Medicines Schedule</Text>

              {selectedPrescription.medicines.map((med) => (
                <View key={med.id} style={styles.medicineCard}>
                  {/* Medicine Name & Dose */}
                  <View style={styles.medTitleRow}>
                    <View style={styles.medLeft}>
                      <Text style={styles.medName}>{med.name}</Text>
                      <Text style={styles.medDosage}>Dose: {med.dose}</Text>
                    </View>
                    <View style={styles.daysPill}>
                      <Text style={styles.daysText}>{med.days} days course</Text>
                    </View>
                  </View>

                  <View style={styles.doseScheduleDivider} />

                  {/* Morning / Afternoon / Night Slots */}
                  <Text style={styles.doseScheduleHeading}>Dose Timing Checklist:</Text>

                  <View style={styles.dosesList}>
                    {med.timing.map((slot) => {
                      const isTaken = !!med.dosesTaken?.[slot];
                      const info = getTimingLabel(slot);

                      return (
                        <View
                          key={slot}
                          style={[
                            styles.doseRow,
                            isTaken && styles.doseRowTaken,
                          ]}
                        >
                          <View style={styles.doseInfo}>
                            <Text style={styles.doseTimeOfDay}>{info.label}</Text>
                            <Text style={styles.doseStatusText}>
                              {isTaken ? '✓ Dose recorded for today' : 'Pending dose'}
                            </Text>
                          </View>

                          {/* Toggle Dose Taken Button */}
                          <TouchableOpacity
                            style={[
                              styles.doseActionBtn,
                              isTaken && styles.doseActionBtnTaken,
                            ]}
                            onPress={() => toggleDose(med.id, slot)}
                            activeOpacity={0.8}
                          >
                            <Text
                              style={[
                                styles.doseActionText,
                                isTaken && styles.doseActionTextTaken,
                              ]}
                            >
                              {isTaken ? '✓ Taken' : 'Mark Taken'}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                  </View>
                </View>
              ))}
            </ScrollView>
          </SafeAreaView>
        )}
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
  },
  adherenceCard: {
    backgroundColor: '#0F766E',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 18,
    padding: 16,
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  adherenceTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  adherenceTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  adherenceSub: {
    color: '#CCFBF1',
    fontSize: 12,
    marginTop: 2,
  },
  percentBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  percentText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  progressTrack: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FDE047',
    borderRadius: 3,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 40,
  },
  rxCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F766E',
  },
  headerInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  clinicText: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  datePill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  datePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  diagnosisBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EEF2F6',
  },
  diagnosisLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  diagnosisValue: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  medsSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  medsCount: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  viewScheduleText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.primary,
  },

  // Modal
  modalSafeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  modalSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  modalCloseBtn: {
    padding: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
  },
  modalCloseIcon: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  modalScroll: {
    flex: 1,
  },
  modalScrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  scheduleHeaderTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 14,
  },
  medicineCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  medTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  medLeft: {
    flex: 1,
    marginRight: 8,
  },
  medName: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  medDosage: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  daysPill: {
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  daysText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0D9488',
  },
  doseScheduleDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  doseScheduleHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textMuted,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  dosesList: {
    gap: 8,
  },
  doseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEF2F6',
  },
  doseRowTaken: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  doseInfo: {
    flex: 1,
  },
  doseTimeOfDay: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  doseStatusText: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  doseActionBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  doseActionBtnTaken: {
    backgroundColor: Colors.success,
  },
  doseActionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  doseActionTextTaken: {
    color: '#FFFFFF',
  },
});
