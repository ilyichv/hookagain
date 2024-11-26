import * as React from "react";

export function useLocalStorage<T>(
	key: string,
	initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void] {
	const parseJSON = (value: string | null) => {
		try {
			return value ? JSON.parse(value) : null;
		} catch (error) {
			console.warn("Failed to parse localStorage value", error);
			return null;
		}
	};

	const [storedValue, setStoredValue] = React.useState<T>(() => {
		const item = window.localStorage.getItem(key);
		return item !== null ? (parseJSON(item) ?? initialValue) : initialValue;
	});

	const setValue = React.useCallback(
		(value: T | ((prev: T) => T)) => {
			setStoredValue((prev) => {
				const newValue = value instanceof Function ? value(prev) : value;
				window.localStorage.setItem(key, JSON.stringify(newValue));
				return newValue;
			});
		},
		[key],
	);

	React.useEffect(() => {
		const handleStorageChange = (event: StorageEvent) => {
			if (event.key === key) {
				setStoredValue(
					event.newValue
						? (parseJSON(event.newValue) ?? initialValue)
						: initialValue,
				);
			}
		};

		window.addEventListener("storage", handleStorageChange);
		return () => {
			window.removeEventListener("storage", handleStorageChange);
		};
	}, [key, initialValue]);

	return [storedValue, setValue];
}
