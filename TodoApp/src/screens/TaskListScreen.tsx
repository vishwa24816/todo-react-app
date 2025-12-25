import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
  Modal,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { fetchTasks, deleteTask, updateTask, setFilter, setSortBy, setSortOrder } from '../redux/taskSlice';
import { signOut } from '../redux/authSlice';
import { RootState, Task } from '../types';
import { AppDispatch } from '../redux/store';
import { COLORS, SIZES, FONTS, PRIORITIES, FILTER_OPTIONS, SORT_OPTIONS } from '../constants';
import TaskCard from '../components/TaskCard';
import FilterModal from '../components/FilterModal';

const TaskListScreen = ({ navigation }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, isLoading, filter, sortBy, sortOrder } = useSelector((state: RootState) => state.tasks);
  const { user } = useSelector((state: RootState) => state.auth);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(fetchTasks(user.id));
    }
  }, [dispatch, user]);

  const handleRefresh = async () => {
    setRefreshing(true);
    if (user) {
      await dispatch(fetchTasks(user.id));
    }
    setRefreshing(false);
  };

  const handleDeleteTask = (taskId: string) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => dispatch(deleteTask(taskId)),
        },
      ]
    );
  };

  const handleToggleTaskStatus = (task: Task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    dispatch(updateTask({ id: task.id, updates: { status: newStatus } }));
  };

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

  const filteredAndSortedTasks = tasks
    .filter(task => {
      if (filter === 'completed') return task.status === 'completed';
      if (filter === 'pending') return task.status === 'pending';
      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
      } else if (sortBy === 'deadline') {
        comparison = a.deadline.getTime() - b.deadline.getTime();
      } else if (sortBy === 'createdAt') {
        comparison = a.createdAt.getTime() - b.createdAt.getTime();
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const renderTask = ({ item }: { item: Task }) => (
    <TaskCard
      task={item}
      onPress={() => navigation.navigate('TaskDetail', { taskId: item.id })}
      onDelete={() => handleDeleteTask(item.id)}
      onToggleStatus={() => handleToggleTaskStatus(item)}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Tasks</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilterModal(true)}
          >
            <Icon name="filter-list" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
          >
            <Icon name="logout" size={24} color={COLORS.danger} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{tasks.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {tasks.filter(t => t.status === 'pending').length}
          </Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {tasks.filter(t => t.status === 'completed').length}
          </Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
      </View>

      <FlatList
        data={filteredAndSortedTasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="assignment" size={64} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>No tasks found</Text>
            <Text style={styles.emptySubtext}>
              Add your first task to get started!
            </Text>
          </View>
        }
      />

      <Modal
        visible={showFilterModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilterModal(false)}
      >
        <FilterModal
          filter={filter}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onFilterChange={(newFilter) => {
            dispatch(setFilter(newFilter));
          }}
          onSortChange={(newSortBy) => {
            dispatch(setSortBy(newSortBy));
          }}
          onSortOrderChange={(newSortOrder) => {
            dispatch(setSortOrder(newSortOrder));
          }}
          onClose={() => setShowFilterModal(false)}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    ...FONTS.h2,
  },
  headerActions: {
    flexDirection: 'row',
  },
  filterButton: {
    padding: SIZES.base / 2,
    marginRight: SIZES.base,
  },
  signOutButton: {
    padding: SIZES.base / 2,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: SIZES.padding,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    ...FONTS.h2,
    color: COLORS.primary,
  },
  statLabel: {
    ...FONTS.caption,
    marginTop: 2,
  },
  listContainer: {
    padding: SIZES.padding,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.padding * 4,
  },
  emptyText: {
    ...FONTS.h3,
    color: COLORS.textSecondary,
    marginTop: SIZES.padding,
  },
  emptySubtext: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    marginTop: SIZES.base,
  },
});

export default TaskListScreen;
