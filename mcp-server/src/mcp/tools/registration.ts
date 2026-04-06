import { CommandBlockedError, CommandDiscoveryService, CommandExecutionService, CommandNotFoundError } from "@/domain/commands";
import { BackendUnavailableError, formatErrorBodyPreview, MalformedResponseError, RequestFailedError, UnsupportedEndpointError } from "@/infrastructure/hotkeyless-ahk";
import { logError, logInfo } from "@/infrastructure/logging";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import * as z from 'zod/v3';


function toErrorResult(error: unknown): { isError: boolean; content: Array<{ type: 'text'; text: string }> } {
  if (error instanceof CommandBlockedError) {
    return {
      isError: true,
      content: [
        {
          type: 'text',
          text: `Blocked by safety policy: command "${error.command}" is blacklisted.`,
        },
      ],
    };
  }

  if (error instanceof CommandNotFoundError) {
    return {
      isError: true,
      content: [
        {
          type: 'text',
          text: `Unknown command "${error.command}". Run discover_commands first to refresh available commands.`,
        },
      ],
    };
  }

  if (error instanceof UnsupportedEndpointError) {
    return {
      isError: true,
      content: [
        {
          type: 'text',
          text: `Unsupported operation: backend does not expose endpoint ${error.endpoint}.`,
        },
      ],
    };
  }

  if (error instanceof BackendUnavailableError) {
    return {
      isError: true,
      content: [
        {
          type: 'text',
          text: `Hotkeyless AHK backend unavailable: ${error.message}`,
        },
      ],
    };
  }

  if (error instanceof MalformedResponseError) {
    return {
      isError: true,
      content: [
        {
          type: 'text',
          text: `Hotkeyless AHK backend returned malformed data: ${error.message}`,
        },
      ],
    };
  }

  if (error instanceof RequestFailedError) {
    return {
      isError: true,
      content: [
        {
          type: 'text',
          text: `Hotkeyless AHK backend request failed (HTTP ${error.status}): ${formatErrorBodyPreview(error.responseBody)}`,
        },
      ],
    };
  }

  return {
    isError: true,
    content: [
      {
        type: 'text',
        text: `Unexpected error: ${error instanceof Error ? error.message : String(error)}`,
      },
    ],
  };
}

export function registerTools(
  server: McpServer,
  discoveryService: CommandDiscoveryService,
  executionService: CommandExecutionService,
): void {
  server.registerTool(
    'discover_commands',
    {
      description: 'Fetch available Hotkeyless commands from /list.',
      inputSchema: {
        refresh: z
          .boolean()
          .optional()
          .describe('Set true to bypass cache and force a fresh /list request.'),
      },
    },
    async ({ refresh }) => {
      logInfo('tool.discover_commands.start', {
        refresh: refresh ?? false,
      });

      try {
        const commands = await discoveryService.getCommands(refresh ?? false);
        logInfo('tool.discover_commands.success', {
          refresh: refresh ?? false,
          count: commands.length,
        });

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  count: commands.length,
                  commands,
                },
                null,
                2,
              ),
            },
          ],
        };
      } catch (error) {
        logError('tool.discover_commands.failure', error, {
          refresh: refresh ?? false,
        });
        return toErrorResult(error);
      }
    },
  );

  server.registerTool(
    'trigger_command',
    {
      description:
        'Trigger one Hotkeyless command by exact name using /trigger. Enforces blacklist and verifies command exists.',
      inputSchema: {
        command: z
          .string()
          .trim()
          .min(1)
          .describe('Exact command name returned by discover_commands.'),
      },
    },
    async ({ command }) => {
      logInfo('tool.trigger_command.start', {
        command,
      });

      try {
        const result = await executionService.trigger(command);
        logInfo('tool.trigger_command.success', {
          command,
          status: result.status,
        });

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  status: result.status,
                  ok: true,
                  response: result.body,
                },
                null,
                2,
              ),
            },
          ],
        };
      } catch (error) {
        logError('tool.trigger_command.failure', error, {
          command,
        });
        return toErrorResult(error);
      }
    },
  );

  server.registerTool(
    'send_keys',
    {
      description:
        'Send keystrokes through optional /send_keys endpoint. Returns clear error when endpoint is unsupported.',
      inputSchema: {
        keys: z.string().min(1).max(1000).describe('Key sequence to send.'),
      },
    },
    async ({ keys }) => {
      logInfo('tool.send_keys.start', {
        keysLength: keys.length,
      });

      try {
        const result = await executionService.sendKeys({
          keys,
        });

        logInfo('tool.send_keys.success', {
          keysLength: keys.length,
          status: result.status,
        });

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  status: result.status,
                  ok: true,
                  response: result.body,
                },
                null,
                2,
              ),
            },
          ],
        };
      } catch (error) {
        logError('tool.send_keys.failure', error, {
          keysLength: keys.length,
        });
        return toErrorResult(error);
      }
    },
  );

  server.registerTool(
    'mouse_move',
    {
      description:
        'Move mouse cursor via optional /mouse_move endpoint. Returns clear error when endpoint is unsupported.',
      inputSchema: {
        x: z.number().int().nonnegative().describe('Target X coordinate.'),
        y: z.number().int().nonnegative().describe('Target Y coordinate.'),
      },
    },
    async ({ x, y }) => {
      logInfo('tool.mouse_move.start', {
        x,
        y,
      });

      try {
        const result = await executionService.mouseMove({
          x,
          y,
        });

        logInfo('tool.mouse_move.success', {
          x,
          y,
          status: result.status,
        });

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  status: result.status,
                  ok: true,
                  response: result.body,
                },
                null,
                2,
              ),
            },
          ],
        };
      } catch (error) {
        logError('tool.mouse_move.failure', error, {
          x,
          y,
        });
        return toErrorResult(error);
      }
    },
  );
}
