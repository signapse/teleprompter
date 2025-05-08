import { useEffect } from 'react';
import { Keyboard } from 'react-native';

// Define types for the callback functions
type FootPedalListenerProps = {
    onLeftPedalPress?: () => void;
    onRightPedalPress?: () => void;
};

// Custom hook for foot pedal listener
export default function useFootPedalListener({ onLeftPedalPress, onRightPedalPress }: FootPedalListenerProps) {
    useEffect(() => {
        const onKeyPress = (event: any) => {
            // Handle the left pedal (Page Down / Arrow Left)
            if (event.keyCode === 34 || event.keyCode === 37) {
                onLeftPedalPress && onLeftPedalPress();
            }

            // Handle the right pedal (Page Up / Arrow Right)
            if (event.keyCode === 33 || event.keyCode === 39) {
                onRightPedalPress && onRightPedalPress();
            }
        };

        const subscription = Keyboard.addListener('keyboardDidShow', onKeyPress);

        return () => {
            subscription.remove();
        };
    }, [onLeftPedalPress, onRightPedalPress]);
};
