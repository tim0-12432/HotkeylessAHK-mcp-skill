# Hotkeyless AHK MCP and Skills

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![AHK Version](https://img.shields.io/badge/AHK%20Version-v2-green)](https://www.autohotkey.com/docs/v2/)
[![MCP](https://img.shields.io/badge/MCP%20Version-1.29.0-purple)](https://github.com/modelcontextprotocol/typescript-sdk)
[![Claude Support](https://img.shields.io/badge/Claude-D97757?logo=Claude&logoColor=white)](https://code.claude.com/docs/en/skills)
[![OpenCode Support](https://img.shields.io/badge/OpenCode-0A0A23)](https://opencode.ai/docs/skills/)
[![Github Copilot Support](https://img.shields.io/badge/GitHub%20Copilot-8957E5?logo=github-copilot)](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills)

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
  - [Hotkeyless AHK API contract](#hotkeyless-ahk-api-contract)
  - [Configuration](#configuration)
2. [Agent skills](#agent-skills)
  - [Quick start](#quick-start-1)

---

## MCP server

### Quick start

#### OpenCode

**`opencode.json`:**
```json
{
  ...
  "mcp": {
    ...
    "hotkeyless-ahk": {
      "type": "local",
      "command": ["npx", "@tim0_12432/hotkeyless-ahk-mcp-server"],
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

#### ClaudeCode

**`.mcp.json`:**
```json
{
  "mcpServers": {
    ...
    "hotkeyless-ahk": {
      "command": "npx",
      "args": ["@tim0_12432/hotkeyless-ahk-mcp-server"],
      "env": {
        "BLACKLIST": "shutdown,restart,kill"
        ...
      }
    }
  }
}
```

#### Github Copilot

**`mcp-config.json`:**
```json
{
  ...
  "mcpServers": {
    ...
    "hotkeyless-ahk": {
      "type": "local",
      "command": "npx",
      "args": ["@tim0_12432/hotkeyless-ahk-mcp-server"],
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

### Build from source

<details>
<summary>Follow instructions here.</summary>

#### 1. Build server

```bash
bun install
bun run build
```

`npm` should also work without problems!

#### 2. Setup your harness

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

</details>

### Hotkeyless AHK API contract

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

#### OpenCode

1. Copy the `./skills/.opencode/...` folders to
  - `.opencode/skills` for project specific skill setup
  - `%USERPROFILE%/.config/opencode/skills` for global setup
2. You can adjust AGENTS.md, custom subagents or custom commands to reference the skills
3. Restart your OpenCode (CLI or Desktop)
4. When asking the agent to use the "hotkeyless AHK skills" it should now use the skill guide

#### ClaudeCode

1. Copy the `./skills/.claude/...` folders to
  - `.claude/skills` for project specific skill setup
  - `%USERPROFILE%/.config/claude-code/skills` for global setup
2. You can adjust CLAUDE.md, custom subagents or custom commands to reference the skills
3. Restart your Claude Code
4. When asking the agent to use the "hotkeyless AHK skills" it should now use the skill guide

#### Github Copilot

1. Copy the `./skills/.claude/...` folders to
  - `.claude/skills` for project specific skill setup
  - `%USERPROFILE%/.config/claude-code/skills` for global setup
2. You can adjust AGENTS.md, custom subagents or custom commands to reference the skills
3. Restart your Claude Code
4. When asking the agent to use the "hotkeyless AHK skills" it should now use the skill guide

---

## License

[MIT](./LICENSE.md)
