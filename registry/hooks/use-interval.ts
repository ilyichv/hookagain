import * as React from "react";

export function useInterval(callback: () => void, delay: number | null) {
	const savedCallback = React.useRef(callback);

	React.useEffect(() => {
		savedCallback.current = callback;
	}, [callback]);

	React.useEffect(() => {
		if (delay === null) {
			return;
		}

		const id = setInterval(() => savedCallback.current(), delay);

		return () => {
			clearInterval(id);
		};
	}, [delay]);
}
