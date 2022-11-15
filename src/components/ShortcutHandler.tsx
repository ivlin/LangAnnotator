// credit to https://devtrium.com/posts/how-keyboard-shortcut for the handler code

import { useCallback, useRef, useLayoutEffect, useEffect } from 'react';

export function useKeyPress(keys: string[], callback: (event: KeyboardEvent) => void): void {
  // implement the callback ref pattern
  const callbackRef = useRef(callback);
  useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  // handle what happens on key press
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      // check if one of the key is part of the ones we want
      if (keys.some((key) => event.key === key)) {
        callbackRef.current(event);
      }
    },
    [keys]
  );

  useEffect(() => {
    // attach the event listener
    document.addEventListener("keydown", handleKeyPress);
    // remove the event listener
    return () =>
      document.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);
};