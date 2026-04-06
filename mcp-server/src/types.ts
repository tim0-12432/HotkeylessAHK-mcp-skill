export interface HotkeylessAhkCommand {
  command: string;
  note: string;
}

export interface TriggerRequest {
  command: string;
  params?: Record<string, unknown>;
}

export interface SendKeysRequest {
  keys: string;
}

export interface MouseMoveRequest {
  x: number;
  y: number;
}

export interface EndpointActionResult {
  status: number;
  body: unknown;
  rawBody: string;
}
