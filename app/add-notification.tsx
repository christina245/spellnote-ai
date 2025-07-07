import { ArrowLeft, Calendar, Clock } from 'lucide-react-native';
import { User } from 'lucide-react-native';
import { useFonts, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import Svg, { Circle, Path } from 'react-native-svg';

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
  aiCheckboxSection: