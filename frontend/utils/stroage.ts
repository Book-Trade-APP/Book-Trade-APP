import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveUserId = async (_id: string) => {
    try {
      await AsyncStorage.setItem('user_id', _id);
      console.log(`User ${_id} Login.`);
    } catch (error) {
      console.log('Failed to save user ID:', error);
    }
};

export const getUserId = async () => {
    try {
      const userId = await AsyncStorage.getItem('user_id');
      return userId !== null ? userId : null;
    } catch (error) {
      console.log('Failed to retrieve user ID:', error);
      return null;
    }
};

export const clearUserData = async () => {
  try {
    const user = await getUserId()
    console.log(`User ${user} Logout.`)
    await AsyncStorage.removeItem('user_id');
    return true;
    //console.log('User data cleared successfully!');
  } catch (error) {
    console.log('Failed to clear user data:', error);
    return false;
  }
};