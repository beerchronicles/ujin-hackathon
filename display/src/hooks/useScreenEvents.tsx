import { useEffect, useState } from "react";
  import { Client } from "@stomp/stompjs";

  export type ScreenNotification = {
    eventId: number | null;
    eventType: string;
    aggregateType: string;
    aggregateId: string;
    payload: unknown;
    createdAt: string;
  };

  const BACKEND_WS_URL = "wss://fantastic-dollop-q9rg56wjq7525q4-8080.app.github.dev/ws";

  export function useScreenEvents(screenId: number) {
    const [events, setEvents] = useState<ScreenNotification[]>([]);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        console.log("Start")
      const client = new Client({
        brokerURL: BACKEND_WS_URL,
        reconnectDelay: 3000,

        onConnect: () => {
            console.log("Connect")
          setConnected(true);

          // Первичное состояние: backend отдаст список текущих событий.
          client.subscribe(`/app/screens/${screenId}/events`, (message) => {
            const currentEvents = JSON.parse(message.body) as ScreenNotification[];
            setEvents(currentEvents);
          });

          // Live updates: сюда backend пушит изменения шаблона/новостей.
          client.subscribe(`/topic/screens/${screenId}/events`, (message) => {
            const event = JSON.parse(message.body) as ScreenNotification;
            setEvents((prev) => {
            if (event.eventId !== null && prev.some((e) => e.eventId === event.eventId)) {
              return prev;
            }

            return [...prev, event];
          });
          });
        },

        onDisconnect: () => {
        console.log("No")
          setConnected(false);
        },

        onStompError: (frame) => {
          console.error("STOMP error:", frame.headers.message, frame.body);
        },
      });

      client.activate();

      return () => {
        void client.deactivate();
      };
    }, [screenId]);

    return { events, connected };
  }