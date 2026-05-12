import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let stompClient = null;

// ================= BASE CONNECT =================
export const connectSocketBase = () => {
    if (stompClient && stompClient.active) {
        return stompClient;
    }

    const token = localStorage.getItem("token");

    stompClient = new Client({
        webSocketFactory: () => new SockJS("http://localhost:8080/ws"),

        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,

        connectHeaders: {
            Authorization: `Bearer ${token}`, // 🔥 IMPORTANT
        },

        onConnect: () => {
            console.log("✅ WebSocket Connected");
        },

        onStompError: (frame) => {
            console.error("STOMP ERROR:", frame);
        },

        onWebSocketError: (err) => {
            console.error("WS ERROR:", err);
        },

        onDisconnect: () => {
            console.log("❌ WebSocket Disconnected");
        },
    });

    stompClient.activate();
    return stompClient;
};

// ================= CHAT SOCKET =================
export const subscribeChat = (chatId, onMessage) => {
  const client = connectSocketBase();

  let subscription = null;

  const waitForConnect = setInterval(() => {
      if (client.connected) {
          clearInterval(waitForConnect);

          subscription = client.subscribe(
              `/topic/messages/${chatId}`,
              (msg) => {
                  try {
                      onMessage(JSON.parse(msg.body));
                  } catch {
                      onMessage(msg.body);
                  }
              }
          );
      }
  }, 100);

  return () => {
      clearInterval(waitForConnect);
      if (subscription) subscription.unsubscribe();
  };
};

// ================= STATUS SOCKET =================
export const subscribeStatus = (onStatus) => {
  const client = connectSocketBase();

  let subscription = null;

  const waitForConnect = setInterval(() => {
      if (client.connected) {
          clearInterval(waitForConnect);

          subscription = client.subscribe("/topic/status", (msg) => {
              onStatus((msg.body));
          });
      }
  }, 100);

  return () => {
      clearInterval(waitForConnect);
      if (subscription) subscription.unsubscribe();
  };
};

// ================= DISCONNECT =================
export const disconnectSocket = () => {
    if (stompClient) {
        stompClient.deactivate();
        stompClient = null;
    }
};