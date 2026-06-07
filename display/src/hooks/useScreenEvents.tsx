import { useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';

export type ScreenNotification = {
  eventId: number | null;
  eventType: string;
  aggregateType: string;
  aggregateId: string;
  payload: unknown;
  createdAt: string;
};

const BACKEND_WS_URL =
  import.meta.env.VITE_BACKEND_WS_URL ??
  'wss://fantastic-dollop-q9rg56wjq7525q4-8080.app.github.dev/ws';

export function useScreenEvents(screenId: number, enabled = true) {
  const [events, setEvents] = useState<ScreenNotification[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!enabled) {
      queueMicrotask(() => {
        setEvents([]);
        setConnected(false);
      });
      return;
    }

    const client = new Client({
      brokerURL: BACKEND_WS_URL,
      reconnectDelay: 3000,

      onConnect: () => {
        setConnected(true);

        client.subscribe(`/app/screens/${screenId}/events`, (message) => {
          const currentEvents = JSON.parse(message.body) as ScreenNotification[];
          setEvents(currentEvents);
        });

        client.subscribe(`/topic/screens/${screenId}/events`, (message) => {
          const event = JSON.parse(message.body) as ScreenNotification;
          setEvents((prev) => {
            if (event.eventId !== null && prev.some((item) => item.eventId === event.eventId)) {
              return prev;
            }

            return [...prev, event];
          });
        });
      },

      onDisconnect: () => {
        setConnected(false);
      },

      onStompError: (frame) => {
        console.error('STOMP error:', frame.headers.message, frame.body);
      },
    });

    client.activate();

    return () => {
      void client.deactivate();
    };
  }, [enabled, screenId]);

  return { events, connected };
}
