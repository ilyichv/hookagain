import type { Channel, Socket } from "phoenix";
import { useEffect, useState } from "react";

export function usePhoenixChannel(
	socket: Socket | null,
	topic: string,
	payload?: Record<string, unknown>,
	callbacks?: Record<string, (payload: any) => void>,
) {
	const [channel, setChannel] = useState<Channel | null>(null);

	useEffect(() => {
		if (!socket) return;

		const phoenixChannel = socket.channel(topic, {
			payload,
		});

		if (callbacks) {
			// register callbacks
			Object.entries(callbacks).forEach(([event, callback]) => {
				phoenixChannel.on(event, callback);
			});
		}

		phoenixChannel.join().receive("ok", () => {
			setChannel(phoenixChannel);
		});

		return () => {
			phoenixChannel.leave();
		};
	}, [socket, topic]);

	return channel;
}
