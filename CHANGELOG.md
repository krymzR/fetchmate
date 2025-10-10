# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2025-10-10

### 🚀 New Features

- Added optional **exponential backoff** for smarter retry timing.
  ```js
  fetchmate(url, { maxRetries: 3, retryDelay: 300, backoff: true });
  ```
