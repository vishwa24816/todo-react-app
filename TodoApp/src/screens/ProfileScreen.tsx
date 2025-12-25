import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { signOut } from '../redux/authSlice';
import { RootState } from '../types';
import { AppDispatch } from '../redux/store';
import { COLORS, SIZES, FONTS } from '../constants';

const ProfileScreen = ({ navigation }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { tasks } = useSelector((state: RootState) => state.tasks);

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => dispatch(signOut()),
        },
      ]
    );
  };

  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const pendingTasks = tasks.filter(task => task.status === 'pending').length;
  const overdueTasks = tasks.filter(
    task => task.status === 'pending' && task.deadline < new Date()
  ).length;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Icon name="person" size={48} color={COLORS.surface} />
          </View>
        </View>
        <Text style={styles.email}>{user?.email}</Text>
        <Text style={styles.memberSince}>
          Member since {user?.createdAt.toLocaleDateString()}
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{tasks.length}</Text>
          <Text style={styles.statLabel}>Total Tasks</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{completedTasks}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{pendingTasks}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
      </View>

      {overdueTasks > 0 && (
        <View style={styles.warningCard}>
          <Icon name="warning" size={24} color={COLORS.danger} />
          <View style={styles.warningContent}>
            <Text style={styles.warningTitle}>Overdue Tasks</Text>
            <Text style={styles.warningText}>
              You have {overdueTasks} overdue task{overdueTasks > 1 ? 's' : ''} that need attention
            </Text>
          </View>
        </View>
      )}

      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem}>
          <Icon name="settings" size={24} color={COLORS.textSecondary} />
          <Text style={styles.menuText}>Settings</Text>
          <Icon name="chevron-right" size={24} color={COLORS.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Icon name="help" size={24} color={COLORS.textSecondary} />
          <Text style={styles.menuText}>Help & Support</Text>
          <Icon name="chevron-right" size={24} color={COLORS.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Icon name="info" size={24} color={COLORS.textSecondary} />
          <Text style={styles.menuText}>About</Text>
          <Icon name="chevron-right" size={24} color={COLORS.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Icon name="feedback" size={24} color={COLORS.textSecondary} />
          <Text style={styles.menuText}>Send Feedback</Text>
          <Icon name="chevron-right" size={24} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Icon name="logout" size={24} color={COLORS.danger} />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.versionText}>Version 1.0.0</Text>
        <Text style={styles.copyrightText}>© 2024 TodoApp</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    alignItems: 'center',
    padding: SIZES.padding * 2,
    backgroundColor: COLORS.primary,
  },
  avatarContainer: {
    marginBottom: SIZES.padding,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  email: {
    ...FONTS.h2,
    color: COLORS.surface,
    marginBottom: SIZES.base / 2,
  },
  memberSince: {
    ...FONTS.caption,
    color: COLORS.surface + 'CC',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: SIZES.padding,
    backgroundColor: COLORS.surface,
    marginHorizontal: SIZES.padding,
    marginTop: -SIZES.radius,
    borderRadius: SIZES.radius,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statCard: {
    alignItems: 'center',
  },
  statNumber: {
    ...FONTS.h2,
    color: COLORS.primary,
    marginBottom: SIZES.base / 2,
  },
  statLabel: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
  warningCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.danger + '10',
    margin: SIZES.padding,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.danger,
  },
  warningContent: {
    flex: 1,
    marginLeft: SIZES.base,
  },
  warningTitle: {
    ...FONTS.h3,
    color: COLORS.danger,
    marginBottom: SIZES.base / 2,
  },
  warningText: {
    ...FONTS.body,
    color: COLORS.textSecondary,
  },
  menuContainer: {
    backgroundColor: COLORS.surface,
    margin: SIZES.padding,
    borderRadius: SIZES.radius,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuText: {
    ...FONTS.body,
    flex: 1,
    marginLeft: SIZES.padding,
    color: COLORS.text,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    margin: SIZES.padding,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.danger,
  },
  signOutText: {
    ...FONTS.body,
    color: COLORS.danger,
    marginLeft: SIZES.base,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    padding: SIZES.padding,
  },
  versionText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginBottom: SIZES.base / 2,
  },
  copyrightText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
});

export default ProfileScreen;
