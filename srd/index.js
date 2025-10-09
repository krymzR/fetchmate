"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchmate = fetchmate;
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
async function fetchmate(url, options = {}) {
    const { maxRetries = 0, retryDelay = 300, ...fetchOptions } = options;
    let attempt = 0;
    let lastError;
    while (attempt <= maxRetries) {
        try {
            const response = await fetch(url, fetchOptions);
            // Retry only on server errors
            if (response.status >= 500 && response.status < 600) {
                throw new Error(`Server error: ${response.status}`);
            }
            return response;
        }
        catch (error) {
            lastError = error;
            if (attempt === maxRetries)
                break;
            await delay(retryDelay);
            attempt++;
        }
    }
    throw lastError;
}
//# sourceMappingURL=index.js.map