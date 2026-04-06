import { TtlCache } from "@/infrastructure/cache";
import { Config } from "@/infrastructure/config";
import { HotkeylessAhkClient } from "@/infrastructure/hotkeyless-ahk";
import { HotkeylessAhkCommand } from "@/types";


const COMMAND_CACHE_KEY = 'commands';

export class CommandDiscoveryService {
  private readonly cache = new TtlCache<string, HotkeylessAhkCommand[]>();

  public constructor(
    private readonly client: HotkeylessAhkClient,
    private readonly config: Config,
  ) {}

  public async getCommands(forceRefresh = false): Promise<HotkeylessAhkCommand[]> {
    if (!forceRefresh) {
      const cached = this.cache.get(COMMAND_CACHE_KEY);
      if (cached) {
        return cached;
      }
    }

    const commands = await this.client.listCommands();
    this.cache.set(COMMAND_CACHE_KEY, commands, this.config.cache.ttlMs);
    return commands;
  }

  public invalidateCache(): void {
    this.cache.delete(COMMAND_CACHE_KEY);
  }
}
