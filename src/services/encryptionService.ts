/**
 * Encryption Service for Buffalo Projects
 *
 * Provides client-side AES-256 encryption for workspace data.
 * Uses CryptoJS with PBKDF2 key derivation for secure encryption.
 *
 * Key Features:
 * - AES-256-CBC encryption
 * - PBKDF2 key derivation (100,000 iterations)
 * - Random salt and IV for each encryption
 * - User-derived keys (password-based)
 *
 * @see https://github.com/brix/crypto-js
 */

import CryptoJS from "crypto-js";

import type { Workspace } from "@/types";

// Constants
const PBKDF2_ITERATIONS = 100000;
const KEY_SIZE = 256 / 32; // 256 bits
const SALT_SIZE = 128 / 8; // 128 bits
const IV_SIZE = 128 / 8; // 128 bits for AES

/**
 * Encrypted data envelope containing ciphertext and metadata
 */
export interface EncryptedEnvelope {
  /** Base64-encoded ciphertext */
  ciphertext: string;
  /** Base64-encoded salt used for key derivation */
  salt: string;
  /** Base64-encoded initialization vector */
  iv: string;
  /** Encryption algorithm identifier */
  algorithm: "AES-256-CBC";
  /** Key derivation function identifier */
  kdf: "PBKDF2";
  /** Number of PBKDF2 iterations */
  iterations: number;
  /** Version for future compatibility */
  version: 1;
}

/**
 * Workspace with encrypted sensitive fields
 */
export interface EncryptedWorkspace {
  id: string;
  code: string;
  projectName: string;
  ownerId: string;
  isPublic: boolean;
  createdAt: string;
  lastModified: string;
  /** Encrypted envelope containing sensitive data */
  encryptedData: EncryptedEnvelope;
  /** Flag indicating workspace is encrypted */
  isEncrypted: true;
  /** Non-sensitive metadata for queries */
  stage?: Workspace["stage"];
  category?: Workspace["category"];
  tags?: string[];
  location?: Workspace["location"];
}

/**
 * Sensitive workspace fields that get encrypted
 */
interface SensitiveWorkspaceData {
  description: string;
  projectDescription: string;
  bmcData: Workspace["bmcData"];
  versions: Workspace["versions"];
  journal: Workspace["journal"];
  chatMessages: Workspace["chatMessages"];
  documents: Workspace["documents"];
  contextNotes: Workspace["contextNotes"];
  pivots: Workspace["pivots"];
  oneLiner?: string;
  gives?: string[];
  asks?: string[];
  publicLink?: string;
}

/**
 * Generate a cryptographically secure random salt
 */
function generateSalt(): CryptoJS.lib.WordArray {
  return CryptoJS.lib.WordArray.random(SALT_SIZE);
}

/**
 * Generate a cryptographically secure random IV
 */
function generateIV(): CryptoJS.lib.WordArray {
  return CryptoJS.lib.WordArray.random(IV_SIZE);
}

/**
 * Derive an encryption key from a password using PBKDF2
 */
function deriveKey(
  password: string,
  salt: CryptoJS.lib.WordArray,
): CryptoJS.lib.WordArray {
  return CryptoJS.PBKDF2(password, salt, {
    keySize: KEY_SIZE,
    iterations: PBKDF2_ITERATIONS,
    hasher: CryptoJS.algo.SHA256,
  });
}

/**
 * Encrypt data using AES-256-CBC
 *
 * @param data - Data to encrypt (will be JSON stringified)
 * @param password - User's encryption password
 * @returns Encrypted envelope with ciphertext and metadata
 */
export function encrypt<T>(data: T, password: string): EncryptedEnvelope {
  const salt = generateSalt();
  const iv = generateIV();
  const key = deriveKey(password, salt);

  const plaintext = JSON.stringify(data);
  const encrypted = CryptoJS.AES.encrypt(plaintext, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return {
    ciphertext: encrypted.ciphertext.toString(CryptoJS.enc.Base64),
    salt: salt.toString(CryptoJS.enc.Base64),
    iv: iv.toString(CryptoJS.enc.Base64),
    algorithm: "AES-256-CBC",
    kdf: "PBKDF2",
    iterations: PBKDF2_ITERATIONS,
    version: 1,
  };
}

/**
 * Decrypt data from an encrypted envelope
 *
 * @param envelope - Encrypted envelope with ciphertext and metadata
 * @param password - User's encryption password
 * @returns Decrypted data
 * @throws Error if decryption fails (wrong password or corrupted data)
 */
export function decrypt<T>(envelope: EncryptedEnvelope, password: string): T {
  try {
    const salt = CryptoJS.enc.Base64.parse(envelope.salt);
    const iv = CryptoJS.enc.Base64.parse(envelope.iv);
    const ciphertext = CryptoJS.enc.Base64.parse(envelope.ciphertext);

    // Use stored iterations for compatibility
    const key = CryptoJS.PBKDF2(password, salt, {
      keySize: KEY_SIZE,
      iterations: envelope.iterations,
      hasher: CryptoJS.algo.SHA256,
    });

    const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: ciphertext,
    });

    const decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    const plaintext = decrypted.toString(CryptoJS.enc.Utf8);

    if (!plaintext) {
      throw new Error("Decryption failed - invalid password or corrupted data");
    }

    return JSON.parse(plaintext) as T;
  } catch (error) {
    if (error instanceof Error && error.message.includes("Decryption failed")) {
      throw error;
    }
    throw new Error("Decryption failed - invalid password or corrupted data");
  }
}

