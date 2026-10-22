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
  BookingFilterTab,
  useBookingViewModel,
} from '../../viewmodels/useBookingViewModel';
import { BookingCategory } from '../../models/Booking';
import { Colors } from '../../theme/colors';
import { Header } from '../components/Header';
import { BookingCard } from '../components/BookingCard';
import { EmptyState } from '../components/EmptyState';

export const BookingScreen: React.FC = () => {
  const {
    bookings,
    counts,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories,
    isRefreshing,
    refreshBookings,

    isCreateModalVisible,
    openCreateModal,
    closeCreateModal,
    formData,
    formErrors,
    updateFormField,
    submitCreateBooking,
    isSubmitting,

    updateBookingStatus,
    deleteBooking,
  } = useBookingViewModel();

  const tabs: { key: BookingFilterTab; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: counts.all },
    { key: 'upcoming', label: 'Upcoming', count: counts.upcoming },
    { key: 'completed', label: 'Completed', count: counts.completed },
    { key: 'cancelled', label: 'Cancelled', count: counts.cancelled },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {/* Screen Header with "+ New" button */}
      <Header
        title="Bookings"
        subtitle={`${counts.upcoming} upcoming appointments`}
        rightAction={
          <TouchableOpacity
            style={styles.newBookingBtn}
            onPress={openCreateModal}
            activeOpacity={0.8}
          >
            <Text style={styles.newBookingBtnText}>+ New</Text>
          </TouchableOpacity>
        }
      />

      <View style={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchWrapper}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search bookings, providers, or locations..."
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

        {/* Status Filter Tabs */}
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

        {/* Categories Horizontal Scroll */}
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

        {/* Bookings List */}
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <BookingCard
              booking={item}
              onStatusChange={updateBookingStatus}
              onDelete={deleteBooking}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={refreshBookings}
              colors={[Colors.primary]}
            />
          }
          ListEmptyComponent={
            <EmptyState
              icon="📅"
              title="No Bookings Found"
              description="No bookings match your selected filter or search keyword. Try creating a new one!"
              actionText="+ Book Service Now"
              onActionPress={openCreateModal}
            />
          }
        />
      </View>

      {/* Create New Booking Modal */}
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
                <Text style={styles.modalTitle}>New Booking</Text>
                <Text style={styles.modalSubtitle}>
                  Fill in the details to schedule a new appointment
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
              {/* Service Title */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Service Title *</Text>
                <TextInput
                  style={[
                    styles.formInput,
                    formErrors.title ? styles.formInputError : null,
                  ]}
                  placeholder="e.g. Legal Consultation, Home Clean..."
                  placeholderTextColor={Colors.textMuted}
                  value={formData.title}
                  onChangeText={(val) => updateFormField('title', val)}
                />
                {formErrors.title && (
                  <Text style={styles.errorText}>{formErrors.title}</Text>
                )}
              </View>

              {/* Service Category */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Category</Text>
                <View style={styles.categoryPickerRow}>
                  {(
                    [
                      'Consultation',
                      'Health & Wellness',
                      'Home Services',
                      'Technical Support',
                    ] as BookingCategory[]
                  ).map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.categoryPickChip,
                        formData.serviceCategory === cat &&
                          styles.categoryPickChipSelected,
                      ]}
                      onPress={() => updateFormField('serviceCategory', cat)}
                    >
                      <Text
                        style={[
                          styles.categoryPickChipText,
                          formData.serviceCategory === cat &&
                            styles.categoryPickChipTextSelected,
                        ]}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Provider Name */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Provider / Specialist Name *</Text>
                <TextInput
                  style={[
                    styles.formInput,
                    formErrors.providerName ? styles.formInputError : null,
                  ]}
                  placeholder="e.g. Dr. Robert Miller"
                  placeholderTextColor={Colors.textMuted}
                  value={formData.providerName}
                  onChangeText={(val) => updateFormField('providerName', val)}
                />
                {formErrors.providerName && (
                  <Text style={styles.errorText}>
                    {formErrors.providerName}
                  </Text>
                )}
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
                    placeholder="10:00 AM"
                    placeholderTextColor={Colors.textMuted}
                    value={formData.time}
                    onChangeText={(val) => updateFormField('time', val)}
                  />
                  {formErrors.time && (
                    <Text style={styles.errorText}>{formErrors.time}</Text>
                  )}
                </View>
              </View>

              {/* Price & Duration Row */}
              <View style={styles.twoColumnRow}>
                <View style={[styles.formGroup, styles.flexCol]}>
                  <Text style={styles.formLabel}>Price (USD) *</Text>
                  <TextInput
                    style={[
                      styles.formInput,
                      formErrors.price ? styles.formInputError : null,
                    ]}
                    placeholder="99"
                    keyboardType="numeric"
                    placeholderTextColor={Colors.textMuted}
                    value={formData.price}
                    onChangeText={(val) => updateFormField('price', val)}
                  />
                  {formErrors.price && (
                    <Text style={styles.errorText}>{formErrors.price}</Text>
                  )}
                </View>

                <View style={[styles.formGroup, styles.flexCol]}>
                  <Text style={styles.formLabel}>Duration (Minutes)</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="60"
                    keyboardType="numeric"
                    placeholderTextColor={Colors.textMuted}
                    value={formData.durationMinutes}
                    onChangeText={(val) =>
                      updateFormField('durationMinutes', val)
                    }
                  />
                </View>
              </View>

              {/* Location */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Location / Platform *</Text>
                <TextInput
                  style={[
                    styles.formInput,
                    formErrors.location ? styles.formInputError : null,
                  ]}
                  placeholder="e.g. Zoom Link, Clinic #3, Home address"
                  placeholderTextColor={Colors.textMuted}
                  value={formData.location}
                  onChangeText={(val) => updateFormField('location', val)}
                />
                {formErrors.location && (
                  <Text style={styles.errorText}>{formErrors.location}</Text>
                )}
              </View>

              {/* Notes */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Notes (Optional)</Text>
                <TextInput
                  style={[styles.formInput, styles.textArea]}
                  placeholder="Special instructions or agenda..."
                  placeholderTextColor={Colors.textMuted}
                  multiline
                  numberOfLines={3}
                  value={formData.notes}
                  onChangeText={(val) => updateFormField('notes', val)}
                />
              </View>

              {/* Sync reminder checkbox */}
              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() =>
                  updateFormField('createReminder', !formData.createReminder)
                }
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.reminderCheckbox,
                    formData.createReminder &&
                      styles.reminderCheckboxSelected,
                  ]}
                >
                  {formData.createReminder && (
                    <Text style={styles.checkIcon}>✓</Text>
                  )}
                </View>
                <Text style={styles.checkboxLabel}>
                  Auto-create an alert reminder for this session
                </Text>
              </TouchableOpacity>
            </ScrollView>

            {/* Modal Actions */}
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={closeCreateModal}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalSubmitBtn}
                onPress={submitCreateBooking}
                disabled={isSubmitting}
                activeOpacity={0.8}
              >
                <Text style={styles.modalSubmitText}>
                  {isSubmitting ? 'Creating...' : 'Confirm Booking'}
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
  newBookingBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
  },
  newBookingBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
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
    height: 70,
    textAlignVertical: 'top',
  },
  twoColumnRow: {
    flexDirection: 'row',
    gap: 12,
  },
  flexCol: {
    flex: 1,
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
    backgroundColor: Colors.primarySubtle,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  categoryPickChipText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  categoryPickChipTextSelected: {
    color: Colors.primary,
    fontWeight: '700',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  reminderCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  reminderCheckboxSelected: {
    backgroundColor: Colors.primary,
  },
  checkIcon: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  checkboxLabel: {
    fontSize: 13,
    color: Colors.textPrimary,
    fontWeight: '500',
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
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  modalSubmitText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
