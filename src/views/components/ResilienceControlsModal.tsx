import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Switch,
  ScrollView,
} from 'react-native';
import { mockBackendApi, BackendSimSettings } from '../../services/api/MockBackendApi';
import { Colors } from '../../theme/colors';

interface ResilienceControlsModalProps {
  visible: boolean;
  onClose: () => void;
  onReloadConfig: () => void;
}

export const ResilienceControlsModal: React.FC<ResilienceControlsModalProps> = ({
  visible,
  onClose,
  onReloadConfig,
}) => {
  const [settings, setSettings] = useState<BackendSimSettings>(
    mockBackendApi.getSettings()
  );

  useEffect(() => {
    if (visible) {
      setSettings(mockBackendApi.getSettings());
    }
  }, [visible]);

  const handleUpdate = async (partial: Partial<BackendSimSettings>) => {
    const updated = { ...settings, ...partial };
    setSettings(updated);
    await mockBackendApi.updateSettings(partial);
    onReloadConfig();
  };

  const latencyOptions = [
    { label: '0ms', value: 0 },
    { label: '400ms', value: 400 },
    { label: '1500ms', value: 1500 },
    { label: '3500ms (Slow 3G)', value: 3500 },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          <View style={styles.handleBar} />

          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Mock Backend & Resilience</Text>
              <Text style={styles.subtitle}>
                Test GET /config, 409 Conflict, latency & failure states
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
            {/* 1. RUNTIME CONFIG SWITCHER */}
            <Text style={styles.sectionTitle}>1. GET /config Layout Switcher</Text>
            <Text style={styles.sectionDesc}>
              Swaps theme colours, Indian banners, section order & layout at runtime:
            </Text>

            <View style={styles.configOptionsRow}>
              <TouchableOpacity
                style={[
                  styles.configCard,
                  settings.activeConfigMode === 'normal' && styles.configCardSelected,
                ]}
                onPress={() => handleUpdate({ activeConfigMode: 'normal' })}
                activeOpacity={0.8}
              >
                <Text style={styles.configIcon}>🌿</Text>
                <Text style={styles.configTitle}>Normal Mode (v1)</Text>
                <Text style={styles.configSub}>Teal & Emerald palette, Hyderabad / Vijayawada clinics</Text>
                {settings.activeConfigMode === 'normal' && (
                  <View style={styles.activePill}>
                    <Text style={styles.activePillText}>Active</Text>
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.configCard,
                  settings.activeConfigMode === 'festival_diwali' &&
                    styles.configCardSelectedFestive,
                ]}
                onPress={() => handleUpdate({ activeConfigMode: 'festival_diwali' })}
                activeOpacity={0.8}
              >
                <Text style={styles.configIcon}>🪔✨</Text>
                <Text style={styles.configTitle}>Diwali Mode (v2)</Text>
                <Text style={styles.configSub}>Festive Saffron/Gold, Diwali Dhamaka greeting, 3-col grid</Text>
                {settings.activeConfigMode === 'festival_diwali' && (
                  <View style={[styles.activePill, styles.activePillFestive]}>
                    <Text style={styles.activePillText}>Active</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* 2. LATENCY SLIDER */}
            <Text style={styles.sectionTitle}>2. Network Latency Simulation</Text>
            <View style={styles.latencyRow}>
              {latencyOptions.map((opt) => {
                const isSelected = settings.latencyMs === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    style={[
                      styles.latencyChip,
                      isSelected && styles.latencyChipSelected,
                    ]}
                    onPress={() => handleUpdate({ latencyMs: opt.value })}
                  >
                    <Text
                      style={[
                        styles.latencyChipText,
                        isSelected && styles.latencyChipTextSelected,
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* 3. SIMULATE 409 CONFLICT ON BOOKINGS */}
            <View style={styles.switchRow}>
              <View style={styles.switchInfo}>
                <Text style={styles.switchTitle}>POST /bookings: 409 Slot Conflict</Text>
                <Text style={styles.switchSub}>
                  Simulates another user taking the slot right before confirmation
                </Text>
              </View>
              <Switch
                value={settings.simulateSlotConflict409}
                onValueChange={(val) => handleUpdate({ simulateSlotConflict409: val })}
                trackColor={{ false: '#CBD5E1', true: Colors.warning }}
                thumbColor="#FFFFFF"
              />
            </View>

            {/* 4. SIMULATE 500 SERVER FAILURE */}
            <View style={styles.switchRow}>
              <View style={styles.switchInfo}>
                <Text style={styles.switchTitle}>GET /config: 500 Failure (Cache Fallback)</Text>
                <Text style={styles.switchSub}>
                  Tests resilience: recovers last good cached config gracefully
                </Text>
              </View>
              <Switch
                value={settings.simulate500Error}
                onValueChange={(val) => handleUpdate({ simulate500Error: val })}
                trackColor={{ false: '#CBD5E1', true: Colors.danger }}
                thumbColor="#FFFFFF"
              />
            </View>

            {/* 5. SIMULATE EMPTY CONTENT */}
            <View style={styles.switchRow}>
              <View style={styles.switchInfo}>
                <Text style={styles.switchTitle}>Simulate Empty Config Sections</Text>
                <Text style={styles.switchSub}>
                  Tests zero-state handling without crashes
                </Text>
              </View>
              <Switch
                value={settings.simulateEmptyConfig}
                onValueChange={(val) => handleUpdate({ simulateEmptyConfig: val })}
                trackColor={{ false: '#CBD5E1', true: '#94A3B8' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <TouchableOpacity
              style={styles.applyBtn}
              onPress={() => {
                onReloadConfig();
                onClose();
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.applyBtnText}>Apply & Close</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '90%',
    paddingBottom: 30,
    paddingTop: 12,
  },
  handleBar: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
  },
  closeText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 4,
    marginTop: 8,
  },
  sectionDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 12,
    lineHeight: 16,
  },
  configOptionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  configCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    padding: 12,
    backgroundColor: '#F8FAFC',
    position: 'relative',
  },
  configCardSelected: {
    borderColor: '#0D9488',
    backgroundColor: '#F0FDFA',
  },
  configCardSelectedFestive: {
    borderColor: '#EA580C',
    backgroundColor: '#FFFBEB',
  },
  configIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  configTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  configSub: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 4,
    lineHeight: 14,
  },
  activePill: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#0D9488',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  activePillFestive: {
    backgroundColor: '#EA580C',
  },
  activePillText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  latencyRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  latencyChip: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  latencyChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  latencyChipText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  latencyChipTextSelected: {
    color: '#FFFFFF',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  switchInfo: {
    flex: 1,
    marginRight: 12,
  },
  switchTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  switchSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 15,
  },
  applyBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 20,
  },
  applyBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
