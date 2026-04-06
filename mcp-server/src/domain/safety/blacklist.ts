import { normalizeCommandForComparison } from '@/domain/commands';

export class BlacklistSafety {
  private readonly blacklistSet: Set<string>;

  public constructor(blacklist: string[]) {
    this.blacklistSet = new Set(blacklist.map((item) => normalizeCommandForComparison(item)));
  }

  public isBlocked(command: string): boolean {
    return this.blacklistSet.has(normalizeCommandForComparison(command));
  }
}
