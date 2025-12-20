import type {
  CSSProperties,
  FormEvent,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
} from "react";

/**
 * Common type definitions used across the application
 * This file provides specific types to replace 'any' usage
 */

/** Generic callback function type */
export type Callback<T = void> = (data: T) => void;

/** Generic async callback function type */
export type AsyncCallback<T = void> = (data: T) => Promise<void>;

/** Error handler type */
export type ErrorHandler = (error: unknown) => void;

/** Generic event handler */
export type EventHandler<T = Event> = (event: T) => void;

/** Form event handler */
export type FormEventHandler = EventHandler<FormEvent>;

/** Mouse event handler */
export type MouseEventHandler = EventHandler<MouseEvent>;

/** Keyboard event handler */
export type KeyboardEventHandler = EventHandler<KeyboardEvent>;

/** Generic record type for objects */
export type GenericRecord = Record<string, unknown>;

/** JSON-serializable value */
export type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };

/** Service response type */
export interface ServiceResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: GenericRecord;
}

/** Pagination parameters */
export interface PaginationParams {
  page: number;
  limit: number;
  offset?: number;
  sort?: string;
  order?: "asc" | "desc";
}

/** API Error type */
export interface APIError {
  code: string;
  message: string;
  details?: GenericRecord;
  timestamp: string;
}

/** File upload result */
export interface FileUploadResult {
  url: string;
  path: string;
  size: number;
  type: string;
  name: string;
}

/** Analytics event */
export interface AnalyticsEvent {
  name: string;
  properties?: GenericRecord;
  timestamp: number;
  userId?: string;
}

/** Component props with children */
export interface WithChildren {
  children: ReactNode;
}

/** Component props with className */
export interface WithClassName {
  className?: string;
}

/** Component props with style */
export interface WithStyle {
  style?: CSSProperties;
}

/** Async state */
export interface AsyncState<T = unknown> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

/** Form field state */
export interface FormField<T = string> {
  value: T;
  error?: string;
  touched: boolean;
  required?: boolean;
}

/** Modal props */
export interface ModalProps extends WithChildren {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

/** Toast notification */
export interface ToastNotification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  message: string;
  duration?: number;
}

/** Service worker message */
export interface ServiceWorkerMessage {
  type: string;
  payload?: unknown;
  error?: string;
}

/** Local storage item */
export interface StorageItem<T = unknown> {
  value: T;
  timestamp: number;
  ttl?: number;
}

/** Navigation item */
export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon?: ReactNode;
  children?: NavigationItem[];
  disabled?: boolean;
  external?: boolean;
}

/** Theme configuration */
export interface ThemeConfig {
  mode: "light" | "dark";
  primaryColor: string;
  fontFamily?: string;
  borderRadius?: string;
}

/** Metrics data point */
export interface MetricDataPoint {
  name: string;
  value: number;
  timestamp: number;
  metadata?: GenericRecord;
}

/** Rate limit info */
export interface RateLimitInfo {
  remaining: number;
  total: number;
  reset: number;
}

/** Export these common utility types */
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Maybe<T> = T | null | undefined;
export type ValueOf<T> = T[keyof T];
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
