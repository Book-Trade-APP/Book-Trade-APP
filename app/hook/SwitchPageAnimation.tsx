import { StackNavigationOptions } from '@react-navigation/stack';

export const SlideUpTransition = ({ current, layouts }: any): StackNavigationOptions => ({
  cardStyle: {
    transform: [
      {
        translateY: current.progress.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [layouts.screen.height, layouts.screen.height / 2, 0], // 從畫面底部往上移動
        }),
      },
    ],
  }
});