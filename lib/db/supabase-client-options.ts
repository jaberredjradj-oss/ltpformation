/**
 * Stub WebSocket for Node.js runtimes without native WebSocket (e.g. Node 20).
 * Prevents RealtimeClient from throwing during Supabase client construction.
 * Realtime is not used by this app.
 */
export class NoOpWebSocket {
  static readonly CONNECTING = 0;
  static readonly OPEN = 1;
  static readonly CLOSING = 2;
  static readonly CLOSED = 3;

  readonly CONNECTING = 0;
  readonly OPEN = 1;
  readonly CLOSING = 2;
  readonly CLOSED = 3;
  readonly readyState = NoOpWebSocket.CLOSED;
  readonly protocol = "";
  readonly url: string;

  onopen: ((this: WebSocket, ev: Event) => unknown) | null = null;
  onmessage: ((this: WebSocket, ev: MessageEvent) => unknown) | null = null;
  onclose: ((this: WebSocket, ev: CloseEvent) => unknown) | null = null;
  onerror: ((this: WebSocket, ev: Event) => unknown) | null = null;

  constructor(url: string | URL) {
    this.url = String(url);
  }

  close(): void {}
  send(): void {}
  addEventListener(): void {}
  removeEventListener(): void {}
}

export const SUPABASE_NO_REALTIME_OPTIONS = {
  realtime: {
    transport: NoOpWebSocket,
  },
} as const;

export const SUPABASE_SERVER_CLIENT_OPTIONS = {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
  ...SUPABASE_NO_REALTIME_OPTIONS,
} as const;
