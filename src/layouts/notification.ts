import { useEffect } from "react";

const useNotification = () => {
	useEffect(() => {
		let pusher: any;
		let channel: any;
		let isMounted = true;

		import("pusher-js").then(({ default: Pusher }) => {
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

			channel = pusher.subscribe("users.all");
			channel.bind("notification.sent", function (data: any) {
				console.info("socket data: ", data);
			});
		});

		return () => {
			isMounted = false;
			channel?.unbind("notification.sent");
			pusher?.unsubscribe("users.all");
		};
	}, []);

	return null;
};

export default useNotification;
