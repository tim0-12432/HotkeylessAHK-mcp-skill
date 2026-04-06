---
name: hotkeyless-ahk-invoke
description: Invoke desktop automation commands on the user's Windows machine via the Hotkeyless AHK HTTP server. Use when the user asks to open programs, press hotkeys, move the mouse, control media, or perform any desktop action. Requires discovering commands first using the hotkeyless-ahk-discovering skill.
---

# Hotkeyless AHK – Invoke Commands

Send commands to the Hotkeyless AHK HTTP server to control the user's desktop.

## Prerequisites

You must know the available commands before invoking anything. If you haven't already, use the `hotkeyless-ahk-discovering` skill first:

```bash
curl -s http://localhost:42800/list
```

Only invoke commands that appear in the `/list` response.

## Invoking a command

### Without parameters

```bash
curl -s http://localhost:42800/send/<command>
```

Example:

```bash
curl -s http://localhost:42800/send/OpenBrowser
```

### With parameters

Pass parameters as query string values separated by `?`:

```bash
curl -s http://localhost:42800/send/<command>?param1?param2
```

Example:

```bash
curl -s http://localhost:42800/send/MoveMouse?500?300
```

> **Note:** Parameters are separated by `?`, not `&`. This is specific to Hotkeyless AHK.

## Response handling

| Response    | Meaning                                      | Action                        |
|-------------|----------------------------------------------|-------------------------------|
| `success`   | Command was forwarded to AHK                | Confirm to user               |
| `failure`   | No AHK subscriber or command not found       | Check if AHK script is running|

If you receive `failure`:
1. Tell the user the AHK subscriber may not be running
2. Suggest they check that the Hotkeyless AHK AutoHotkey script is active
3. Do not retry more than once

## Configuration

- **Default URL:** `http://localhost:42800`
- The user may specify a different host or port

## Rules

- **Never guess command names.** Only use commands from `/list`.
- **Never invoke `kill`** unless the user explicitly asks to shut down the Hotkeyless AHK server.
- **Ask before bulk actions.** If a task requires more than 5 sequential commands (e.g. gameplay automation), confirm the plan with the user first.
- **No feedback loop.** You cannot see the screen. If you need visual confirmation of results, tell the user or suggest a screenshot MCP tool.

