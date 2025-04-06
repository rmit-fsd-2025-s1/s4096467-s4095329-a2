import { useState, useEffect, SetStateAction } from "react";

export function useIfLocalStorage<T>(key: string, initialValue: T): 
[T, (value: SetStateAction<T>) => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    // Arrow function to set a different initial value depending on what is in localStorage
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        return JSON.parse(item); // Sets the initial value to the one from localStorage if there is one
      }
      return initialValue; // If there isn't one in localStorage, set it to the input default value
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  // Get item from localStorage, if it is null, set it to the default value specified
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key); // Get the value
      // If it is null, set it
      if (item === null) {
        window.localStorage.setItem(key, JSON.stringify(initialValue));
      }
    } catch (error) {
      console.log(error);
    }
  }, [key, initialValue]);

  // Save to localStorage when the value changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.log(error);
    }
  }, [key, storedValue]);

  const setValue = (value: SetStateAction<T>) => {
    setStoredValue(value);
  };

  return [storedValue, setValue];
}
