import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput, ScrollView } from 'react-native';
import { ArrowLeft, Calendar, Clock } from 'lucide-react-native';
import { User } from 'lucide-react-native';
import { useFonts, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import Svg, { Circle, Path } from 'react-native-svg';

export default function AddNotification() {
  const [details, setDetails] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [time, setTime] = useState('');
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [sendWithoutAI, setSendWithoutAI] = useState(false);

  // Mock characters data
  const characters = [
    { id: '1', name: 'Character 1', isEmpty: false, avatarSource: require('../assets/images/pink bunny.jpg') },
    { id: '2', name: 'Character 2', isEmpty: false, avatarSource: require('../assets/images/20250706_1541_Futuristic Spacecraft Cockpit_simple_compose_01jzgyc3yserjtsrq38jpjn75t.png') },
    { id: '3', name: 'Add Character', isEmpty: true, avatarSource: null },
  ];

  const handleCharacterSelect = (characterId: string) => {
    const character = characters.find(c => c.id === characterId);
    if (character && !character.isEmpty && !sendWithoutAI) {
      setSelectedCharacterId(characterId);
    }
  };

  const handleSendWithoutAIToggle = () => {
    const newSendWithoutAI = !sendWithoutAI;
    setSendWithoutAI(newSendWithoutAI);
    
    if (newSendWithoutAI) {
      // When enabling AI-free mode, deselect all characters
      setSelectedCharacterId(null);
    } else {
      // When disabling AI-free mode, select the first available character
      const firstAvailableCharacter = characters.find(char => !char.isEmpty);
      if (firstAvailableCharacter) {
        setSelectedCharacterId(firstAvailableCharacter.id);
      }
    }
  };

  // Check if all required fields are filled for Save button
  const canSaveNotification = () => {
    return details.trim() !== '' && 
           startDate !== null && 
           time.trim() !== '' && 
           (selectedCharacterId !== null || sendWithoutAI); // Allow saving when AI-free is selected
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Notification</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          <TextInput
            style={styles.textInput}
            value={details}
            onChangeText={setDetails}
            placeholder="Enter notification details..."
            multiline
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Date & Time</Text>
          <View style={styles.dateTimeContainer}>
            <TouchableOpacity style={styles.dateButton}>
              <Calendar size={20} color="#666" />
              <Text style={styles.dateButtonText}>
                {startDate ? startDate.toDateString() : 'Select Date'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.timeButton}>
              <Clock size={20} color="#666" />
              <Text style={styles.timeButtonText}>
                {time || 'Select Time'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Character Selection</Text>
          
          <View style={styles.characterSlots}>
            {characters.map((character) => {
              const showProfileIcon = sendWithoutAI;
              const isSelected = !sendWithoutAI && selectedCharacterId === character.id && !character.isEmpty;
              
              return (
                <TouchableOpacity
                  key={character.id}
                  style={[
                    styles.characterSlot,
                    isSelected && styles.characterSlotSelected
                  ]}
                  onPress={() => !sendWithoutAI && handleCharacterSelect(character.id)}
                  activeOpacity={character.isEmpty || sendWithoutAI ? 1 : 0.7}
                  disabled={character.isEmpty || sendWithoutAI}
                >
                  <View style={[
                    styles.characterAvatarContainer,
                    character.isEmpty && styles.emptyCharacterSlot,
                    isSelected && styles.selectedCharacterAvatar,
                    sendWithoutAI && !character.isEmpty && styles.aiFreeModeAvatar
                  ]}>
                    {showProfileIcon && !character.isEmpty ? (
                      <User size={32} color="#9CA3AF" />
                    ) : character.isEmpty ? (
                      <Text style={styles.addCharacterText}>+</Text>
                    ) : (
                      <Image 
                        source={character.avatarSource}
                        style={styles.characterAvatar}
                        resizeMode="cover"
                      />
                    )}
                  </View>
                  <Text style={[
                    styles.characterName,
                    isSelected && styles.characterNameSelected,
                    character.isEmpty && styles.characterNameEmpty,
                    sendWithoutAI && !character.isEmpty && styles.characterNameAIFree
                  ]}>
                    {showProfileIcon && !character.isEmpty ? 'You' : character.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity 
            style={styles.aiCheckbox}
            onPress={handleSendWithoutAIToggle}
            activeOpacity={0.7}
          >
            <View style={styles.checkboxContainer}>
              <View style={[styles.checkbox, sendWithoutAI && styles.checkboxChecked]}>
                {sendWithoutAI && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>Send without AI</Text>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[
            styles.saveButton,
            canSaveNotification() && styles.saveButtonEnabled
          ]}
          disabled={!canSaveNotification()}
        >
          <Text style={[
            styles.saveButtonText,
            canSaveNotification() && styles.saveButtonTextEnabled
          ]}>
            Save Notification
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 16,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  dateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    gap: 8,
  },
  timeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    gap: 8,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
  timeButtonText: {
    fontSize: 16,
    color: '#333',
  },
  characterSlots: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  characterSlot: {
    alignItems: 'center',
    flex: 1,
  },
  characterSlotSelected: {
    // Add selected styling if needed
  },
  characterAvatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  emptyCharacterSlot: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  selectedCharacterAvatar: {
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  aiFreeModeAvatar: {
    backgroundColor: '#374151',
    borderColor: '#4B5563',
    opacity: 0.6,
  },
  characterAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  addCharacterText: {
    fontSize: 24,
    color: '#999',
    fontWeight: '300',
  },
  characterName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  characterNameSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
  characterNameEmpty: {
    fontSize: 12,
    fontWeight: '400',
    color: '#9CA3AF',
  },
  characterNameAIFree: {
    color: '#9CA3AF',
    fontWeight: '400',
  },
  aiCheckbox: {
    marginTop: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonEnabled: {
    backgroundColor: '#007AFF',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
  },
  saveButtonTextEnabled: {
    color: '#fff',
  },
});