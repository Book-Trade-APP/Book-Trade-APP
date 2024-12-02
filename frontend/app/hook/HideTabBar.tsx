import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

export function useHideTabBar() {
  const navigation = useNavigation();

  useEffect(() => {
    const parentNavigation = navigation.getParent();
    if (parentNavigation) {
      parentNavigation.setOptions({
        tabBarStyle: { display: 'none' },
      });
    }

    return () => {
      if (parentNavigation) {
        parentNavigation.setOptions({
          tabBarStyle: undefined, // 恢復為預設樣式
        });
      }
    };
  }, [navigation]);
}