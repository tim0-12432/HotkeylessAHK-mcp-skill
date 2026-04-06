import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio';
import { CommandDiscoveryService, CommandExecutionService } from '@/domain/commands';
import { BlacklistSafety } from '@/domain/safety';
import { loadConfig } from '@/infrastructure/config';
import { HotkeylessAhkClient } from '@/infrastructure/hotkeyless-ahk';
import { logError, logInfo } from '@/infrastructure/logging';
import { registerResources } from '@/mcp/resources';
import { registerTools } from '@/mcp/tools';

async function main(): Promise<void> {
  logInfo('server.startup.begin');

  const config = loadConfig();

  const server = new McpServer({
    name: 'hotkeyless-ahk-mcp-server',
    version: '1.0.0',
  });

  const hotkeylessClient = new HotkeylessAhkClient(config);
  const discoveryService = new CommandDiscoveryService(hotkeylessClient, config);
  const safety = new BlacklistSafety(config.blacklist);
  const executionService = new CommandExecutionService(
    hotkeylessClient,
    discoveryService,
    safety,
  );

  registerTools(server, discoveryService, executionService);
  registerResources(server, discoveryService);

  const transport = new StdioServerTransport();
  await server.connect(transport);

  logInfo('server.startup.success', {
    baseUrl: config.baseUrl,
  });
}

main().catch((error: unknown) => {
  logError('server.startup.failure', error);
  process.exit(1);
});
