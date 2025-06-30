import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  ScrollView,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

interface TimePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onCancel: () => void;
  onConfirm: (time: string) => void;
  initialTime?: string;
  title?: string;
}

export default function TimePickerModal({
  visible,
  onClose,
  onCancel,
  onConfirm,
  initialTime = "6:00 PM",
  title = "Select time"
}: TimePickerModalProps) {
  // Parse initial time or set defaults
  const parseTime = (timeStr: string) => {
    const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (match) {
      return {
        hour: parseInt(match[1]),
        minute: parseInt(match[2]),
        period: match[3].toUpperCase()
      };
    }
    return { hour: 6, minute: 0, period: 'PM' };
  };

  const initialParsed = parseTime(initialTime);
  const [selectedHour, setSelectedHour] = useState(initialParsed.hour);
  const [selectedMinute, setSelectedMinute] = useState(initialParsed.minute);
  const [selectedPeriod, setSelectedPeriod] = useState(initialParsed.period);

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  const periods = ['AM', 'PM'];

  const formatTime = () => {
    const formattedMinute = selectedMinute.toString().padStart(2, '0');
    return `${selectedHour}:${formattedMinute} ${selectedPeriod}`;
  };

  const handleConfirm = () => {
    onConfirm(formatTime());
    onClose();
  };

  const renderScrollablePicker = (
    items: (string | number)[],
    selectedValue: string | number,
    onSelect: (value: any) => void,
    style?: any
  ) => {
    const selectedIndex = items.findIndex(item => item === selectedValue);
    
    return (
      <View style={[styles.scrollPickerContainer, style]}>
        <ScrollView
          style={styles.scrollPicker}
          contentContainerStyle={styles.scrollPickerContent}
          showsVerticalScrollIndicator={false}
          snapToInterval={32} // Height of each item
          snapToAlignment="center"
          decelerationRate="fast"
          contentOffset={{ x: 0, y: selectedIndex * 32 }}
        >
          {/* Add padding items at the beginning */}
          <View style={styles.pickerPadding} />
          <View style={styles.pickerPadding} />
          
          {items.map((item, index) => {
            const isSelected = item === selectedValue;
            return (
              <TouchableOpacity
                key={index}
                style={[styles.scrollPickerItem, isSelected && styles.selectedScrollPickerItem]}
                onPress={() => onSelect(item)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.scrollPickerItemText, 
                  isSelected && styles.selectedScrollPickerItemText
                ]}>
                  {typeof item === 'number' && item < 10 ? `0${item}` : item}
                </Text>
              </TouchableOpacity>
            );
          })}
          
          {/* Add padding items at the end */}
          <View style={styles.pickerPadding} />
          <View style={styles.pickerPadding} />
        </ScrollView>
        
        {/* Selection indicator overlay */}
        <View style={styles.selectionIndicator} />
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
          </View>

          {/* Time Display */}
          <View style={styles.timeDisplayContainer}>
            <Text style={styles.timeDisplayText}>{formatTime()}</Text>
          </View>

          {/* Scrollable Wheel Pickers Container */}
          <View style={styles.wheelPickersContainer}>
            {/* Hour Picker */}
            <View style={styles.pickerColumn}>
              <Text style={styles.pickerLabel}>Hour</Text>
              {renderScrollablePicker(hours, selectedHour, setSelectedHour)}
            </View>

            {/* Minute Picker */}
            <View style={styles.pickerColumn}>
              <Text style={styles.pickerLabel}>Minute</Text>
              {renderScrollablePicker(minutes, selectedMinute, setSelectedMinute)}
            </View>

            {/* Period Picker */}
            <View style={styles.pickerColumn}>
              <Text style={styles.pickerLabel}>Period</Text>
              {renderScrollablePicker(periods, selectedPeriod, setSelectedPeriod)}
            </View>
          </View>

          {/* Action Buttons with 30px gap */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={onCancel}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.okButton}
              onPress={handleConfirm}
              activeOpacity={0.7}
            >
              <Text style={styles.okButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    width: 198.5,
    backgroundColor: '#ECE6F0', // Same background for entire modal
    borderRadius: 28,
    padding: 18,
    paddingHorizontal: 20,
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 10,
  },
  header: {
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: '#49454F',
    fontFamily: 'Inter',
  },
  timeDisplayContainer: {
    marginBottom: 12,
  },
  timeDisplayText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1B1F',
    fontFamily: 'Inter',
  },
  wheelPickersContainer: {
    flexDirection: 'row',
    height: 120, // Fixed height for the picker area
    gap: 8,
    marginBottom: 30, // 30px gap before buttons
  },
  pickerColumn: {
    flex: 1,
    alignItems: 'center',
  },
  pickerLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#49454F',
    fontFamily: 'Inter',
    marginBottom: 8,
  },
  scrollPickerContainer: {
    flex: 1,
    height: 96, // Height for 3 visible items (32px each)
    position: 'relative',
  },
  scrollPicker: {
    flex: 1,
  },
  scrollPickerContent: {
    paddingVertical: 0,
  },
  pickerPadding: {
    height: 32, // Same height as picker items for proper centering
  },
  scrollPickerItem: {
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  selectedScrollPickerItem: {
    backgroundColor: 'rgba(107, 70, 193, 0.1)', // Subtle selection background
  },
  scrollPickerItemText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#1C1B1F',
    fontFamily: 'Inter',
  },
  selectedScrollPickerItemText: {
    color: '#6B46C1',
    fontWeight: '600',
  },
  selectionIndicator: {
    position: 'absolute',
    top: 32, // Position at the center item
    left: 0,
    right: 0,
    height: 32,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(107, 70, 193, 0.2)',
    backgroundColor: 'rgba(107, 70, 193, 0.05)',
    pointerEvents: 'none', // Allow touches to pass through
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#ECE6F0', // Same background as modal
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  cancelButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B46C1',
    fontFamily: 'Inter',
  },
  okButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  okButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B46C1',
    fontFamily: 'Inter',
  },
});