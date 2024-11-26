import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useMediaQuery } from "../registry/hooks/use-media-query";

describe("useMediaQuery", () => {
	let matchMedia: any;

	beforeEach(() => {
		// Mock matchMedia
		matchMedia = vi.spyOn(window, "matchMedia");
	});

	afterEach(() => {
		matchMedia.mockRestore();
	});

	it("should return initial matches value", () => {
		const mockMediaQueryList = {
			matches: true,
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
		};

		matchMedia.mockReturnValue(mockMediaQueryList);

		const { result } = renderHook(() => useMediaQuery("(min-width: 768px)"));

		expect(result.current).toBe(true);
	});

	it("should cleanup event listener on unmount", () => {
		const mockMediaQueryList = {
			matches: true,
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
		};

		matchMedia.mockReturnValue(mockMediaQueryList);

		const { unmount } = renderHook(() => useMediaQuery("(min-width: 768px)"));

		unmount();

		expect(mockMediaQueryList.removeEventListener).toHaveBeenCalledWith(
			"change",
			expect.any(Function),
		);
	});

	it("should update when query changes", () => {
		const firstMediaQueryList = {
			matches: true,
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
		};

		const secondMediaQueryList = {
			matches: false,
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
		};

		matchMedia
			.mockReturnValueOnce(firstMediaQueryList)
			.mockReturnValueOnce(secondMediaQueryList);

		const { result, rerender } = renderHook((query) => useMediaQuery(query), {
			initialProps: "(min-width: 768px)",
		});

		expect(result.current).toBe(true);

		// Change the query
		rerender("(min-width: 1024px)");

		expect(firstMediaQueryList.removeEventListener).toHaveBeenCalled();
		expect(secondMediaQueryList.addEventListener).toHaveBeenCalled();
		expect(result.current).toBe(false);
	});
});
