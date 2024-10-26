import { useState } from "react";

export function useCopyToClipboard({
	timeout = 2000,
	onCopy,
}: {
	timeout?: number;
	onCopy?: (text: string) => void;
} = {}) {
	const [isCopied, setIsCopied] = useState(false);

	const copyToClipboard = (value: string) => {
		if (typeof window === "undefined" || !navigator.clipboard.writeText) {
			return;
		}

		if (!value) return;

		navigator.clipboard.writeText(value).then(() => {
			setIsCopied(true);
			onCopy?.(value);
			setTimeout(() => {
				setIsCopied(false);
			}, timeout);
		}, console.error);
	};

	return { isCopied, copyToClipboard };
}
