import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { fetchTasks, updateTask, deleteTask } from '../redux/taskSlice';
import { RootState, Task } from '../types';
import { AppDispatch } from '../redux/store';
import { COLORS, SIZES, FONTS, PRIORITIES } from '../constants';

const TaskDetailScreen = ({ route, navigation }: any) => {
  const { taskId } = route.params;
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, isLoading } = useSelector((state: RootState) => state.tasks);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<Task | null>(null);

  const task = tasks.find(t => t.id === taskId);

  useEffect(() => {
    if (!task && taskId) {
      // If task not found in store, fetch tasks again
      const { user } = useSelector((state: RootState) => state.auth);
      if (user) {
        dispatch(fetchTasks(user.id));
      }
    }
  }, [task, taskId, dispatch]);

  useEffect(() => {
    if (task) {
      setEditedTask({ ...task });
    }
  }, [task]);

  if (!task) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Task not found</Text>
      </View>
    );
  }

  const handleUpdateTask = async () => {
    if (!editedTask) return;

    try {
      await dispatch(updateTask({
        id: task.id,
        updates: {
          title: editedTask.title,
          description: editedTask.description,
          deadline: editedTask.deadline,
          priority: editedTask.priority,
          category: editedTask.category,
        }
      })).unwrap();
      
      setIsEditing(false);
      Alert.alert('Success', 'Task updated successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleDeleteTask = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deleteTask(task.id)).unwrap();
              navigation.goBack();
            } catch (error: any) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  };

  const handleToggleStatus = async () => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      await dispatch(updateTask({
        id: task.id,
        updates: { status: newStatus }
      })).unwrap();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const isOverdue = task.deadline < new Date() && task.status !== 'completed';

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.statusContainer}>
          <TouchableOpacity
            style={[styles.statusButton, task.status === 'completed' && styles.completedStatus]}
            onPress={handleToggleStatus}
          >
            <Icon
              name={task.status === 'completed' ? 'check-circle' : 'radio-button-unchecked'}
              size={24}
              color={task.status === 'completed' ? COLORS.success : COLORS.primary}
            />
          </TouchableOpacity>
          <Text style={styles.statusText}>
            {task.status === 'completed' ? 'Completed' : 'Pending'}
          </Text>
        </View>
        
        <View style={styles.headerActions}>
          {!isEditing && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setIsEditing(true)}
            >
              <Icon name="edit" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleDeleteTask}
          >
            <Icon name="delete" size={24} color={COLORS.danger} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        {isEditing ? (
          <View style={styles.editForm}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              value={editedTask?.title || ''}
              onChangeText={(text) => setEditedTask(prev => prev ? {...prev, title: text} : null)}
              multiline
            />
            
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={editedTask?.description || ''}
              onChangeText={(text) => setEditedTask(prev => prev ? {...prev, description: text} : null)}
              multiline
              numberOfLines={4}
            />
            
            <View style={styles.editActions}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setIsEditing(false);
                  setEditedTask(task);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleUpdateTask}
                disabled={isLoading}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View>
            <Text style={styles.title}>{task.title}</Text>
            
            {task.description && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.description}>{task.description}</Text>
              </View>
            )}
            
            <View style={styles.details}>
              <View style={styles.detailItem}>
                <Icon name="calendar-today" size={20} color={COLORS.textSecondary} />
                <Text style={[styles.detailText, isOverdue && styles.overdueText]}>
                  {task.deadline.toLocaleDateString()} at {task.deadline.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </Text>
                {isOverdue && (
                  <Text style={styles.overdueLabel}>Overdue</Text>
                )}
              </View>
              
              <View style={styles.detailItem}>
                <Icon name="flag" size={20} color={PRIORITIES[task.priority].color} />
                <Text style={styles.detailText}>{PRIORITIES[task.priority].label} Priority</Text>
              </View>
              
              {task.category && (
                <View style={styles.detailItem}>
                  <Icon name="label" size={20} color={COLORS.primary} />
                  <Text style={styles.detailText}>{task.category}</Text>
                </View>
              )}
              
              <View style={styles.detailItem}>
                <Icon name="schedule" size={20} color={COLORS.textSecondary} />
                <Text style={styles.detailText}>
                  Created {task.createdAt.toLocaleDateString()}
                </Text>
              </View>
            </View>
          </View>
        )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusButton: {
    marginRight: SIZES.base,
  },
  completedStatus: {
    // Add any additional styling for completed status
  },
  statusText: {
    ...FONTS.body,
    color: COLORS.text,
  },
  headerActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: SIZES.base,
    marginLeft: SIZES.base,
  },
  content: {
    padding: SIZES.padding,
  },
  title: {
    ...FONTS.h1,
    marginBottom: SIZES.padding,
    color: COLORS.text,
  },
  section: {
    marginBottom: SIZES.padding * 1.5,
  },
  sectionTitle: {
    ...FONTS.h3,
    marginBottom: SIZES.base,
    color: COLORS.text,
  },
  description: {
    ...FONTS.body,
    lineHeight: 22,
    color: COLORS.textSecondary,
  },
  details: {
    marginTop: SIZES.padding,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  detailText: {
    ...FONTS.body,
    marginLeft: SIZES.base,
    color: COLORS.text,
  },
  overdueText: {
    color: COLORS.danger,
    fontWeight: 'bold',
  },
  overdueLabel: {
    ...FONTS.caption,
    color: COLORS.danger,
    backgroundColor: COLORS.danger + '20',
    paddingHorizontal: SIZES.base / 2,
    paddingVertical: 2,
    borderRadius: SIZES.base / 2,
    marginLeft: SIZES.base,
  },
  editForm: {
    // Add edit form styles
  },
  label: {
    ...FONTS.body,
    marginBottom: SIZES.base / 2,
    color: COLORS.text,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    padding: SIZES.base,
    fontSize: SIZES.font,
    backgroundColor: COLORS.surface,
    color: COLORS.text,
    marginBottom: SIZES.base,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SIZES.padding,
  },
  button: {
    flex: 1,
    padding: SIZES.base,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    marginHorizontal: SIZES.base / 2,
  },
  cancelButton: {
    backgroundColor: COLORS.border,
  },
  cancelButtonText: {
    color: COLORS.text,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: COLORS.primary,
  },
  saveButtonText: {
    color: COLORS.surface,
    fontWeight: 'bold',
  },
  errorText: {
    ...FONTS.body,
    color: COLORS.danger,
    textAlign: 'center',
    marginTop: SIZES.padding * 2,
  },
});

export default TaskDetailScreen;
