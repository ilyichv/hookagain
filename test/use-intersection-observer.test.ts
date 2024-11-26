import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useIntersectionObserver } from "../registry/hooks/use-intersection-observer";

describe("useIntersectionObserver", () => {
	const mockObserve = vi.fn();
	const mockDisconnect = vi.fn();
	const mockIntersectionObserver = vi.fn(() => ({
		observe: mockObserve,
		disconnect: mockDisconnect,
	}));

	beforeEach(() => {
		// Mock IntersectionObserver
		vi.stubGlobal("IntersectionObserver", mockIntersectionObserver);
		// Clear mocks before each test
		mockObserve.mockClear();
		mockDisconnect.mockClear();
		mockIntersectionObserver.mockClear();
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("should initialize with undefined entry", () => {
		const elementRef = { current: document.createElement("div") };
		const { result } = renderHook(() =>
			useIntersectionObserver(elementRef, {}),
		);

		expect(result.current).toBeUndefined();
	});

	it("should create IntersectionObserver with correct params", () => {
		const elementRef = { current: document.createElement("div") };
		const options = {
			threshold: 0.5,
			rootMargin: "10px",
			root: document.createElement("div"),
		};

		renderHook(() => useIntersectionObserver(elementRef, options));

		expect(mockIntersectionObserver).toHaveBeenCalledWith(
			expect.any(Function),
			options,
		);
		expect(mockObserve).toHaveBeenCalledWith(elementRef.current);
	});

	it("should not create IntersectionObserver if element ref is null", () => {
		const elementRef = { current: null };

		renderHook(() => useIntersectionObserver(elementRef, {}));

		expect(mockIntersectionObserver).not.toHaveBeenCalled();
		expect(mockObserve).not.toHaveBeenCalled();
	});

	it("should disconnect observer on unmount", () => {
		const elementRef = { current: document.createElement("div") };

		const { unmount } = renderHook(() =>
			useIntersectionObserver(elementRef, {}),
		);

		unmount();

		expect(mockDisconnect).toHaveBeenCalled();
	});

	it("should handle window.IntersectionObserver not being available", () => {
		vi.unstubAllGlobals(); // Remove the mock to simulate unsupported environment
		const elementRef = { current: document.createElement("div") };

		const { result } = renderHook(() =>
			useIntersectionObserver(elementRef, {}),
		);

		expect(result.current).toBeUndefined();
		expect(mockIntersectionObserver).not.toHaveBeenCalled();
		expect(mockObserve).not.toHaveBeenCalled();
	});
});
