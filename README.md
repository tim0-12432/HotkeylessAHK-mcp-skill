# Hotkeyless AHK MCP and Skills

This repository provides:

- A TypeScript MCP server that wraps the [Hotkeyless AHK](https://github.com/sebinside/HotkeylessAHK) HTTP API.
- Reusable skill documents for OpenCode, Claude, and generic agent runtimes.
- Practical examples for desktop automation scenarios.

## Workspace layout

```text
packages/
  mcp-server/   # Node MCP server package
  skills/       # Agent skill documents
examples/       # End-to-end usage examples
```

---

1. [MCP server](#mcp-server)
  - [Quick start](#quick-start)
  - [Hotkeyless API contract used](#hotkeyless-api-contract-used)
  - [Configuration](#configuration)
  - [Run MCP server](#run-mcp-server)
2. [Agent skills](#agent-skills)
  - [Quick start](#quick-start-1)

---

## MCP server

### Quick start

#### Build server

```bash
bun install
bun run build
```

`npm` should also work without problems!

#### Setup your harness

##### OpenCode

**`opencode.json`:**
```json
{
  ...
  "mcp": {
    ...
    "hotkeyless-ahk": {
      "type": "local",
      "command": ["node", "<absolute path to the built files>/mcp-server/dist/index.js"],
      "enabled": true,
      "environment": {
          "BLACKLIST": "shutdown,restart,kill"
          ...
      }
    }
  },
  ...
}
```

##### ClaudeCode

**`.mcp.json`:**
```json
{
  "mcpServers": {
    ...
    "hotkeyless-ahk": {
      "command": "node",
      "args": ["<absolute path to the built files>/mcp-server/dist/index.js"],
      "env": {
        "BLACKLIST": "shutdown,restart,kill"
        ...
      }
    }
  }
}
```

##### Github Copilot

**`mcp-config.json`:**
```json
{
  ...
  "mcpServers": {
    ...
    "hotkeyless-ahk": {
      "type": "local",
      "command": "node",
      "args": ["<absolute path to the built files>/mcp-server/dist/index.js"],
      "env": {
        "BLACKLIST": "shutdown,restart,kill"
          ...
      },
      "tools": ["*"]
    }
  },
  ...
}
```

### Hotkeyless AHK API contract used

- `GET /list` returns JSON array of `{ command: string, note: string }`
- `GET /send/<command>` accepts query parameters

### Configuration

Default config is at `mcp-server/dist/infrastructure/config/config.ts`.

Environment overrides:

|Parameter override|What it does|Default|
|---|---|---|
|BASE_URL|Adress of the Hotkeyless AHK server|`http://localhost:42800`|
|TIMEOUT_MS|Timeout milliseconds for each request|4000|
|BLACKLIST|A list of commands to avoid being called|[]|
|CACHE_TTL_MS|Cache lifetime for command list in milliseconds|5000|
|ENDPOINT_LIST|Endpoint address of the command list|`/list`|
|ENDPOINT_TRIGGER|Endpoint address for invoking commands|`/send`|

## Agent Skills

### Quick start

