import * as React from "react";

interface UseIntersectionObserverProps {
	threshold?: number;
	root?: Element | null;
	rootMargin?: string;
}

export function useIntersectionObserver(
	elementRef: React.RefObject<Element>,
	{
		threshold = 0,
		root = null,
		rootMargin = "0%",
	}: UseIntersectionObserverProps,
): IntersectionObserverEntry | undefined {
	const [entry, setEntry] = React.useState<IntersectionObserverEntry>();

	const updateEntry = ([entry]: IntersectionObserverEntry[]): void => {
		setEntry(entry);
	};

	React.useEffect(() => {
		const node = elementRef.current;
		const isSupported = !!window.IntersectionObserver;

		if (!node || !isSupported) return;

		const params = { threshold, root, rootMargin };
		const observer = new IntersectionObserver(updateEntry, params);

		observer.observe(node);

		return () => observer.disconnect();
	}, [elementRef, threshold, root, rootMargin]);

	return entry;
}
