export class BackendUnavailableError extends Error {
  public constructor(message: string, public readonly causeError?: unknown) {
    super(message);
    this.name = 'BackendUnavailableError';
  }
}

const ERROR_BODY_PREVIEW_MAX_LENGTH = 200;

export function formatErrorBodyPreview(responseBody: string, maxLength = ERROR_BODY_PREVIEW_MAX_LENGTH): string {
  const sanitized = responseBody
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (sanitized.length === 0) {
    return 'empty';
  }

  const truncated = sanitized.length > maxLength;
  const preview = truncated ? sanitized.slice(0, maxLength) : sanitized;
  const suffix = truncated ? '…' : '';

  return `${preview}${suffix} (sanitized, ${sanitized.length} chars)`;
}

export class MalformedResponseError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = 'MalformedResponseError';
  }
}

export class RequestFailedError extends Error {
  public constructor(
    message: string,
    public readonly status: number,
    public readonly responseBody: string,
  ) {
    super(message);
    this.name = 'RequestFailedError';
  }
}

export class UnsupportedEndpointError extends Error {
  public constructor(message: string, public readonly endpoint: string) {
    super(message);
    this.name = 'UnsupportedEndpointError';
  }
}
