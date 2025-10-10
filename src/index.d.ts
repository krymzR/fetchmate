export interface FetchmateOptions extends RequestInit {
  /**
   * Number of retry attempts after the initial fetch.
   */
  maxRetries?: number;

  /**
   * Base delay (in milliseconds) between retries.
   */
  retryDelay?: number;

  /**
   * Whether to apply exponential backoff between retries.
   * If true, each retry delay increases as retryDelay * (2 ** attempt)
   */
  backoff?: boolean;
}
