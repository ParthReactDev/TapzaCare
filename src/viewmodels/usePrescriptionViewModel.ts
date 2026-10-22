import { useState, useEffect, useCallback, useMemo } from 'react';
import { Prescription } from '../models/BackendApi';
import { api } from '../services/api/client';
import { mockBackendApi } from '../services/api/MockBackendApi';

export function usePrescriptionViewModel() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchPrescriptions = useCallback(async () => {
    setIsLoading(true);
    try {
      // Calls exact endpoint: GET /prescriptions -> Prescription[]
      const list: Prescription[] = await api.get('/prescriptions');
      setPrescriptions(list);
    } catch {
      // fallback
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrescriptions();
  }, [fetchPrescriptions]);

  const filteredPrescriptions = useMemo(() => {
    if (!searchQuery.trim()) return prescriptions;
    const q = searchQuery.toLowerCase();
    return prescriptions.filter(
      (p) =>
        p.doctorName.toLowerCase().includes(q) ||
        p.clinicName.toLowerCase().includes(q) ||
        p.medicines.some((m) => m.name.toLowerCase().includes(q))
    );
  }, [prescriptions, searchQuery]);

  // Compute daily adherence progress
  const doseStats = useMemo(() => {
    let total = 0;
    let taken = 0;
    prescriptions.forEach((p) => {
      p.medicines.forEach((m) => {
        (m.timing || []).forEach((slot) => {
          total++;
          if (m.dosesTaken && m.dosesTaken[slot]) {
            taken++;
          }
        });
      });
    });
    return {
      total,
      taken,
      percentage: total > 0 ? Math.round((taken / total) * 100) : 0,
    };
  }, [prescriptions]);

  const openPrescription = useCallback((prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setIsDetailModalVisible(true);
  }, []);

  const closePrescription = useCallback(() => {
    setIsDetailModalVisible(false);
    setSelectedPrescription(null);
  }, []);

  const toggleDose = useCallback(
    async (
      medicineId: string,
      timing: 'morning' | 'afternoon' | 'night'
    ) => {
      if (!selectedPrescription) return;
      await mockBackendApi.markDoseTaken(
        selectedPrescription.id,
        medicineId,
        timing
      );

      // Refresh local list
      const updated = await mockBackendApi.getPrescriptions();
      setPrescriptions(updated);
      const activeOne = updated.find((p) => p.id === selectedPrescription.id);
      if (activeOne) setSelectedPrescription(activeOne);
    },
    [selectedPrescription]
  );

  return {
    prescriptions: filteredPrescriptions,
    selectedPrescription,
    isDetailModalVisible,
    searchQuery,
    setSearchQuery,
    doseStats,
    isLoading,
    openPrescription,
    closePrescription,
    toggleDose,
    refreshPrescriptions: fetchPrescriptions,
  };
}
