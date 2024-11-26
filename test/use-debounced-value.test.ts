import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useDebouncedValue } from "../registry/hooks/use-debounced-value";

describe("useDebouncedValue", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("should return initial value immediately", () => {
		const { result } = renderHook(() => useDebouncedValue("initial"));
		expect(result.current).toBe("initial");
	});

	it("should debounce value updates", () => {
		const { result, rerender } = renderHook(
			({ value }) => useDebouncedValue(value),
			{ initialProps: { value: "initial" } },
		);

		// Update the value
		rerender({ value: "updated" });

		// Value should not change immediately
		expect(result.current).toBe("initial");

		// Fast forward past the default delay (500ms)
		act(() => {
			vi.advanceTimersByTime(500);
		});

		// Value should be updated now
		expect(result.current).toBe("updated");
	});

	it("should respect custom delay", () => {
		const { result, rerender } = renderHook(
			({ value }) => useDebouncedValue(value, 1000),
			{ initialProps: { value: "initial" } },
		);

		rerender({ value: "updated" });

		// Value should not change after default delay
		act(() => {
			vi.advanceTimersByTime(500);
		});
		expect(result.current).toBe("initial");

		// Value should change after custom delay
		act(() => {
			vi.advanceTimersByTime(500); // Total 1000ms
		});
		expect(result.current).toBe("updated");
	});

	it("should cancel previous timeout on new updates", () => {
		const { result, rerender } = renderHook(
			({ value }) => useDebouncedValue(value),
			{ initialProps: { value: "initial" } },
		);

		rerender({ value: "first update" });

		// Advance timer partially
		act(() => {
			vi.advanceTimersByTime(250);
		});

		// Update again before first update is applied
		rerender({ value: "second update" });

		// Advance to just after first update would have occurred
		act(() => {
			vi.advanceTimersByTime(250);
		});

		// Should still show initial value
		expect(result.current).toBe("initial");

		// Advance timer to complete second update
		act(() => {
			vi.advanceTimersByTime(250);
		});

		// Should show second update
		expect(result.current).toBe("second update");
	});

	it("should clean up timeout on unmount", () => {
		const { result, rerender, unmount } = renderHook(
			({ value }) => useDebouncedValue(value),
			{ initialProps: { value: "initial" } },
		);

		rerender({ value: "updated" });

		// Unmount before timeout completes
		unmount();

		// Advance timers
		act(() => {
			vi.advanceTimersByTime(500);
		});

		// Value should remain unchanged
		expect(result.current).toBe("initial");
	});
});
