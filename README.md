# fetchmate

**Your flexible Fetch API companion — extendable, reliable, and built for modern web requests..**

[![npm version](https://img.shields.io/npm/v/@nursoltan-s/fetchmate.svg?style=flat&color=green)](https://www.npmjs.com/package/@nursoltan-s/fetchmate)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Build Status](https://img.shields.io/badge/tests-passing-brightgreen)](#-testing)
[![Made with TypeScript](https://img.shields.io/badge/TypeScript-%E2%9C%93-blue)](#)

---

## 🚀 What is fetchmate?

`@nursoltan-s/fetchmate` is a lightweight and flexible wrapper around the native [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) that supercharges your HTTP requests with robust retry capabilities, customizable delays, and easy configuration.

Whether you're dealing with flaky network conditions, rate limits, or intermittent server errors, `@nursoltan-s/fetchmate` has got your back — so you can keep your code clean and your apps resilient.

---

## ✨ Key Features

- **Max retries:** Automatically retry failed requests up to a configurable limit.
- **Retry delay:** Control how long to wait between retries (in milliseconds).
- **Custom retry statuses:** Retry not just on server errors but on any HTTP status codes you choose (like `429 Too Many Requests`).
- **Simple API:** Drop-in replacement for `fetch`, no hassle.
- **TypeScript support:** Comes with type definitions out of the box.

---

## 📦 Installation

```bash
npm install @nursoltan-s/fetchmate
# or
yarn add @nursoltan-s/fetchmate

```

## 💡 Usage

```
import { fetchmate } from '@nursoltan-s/fetchmate';

async function getData() {
  try {
    const response = await fetchmate('https://api.example.com/data', {
      maxRetries: 3,
      retryDelay: 1000, // 1 second delay between retries
      retryOnStatuses: [429, 503], // Retry on "Too Many Requests" and "Service Unavailable"
      method: 'GET',
      headers: { 'Authorization': 'Bearer YOUR_TOKEN' }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);

  } catch (error) {
    console.error('Request failed:', error);
  }
}

```

## ⚙️ API

fetchmate(url: string, options?: FetchmateOptions): Promise<Response>

- url: The resource you want to fetch.
- options: An object extending the standard Fetch API options with additional properties:

| Option            | Type          | Default     | Description                                                                               |
| ----------------- | ------------- | ----------- | ----------------------------------------------------------------------------------------- |
| `maxRetries`      | `number`      | `0`         | Maximum number of retry attempts.                                                         |
| `retryDelay`      | `number`      | `300` (ms)  | Base delay between retries.                                                               |
| `backoff`         | `boolean`     | `false`     | If `true`, applies exponential backoff (`retryDelay * 2 ** attempt`).                     |
| `retryOnStatuses` | `number[]`    | `[500–599]` | HTTP status codes that should trigger a retry.                                            |
| ...               | `RequestInit` | —           | All standard [Fetch API options](https://developer.mozilla.org/docs/Web/API/RequestInit). |

## 🔧 Why fetchmate?

- ✅ Resilient networking — Prevent temporary network blips or server hiccups from crashing your app.

- ⚙️ Customizable — You decide what’s retryable and how aggressively to retry.

- 🪶 Lightweight — No heavy dependencies, just a few lines of clean, tested code.

- 🔒 TypeScript-friendly — Write safer code with full type support.

## 🧪 Testing

fetchmate is thoroughly tested with Jest and supports both JavaScript and TypeScript environments.

```
npm test
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check the [issues](https://github.com/nursoltan-s/fetchmate/issues) or submit a [pull request](https://github.com/nursoltan-s/fetchmate/pulls).

## 📜 License

MIT License © 2025 [Nursoltan Saipolda]

---

Made with ❤️ by fetchmate — your fetch’s best mate in the wild web.
