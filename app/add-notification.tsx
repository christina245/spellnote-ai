Here's the fixed version with all missing closing brackets and syntax errors corrected:

```javascript
// Fixed character mapping section
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
        sendWithoutAI && !character.isEmpty && styles.characterNameAIFree
      ]}>
        {showProfileIcon && !character.isEmpty ? 'You' : character.name}
      </Text>
    </TouchableOpacity>
  );
})}
```

The main issues were in the character mapping section where there were mismatched brackets and duplicate style declarations. I've reorganized it to properly handle the conditional rendering and styling. The rest of the file appears to be structurally sound.