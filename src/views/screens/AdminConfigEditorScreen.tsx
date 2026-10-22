import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { LayoutConfig, LayoutSection } from '../../models/BackendApi';
import { mockBackendApi } from '../../services/api/MockBackendApi';
import { Header } from '../components/Header';
import { Colors } from '../../theme/colors';

interface AdminConfigEditorScreenProps {
  navigation?: any;
}

const COLOR_SWATCHES = [
  { name: 'Teal', hex: '#0D9488' },
  { name: 'Saffron', hex: '#EA580C' },
  { name: 'Purple', hex: '#6C5CE7' },
  { name: 'Crimson', hex: '#E11D48' },
  { name: 'Navy', hex: '#0F172A' },
  { name: 'Emerald', hex: '#10B981' },
];

export const AdminConfigEditorScreen: React.FC<AdminConfigEditorScreenProps> = ({ navigation }) => {
  const [config, setConfig] = useState<LayoutConfig | null>(null);
  const [jsonText, setJsonText] = useState('');
  const [activeTab, setActiveTab] = useState<'form' | 'json'>('form');

  useEffect(() => {
    (async () => {
      const current = await mockBackendApi.getConfig();
      setConfig(current);
      setJsonText(JSON.stringify(current, null, 2));
    })();
  }, []);

  const handleColorChange = (key: 'primary' | 'secondary' | 'background' | 'surface', hex: string) => {
    if (!config) return;
    const updated = {
      ...config,
      theme: {
        ...config.theme,
        [key]: hex,
      },
    };
    setConfig(updated);
    setJsonText(JSON.stringify(updated, null, 2));
  };

  const handleToggleFestival = () => {
    if (!config) return;
    const updated: LayoutConfig = {
      ...config,
      version: config.version + 1,
      theme: {
        ...config.theme,
        festival: config.theme.festival
          ? undefined
          : {
              name: 'Live Custom Festival',
              greeting: 'Welcome to Special Live Celebration! ✨',
              bannerImageUrl: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?w=600',
            },
      },
    };
    setConfig(updated);
    setJsonText(JSON.stringify(updated, null, 2));
  };

  const handleRemoveSection = (sectionId: string) => {
    if (!config) return;
    const updated = {
      ...config,
      sections: config.sections.filter((s) => s.id !== sectionId),
    };
    setConfig(updated);
    setJsonText(JSON.stringify(updated, null, 2));
  };

  const handleSaveJson = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setConfig(parsed);
      Alert.alert('Success', 'Live config validated & updated successfully!');
    } catch {
      Alert.alert('Syntax Error', 'Invalid JSON structure. Please check syntax.');
    }
  };

  const handleApplyLive = () => {
    Alert.alert(
      'Live Config Applied',
      'The home feed and theme have been reconfigured with your custom layout settings.',
      [{ text: 'OK', onPress: () => navigation?.goBack?.() }]
    );
  };

  if (!config) return null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <Header
        title="Admin Config Editor"
        subtitle={`Live Config v${config.version} • Runtime Modifier`}
        showBack={true}
        onBack={() => navigation?.goBack?.()}
      />

      <View style={styles.container}>
        {/* Toggle Form vs JSON tabs */}
        <View style={styles.tabToggleRow}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'form' && styles.tabBtnActive]}
            onPress={() => setActiveTab('form')}
          >
            <Text style={[styles.tabBtnText, activeTab === 'form' && styles.tabBtnTextActive]}>
              Interactive Form
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'json' && styles.tabBtnActive]}
            onPress={() => setActiveTab('json')}
          >
            <Text style={[styles.tabBtnText, activeTab === 'json' && styles.tabBtnTextActive]}>
              Raw JSON (GET /config)
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'form' ? (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
            {/* 1. Theme Color Customizer */}
            <Text style={styles.sectionHeading}>1. Theme Palette Customizer</Text>
            <Text style={styles.label}>Primary Brand Color: {config.theme.primary}</Text>
            <View style={styles.swatchesRow}>
              {COLOR_SWATCHES.map((swatch) => (
                <TouchableOpacity
                  key={swatch.hex}
                  style={[
                    styles.swatch,
                    { backgroundColor: swatch.hex },
                    config.theme.primary === swatch.hex && styles.swatchActive,
                  ]}
                  onPress={() => handleColorChange('primary', swatch.hex)}
                />
              ))}
            </View>

            {/* 2. Festival Mode Toggle */}
            <Text style={styles.sectionHeading}>2. Festival Greeting Banner</Text>
            <TouchableOpacity
              style={[
                styles.festivalToggleBtn,
                config.theme.festival ? styles.festiveActive : styles.festiveInactive,
              ]}
              onPress={handleToggleFestival}
              activeOpacity={0.8}
            >
              <Text style={styles.festivalToggleText}>
                {config.theme.festival
                  ? '🪔 Festival Mode: ON (Tap to Disable)'
                  : '🌿 Festival Mode: OFF (Tap to Enable Festival)'}
              </Text>
            </TouchableOpacity>

            {/* 3. Sections Manager */}
            <Text style={styles.sectionHeading}>
              3. Configured Sections ({config.sections.length})
            </Text>
            <Text style={styles.helperText}>
              Remove or inspect section components. Changes reflect instantly:
            </Text>

            {config.sections.map((sec: LayoutSection, index: number) => (
              <View key={sec.id} style={styles.sectionItemCard}>
                <View style={styles.sectionItemLeft}>
                  <Text style={styles.sectionIndex}>#{index + 1}</Text>
                  <View>
                    <Text style={styles.sectionType}>{sec.type}</Text>
                    <Text style={styles.sectionId}>{sec.id}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.deleteSecBtn}
                  onPress={() => handleRemoveSection(sec.id)}
                >
                  <Text style={styles.deleteSecText}>Remove</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.jsonWrapper}>
            <TextInput
              style={styles.jsonInput}
              multiline
              value={jsonText}
              onChangeText={setJsonText}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity style={styles.validateBtn} onPress={handleSaveJson}>
              <Text style={styles.validateBtnText}>Validate & Save JSON</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Bottom Apply Bar */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.applyBtn} onPress={handleApplyLive} activeOpacity={0.85}>
            <Text style={styles.applyBtnText}>⚡ Apply Changes Live to Home Feed</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
  },
  tabToggleRow: {
    flexDirection: 'row',
    backgroundColor: '#EEF2F6',
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 12,
    padding: 3,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tabBtnTextActive: {
    color: Colors.primary,
    fontWeight: '800',
  },
  scroll: {
    paddingHorizontal: 16,
    paddingBottom: 90,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  swatchesRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  swatch: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  swatchActive: {
    borderColor: '#0F172A',
    transform: [{ scale: 1.15 }],
  },
  festivalToggleBtn: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  festiveActive: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  festiveInactive: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  festivalToggleText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#92400E',
  },
  helperText: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 10,
  },
  sectionItemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionIndex: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.primary,
    backgroundColor: Colors.primarySubtle,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  sectionType: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  sectionId: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  deleteSecBtn: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  deleteSecText: {
    fontSize: 11,
    color: '#DC2626',
    fontWeight: '700',
  },
  jsonWrapper: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  jsonInput: {
    flex: 1,
    backgroundColor: '#0F172A',
    color: '#4ADE80',
    fontFamily: 'monospace',
    fontSize: 12,
    borderRadius: 12,
    padding: 14,
    textAlignVertical: 'top',
  },
  validateBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  validateBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 14,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  applyBtn: {
    backgroundColor: '#0F766E',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  applyBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