/**
 * Encrypt a workspace's sensitive data
 *
 * @param workspace - Full workspace object
 * @param password - User's encryption password
 * @returns Workspace with encrypted sensitive fields
 */
export function encryptWorkspace(
  workspace: Workspace,
  password: string,
): EncryptedWorkspace {
  // Extract sensitive data
  const sensitiveData: SensitiveWorkspaceData = {
    description: workspace.description,
    projectDescription: workspace.projectDescription,
    bmcData: workspace.bmcData,
    versions: workspace.versions || [],
    journal: workspace.journal || [],
    chatMessages: workspace.chatMessages || [],
    documents: workspace.documents || [],
    contextNotes: workspace.contextNotes || [],
    pivots: workspace.pivots || [],
    oneLiner: workspace.oneLiner,
    gives: workspace.gives,
    asks: workspace.asks,
    publicLink: workspace.publicLink,
  };

  // Encrypt sensitive data
  const encryptedData = encrypt(sensitiveData, password);

  // Return workspace with encrypted envelope
  return {
    id: workspace.id,
    code: workspace.code,
    projectName: workspace.projectName,
    ownerId: workspace.ownerId || "",
    isPublic: workspace.isPublic,
    createdAt:
      typeof workspace.createdAt === "string"
        ? workspace.createdAt
        : new Date().toISOString(),
    lastModified:
      typeof workspace.lastModified === "string"
        ? workspace.lastModified
        : new Date().toISOString(),
    encryptedData,
    isEncrypted: true,
    // Keep non-sensitive metadata for queries
    stage: workspace.stage,
    category: workspace.category,
    tags: workspace.tags,
    location: workspace.location,
  };
}

/**
 * Decrypt a workspace's sensitive data
 *
 * @param encryptedWorkspace - Workspace with encrypted data
 * @param password - User's encryption password
 * @returns Full workspace object with decrypted data
 */
export function decryptWorkspace(
  encryptedWorkspace: EncryptedWorkspace,
  password: string,
): Workspace {
  // Decrypt sensitive data
  const sensitiveData = decrypt<SensitiveWorkspaceData>(
    encryptedWorkspace.encryptedData,
    password,
  );

  // Reconstruct full workspace
  return {
    id: encryptedWorkspace.id,
    code: encryptedWorkspace.code,
    projectName: encryptedWorkspace.projectName,
    ownerId: encryptedWorkspace.ownerId,
    isPublic: encryptedWorkspace.isPublic,
    createdAt: encryptedWorkspace.createdAt,
    lastModified: encryptedWorkspace.lastModified,
    stage: encryptedWorkspace.stage,
    category: encryptedWorkspace.category,
    tags: encryptedWorkspace.tags,
    location: encryptedWorkspace.location,
    // Decrypted sensitive fields
    description: sensitiveData.description,
    projectDescription: sensitiveData.projectDescription,
    bmcData: sensitiveData.bmcData,
    versions: sensitiveData.versions,
    journal: sensitiveData.journal,
    chatMessages: sensitiveData.chatMessages,
    documents: sensitiveData.documents,
    contextNotes: sensitiveData.contextNotes,
    pivots: sensitiveData.pivots,
    oneLiner: sensitiveData.oneLiner,
    gives: sensitiveData.gives,
    asks: sensitiveData.asks,
    publicLink: sensitiveData.publicLink,
  };
}

/**
 * Check if a workspace object is encrypted
 */
export function isEncryptedWorkspace(
  workspace: unknown,
): workspace is EncryptedWorkspace {
  return (
    typeof workspace === "object" &&
    workspace !== null &&
    "isEncrypted" in workspace &&
    (workspace as EncryptedWorkspace).isEncrypted === true &&
    "encryptedData" in workspace
  );
}

/**
 * Hash a password for storage (for password verification, not encryption)
 * Uses SHA-256 with a salt
 */
export function hashPassword(password: string, salt?: string): string {
  const useSalt = salt || CryptoJS.lib.WordArray.random(16).toString();
  const hash = CryptoJS.SHA256(password + useSalt).toString();
  return `${useSalt}:${hash}`;
}

/**
 * Verify a password against a stored hash
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, hash] = storedHash.split(":");
  if (!salt || !hash) {
    return false;
  }

  const computedHash = CryptoJS.SHA256(password + salt).toString();
  return computedHash === hash;
}

/**
 * Generate a secure encryption key hint
 * Creates a partial hash that can be used to verify the user has the right password
 * without exposing the actual password
 */
export function generateKeyHint(password: string): string {
  const hash = CryptoJS.SHA256(password).toString();
  // Return first 8 characters as a hint
  return hash.substring(0, 8);
}

export const encryptionService = {
  encrypt,
  decrypt,
  encryptWorkspace,
  decryptWorkspace,
  isEncryptedWorkspace,
  hashPassword,
  verifyPassword,
  generateKeyHint,
};

export default encryptionService;
