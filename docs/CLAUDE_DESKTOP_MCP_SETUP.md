# Claude Desktop MCP Setup for Playwright

This guide explains how to configure Playwright MCP for Claude Desktop (Claude Code).

## Quick Setup

### Method 1: Using @config.toml in Project Root (Recommended)

The `@config.toml` file in this project is already configured. For Claude Desktop to use it:

1. **Copy or symlink the config file to your home directory:**

```bash
# Option A: Copy the file
cp @config.toml ~/@config.toml

# Option B: Create a symlink (keeps it in sync)
ln -s $(pwd)/@config.toml ~/@config.toml
```

2. **Or place it in Claude Desktop's config directory:**

**macOS:**

```bash
cp @config.toml ~/Library/Application\ Support/Claude/@config.toml
```

**Linux:**

```bash
cp @config.toml ~/.config/claude/@config.toml
```

**Windows:**

```bash
copy @config.toml %APPDATA%\Claude\@config.toml
```

### Method 2: Using Claude Desktop's JSON Config

Claude Desktop can also use JSON format. Create/edit:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`

**Linux:** `~/.config/claude/claude_desktop_config.json`

**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"],
      "env": {
        "PWD": "/Users/laneyfraass/Buffalo-Projects"
      }
    }
  }
}
```

For the custom server:

```json
{
  "mcpServers": {
    "playwright-custom": {
      "command": "node",
      "args": [
        "/Users/laneyfraass/Buffalo-Projects/tools/playwright-mcp/server.mjs"
      ],
      "env": {
        "PWD": "/Users/laneyfraass/Buffalo-Projects"
      }
    }
  }
}
```

### Method 3: Using Claude CLI (if available)

```bash
claude mcp add playwright npx -y @playwright/mcp@latest
```

## Verify Configuration

1. **Restart Claude Desktop** after making configuration changes

2. **Check MCP Status:**
   - Open Claude Desktop
   - Look for MCP server status indicators
   - Check for any error messages in the console

3. **Test the Connection:**
   - Ask Claude: "What Playwright MCP tools are available?"
   - Or: "List the configured Playwright test projects"

## Troubleshooting

### MCP Server Not Connecting

1. **Check Node.js is available:**

   ```bash
   which node
   node --version  # Should be 18+
   ```

2. **Verify Playwright is installed:**

   ```bash
   npx playwright --version
   ```

3. **Test the MCP server manually:**

   ```bash
   npx -y @playwright/mcp@latest
   ```

4. **Check Claude Desktop logs:**
   - macOS: `~/Library/Logs/Claude/`
   - Look for MCP-related errors

### Working Directory Issues

If tests can't find your project files:

1. **Set PWD environment variable** in the config:

   ```toml
   [mcp_servers.playwright]
   command = "npx"
   args = ["-y", "@playwright/mcp@latest"]
   env = { "PWD" = "/Users/laneyfraass/Buffalo-Projects" }
   ```

2. **Or use absolute paths** in custom server args

### Path Not Found Errors

- Use **absolute paths** for custom servers
- Ensure the project directory exists
- Check file permissions (`chmod +x` for custom server)

## Current Project Configuration

Your project's `@config.toml` is configured with:

```toml
[mcp_servers.playwright]
command = "npx"
args = ["-y", "@playwright/mcp@latest"]
```

This uses the official Microsoft-maintained Playwright MCP package, which:

- ✅ Automatically updates with `@latest`
- ✅ Works with any Playwright project
- ✅ Requires no local dependencies
- ✅ Full Playwright API support

## Custom Server Option

If you prefer the custom server (`tools/playwright-mcp/server.mjs`):

1. Make sure it's executable:

   ```bash
   chmod +x tools/playwright-mcp/server.mjs
   ```

2. Update config to use absolute path:
   ```toml
   [mcp_servers.playwright-custom]
   command = "node"
   args = ["/Users/laneyfraass/Buffalo-Projects/tools/playwright-mcp/server.mjs"]
   ```

## Available MCP Tools

Once configured, Claude can use:

- **playwright.info** - Get test directory and configured projects
- **playwright.run** - Run tests with filters (project, grep, headed)
- **playwright.ui** - Open Playwright UI mode
- **playwright.report** - Get path to latest HTML report

## Example Claude Prompts

After setup, try these in Claude Desktop:

```
"Run the Playwright tests for the chromium project"
"What Playwright test projects are configured?"
"Open Playwright UI mode"
"Show me the latest test report"
"Run tests matching 'smoke' in the name"
```

## Next Steps

1. Copy `@config.toml` to Claude Desktop's config location
2. Restart Claude Desktop
3. Verify MCP connection in Claude Desktop
4. Test with example prompts above

## References

- [Playwright MCP Package](https://www.npmjs.com/package/@playwright/mcp)
- [Claude Desktop MCP Documentation](https://claude.ai/docs/mcp)
- [MCP Specification](https://modelcontextprotocol.io/)
