import { View, Text, StyleSheet } from 'react-native';
import { useHideTabBar } from '../../hook/HideTabBar';
import React from 'react';
export default function SellerScreen() {
    useHideTabBar();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>賣東西</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});