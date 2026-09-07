import { useEffect } from "react";
import type Pusher from "pusher-js";
import type { Channel } from "pusher-js";

const CHANNEL = "users.all";
const EVENT = "notification.sent";

const useNotification = () => {
	useEffect(() => {
		let pusher: Pusher | undefined;
		let channel: Channel | undefined;
		let isMounted = true;
		const onNotification = (data: unknown) => {
			if (isMounted) console.info("socket data: ", data);
		};

		void import("pusher-js").then(({ default: Pusher }) => {
			if (!isMounted) return;

			pusher = new Pusher("unnbu56wlbgizfubrdeg", {
				wsHost: "test-backend.bazdidfani.ir",
				wsPort: 9000,
				wssPort: 9000,
				forceTLS: false,
				disableStats: true,
				enabledTransports: ["ws", "wss"],
				cluster: "mt1",
			});

			channel = pusher.subscribe(CHANNEL);
			channel.bind(EVENT, onNotification);
		}).catch((error: unknown) => {
			pusher?.disconnect();
			if (isMounted) console.error("Could not initialize notifications", error);
		});

		return () => {
			isMounted = false;
			channel?.unbind(EVENT, onNotification);
			pusher?.unsubscribe(CHANNEL);
			pusher?.disconnect();
		};
	}, []);

	return null;
};

export default useNotification;
