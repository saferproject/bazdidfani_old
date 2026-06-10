// hooks/useWebSocket.ts
import { useEffect, useRef, useState, useCallback } from "react";

interface UseWebSocketOptions {
	reconnectInterval?: number;
	maxReconnectAttempts?: number;
	onOpen?: () => void;
	onClose?: () => void;
	onError?: (error: Event) => void;
}

interface UseWebSocketReturn<T> {
	isConnected: boolean;
	lastMessage: T | null;
	sendMessage: (message: any) => void;
	reconnect: () => void;
	disconnect: () => void;
}

export const useWebSocket = <T = any>(url: string, options: UseWebSocketOptions = {}): UseWebSocketReturn<T> => {
	const { reconnectInterval = 3000, maxReconnectAttempts = 5, onOpen, onClose, onError } = options;

	const [isConnected, setIsConnected] = useState<boolean>(false);
	const [lastMessage, setLastMessage] = useState<T | null>(null);

	const ws = useRef<WebSocket | null>(null);
	const reconnectCount = useRef<number>(0);
	const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);

	const connect = useCallback(() => {
		try {
			// Create WebSocket connection
			ws.current = new WebSocket(url);

			ws.current.onopen = () => {
				console.log("WebSocket Connected");
				setIsConnected(true);
				reconnectCount.current = 0;
				onOpen?.();
			};

			ws.current.onmessage = (event: MessageEvent) => {
				try {
					const data: T = JSON.parse(event.data);
					setLastMessage(data);
				} catch (error) {
					console.error("Failed to parse WebSocket message:", error);
				}
			};

			ws.current.onerror = (error: Event) => {
				console.error("WebSocket Error:", error);
				onError?.(error);
			};

			ws.current.onclose = () => {
				console.log("WebSocket Disconnected");
				setIsConnected(false);
				onClose?.();

				// Auto reconnect
				if (reconnectCount.current < maxReconnectAttempts) {
					reconnectTimeout.current = setTimeout(() => {
						reconnectCount.current++;
						console.log(`Reconnecting... Attempt ${reconnectCount.current}`);
						connect();
					}, reconnectInterval);
				} else {
					console.log("Max reconnection attempts reached");
				}
			};
		} catch (error) {
			console.error("Failed to create WebSocket connection:", error);
		}
	}, [url, reconnectInterval, maxReconnectAttempts, onOpen, onClose, onError]);

	useEffect(() => {
		connect();

		// Cleanup on unmount
		return () => {
			if (reconnectTimeout.current) {
				clearTimeout(reconnectTimeout.current);
			}
			if (ws.current) {
				ws.current.close();
			}
		};
	}, [connect]);

	const sendMessage = useCallback((message: any) => {
		if (ws.current && ws.current.readyState === WebSocket.OPEN) {
			try {
				ws.current.send(JSON.stringify(message));
			} catch (error) {
				console.error("Failed to send WebSocket message:", error);
			}
		} else {
			console.warn("WebSocket is not connected");
		}
	}, []);

	const reconnect = useCallback(() => {
		if (ws.current) {
			ws.current.close();
		}
		reconnectCount.current = 0;
		connect();
	}, [connect]);

	const disconnect = useCallback(() => {
		if (reconnectTimeout.current) {
			clearTimeout(reconnectTimeout.current);
		}
		reconnectCount.current = maxReconnectAttempts; // Prevent auto-reconnect
		if (ws.current) {
			ws.current.close();
		}
	}, [maxReconnectAttempts]);

	return {
		isConnected,
		lastMessage,
		sendMessage,
		reconnect,
		disconnect,
	};
};
