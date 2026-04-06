import { Config } from "@/infrastructure/config";
import { BackendUnavailableError, MalformedResponseError, RequestFailedError } from "./errors";
import { EndpointActionResult, HotkeylessAhkCommand, MouseMoveRequest, SendKeysRequest, TriggerRequest } from "@/types";


function withLeadingSlash(path: string): string {
  if (path.startsWith('/')) {
    return path;
  }

  return `/${path}`;
}

async function parseResponse(response: Response): Promise<{ body: unknown; rawBody: string }> {
  const rawBody = await response.text();

  if (rawBody.trim() === '') {
    return {
      body: null,
      rawBody,
    };
  }

  try {
    return {
      body: JSON.parse(rawBody) as unknown,
      rawBody,
    };
  } catch {
    return {
      body: rawBody,
      rawBody,
    };
  }
}

export class HotkeylessAhkClient {
  public constructor(private readonly config: Config) {}

  private buildUrl(path: string): URL {
    const normalizedPath = withLeadingSlash(path);
    return new URL(normalizedPath, this.config.baseUrl);
  }

  private async requestJson(
    path: string,
    init: RequestInit,
  ): Promise<{ status: number; body: unknown; rawBody: string }> {
    const abortController = new AbortController();
    const timeout = setTimeout(() => {
      abortController.abort();
    }, this.config.timeoutMs);

    try {
      const response = await fetch(this.buildUrl(path), {
        ...init,
        signal: abortController.signal,
      });

      const parsed = await parseResponse(response);

      if (!response.ok) {
        throw new RequestFailedError(
          `Hotkeyless API request failed with status ${response.status}.`,
          response.status,
          parsed.rawBody,
        );
      }

      return {
        status: response.status,
        body: parsed.body,
        rawBody: parsed.rawBody,
      };
    } catch (error) {
      if (error instanceof RequestFailedError) {
        throw error;
      }

      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new BackendUnavailableError(
        `Could not reach Hotkeyless backend at ${this.config.baseUrl}: ${errorMessage}`,
        error,
      );
    } finally {
      clearTimeout(timeout);
    }
  }

  public async listCommands(): Promise<HotkeylessAhkCommand[]> {
    const response = await this.requestJson(this.config.endpoints.list, {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    });
    if (!response.body || response.body instanceof Array === false) {
      throw new MalformedResponseError(
        `Hotkeyless /list response is malformed: ${response.rawBody}`,
      );
    }
    return response.body as HotkeylessAhkCommand[];
  }

  public async triggerCommand(payload: TriggerRequest): Promise<EndpointActionResult> {
    return this.requestJson(`${this.config.endpoints.trigger}${this.buildUrl(payload.command)}`, {
      method: 'GET',
      body: JSON.stringify(payload.params ?? {}),
    });
  }

  private async tryOptionalEndpoint(
    payload: unknown,
    endpointName: string,
  ): Promise<EndpointActionResult> {
    const obj: TriggerRequest = {
        command: endpointName,
        params: payload as Record<string, unknown>,
    }
    return this.triggerCommand(obj);
  }

  public async sendKeys(payload: SendKeysRequest): Promise<EndpointActionResult> {
    return this.tryOptionalEndpoint(payload, 'send_keys');
  }

  public async mouseMove(payload: MouseMoveRequest): Promise<EndpointActionResult> {
    return this.tryOptionalEndpoint(payload, 'mouse_move');
  }
}
