# Hotkeyless AHK – Discover Commands

Hotkeyless AHK is a local HTTP server that exposes AutoHotkey functions as REST endpoints. Before you can invoke any command, you must discover what is available.

## Step 1: Fetch available commands

Run exactly this:

```bash
curl -s http://localhost:42800/list
```

The response is a JSON array:

```json
[
  {"command": "OpenBrowser", "note": "None"},
  {"command": "VolumeUp", "note": "None"},
  {"command": "MoveMouse", "note": "None"}
]
```

Each object has:
- `command`: The function name you can invoke via `/send/<command>`
- `note`: Parameter hints or `"None"` if undocumented

## Step 2: Present to user

List all discovered commands in a readable format. Group them by apparent category if possible (e.g. media controls, window management, mouse actions).

If the user asks to do something not covered by any listed command, tell them it's not configured in their Hotkeyless AHK setup.

## Configuration

- **Default URL:** `http://localhost:42800`
- The user may specify a different host or port. Always ask if the default doesn't respond.

## Important

- Always run discovery before invoking commands you haven't seen yet.
- Do not guess command names. Only use names returned by `/list`.
- The available commands are user-configured and differ per machine.
