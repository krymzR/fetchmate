export interface FetchmateOptions extends RequestInit {
  maxRetries?: number;
  retryDelay?: number; // ms
  retryOnStatuses?: number[]; // HTTP statuses that trigger a retry
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
    retryOnStatuses = [500, 501, 502, 503, 504, 505],
    ...fetchOptions
  } = options;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, fetchOptions);

      if (!response.ok && shouldRetry(response, retryOnStatuses)) {
        throw new Error(`Retryable server error: ${response.status}`);
      }

      return response; // success!
    } catch (error) {
      if (attempt === maxRetries) {
        throw error; // no retries left
      }
      await delay(retryDelay);
    }
  }

  // Should never get here because of throw inside catch
  throw new Error("Unknown error in fetchmate");
}
