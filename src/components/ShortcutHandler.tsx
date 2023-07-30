// credit to https://devtrium.com/posts/how-keyboard-shortcut for the handler code

import { useCallback, useRef, useLayoutEffect, useEffect } from 'react';

function matchKeyCombo(keys: string[], event: KeyboardEvent) {
  if ((keys.includes("Ctrl") && !event.ctrlKey) ||
      (keys.includes("Alt") && !event.altKey) || 
      (keys.includes("Shift") && !event.shiftKey)) {
    return false;
  }
  return keys.some((key) => event.key.toUpperCase() === key.toUpperCase());
} 

export function useKeyPress(keys: string[], callback: (event: KeyboardEvent) => void): void {
  // implement the callback ref pattern
  const callbackRef = useRef(callback);
  useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  // handle what happens on key press
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (matchKeyCombo(keys, event)) {
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