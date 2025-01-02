import React, { useState, useEffect } from 'react';
import { View, Image, ActivityIndicator } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { AuthStackParamList } from '../navigation/type';
import { styles } from '../tabs/styles/loading';

export default function LoadingScreen() {
    const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        //setData();
        setTimeout(() => {
            navigation.navigate('Login');
            setIsLoading(false);
        }, 1500);
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