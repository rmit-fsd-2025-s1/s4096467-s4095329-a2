import { useState, useEffect, SetStateAction } from "react";

export function useLocalStorage<T>(key: string, initialValue: T): 
[T, (value: SetStateAction<T>) => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.log(error);
    }
  }, [key]);

  // Save to localStorage when value changes
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
