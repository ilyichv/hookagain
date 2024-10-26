import * as React from "react";

export function useDebouncedValue<T>(value: T, delay = 500) {
	const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

	React.useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(timer);
		};
	}, [value, delay]);

	return debouncedValue;
}
