import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  Image 
} from 'react-native';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react-native';
import { useFonts, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import Svg, { Circle, Path } from 'react-native-svg';

export default function EditNotification() {
  const [details, setDetails] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [time, setTime] = useState('');
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [sendWithoutAI, setSendWithoutAI] = useState(false);
  const [characters, setCharacters] = useState([
    { id: '1', name: 'Character 1', isEmpty: false, isSelected: false, avatarSource: require('../assets/images/pink bunny.jpg') },
    { id: '2', name: 'Character 2', isEmpty: false, isSelected: false, avatarSource: require('../assets/images/spacecraft-ai.jpg') },
    { id: '3', name: 'Add Character', isEmpty: true, isSelected: false, avatarSource: null },
  ]);

  const [fontsLoaded] = useFonts({
    Montserrat_700Bold,
  });

  const handleCharacterSelect = (characterId: string) => {
    const character = characters.find(c => c.id === characterId);
    if (character && !sendWithoutAI) {
      if (character.isEmpty) {
        // Handle empty slot press - could navigate to character creation
        Alert.alert('Add Character', 'Character creation functionality will be implemented');
      } else {
        setSelectedCharacterId(characterId);
        // Update character selection state
        setCharacters(prev => prev.map(char => ({
          ...char,
          isSelected: char.id === characterId
        })));
      }
    }
  };

  const handleSendWithoutAIToggle = () => {
    const newSendWithoutAI = !sendWithoutAI;
    setSendWithoutAI(newSendWithoutAI);
    
    if (newSendWithoutAI) {
      // When enabling AI-free mode, deselect all characters
      setSelectedCharacterId(null);
      // Update character selection state
      setCharacters(prev => prev.map(char => ({
        ...char,
        isSelected: false
      })));
    } else {
      // When disabling AI-free mode, select the first available character
      const firstAvailableCharacter = characters.find(char => !char.isEmpty);
      if (firstAvailableCharacter) {
        setSelectedCharacterId(firstAvailableCharacter.id);
        // Update character selection state
        setCharacters(prev => prev.map(char => ({
          ...char,
          isSelected: char.id === firstAvailableCharacter.id
        })));
      }
    }
  };

  const closeSMSModal = () => {
    // Implementation for closing SMS modal
  };

  // Check if all required fields are filled for Save button
  const canSaveNotification = () => {
    return details.trim() !== '' && 
           startDate !== null && 
           time.trim() !== '' && 
           (selectedCharacterId !== null || sendWithoutAI); // Allow saving when AI-free is selected
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.characterSlots}>
          {characters.map((character) => {
            const showProfileIcon = sendWithoutAI;
            const isSelected = !sendWithoutAI && character.isSelected && !character.isEmpty;
            
            return (
            <TouchableOpacity
              key={character.id}
              style={styles.characterSlot}
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
                character.isEmpty && styles.characterNameEmpty,
                isSelected && styles.characterNameSelected,
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
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  characterSlots: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  characterSlot: {
    alignItems: 'center',
  },
  characterAvatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  emptyCharacterSlot: {
    backgroundColor: '#e5e5e5',
    borderColor: '#ccc',
    borderStyle: 'dashed',
  },
  selectedCharacterAvatar: {
    borderColor: '#007AFF',
  },
  characterAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  addCharacterText: {
    fontSize: 24,
    color: '#999',
    fontWeight: 'bold',
  },
  characterName: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  characterNameSelected: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  characterNameEmpty: {
    fontSize: 12,
    fontWeight: '400',
    color: '#9CA3AF',
  },
  aiFreeModeAvatar: {
    backgroundColor: '#374151',
    borderColor: '#4B5563',
    opacity: 0.6,
  },
  characterNameAIFree: {
    color: '#9CA3AF',
    fontWeight: '400',
  },
  aiCheckbox: {
    padding: 10,
  },
  aiCheckboxSection: {
    marginTop: 20,
  },
});