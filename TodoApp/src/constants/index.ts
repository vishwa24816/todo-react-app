// Application constants

export const COLORS = {
  primary: '#6366F1',
  primaryDark: '#4F46E5',
  secondary: '#EC4899',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  background: '#F9FAFB',
  surface: '#FFFFFF',
  text: '#111827',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  shadow: '#000000',
};

export const SIZES = {
  base: 8,
  font: 14,
  padding: 16,
  radius: 12,
  h1: 32,
  h2: 24,
  h3: 18,
};

export const FONTS = {
  h1: {
    fontSize: SIZES.h1,
    fontWeight: 'bold' as const,
    color: COLORS.text,
  },
  h2: {
    fontSize: SIZES.h2,
    fontWeight: '600' as const,
    color: COLORS.text,
  },
  h3: {
    fontSize: SIZES.h3,
    fontWeight: '500' as const,
    color: COLORS.text,
  },
  body: {
    fontSize: SIZES.font,
    color: COLORS.text,
  },
  caption: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
};

export const PRIORITIES = {
  low: { label: 'Low', color: COLORS.success },
  medium: { label: 'Medium', color: COLORS.warning },
  high: { label: 'High', color: COLORS.danger },
};

export const CATEGORIES = [
  'Personal',
  'Work',
  'Shopping',
  'Health',
  'Education',
  'Finance',
  'Home',
  'Travel',
  'Family',
  'Social',
  'Creative',
  'Other',
];

export const CATEGORY_COLORS = {
  Personal: '#6366F1',
  Work: '#EF4444',
  Shopping: '#F59E0B',
  Health: '#10B981',
  Education: '#8B5CF6',
  Finance: '#EC4899',
  Home: '#14B8A6',
  Travel: '#F97316',
  Family: '#06B6D4',
  Social: '#84CC16',
  Creative: '#A855F7',
  Other: '#6B7280',
};

export const TAGS = [
  'urgent',
  'important',
  'meeting',
  'deadline',
  'review',
  'follow-up',
  'research',
  'planning',
  'routine',
  'project',
  'goal',
  'reminder',
];

export const SORT_OPTIONS = [
  { value: 'urgency', label: 'Urgency (Mixed)' },
  { value: 'createdAt', label: 'Created Date' },
  { value: 'deadline', label: 'Deadline' },
  { value: 'priority', label: 'Priority' },
];

export const FILTER_OPTIONS = [
  { value: 'all', label: 'All Tasks' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'today', label: 'Due Today' },
  { value: 'week', label: 'Due This Week' },
];
