import { ArrowLeft, Calendar, Clock } from 'lucide-react-native';
import { User } from 'lucide-react-native';
import { useFonts, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import Svg, { Circle, Path } from 'react-native-svg';

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
  };

  // Check if all required fields are filled for Save button
  const canSaveNotification = () => {
    return details.trim() !== '' && 
           startDate !== null && 
           time.trim() !== '' && 
           (selectedCharacterId !== null || sendWithoutAI); // Allow saving when AI-free is selected
  };

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
  aiCheckboxSection: {
  }