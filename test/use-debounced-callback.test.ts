import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useDebouncedCallback } from "../registry/hooks/use-debounced-callback";

describe("useDebouncedCallback", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("should debounce the callback function", () => {
		const callback = vi.fn();
		const { result } = renderHook(() => useDebouncedCallback(callback, 500));

		// Call the debounced function multiple times
		act(() => {
			result.current();
			result.current();
			result.current();
		});

		// Callback should not be called immediately
		expect(callback).not.toHaveBeenCalled();

		// Fast forward time by 499ms
		act(() => {
			vi.advanceTimersByTime(499);
		});
		expect(callback).not.toHaveBeenCalled();

		// Fast forward the remaining time
		act(() => {
			vi.advanceTimersByTime(1);
		});
		expect(callback).toHaveBeenCalledTimes(1);
	});

	it("should pass arguments to the callback function", () => {
		const callback = vi.fn();
		const { result } = renderHook(() => useDebouncedCallback(callback, 500));

		const testArg1 = "test";
		const testArg2 = 123;

		// Call the debounced function with arguments
		act(() => {
			result.current(testArg1, testArg2);
		});

		// Fast forward time
		act(() => {
			vi.advanceTimersByTime(500);
		});

		expect(callback).toHaveBeenCalledWith(testArg1, testArg2);
	});
});
