import { useEffect } from "react";
import {
  findNodeHandle,
  TouchableWithoutFeedback,
  NativeModules,
} from "react-native";

function useOnClickOutside(ref: React.RefObject<any>, callback: () => void) {
  useEffect(() => {
    const handleTouchOutside = (event: any) => {
      if (ref.current) {
        const node = findNodeHandle(ref.current);
        if (node) {
          ref.current.measureInWindow((x, y, width, height) => {
            const { pageX: touchX, pageY: touchY } = event.nativeEvent;
            const isOutside =
              touchX < x ||
              touchX > x + width ||
              touchY < y ||
              touchY > y + height;

            if (isOutside) {
              callback(); // Trigger callback if touch is outside the element
            }
          });
        }
      }
    };

    // Attach event listener
    const subscription = TouchableWithoutFeedback.addEventListener(
      "press",
      handleTouchOutside
    );

    return () => {
      // Cleanup event listener
      subscription && subscription.remove();
    };
  }, [ref, callback]);
}

export default { useOnClickOutside };
