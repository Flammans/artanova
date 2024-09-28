/**
 * Truncate the given text to the specified limit and append '...' if it exceeds the limit.
 *
 * @param text - The text to be truncated.
 * @param limit - The maximum number of characters allowed before truncation. Default is 100.
 * @returns The truncated text with '...' appended if it exceeds the limit.
 */
export const truncateText = (text: string, limit: number = 100): string => {
  return text.length > limit ? `${text.slice(0, limit)}...` : text
}
