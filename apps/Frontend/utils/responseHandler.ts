/**
 * Handles fetch response parsing and error handling
 * Used across all TanStack Query API service layers
 */
export async function handleApiResponse<T>(
  response: Response,
  defaultError: string = "An error occurred"
): Promise<T> {
  if (!response.ok) {
    let errorMessage = defaultError;

    try {
      // Try to parse as JSON first
      const error = await response.json();
      errorMessage =
        error.error || error.message || error.details || defaultError;
    } catch {
      // If JSON parse fails, try to get text (might be HTML error page)
      try {
        const text = await response.text();
        // Extract meaningful error from HTML if possible
        errorMessage = text.length < 200 ? text : defaultError;
      } catch {
        // If all else fails, use default error
        errorMessage = defaultError;
      }
    }

    throw new Error(errorMessage);
  }

  return response.json();
}
