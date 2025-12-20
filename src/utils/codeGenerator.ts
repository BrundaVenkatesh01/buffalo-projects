import { customAlphabet } from "nanoid";

// Custom alphabet without ambiguous characters
const alphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
const generateId = customAlphabet(alphabet, 4);

export const generateWorkspaceCode = (): string => {
  return `BUF-${generateId()}`;
};

export const isValidWorkspaceCode = (code: string): boolean => {
  return /^BUF-[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{4}$/.test(code);
};
