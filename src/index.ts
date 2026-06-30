// @ts-nocheck
// OpenCode entry (the deployed plugin file). core-auth registers the native
// provider + auth method and routes requests to driver.handle.

import { defineProvider } from "../core-auth/dist/index.js";
import { driver } from "./driver.js";
import { deployCommands, defineConfig } from "../core/src/index.js";
import { STUB_COMMANDS, maybeRunCli } from "./commands.js";

// Register config defaults BEFORE the CLI guard so `config schema` sees them (no write).
defineConfig("stub-auth", {
  logging: true,
  response_text: "Hello from stub-auth — the core-auth pipeline works end to end.",
  model_count: 3,
  latency_ms: 0,
  fail_rate: 0,
  streaming: null,   // null = honor the request's stream flag; true/false = force
});

// Slash-command / config invocations shell back in as `node <bundle> <action>`;
// handle those first and exit so they never register the provider.
if (await maybeRunCli("stub-auth")) {
  process.exit(0);
}
try {
  deployCommands("stub-auth", STUB_COMMANDS);
} catch {
  /* best-effort */
}

export const StubProvider = defineProvider(driver).opencode;
