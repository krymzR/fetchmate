export interface FetchmateOptions extends RequestInit {
  maxRetries?: number;
  retryDelay?: number; // ms
  retryOnStatuses?: number[];
  backoff?: boolean;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Determines if the response status should trigger a retry.
 */
function shouldRetry(response: Response, retryOnStatuses: number[]) {
  return retryOnStatuses.includes(response.status);
}

export async function fetchmate(
  url: string,
  options: FetchmateOptions = {}
): Promise<Response> {
  const {
    maxRetries = 0,
    retryDelay = 300,
    backoff = false,
    ...fetchOptions
  } = options;

  let attempt = 0;
  let lastError;

  while (attempt <= maxRetries) {
    try {
      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        if (
          response.status === 408 ||
          response.status === 429 ||
          (response.status >= 500 && response.status < 600)
        ) {
          throw new Error(`Retryable error: ${response.status}`);
        }
      }

      return response;
    } catch (error) {
      lastError = error;
      if (attempt === maxRetries) break;

      const delayMs = backoff ? retryDelay * Math.pow(2, attempt) : retryDelay;

      await new Promise((r) => setTimeout(r, delayMs));
      attempt++;
    }
  }

  throw lastError;
}
