import { renderHook } from "@testing-library/react";
import { Socket } from "phoenix";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { usePhoenixSocket } from "../registry/hooks/use-phoenix-socket";

// Mock Phoenix Socket
vi.mock("phoenix", () => ({
	Socket: vi.fn(() => ({
		connect: vi.fn(),
		disconnect: vi.fn(),
	})),
}));

describe("usePhoenixSocket", () => {
	const TEST_URL = "ws://localhost:4000/socket";

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should create and connect to a socket with the provided URL", () => {
		const { result } = renderHook(() => usePhoenixSocket(TEST_URL));

		expect(Socket).toHaveBeenCalledWith(TEST_URL);
		expect(result.current).toBeTruthy();
		expect(result.current?.connect).toHaveBeenCalled();
	});

	it("should disconnect socket on unmount", () => {
		const { unmount } = renderHook(() => usePhoenixSocket(TEST_URL));

		unmount();

		const mockSocket = (Socket as unknown as vi.Mock).mock.results[0].value;
		expect(mockSocket.disconnect).toHaveBeenCalled();
	});

	it("should recreate socket when URL changes", () => {
		const NEW_URL = "ws://localhost:4000/socket2";
		const { rerender } = renderHook(({ url }) => usePhoenixSocket(url), {
			initialProps: { url: TEST_URL },
		});

		// First render should create initial socket
		expect(Socket).toHaveBeenCalledWith(TEST_URL);

		// Rerender with new URL
		rerender({ url: NEW_URL });

		// Should disconnect old socket and create new one
		const firstSocket = (Socket as unknown as vi.Mock).mock.results[0].value;
		expect(firstSocket.disconnect).toHaveBeenCalled();
		expect(Socket).toHaveBeenCalledWith(NEW_URL);
	});
});
