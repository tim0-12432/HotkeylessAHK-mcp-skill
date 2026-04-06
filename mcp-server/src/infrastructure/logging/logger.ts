type LogLevel = 'info' | 'error';

type LogFields = Record<string, unknown>;

function writeStructuredLog(level: LogLevel, event: string, fields?: LogFields): void {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    event,
    ...(fields ?? {}),
  };

  process.stderr.write(`${JSON.stringify(logEntry)}\n`);
}

export function logInfo(event: string, fields?: LogFields): void {
  writeStructuredLog('info', event, fields);
}

export function logError(event: string, error: unknown, fields?: LogFields): void {
  const errorFields: LogFields = {
    ...(fields ?? {}),
    errorMessage: error instanceof Error ? error.message : String(error),
  };

  if (error instanceof Error && error.stack) {
    errorFields.errorStack = error.stack;
  }

  writeStructuredLog('error', event, errorFields);
}
