import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
const LoadingScreen:React.FC = ({}) => {
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        //setData();
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      }, []);
    return(
        <View style={styles.container}>
            <Image source={require('../assets/Chiikawa.jpg')} style={styles.logo} />
            <Text style={styles.title}>二手書交易平台</Text>
            {isLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <ActivityIndicator size="large" color="#0000ff" />
            )}
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 40,
    },
    message: {
        fontSize: 18,
        color: '#666',
    },
    button: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
})

export default LoadingScreen;