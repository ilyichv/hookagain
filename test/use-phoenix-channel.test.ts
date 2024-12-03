import { renderHook } from "@testing-library/react";
import type { Channel, Socket } from "phoenix";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { usePhoenixChannel } from "../registry/hooks/use-phoenix-channel";

describe("usePhoenixChannel", () => {
	let mockSocket: Socket;
	let mockChannel: Channel;

	beforeEach(() => {
		// Mock channel methods
		mockChannel = {
			on: vi.fn(),
			join: vi.fn(() => ({
				receive: vi.fn((event, callback) => {
					if (event === "ok") callback();
					return mockChannel;
				}),
			})),
			leave: vi.fn(),
		} as unknown as Channel;

		// Mock socket methods
		mockSocket = {
			channel: vi.fn(() => mockChannel),
		} as unknown as Socket;
	});

	it("should create a channel with the given name and payload", () => {
		const channelName = "test:channel";
		const payload = { user_id: 123 };
		const callbacks = { test: vi.fn() };

		renderHook(() =>
			usePhoenixChannel(mockSocket, channelName, payload, callbacks),
		);

		expect(mockSocket.channel).toHaveBeenCalledWith(channelName, { payload });
	});

	it("should register callbacks on the channel", () => {
		const callbacks = {
			event1: vi.fn(),
			event2: vi.fn(),
		};

		renderHook(() =>
			usePhoenixChannel(mockSocket, "test:channel", undefined, callbacks),
		);

		expect(mockChannel.on).toHaveBeenCalledWith("event1", callbacks.event1);
		expect(mockChannel.on).toHaveBeenCalledWith("event2", callbacks.event2);
	});

	it("should not create a channel if socket is null", () => {
		const callbacks = { test: vi.fn() };

		renderHook(() =>
			usePhoenixChannel(null, "test:channel", undefined, callbacks),
		);

		expect(mockSocket.channel).not.toHaveBeenCalled();
	});

	it("should leave the channel on unmount", () => {
		const { unmount } = renderHook(() =>
			usePhoenixChannel(mockSocket, "test:channel", undefined, {
				test: vi.fn(),
			}),
		);

		unmount();

		expect(mockChannel.leave).toHaveBeenCalled();
	});

	it("should set channel state after successful join", () => {
		const { result } = renderHook(() =>
			usePhoenixChannel(mockSocket, "test:channel", undefined, {
				test: vi.fn(),
			}),
		);

		expect(result.current).toBe(mockChannel);
	});
});
