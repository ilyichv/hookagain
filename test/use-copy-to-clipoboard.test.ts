import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useCopyToClipboard } from "../registry/hooks/use-copy-to-clipboard";

describe("useCopyToClipboard", () => {
	const originalClipboard = { ...global.navigator.clipboard };
	const mockWriteText = vi.fn(() => Promise.resolve());

	beforeEach(() => {
		vi.useFakeTimers();
		// Mock clipboard API
		Object.defineProperty(navigator, "clipboard", {
			value: { writeText: mockWriteText },
			writable: true,
		});
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.clearAllMocks();
		// Restore clipboard API
		Object.defineProperty(navigator, "clipboard", {
			value: originalClipboard,
			writable: true,
		});
	});

	it("should copy text to clipboard and set isCopied to true", async () => {
		const { result } = renderHook(() => useCopyToClipboard());

		await act(async () => {
			result.current.copyToClipboard("test text");
		});

		expect(mockWriteText).toHaveBeenCalledWith("test text");
		expect(result.current.isCopied).toBe(true);
	});

	it("should reset isCopied after timeout", async () => {
		const { result } = renderHook(() => useCopyToClipboard({ timeout: 1000 }));

		await act(async () => {
			result.current.copyToClipboard("test text");
		});

		expect(result.current.isCopied).toBe(true);

		act(() => {
			vi.advanceTimersByTime(1000);
		});

		expect(result.current.isCopied).toBe(false);
	});

	it("should call onCopy callback when text is copied", async () => {
		const onCopy = vi.fn();
		const { result } = renderHook(() => useCopyToClipboard({ onCopy }));

		await act(async () => {
			result.current.copyToClipboard("test text");
		});

		expect(onCopy).toHaveBeenCalledWith("test text");
	});

	it("should not copy empty text", async () => {
		const { result } = renderHook(() => useCopyToClipboard());

		await act(async () => {
			result.current.copyToClipboard("");
		});

		expect(mockWriteText).not.toHaveBeenCalled();
		expect(result.current.isCopied).toBe(false);
	});

	it("should handle clipboard API errors", async () => {
		const consoleError = vi
			.spyOn(console, "error")
			.mockImplementation(() => {});
		const mockWriteTextError = vi.fn(() =>
			Promise.reject(new Error("Clipboard error")),
		);

		Object.defineProperty(navigator, "clipboard", {
			value: { writeText: mockWriteTextError },
			writable: true,
		});

		const { result } = renderHook(() => useCopyToClipboard());

		await act(async () => {
			result.current.copyToClipboard("test text");
		});

		expect(mockWriteTextError).toHaveBeenCalledWith("test text");
		expect(result.current.isCopied).toBe(false);
		expect(consoleError).toHaveBeenCalled();

		consoleError.mockRestore();
	});
});
