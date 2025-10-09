function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
/**
 * Determines if the response status should trigger a retry.
 */
function shouldRetry(response, retryOnStatuses) {
    return retryOnStatuses.includes(response.status);
}
export async function fetchmate(url, options = {}) {
    const { maxRetries = 0, retryDelay = 300, retryOnStatuses = [500, 501, 502, 503, 504, 505], ...fetchOptions } = options;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            const response = await fetch(url, fetchOptions);
            if (!response.ok && shouldRetry(response, retryOnStatuses)) {
                throw new Error(`Retryable server error: ${response.status}`);
            }
            return response; // success!
        }
        catch (error) {
            if (attempt === maxRetries) {
                throw error; // no retries left
            }
            await delay(retryDelay);
        }
    }
    // Should never get here because of throw inside catch
    throw new Error("Unknown error in fetchmate");
}
