/**
 * Generates a unique ID for blocks
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * Generates a unique ID with a prefix
 */
export function generateIdWithPrefix(prefix: string): string {
  return `${prefix}_${generateId()}`;
}
