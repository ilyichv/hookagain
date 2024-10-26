import * as React from "react";

export function useDebouncedCallback<T extends (...args: any[]) => any>(
	callback: T,
	delay = 500,
) {
	const timeoutRef = React.useRef<NodeJS.Timeout>();

	return React.useCallback(
		(...args: Parameters<T>) => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}

			timeoutRef.current = setTimeout(() => {
				callback(...args);
			}, delay);
		},
		[callback, delay],
	);
}
