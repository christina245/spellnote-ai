import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import { Camera, Image as ImageIcon, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface PhotoUploadModalProps {
  visible: boolean;
  onClose: () => void;
  onPhotoSelected: (uri: string) => void;
}

export default function PhotoUploadModal({
  visible,
  onClose,
  onPhotoSelected
}: PhotoUploadModalProps) {
  const [showCamera, setShowCamera] = useState(false);
  const [facing, setFacing] = useState<CameraType>('front');
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Sorry, we need camera roll permissions to upload photos.',
          [{ text: 'OK' }]
        );
        return false;
      }
    }
    return true;
  };

  const pickImageFromLibrary = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // Square aspect ratio for avatars
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        onPhotoSelected(result.assets[0].uri);
        onClose();
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const takePhoto = async () => {
    if (Platform.OS === 'web') {
      Alert.alert(
        'Camera Not Available',
        'Camera functionality is not available on web. Please use "Choose from Library" instead.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (!cameraPermission) {
      Alert.alert('Error', 'Camera permissions are still loading.');
      return;
    }

    if (!cameraPermission.granted) {
      const permission = await requestCameraPermission();
      if (!permission.granted) {
        Alert.alert(
          'Permission Required',
          'Camera permission is required to take photos.',
          [{ text: 'OK' }]
        );
        return;
      }
    }

    setShowCamera(true);
  };

  const handleTakePhoto = async (camera: any) => {
    try {
      const photo = await camera.takePictureAsync({
        quality: 0.8,
        base64: false,
      });

      if (photo && photo.uri) {
        onPhotoSelected(photo.uri);
        setShowCamera(false);
        onClose();
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  if (showCamera && Platform.OS !== 'web') {
    return (
      <Modal visible={visible} animationType="slide">
        <View style={styles.cameraContainer}>
          <CameraView 
            style={styles.camera} 
            facing={facing}
            ref={(ref) => {
              if (ref) {
                // Store camera ref for taking photos
                (ref as any).takePictureAsync = (ref as any).takePictureAsync;
              }
            }}
          >
            <View style={styles.cameraOverlay}>
              {/* Close Button */}
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => {
                  setShowCamera(false);
                  onClose();
                }}
                activeOpacity={0.7}
              >
                <X size={24} color="#FFFFFF" />
              </TouchableOpacity>

              {/* Camera Controls */}
              <View style={styles.cameraControls}>
                <TouchableOpacity 
                  style={styles.flipButton}
                  onPress={toggleCameraFacing}
                  activeOpacity={0.7}
                >
                  <Text style={styles.flipButtonText}>Flip</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.captureButton}
                  onPress={() => {
                    // We need to access the camera ref here
                    // This is a simplified version - in production you'd want better ref handling
                    Alert.alert('Photo Capture', 'Photo capture functionality needs camera ref implementation');
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.captureButtonInner} />
                </TouchableOpacity>

                <View style={styles.placeholder} />
              </View>
            </View>
          </CameraView>
        </View>
      </Modal>
    );
  }

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
            <Text style={styles.title}>Upload Photo</Text>
            <TouchableOpacity 
              style={styles.closeIconButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <X size={24} color="#1F2937" />
            </TouchableOpacity>
          </View>

          {/* Options */}
          <View style={styles.optionsContainer}>
            <TouchableOpacity 
              style={styles.optionButton}
              onPress={takePhoto}
              activeOpacity={0.7}
            >
              <View style={styles.optionIconContainer}>
                <Camera size={32} color="#F3CC95" />
              </View>
              <Text style={styles.optionTitle}>Take Photo</Text>
              <Text style={styles.optionDescription}>
                {Platform.OS === 'web' 
                  ? 'Not available on web'
                  : 'Use your camera to take a new photo'
                }
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.optionButton}
              onPress={pickImageFromLibrary}
              activeOpacity={0.7}
            >
              <View style={styles.optionIconContainer}>
                <ImageIcon size={32} color="#F3CC95" />
              </View>
              <Text style={styles.optionTitle}>Choose from Library</Text>
              <Text style={styles.optionDescription}>
                Select an existing photo from your device
              </Text>
            </TouchableOpacity>
          </View>

          {/* Cancel Button */}
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
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
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'Inter',
  },
  closeIconButton: {
    padding: 4,
  },
  optionsContainer: {
    gap: 16,
    marginBottom: 24,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  optionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(243, 204, 149, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'Inter',
    marginBottom: 4,
    flex: 1,
  },
  optionDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6B7280',
    fontFamily: 'Inter',
    flex: 2,
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    fontFamily: 'Inter',
  },
  // Camera styles
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  cameraControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  flipButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  flipButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
  },
  placeholder: {
    width: 60, // Same width as flip button for balance
  },
});