import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Task } from '../types';
import { COLORS, SIZES, FONTS, PRIORITIES, CATEGORY_COLORS } from '../constants';

interface TaskCardProps {
  task: Task;
  onPress: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onPress, onDelete, onToggleStatus }) => {
  const animatedValue = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.spring(animatedValue, {
      toValue: 0.98,
      useNativeDriver: true,
      friction: 8,
      tension: 100,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(animatedValue, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
      tension: 100,
    }).start();
  };

  React.useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const isOverdue = task.deadline < new Date() && task.status !== 'completed';
  const priorityColor = PRIORITIES[task.priority].color;
  const categoryColor = task.category ? CATEGORY_COLORS[task.category as keyof typeof CATEGORY_COLORS] || COLORS.primary : COLORS.primary;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { scale: animatedValue },
            { translateX: slideAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [-50, 0],
            })},
          ],
        },
      ]}
    >
      <TouchableOpacity 
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity
              style={[styles.checkbox, task.status === 'completed' && styles.checkboxChecked]}
              onPress={onToggleStatus}
            >
              {task.status === 'completed' && (
                <Icon name="check" size={16} color={COLORS.surface} />
              )}
            </TouchableOpacity>
            <View style={styles.titleContainer}>
              <Text
                style={[
                  styles.title,
                  task.status === 'completed' && styles.completedTitle,
                ]}
                numberOfLines={2}
              >
                {task.title}
              </Text>
              <View style={styles.metaContainer}>
                {task.category && (
                  <View style={[styles.categoryBadge, { backgroundColor: categoryColor + '20', borderColor: categoryColor }]}>
                    <Text style={[styles.categoryText, { color: categoryColor }]}>{task.category}</Text>
                  </View>
                )}
                {task.tags && task.tags.length > 0 && (
                  <View style={styles.tagsContainer}>
                    {task.tags.slice(0, 2).map((tag, index) => (
                      <View key={index} style={styles.tagBadge}>
                        <Text style={styles.tagText}>#{tag}</Text>
                      </View>
                    ))}
                    {task.tags.length > 2 && (
                      <Text style={styles.moreTagsText}>+{task.tags.length - 2}</Text>
                    )}
                  </View>
                )}
              </View>
            </View>
            <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
              <Icon name="delete" size={20} color={COLORS.danger} />
            </TouchableOpacity>
          </View>

          {task.description && (
            <Text
              style={[styles.description, task.status === 'completed' && styles.completedText]}
              numberOfLines={2}
            >
              {task.description}
            </Text>
          )}

          <View style={styles.footer}>
            <View style={styles.dateContainer}>
              <Icon
                name="schedule"
                size={14}
                color={isOverdue ? COLORS.danger : COLORS.textSecondary}
              />
              <Text
                style={[
                  styles.date,
                  isOverdue && styles.overdueText,
                  task.status === 'completed' && styles.completedText,
                ]}
              >
                {task.deadline.toLocaleDateString()} at {task.deadline.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </Text>
              {isOverdue && (
                <View style={styles.overdueBadge}>
                  <Text style={styles.overdueBadgeText}>Overdue</Text>
                </View>
              )}
            </View>
            <View style={[styles.priorityBadge, { backgroundColor: priorityColor }]}>
              <Text style={styles.priorityText}>{PRIORITIES[task.priority].label}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.base,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    padding: SIZES.padding,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SIZES.base / 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.base,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    ...FONTS.h3,
    marginBottom: 4,
    color: COLORS.text,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: COLORS.textSecondary,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  categoryBadge: {
    paddingHorizontal: SIZES.base / 2,
    paddingVertical: 2,
    borderRadius: SIZES.base / 2,
    borderWidth: 1,
    marginRight: SIZES.base / 2,
    marginBottom: 2,
  },
  categoryText: {
    ...FONTS.caption,
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  tagBadge: {
    backgroundColor: COLORS.background,
    paddingHorizontal: SIZES.base / 2,
    paddingVertical: 2,
    borderRadius: SIZES.base / 2,
    marginRight: SIZES.base / 2,
    marginBottom: 2,
  },
  tagText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    fontSize: 10,
  },
  moreTagsText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    fontSize: 10,
    marginLeft: 2,
  },
  deleteButton: {
    padding: SIZES.base / 2,
    marginLeft: SIZES.base,
  },
  description: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    marginBottom: SIZES.base,
    lineHeight: 18,
  },
  completedText: {
    color: COLORS.textSecondary,
    textDecorationLine: 'line-through',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  date: {
    ...FONTS.caption,
    marginLeft: SIZES.base / 2,
    color: COLORS.textSecondary,
    flex: 1,
  },
  overdueText: {
    color: COLORS.danger,
    fontWeight: 'bold',
  },
  overdueBadge: {
    backgroundColor: COLORS.danger + '20',
    paddingHorizontal: SIZES.base / 2,
    paddingVertical: 2,
    borderRadius: SIZES.base / 2,
    marginLeft: SIZES.base / 2,
  },
  overdueBadgeText: {
    ...FONTS.caption,
    color: COLORS.danger,
    fontWeight: '600',
    fontSize: 10,
  },
  priorityBadge: {
    paddingHorizontal: SIZES.base,
    paddingVertical: SIZES.base / 3,
    borderRadius: SIZES.base,
  },
  priorityText: {
    ...FONTS.caption,
    color: COLORS.surface,
    fontWeight: 'bold',
  },
});

export default TaskCard;
