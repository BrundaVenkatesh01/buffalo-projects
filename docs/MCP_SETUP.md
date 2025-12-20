# Playwright MCP Configuration Guide

This guide explains how to configure Playwright Model Context Protocol (MCP) servers for use with Cursor IDE and other MCP-compatible clients.

## Overview

We have two Playwright MCP server options available:

1. **Official Package** (`@playwright/mcp@latest`) - Full-featured, maintained by Microsoft
2. **Custom Server** (`tools/playwright-mcp/server.mjs`) - Lightweight, project-specific tools

## Available Tools

Both servers provide similar functionality:

- `playwright.info` - Get Playwright testDir and configured projects
- `playwright.run` - Run Playwright tests with options (project, grep, headed)
- `playwright.ui` - Open Playwright UI mode
- `playwright.report` - Get path to last HTML test report

## Configuration

### Option 1: Using @config.toml (Claude Desktop / General MCP)

The `@config.toml` file in the project root configures MCP servers. Currently set to use the official package:

```toml
[mcp_servers.playwright]
command = "npx"
args = ["@playwright/mcp@latest"]
```

To use the custom server instead, uncomment the custom server section and comment out the official one.

### Option 2: Cursor IDE Configuration

Cursor uses a built-in MCP settings UI:

1. **Open Cursor Settings**
   - `Cmd/Ctrl + ,` or `Cursor Settings` from menu

2. **Navigate to MCP Settings**
   - Go to `Cursor Settings` → `MCP` → `Add new MCP Server`

3. **Configure the Server**
   - **Name**: `playwright` (or `playwright-custom` for local server)
   - **Type**: `command`
   - **Command**:
     - Official: `npx`
     - Custom: `node`
   - **Arguments**:
     - Official: `@playwright/mcp@latest`
     - Custom: `tools/playwright-mcp/server.mjs` (use absolute path if needed)

4. **Restart Cursor** after configuration

### Option 3: Manual Configuration File

If you need to manually configure, create/edit the Cursor MCP config file (location varies by OS):

**macOS**: `~/Library/Application Support/Cursor/User/globalStorage/mcp.json`

**Linux**: `~/.config/Cursor/User/globalStorage/mcp.json`

**Windows**: `%APPDATA%\Cursor\User\globalStorage\mcp.json`

Example configuration:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"],
      "cwd": "/Users/laneyfraass/Buffalo-Projects"
    }
  }
}
```

Or for the custom server:

```json
{
  "mcpServers": {
    "playwright-custom": {
      "command": "node",
      "args": ["tools/playwright-mcp/server.mjs"],
      "cwd": "/Users/laneyfraass/Buffalo-Projects"
    }
  }
}
```

## Testing the Configuration

### Test Custom Server Directly

```bash
# Make sure the server is executable
chmod +x tools/playwright-mcp/server.mjs

# Test with a simple MCP client or echo JSON-RPC messages
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node tools/playwright-mcp/server.mjs
```

### Verify in Cursor

1. Open a chat with Composer
2. Ask: "Run the Playwright info tool" or "What Playwright projects are configured?"
3. The AI should be able to use the MCP tools

## Custom Server Features

The custom server (`tools/playwright-mcp/server.mjs`) provides:

- **Project-aware**: Automatically detects projects from `playwright.config.ts`
- **Report integration**: Finds the latest HTML report automatically
- **Lightweight**: No external dependencies beyond Node.js stdlib
- **Customizable**: Easy to extend with project-specific tools

## Troubleshooting

### Server Not Found

- Ensure Node.js is in your PATH
- Verify the command/args are correct
- Check file permissions (`chmod +x` for custom server)

### Permission Errors

```bash
chmod +x tools/playwright-mcp/server.mjs
```

### Wrong Working Directory

- Ensure `cwd` is set to the project root in MCP config
- Use absolute paths if relative paths fail

### Tests Not Running

- Verify Playwright is installed: `npx playwright --version`
- Check `playwright.config.ts` exists and is valid
- Ensure dev server can start (`npm run dev` works)

## Differences: Official vs Custom

| Feature       | Official `@playwright/mcp`  | Custom Server      |
| ------------- | --------------------------- | ------------------ |
| Maintenance   | Microsoft maintained        | Project-specific   |
| Features      | Full Playwright API         | Core tools only    |
| Dependencies  | Requires npm package        | Node.js only       |
| Customization | Limited                     | Fully customizable |
| Updates       | Auto-updates with `@latest` | Manual updates     |

## Recommended Setup

For most users, **use the official package** (`@playwright/mcp@latest`) as it's:

- More feature-complete
- Actively maintained
- Well-tested
- Automatically updated

Use the custom server if you need:

- Custom tool implementations
- Project-specific test workflows
- No external dependencies
- Full control over behavior

## Next Steps

After configuration:

1. Test MCP tools in Cursor chat
2. Run tests: "Run Playwright tests for chromium project"
3. Open UI: "Open Playwright UI mode"
4. Check reports: "What's the latest test report?"

## References

- [MCP Specification](https://modelcontextprotocol.io/)
- [Playwright MCP Package](https://www.npmjs.com/package/@playwright/mcp)
- [Cursor MCP Documentation](https://docs.cursor.com/mcp)
