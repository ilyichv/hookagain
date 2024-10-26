"use client";

import * as React from "react";

type SetValue<T> = T | ((prevValue: T) => T);

export function useLocalStorage<T>(
	key: string,
	initialValue: T,
): [T, (value: SetValue<T>) => void] {
	const readValue = React.useCallback((): T => {
		if (typeof window === "undefined") {
			return initialValue;
		}

		try {
			const item = window.localStorage.getItem(key);
			return item ? (JSON.parse(item) as T) : initialValue;
		} catch (error) {
			console.warn(`Error reading localStorage key "${key}":`, error);
			return initialValue;
		}
	}, [key, initialValue]);

	const [storedValue, setStoredValue] = React.useState<T>(readValue);

	const setValue = React.useCallback(
		(value: SetValue<T>) => {
			try {
				const valueToStore =
					value instanceof Function ? value(storedValue) : value;

				setStoredValue(valueToStore);

				if (typeof window !== "undefined") {
					window.localStorage.setItem(key, JSON.stringify(valueToStore));
				}
			} catch (error) {
				console.warn(`Error setting localStorage key "${key}":`, error);
			}
		},
		[key, storedValue],
	);

	React.useEffect(() => {
		const handleStorageChange = (e: StorageEvent) => {
			if (e.key === key && e.newValue !== null) {
				try {
					setStoredValue(JSON.parse(e.newValue));
				} catch {
					setStoredValue(readValue());
				}
			}
		};

		window.addEventListener("storage", handleStorageChange);

		setStoredValue(readValue());

		return () => {
			window.removeEventListener("storage", handleStorageChange);
		};
	}, [key, readValue]);

	return [storedValue, setValue];
}
