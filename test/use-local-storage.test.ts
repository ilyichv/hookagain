import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useLocalStorage } from "../registry/hooks/use-local-storage";

describe("useLocalStorage", () => {
	const key = "test-key";
	const initialValue = { test: "value" };

	// Mock localStorage
	const localStorageMock = (() => {
		let store: Record<string, string> = {};
		return {
			getItem: vi.fn((key: string) => store[key] || null),
			setItem: vi.fn((key: string, value: string) => {
				store[key] = value;
			}),
			clear: vi.fn(() => {
				store = {};
			}),
		};
	})();

	// Mock window.addEventListener
	const addEventListenerMock = vi.fn();
	const removeEventListenerMock = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		Object.defineProperty(window, "localStorage", { value: localStorageMock });
		window.addEventListener = addEventListenerMock;
		window.removeEventListener = removeEventListenerMock;
	});

	it("should initialize with the initial value when localStorage is empty", () => {
		const { result } = renderHook(() => useLocalStorage(key, initialValue));
		expect(result.current[0]).toEqual(initialValue);
	});

	it("should initialize with the value from localStorage if it exists", () => {
		const existingValue = { test: "existing" };
		localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(existingValue));

		const { result } = renderHook(() => useLocalStorage(key, initialValue));
		expect(result.current[0]).toEqual(existingValue);
	});

	it("should update the value and localStorage when setValue is called", () => {
		const { result } = renderHook(() => useLocalStorage(key, initialValue));
		const newValue = { test: "new value" };

		act(() => {
			result.current[1](newValue);
		});

		expect(result.current[0]).toEqual(newValue);
		expect(localStorageMock.setItem).toHaveBeenCalledWith(
			key,
			JSON.stringify(newValue),
		);
	});

	it("should clean up event listener on unmount", () => {
		const { unmount } = renderHook(() => useLocalStorage(key, initialValue));

		unmount();

		expect(removeEventListenerMock).toHaveBeenCalledWith(
			"storage",
			expect.any(Function),
		);
	});
});
