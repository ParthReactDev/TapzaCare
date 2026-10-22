export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  notificationsCount: number;
}

export interface DashboardStats {
  upcomingBookingsCount: number;
  completedBookingsCount: number;
  activeRemindersCount: number;
  totalSpent: number;
}

export interface QuickActionItem {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  route: string;
  badge?: string;
  color: string;
}
