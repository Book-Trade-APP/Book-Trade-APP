import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

export function useHideTabBar() {
  const navigation = useNavigation();
  const [tabBarHidden, setTabBarHidden] = useState(false);

  useEffect(() => {
    const parentNavigation = navigation.getParent();
    if (parentNavigation) {
      parentNavigation.setOptions({
        tabBarStyle: { display: 'none' },
      });
      
      // Confirm tab bar is hidden
      setTabBarHidden(true);
    }

    return () => {
      if (parentNavigation) {
        parentNavigation.setOptions({
          tabBarStyle: undefined, // Restore to default style
        });
        setTabBarHidden(false);
      }
    };
  }, [navigation]);

  return tabBarHidden;
}