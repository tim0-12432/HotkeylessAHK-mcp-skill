import { CommandDiscoveryService } from "@/domain/commands";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";


const COMMAND_RESOURCE_URI = 'hotkeyless://commands';

export function registerResources(
  server: McpServer,
  discoveryService: CommandDiscoveryService,
): void {
  server.registerResource(
    'hotkeyless-ahk-commands',
    COMMAND_RESOURCE_URI,
    {
      title: 'Hotkeyless AHK Available Commands',
      description:
        'Cached view of available command definitions returned by Hotkeyless /list endpoint.',
      mimeType: 'application/json',
    },
    async () => {
      try {
        const commands = await discoveryService.getCommands(false);
        return {
          contents: [
            {
              uri: COMMAND_RESOURCE_URI,
              mimeType: 'application/json',
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
        return {
          contents: [
            {
              uri: COMMAND_RESOURCE_URI,
              mimeType: 'application/json',
              text: JSON.stringify(
                {
                  error: true,
                  message: error instanceof Error ? error.message : String(error),
                },
                null,
                2,
              ),
            },
          ],
        };
      }
    },
  );
}
