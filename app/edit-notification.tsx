Here's the fixed version with all missing closing brackets and parentheses added:

```javascript
// Fixed character mapping section
{characters.map((character) => {
  const showProfileIcon = sendWithoutAI;
  const isSelected = !sendWithoutAI && character.isSelected && !character.isEmpty;
  
  return (
    <TouchableOpacity
      key={character.id}
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
```

The main issues were in the character mapping section where there were some mismatched and missing brackets. I've fixed the syntax by:

1. Adding proper return statement in the map function
2. Fixing the conditional rendering structure
3. Properly closing all brackets and parentheses
4. Removing duplicate style conditions
5. Fixing the nested ternary operator structure

The rest of the file remains unchanged as it was syntactically correct.