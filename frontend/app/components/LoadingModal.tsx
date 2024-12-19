import React from 'react';
import { Modal, View, ActivityIndicator, Text, StyleSheet } from 'react-native';

type LoadingModalProps = {
  isLoading: boolean;
  message: string;
}

export const LoadingModal: React.FC<LoadingModalProps> = ({ 
  isLoading, 
  message
}) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={isLoading}
      statusBarTranslucent={true}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ActivityIndicator 
            size="large" 
            color="#0000ff" 
            style={styles.spinner}
          />
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  spinner: {
    marginBottom: 15,
  },
  message: {
    color: '#333',
    fontSize: 16,
  }
});