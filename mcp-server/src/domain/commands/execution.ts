import { EndpointActionResult, MouseMoveRequest, SendKeysRequest } from "@/types";
import { CommandBlockedError, CommandNotFoundError } from "./errors";
import { BlacklistSafety } from "@/domain/safety";
import { CommandDiscoveryService } from "./discovery";
import { HotkeylessAhkClient } from "@/infrastructure/hotkeyless-ahk";
import { normalizeCommandForComparison } from "./normalization";


export class CommandExecutionService {
  public constructor(
    private readonly client: HotkeylessAhkClient,
    private readonly discoveryService: CommandDiscoveryService,
    private readonly safety: BlacklistSafety,
  ) {}

  public async trigger(command: string): Promise<EndpointActionResult> {
    if (this.safety.isBlocked(command)) {
      throw new CommandBlockedError(command);
    }

    const availableCommands = await this.discoveryService.getCommands();
    const normalizedInput = normalizeCommandForComparison(command);
    const matchedCommand = availableCommands.find(
      (entry) => normalizeCommandForComparison(entry.command) === normalizedInput,
    );
    if (!matchedCommand) {
      throw new CommandNotFoundError(command);
    }

    return this.client.triggerCommand({ command: matchedCommand.command });
  }

  public async sendKeys(input: SendKeysRequest): Promise<EndpointActionResult> {
    return this.client.sendKeys(input);
  }

  public async mouseMove(input: MouseMoveRequest): Promise<EndpointActionResult> {
    return this.client.mouseMove(input);
  }
}
