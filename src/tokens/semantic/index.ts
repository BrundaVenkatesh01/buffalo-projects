/**
 * Semantic Design Tokens
 *
 * USE THESE in your components, not the primitives.
 * Semantic tokens map primitive values to specific use cases and contexts.
 *
 * @example
 * // ✅ CORRECT - Use semantic tokens
 * import { BACKGROUND, TEXT, BUTTON } from '@/tokens/semantic';
 * <button style={{ backgroundColor: BUTTON.primary.background.default }}>Click</button>
 *
 * // ❌ WRONG - Don't use primitives directly
 * import { COLOR_PRIMITIVES } from '@/tokens/primitives';
 * <button style={{ backgroundColor: COLOR_PRIMITIVES.blue[600] }}>Click</button>
 */

export * from "./colors";
export * from "./typography";
export * from "./components";
export * from "./motion";
