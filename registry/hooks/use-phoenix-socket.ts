import { Socket } from "phoenix";
import { useEffect, useState } from "react";

export function usePhoenixSocket(url: string) {
	const [socket, setSocket] = useState<Socket | null>(null);

	useEffect(() => {
		const socket = new Socket(url);
		socket.connect();
		setSocket(socket);

		return () => {
			socket.disconnect();
		};
	}, [url]);

	return socket;
}
