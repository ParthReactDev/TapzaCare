import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {
  ReminderFilterTab,
  useReminderViewModel,
} from '../../viewmodels/useReminderViewModel';
import {
  ReminderCategory,
  ReminderPriority,
  ReminderRepeat,
} from '../../models/Reminder';
import { Colors } from '../../theme/colors';
import { Header } from '../components/Header';
import { ReminderCard } from '../components/ReminderCard';
import { EmptyState } from '../components/EmptyState';

export const RemindersScreen: React.FC = () => {
  const {
    reminders,
    counts,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories,
    isRefreshing,
    refreshReminders,

    isCreateModalVisible,
    openCreateModal,
    closeCreateModal,
    formData,
    formErrors,
    updateFormField,
    submitCreateReminder,
    isSubmitting,

    toggleComplete,
    snoozeReminder,
    deleteReminder,
  } = useReminderViewModel();

  const tabs: { key: ReminderFilterTab; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: counts.all },
    { key: 'pending', label: 'Pending', count: counts.pending },
    { key: 'high_priority', label: '🔥 Urgent', count: counts.highPriority },
    { key: 'completed', label: 'Done', count: counts.completed },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {/* Screen Header with "+ New" button */}
      <Header
        title="Reminders"
        subtitle={`${counts.pending} pending tasks`}
        rightAction={
          <TouchableOpacity
            style={styles.newBtn}
            onPress={openCreateModal}
            activeOpacity={0.8}
          >
            <Text style={styles.newBtnText}>+ New</Text>
          </TouchableOpacity>
        }
      />

      <View style={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchWrapper}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search reminders or notes..."
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Tabs */}
        <View style={styles.tabsContainer}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tabButton, isActive && styles.activeTabButton]}
                onPress={() => setActiveTab(tab.key)}
                activeOpacity={0.8}
              >
                <Text
                  style={[styles.tabText, isActive && styles.activeTabText]}
                >
                  {tab.label}
                </Text>
                <View
                  style={[
                    styles.tabCountPill,
                    isActive && styles.activeTabCountPill,
                  ]}
                >
                  <Text
                    style={[
                      styles.tabCountText,
                      isActive && styles.activeTabCountText,
                    ]}
                  >
                    {tab.count}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Categories Chips */}
        <View style={styles.categoriesSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContent}
          >
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.catChip,
                    isSelected && styles.activeCatChip,
                  ]}
                  onPress={() => setSelectedCategory(cat)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.catChipText,
                      isSelected && styles.activeCatChipText,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Reminders List */}
        <FlatList
          data={reminders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ReminderCard
              reminder={item}
              onToggleComplete={toggleComplete}
              onSnooze={snoozeReminder}
              onDelete={deleteReminder}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={refreshReminders}
              colors={[Colors.primary]}
            />
          }
          ListEmptyComponent={
            <EmptyState
              icon="🔔"
              title="No Reminders Found"
              description="No tasks match your current criteria. Create a reminder so you don't miss any appointments!"
              actionText="+ Create Reminder"
              onActionPress={openCreateModal}
            />
          }
        />
      </View>

      {/* Create New Reminder Modal */}
      <Modal
        visible={isCreateModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeCreateModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>New Reminder</Text>
                <Text style={styles.modalSubtitle}>
                  Set an alert for critical tasks and follow-ups
                </Text>
              </View>
              <TouchableOpacity
                onPress={closeCreateModal}
                style={styles.modalCloseBtn}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalScroll}
            >
              {/* Title */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Reminder Title *</Text>
                <TextInput
                  style={[
                    styles.formInput,
                    formErrors.title ? styles.formInputError : null,
                  ]}
                  placeholder="e.g. Call accountant, Take medicine..."
                  placeholderTextColor={Colors.textMuted}
                  value={formData.title}
                  onChangeText={(val) => updateFormField('title', val)}
                />
                {formErrors.title && (
                  <Text style={styles.errorText}>{formErrors.title}</Text>
                )}
              </View>

              {/* Description */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Description (Optional)</Text>
                <TextInput
                  style={[styles.formInput, styles.textArea]}
                  placeholder="Additional context or checklist items..."
                  placeholderTextColor={Colors.textMuted}
                  multiline
                  numberOfLines={3}
                  value={formData.description}
                  onChangeText={(val) => updateFormField('description', val)}
                />
              </View>

              {/* Priority Picker */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Priority Level</Text>
                <View style={styles.priorityRow}>
                  {(['low', 'medium', 'high'] as ReminderPriority[]).map((p) => {
                    const isSelected = formData.priority === p;
                    return (
                      <TouchableOpacity
                        key={p}
                        style={[
                          styles.priorityChip,
                          isSelected && styles.priorityChipSelected,
                          isSelected && p === 'high' && styles.priorityHigh,
                        ]}
                        onPress={() => updateFormField('priority', p)}
                      >
                        <Text
                          style={[
                            styles.priorityChipText,
                            isSelected && styles.priorityChipTextSelected,
                          ]}
                        >
                          {p === 'high' ? '🔥 High' : p === 'medium' ? '⚡ Medium' : '🌱 Low'}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Category Picker */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Category</Text>
                <View style={styles.categoryPickerRow}>
                  {(
                    [
                      'Appointment',
                      'Payment',
                      'Follow-up',
                      'Task',
                      'Health',
                    ] as ReminderCategory[]
                  ).map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.categoryPickChip,
                        formData.category === cat &&
                          styles.categoryPickChipSelected,
                      ]}
                      onPress={() => updateFormField('category', cat)}
                    >
                      <Text
                        style={[
                          styles.categoryPickChipText,
                          formData.category === cat &&
                            styles.categoryPickChipTextSelected,
                        ]}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Date & Time Row */}
              <View style={styles.twoColumnRow}>
                <View style={[styles.formGroup, styles.flexCol]}>
                  <Text style={styles.formLabel}>Date *</Text>
                  <TextInput
                    style={[
                      styles.formInput,
                      formErrors.date ? styles.formInputError : null,
                    ]}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={Colors.textMuted}
                    value={formData.date}
                    onChangeText={(val) => updateFormField('date', val)}
                  />
                  {formErrors.date && (
                    <Text style={styles.errorText}>{formErrors.date}</Text>
                  )}
                </View>

                <View style={[styles.formGroup, styles.flexCol]}>
                  <Text style={styles.formLabel}>Time *</Text>
                  <TextInput
                    style={[
                      styles.formInput,
                      formErrors.time ? styles.formInputError : null,
                    ]}
                    placeholder="09:00 AM"
                    placeholderTextColor={Colors.textMuted}
                    value={formData.time}
                    onChangeText={(val) => updateFormField('time', val)}
                  />
                  {formErrors.time && (
                    <Text style={styles.errorText}>{formErrors.time}</Text>
                  )}
                </View>
              </View>

              {/* Repeat Recurrence */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Repeat</Text>
                <View style={styles.repeatRow}>
                  {(['none', 'daily', 'weekly', 'monthly'] as ReminderRepeat[]).map(
                    (rep) => (
                      <TouchableOpacity
                        key={rep}
                        style={[
                          styles.repeatChip,
                          formData.repeat === rep && styles.repeatChipSelected,
                        ]}
                        onPress={() => updateFormField('repeat', rep)}
                      >
                        <Text
                          style={[
                            styles.repeatChipText,
                            formData.repeat === rep &&
                              styles.repeatChipTextSelected,
                          ]}
                        >
                          {rep}
                        </Text>
                      </TouchableOpacity>
                    )
                  )}
                </View>
              </View>
            </ScrollView>

            {/* Modal Footer */}
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={closeCreateModal}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalSubmitBtn}
                onPress={submitCreateReminder}
                disabled={isSubmitting}
                activeOpacity={0.8}
              >
                <Text style={styles.modalSubmitText}>
                  {isSubmitting ? 'Saving...' : 'Set Reminder'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
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
  newBtn: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
  },
  newBtnText: {
    color: '#0F172A',
    fontWeight: '800',
    fontSize: 13,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  clearIcon: {
    fontSize: 14,
    color: Colors.textMuted,
    padding: 4,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#EEF2F6',
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 3,
    marginBottom: 10,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 10,
    gap: 4,
  },
  activeTabButton: {
    backgroundColor: Colors.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: '700',
  },
  tabCountPill: {
    backgroundColor: 'rgba(0,0,0,0.06)',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 8,
  },
  activeTabCountPill: {
    backgroundColor: Colors.primarySubtle,
  },
  tabCountText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  activeTabCountText: {
    color: Colors.primary,
  },
  categoriesSection: {
    marginBottom: 8,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  catChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  activeCatChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  catChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  activeCatChipText: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  modalTitle: {
    fontSize: 20,
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
    borderRadius: 14,
  },
  modalCloseText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '700',
  },
  modalScroll: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  formGroup: {
    marginBottom: 14,
  },
  formLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  formInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    color: Colors.textPrimary,
    fontSize: 14,
  },
  formInputError: {
    borderColor: Colors.danger,
    backgroundColor: '#FEF2F2',
  },
  errorText: {
    color: Colors.danger,
    fontSize: 11,
    marginTop: 4,
    fontWeight: '600',
  },
  textArea: {
    height: 65,
    textAlignVertical: 'top',
  },
  twoColumnRow: {
    flexDirection: 'row',
    gap: 12,
  },
  flexCol: {
    flex: 1,
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityChip: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  priorityChipSelected: {
    backgroundColor: Colors.primarySubtle,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  priorityHigh: {
    backgroundColor: Colors.dangerSubtle,
    borderColor: Colors.danger,
  },
  priorityChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  priorityChipTextSelected: {
    color: Colors.primary,
    fontWeight: '700',
  },
  categoryPickerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryPickChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  categoryPickChipSelected: {
    backgroundColor: Colors.secondarySubtle,
    borderWidth: 1,
    borderColor: Colors.secondary,
  },
  categoryPickChipText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  categoryPickChipTextSelected: {
    color: '#008b8b',
    fontWeight: '700',
  },
  repeatRow: {
    flexDirection: 'row',
    gap: 8,
  },
  repeatChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  repeatChipSelected: {
    backgroundColor: Colors.primarySubtle,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  repeatChipText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  repeatChipTextSelected: {
    color: Colors.primary,
    fontWeight: '700',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  modalCancelText: {
    color: Colors.textSecondary,
    fontWeight: '700',
    fontSize: 14,
  },
  modalSubmitBtn: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
  },
  modalSubmitText: {
    color: '#0F172A',
    fontWeight: '800',
    fontSize: 14,
  },
});
