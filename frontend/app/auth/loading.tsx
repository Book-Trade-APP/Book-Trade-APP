import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, ActivityIndicator } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { AuthStackParamList } from '../navigation/type';

export default function LoadingScreen() {
    const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        //setData();
        setTimeout(() => {
            navigation.navigate('Login');
            setIsLoading(false);
        }, 2000);
      }, []);
    return(
        <View style={styles.container}>
            <Image source={require('../../assets/Book-trade-icon.jpg')} style={styles.logo} />
            {isLoading && (
                <ActivityIndicator size="large" color="#0000ff" />
            )}
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 200,
        height: 200,
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