import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useInterval } from "../registry/hooks/use-interval";

describe("useInterval", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("should call the callback at the specified interval", () => {
		const callback = vi.fn();
		renderHook(() => useInterval(callback, 100));

		// Initially, the callback should not be called
		expect(callback).not.toHaveBeenCalled();

		// Fast-forward 100ms
		vi.advanceTimersByTime(100);
		expect(callback).toHaveBeenCalledTimes(1);

		// Fast-forward another 100ms
		vi.advanceTimersByTime(100);
		expect(callback).toHaveBeenCalledTimes(2);
	});

	it("should not start the interval if delay is null", () => {
		const callback = vi.fn();
		renderHook(() => useInterval(callback, null));

		vi.advanceTimersByTime(1000);
		expect(callback).not.toHaveBeenCalled();
	});

	it("should clear the interval on unmount", () => {
		const callback = vi.fn();
		const { unmount } = renderHook(() => useInterval(callback, 100));

		vi.advanceTimersByTime(100);
		expect(callback).toHaveBeenCalledTimes(1);

		unmount();
		vi.advanceTimersByTime(100);
		expect(callback).toHaveBeenCalledTimes(1);
	});

	it("should handle delay changes", () => {
		const callback = vi.fn();
		const { rerender } = renderHook(
			({ delay }) => useInterval(callback, delay),
			{ initialProps: { delay: 100 } },
		);

		// First interval at 100ms
		vi.advanceTimersByTime(100);
		expect(callback).toHaveBeenCalledTimes(1);

		// Change delay to 200ms
		rerender({ delay: 200 });

		// Advance 100ms - should not call callback
		vi.advanceTimersByTime(100);
		expect(callback).toHaveBeenCalledTimes(1);

		// Advance another 100ms - should call callback
		vi.advanceTimersByTime(100);
		expect(callback).toHaveBeenCalledTimes(2);
	});

	it("should handle callback changes", () => {
		const callback1 = vi.fn();
		const callback2 = vi.fn();
		const { rerender } = renderHook(({ cb }) => useInterval(cb, 100), {
			initialProps: { cb: callback1 },
		});

		vi.advanceTimersByTime(100);
		expect(callback1).toHaveBeenCalledTimes(1);
		expect(callback2).not.toHaveBeenCalled();

		rerender({ cb: callback2 });

		vi.advanceTimersByTime(100);
		expect(callback1).toHaveBeenCalledTimes(1);
		expect(callback2).toHaveBeenCalledTimes(1);
	});
});
