import { mockBackendApi } from './MockBackendApi';
import {
  BookingPayload,
  BookingResponse,
  Doctor,
  LayoutConfig,
  Prescription,
  Slot,
} from '../../models/BackendApi';

export const api = {
  get: async (endpoint: string, options?: { params?: Record<string, any> }): Promise<any> => {
    if (endpoint === '/config') {
      return await mockBackendApi.getConfig();
    }
    if (endpoint === '/doctors') {
      return await mockBackendApi.getDoctors();
    }
    if (endpoint.startsWith('/slots')) {
      const doctorId = options?.params?.doctorId || 'doc-hyd-1';
      const date = options?.params?.date || new Date().toISOString().split('T')[0];
      return await mockBackendApi.getSlots(doctorId, date);
    }
    if (endpoint === '/prescriptions') {
      return await mockBackendApi.getPrescriptions();
    }
    throw new Error(`404 Not Found: ${endpoint}`);
  },

  post: async (endpoint: string, body: any): Promise<any> => {
    if (endpoint === '/bookings') {
      return await mockBackendApi.postBooking(body as BookingPayload);
    }
    throw new Error(`404 Not Found: ${endpoint}`);
  },
};
