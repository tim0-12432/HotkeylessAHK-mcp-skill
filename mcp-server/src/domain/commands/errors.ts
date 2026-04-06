

export class CommandBlockedError extends Error {
  public constructor(public readonly command: string) {
    super(`Command "${command}" is blocked by safety blacklist.`);
    this.name = 'CommandBlockedError';
  }
}

export class CommandNotFoundError extends Error {
  public constructor(public readonly command: string) {
    super(`Command "${command}" was not found in /list.`);
    this.name = 'CommandNotFoundError';
  }
}
