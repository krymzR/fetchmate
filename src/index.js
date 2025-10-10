"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchmate = fetchmate;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchmate(url, options = {}) {
  const {
    maxRetries = 0, // number of retries after first attempt
    retryDelay = 300, // initial delay (ms)
    backoff = false, // exponential backoff toggle
    ...fetchOptions
  } = options;

  let attempt = 0;
  let lastError;

  while (attempt <= maxRetries) {
    try {
      const response = await fetch(url, fetchOptions);

      // Retry on specific status codes
      if (!response.ok) {
        if (
          response.status === 408 ||
          response.status === 429 ||
          (response.status >= 500 && response.status < 600)
        ) {
          throw new Error(`Retryable error: ${response.status}`);
        }
      }

      return response; // success
    } catch (error) {
      lastError = error;
      if (attempt === maxRetries) break;

      const delayMs = backoff ? retryDelay * Math.pow(2, attempt) : retryDelay;

      await delay(delayMs);
      attempt++;
    }
  }

  throw lastError;
}
