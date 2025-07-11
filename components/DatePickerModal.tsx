import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import { ChevronLeft, ChevronRight, CreditCard as Edit3 } from 'lucide-react-native';

const { width: screenWidth } = Dimensions.get('window');

interface DatePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onCancel: () => void;
  onConfirm: (date: Date) => void;
  initialDate?: Date;
  title?: string;
}

export default function DatePickerModal({
  visible,
  onClose,
  onCancel,
  onConfirm,
  initialDate = new Date(),
  title = "Select date"
}: DatePickerModalProps) {
  // Ensure we always have a valid date
  const getValidDate = (date: Date) => {
    if (!date || isNaN(date.getTime())) {
      return new Date();
    }
    return date;
  };

  const validInitialDate = getValidDate(initialDate);
  const [selectedDate, setSelectedDate] = useState(validInitialDate);
  const [currentMonth, setCurrentMonth] = useState(validInitialDate.getMonth());
  const [currentYear, setCurrentYear] = useState(validInitialDate.getFullYear());

  // Update state when initialDate changes
  useEffect(() => {
    const validDate = getValidDate(initialDate);
    setSelectedDate(validDate);
    setCurrentMonth(validDate.getMonth());
    setCurrentYear(validDate.getFullYear());
  }, [initialDate]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const formatSelectedDate = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Ensure selectedDate is valid
    const validDate = getValidDate(selectedDate);
    
    const dayName = days[validDate.getDay()];
    const monthName = months[validDate.getMonth()];
    const date = validDate.getDate();
    
    return `${dayName}, ${monthName} ${date}`;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const selectDate = (day: number) => {
    // Ensure we create a valid date
    const newDate = new Date(currentYear, currentMonth, day);
    if (isNaN(newDate.getTime())) {
      console.warn('Invalid date created:', currentYear, currentMonth, day);
      return;
    }
    setSelectedDate(newDate);
  };

  const handleConfirm = () => {
    onConfirm(selectedDate);
    onClose();
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <View key={`empty-${i}`} style={styles.dayCell}>
          <Text style={styles.emptyDay}></Text>
        </View>
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const validSelectedDate = getValidDate(selectedDate);
      const isSelected = validSelectedDate.getDate() === day && 
                        validSelectedDate.getMonth() === currentMonth && 
                        validSelectedDate.getFullYear() === currentYear;
      
      days.push(
        <TouchableOpacity
          key={day}
          style={[styles.dayCell, isSelected && styles.selectedDayCell]}
          onPress={() => selectDate(day)}
          activeOpacity={0.7}
        >
          <Text style={[styles.dayText, isSelected && styles.selectedDayText]}>
            {day}
          </Text>
        </TouchableOpacity>
      );
    }

    return days;
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

          {/* Selected Date Display */}
          <View style={styles.selectedDateContainer}>
            <Text style={styles.selectedDateText}>{formatSelectedDate()}</Text>
            <TouchableOpacity style={styles.editButton} activeOpacity={0.7}>
              <Edit3 size={20} color="#6B46C1" />
            </TouchableOpacity>
          </View>

          {/* Month Navigation */}
          <View style={styles.monthNavigation}>
            <TouchableOpacity 
              style={styles.navButton}
              onPress={() => navigateMonth('prev')}
              activeOpacity={0.7}
            >
              <ChevronLeft size={20} color="#6B46C1" />
            </TouchableOpacity>
            
            <Text style={styles.monthYearText}>
              {months[currentMonth]} {currentYear}
            </Text>
            
            <TouchableOpacity 
              style={styles.navButton}
              onPress={() => navigateMonth('next')}
              activeOpacity={0.7}
            >
              <ChevronRight size={20} color="#6B46C1" />
            </TouchableOpacity>
          </View>

          {/* Week Days Header */}
          <View style={styles.weekDaysContainer}>
            {weekDays.map((day, index) => (
              <View key={index} style={styles.weekDayCell}>
                <Text style={styles.weekDayText}>{day}</Text>
              </View>
            ))}
          </View>

          {/* Calendar Grid */}
          <View style={styles.calendarGrid}>
            {renderCalendarDays()}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
            
            <View style={styles.rightButtons}>
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
    width: 360,
    backgroundColor: '#ECE6F0',
    borderRadius: 28,
    paddingVertical: 24,
    paddingHorizontal: 24,
    alignItems: 'flex-start',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#49454F',
    fontFamily: 'Inter',
  },
  selectedDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  selectedDateText: {
    fontSize: 32,
    fontWeight: '400',
    color: '#1C1B1F',
    fontFamily: 'Inter',
  },
  editButton: {
    padding: 8,
  },
  monthNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  navButton: {
    padding: 8,
  },
  weekDaysContainer: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 8,
  },
  weekDayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  weekDayText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#49454F',
    fontFamily: 'Inter',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    marginBottom: 24,
  },
  dayCell: {
    width: '14.28%', // 100% / 7 days
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 2,
  },
  selectedDayCell: {
    backgroundColor: '#4A3A7B',
    borderRadius: 20,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#1C1B1F',
    fontFamily: 'Inter',
  },
  selectedDayText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  emptyDay: {
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingTop: 8,
  },
  closeButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  closeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4A3A7B',
    fontFamily: 'Inter',
  },
  rightButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4A3A7B',
    fontFamily: 'Inter',
  },
  okButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  okButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4A3A7B',
    fontFamily: 'Inter',
  },
  monthYearText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1B1F',
    fontFamily: 'Inter',
  },
});