import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, SIZES, FONTS, FILTER_OPTIONS, SORT_OPTIONS } from '../constants';

interface FilterModalProps {
  filter: 'all' | 'pending' | 'completed';
  sortBy: 'createdAt' | 'deadline' | 'priority';
  sortOrder: 'asc' | 'desc';
  onFilterChange: (filter: 'all' | 'pending' | 'completed') => void;
  onSortChange: (sortBy: 'createdAt' | 'deadline' | 'priority') => void;
  onSortOrderChange: (sortOrder: 'asc' | 'desc') => void;
  onClose: () => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  filter,
  sortBy,
  sortOrder,
  onFilterChange,
  onSortChange,
  onSortOrderChange,
  onClose,
}) => {
  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Filter & Sort</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon name="close" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Filter Tasks</Text>
            {FILTER_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[styles.option, filter === option.value && styles.selectedOption]}
                onPress={() => onFilterChange(option.value as any)}
              >
                <Text
                  style={[
                    styles.optionText,
                    filter === option.value && styles.selectedOptionText,
                  ]}
                >
                  {option.label}
                </Text>
                {filter === option.value && (
                  <Icon name="check" size={20} color={COLORS.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sort By</Text>
            {SORT_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[styles.option, sortBy === option.value && styles.selectedOption]}
                onPress={() => onSortChange(option.value as any)}
              >
                <Text
                  style={[
                    styles.optionText,
                    sortBy === option.value && styles.selectedOptionText,
                  ]}
                >
                  {option.label}
                </Text>
                {sortBy === option.value && (
                  <Icon name="check" size={20} color={COLORS.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sort Order</Text>
            <TouchableOpacity
              style={[styles.option, sortOrder === 'asc' && styles.selectedOption]}
              onPress={() => onSortOrderChange('asc')}
            >
              <Text
                style={[
                  styles.optionText,
                  sortOrder === 'asc' && styles.selectedOptionText,
                ]}
              >
                Ascending
              </Text>
              {sortOrder === 'asc' && (
                <Icon name="check" size={20} color={COLORS.primary} />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.option, sortOrder === 'desc' && styles.selectedOption]}
              onPress={() => onSortOrderChange('desc')}
            >
              <Text
                style={[
                  styles.optionText,
                  sortOrder === 'desc' && styles.selectedOptionText,
                ]}
              >
                Descending
              </Text>
              {sortOrder === 'desc' && (
                <Icon name="check" size={20} color={COLORS.primary} />
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>

        <TouchableOpacity style={styles.applyButton} onPress={onClose}>
          <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    width: '90%',
    maxHeight: '80%',
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    ...FONTS.h2,
  },
  closeButton: {
    padding: SIZES.base / 2,
  },
  content: {
    padding: SIZES.padding,
  },
  section: {
    marginBottom: SIZES.padding * 1.5,
  },
  sectionTitle: {
    ...FONTS.h3,
    marginBottom: SIZES.base,
    color: COLORS.text,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.base,
    borderRadius: SIZES.radius / 2,
    marginBottom: SIZES.base / 2,
  },
  selectedOption: {
    backgroundColor: COLORS.primary + '20',
  },
  optionText: {
    ...FONTS.body,
    color: COLORS.text,
  },
  selectedOptionText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  applyButton: {
    backgroundColor: COLORS.primary,
    margin: SIZES.padding,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    alignItems: 'center',
  },
  applyButtonText: {
    ...FONTS.body,
    color: COLORS.surface,
    fontWeight: 'bold',
  },
});

export default FilterModal;
