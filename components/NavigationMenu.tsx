import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { User, Sparkles, Compass, FileText, CircleHelp as HelpCircle, MessageSquare, TriangleAlert as AlertTriangle, MessageCircle, LogOut } from 'lucide-react-native';
import { HeartCrack, Trophy } from 'lucide-react-native';

const { width: screenWidth } = Dimensions.get('window');

interface NavigationMenuProps {
  visible: boolean;
  onClose: () => void;
  onNavigate: (route: string) => void;
  userMode: 'character' | 'spellbot' | 'ai-free';
}

export default function NavigationMenu({ 
  visible, 
  onClose, 
  onNavigate, 
  userMode 
}: NavigationMenuProps) {
  
  const handleMenuItemPress = (route: string) => {
    onClose(); // Close menu first
    // Add a small delay to ensure menu closes before navigation
    setTimeout(() => {
      onNavigate(route);
    }, 100);
  };

  const menuItems = [
    {
      icon: User,
      label: 'Account',
      route: 'account',
    },
    {
      icon: Trophy,
      label: 'Goals',
      route: 'goals',
    },
    {
      icon: Sparkles,
      label: userMode === 'ai-free' ? 'Switch to AI Mode' : 'Switch to AI-Free',
      route: userMode === 'ai-free' ? 'switch-to-ai-mode' : 'switch-to-ai-free',
    },
    {
      icon: Compass,
      label: 'Browse characters',
      route: 'browse-characters',
    },
    {
      icon: HeartCrack,
      label: 'Resources',
      route: 'resources',
    },
    {
      icon: HelpCircle,
      label: 'Help center',
      route: 'help-center',
    },
    {
      icon: MessageSquare,
      label: 'Submit feedback',
      route: 'submit-feedback',
    },
    {
      icon: AlertTriangle,
      label: 'Report an issue',
      route: 'report-issue',
    },
    {
      icon: MessageCircle,
      label: 'Contact support',
      route: 'contact-support',
    },
    {
      icon: LogOut,
      label: 'Log out',
      route: 'logout',
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.menuContainer}>
            <TouchableOpacity 
              activeOpacity={1}
              onPress={(e) => e.stopPropagation()}
            >
              <View style={styles.menuContent}>
                {menuItems.map((item, index) => {
                  const IconComponent = item.icon;
                  const isLogout = item.route === 'logout';
                  const isSwitchMode = item.route === 'switch-to-ai-free' || item.route === 'switch-to-ai-mode';
                  
                  return (
                    <TouchableOpacity
                      key={item.route}
                      style={styles.menuItem}
                      onPress={() => handleMenuItemPress(item.route)}
                      activeOpacity={0.7}
                    >
                      <IconComponent 
                        size={20} 
                        color={
                          isLogout ? "#EF4444" : 
                          isSwitchMode ? "#F59E0B" : 
                          "#FFFFFF"
                        } 
                      />
                      <Text style={[
                        styles.menuItemText,
                        isLogout && styles.menuItemTextLogout,
                        isSwitchMode && styles.menuItemTextSwitch
                      ]}>
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  menuContainer: {
    marginTop: 100, // Position below header
    marginRight: 24, // 24px from right edge
    minWidth: Math.max(screenWidth * 0.6, 240), // Minimum 60% width, min 240px
    maxWidth: Math.min(screenWidth * 0.75, 320), // Maximum 75% width, max 320px
  },
  menuContent: {
    backgroundColor: 'rgba(28, 24, 48, 0.95)', // Semi-transparent dark background
    borderRadius: 16,
    paddingVertical: 8,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
    // Removed border
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 16, // 16px gap between icon and text for proper alignment
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#FFFFFF',
    fontFamily: 'Inter',
    flex: 1, // Take remaining space
  },
  menuItemTextLogout: {
    color: '#EF4444', // Red color for logout
  },
  menuItemTextSwitch: {
    color: '#F59E0B', // Amber color for switch mode
  },
});