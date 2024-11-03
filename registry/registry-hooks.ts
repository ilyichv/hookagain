import type { Registry } from "./schema";

export const hooks: Registry = [
	{
		name: "use-copy-to-clipboard",
		type: "registry:hook",
		description: "A hook that allows you to copy text to the clipboard.",
		files: ["hooks/use-copy-to-clipboard.ts"],
	},
	{
		name: "use-debounced-callback",
		type: "registry:hook",
		description: "A hook that debounces a callback.",
		files: ["hooks/use-debounced-callback.ts"],
	},
	{
		name: "use-interval",
		type: "registry:hook",
		description: "A hook that runs a callback at a given interval.",
		files: ["hooks/use-interval.ts"],
	},
	{
		name: "use-debounced-value",
		type: "registry:hook",
		description: "A hook that debounces a value.",
		files: ["hooks/use-debounced-value.ts"],
	},
	{
		name: "use-intersection-observer",
		type: "registry:hook",
		description: "A hook that provides an intersection observer.",
		files: ["hooks/use-intersection-observer.ts"],
	},
	{
		name: "use-local-storage",
		type: "registry:hook",
		description:
			"A hook that allows you to store and retrieve values from local storage.",
		files: ["hooks/use-local-storage.ts"],
	},
	{
		name: "use-media-query",
		type: "registry:hook",
		description:
			"A hook that provides a way to detect if a media query matches the current viewport.",
		files: ["hooks/use-media-query.ts"],
	},
];
