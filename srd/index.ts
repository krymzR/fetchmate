export interface FetchmateOptions extends RequestInit {
  maxRetries?: number;
  retryDelay?: number; // in ms
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchmate(
  url: string,
  options: FetchmateOptions = {}
): Promise<Response> {
  const { maxRetries = 0, retryDelay = 300, ...fetchOptions } = options;

  let attempt = 0;
  let lastError: any;

  while (attempt <= maxRetries) {
    try {
      const response = await fetch(url, fetchOptions);

      // Retry only on server errors
      if (response.status >= 500 && response.status < 600) {
        throw new Error(`Server error: ${response.status}`);
      }

      return response;
    } catch (error) {
      lastError = error;
      if (attempt === maxRetries) break;

      await delay(retryDelay);
      attempt++;
    }
  }

  throw lastError;
}
