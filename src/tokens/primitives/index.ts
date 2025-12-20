/**
 * Primitive Design Tokens
 *
 * Raw, low-level design values. These should NOT be used directly in components.
 * Instead, use semantic tokens which map these primitives to specific use cases.
 *
 * @example
 * // ❌ DON'T use primitives directly
 * import { COLOR_PRIMITIVES } from '@/tokens/primitives';
 * const badButton = <button style={{ color: COLOR_PRIMITIVES.blue[600] }}>Click</button>;
 *
 * // ✅ DO use semantic tokens
 * import { BUTTON_COLORS } from '@/tokens/semantic';
 * const goodButton = <button className={BUTTON_COLORS.primary}>Click</button>;
 */

export * from "./colors";
export * from "./spacing";
export * from "./typography";
export * from "./effects";
export * from "./motion";
