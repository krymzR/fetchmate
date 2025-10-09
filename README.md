# fetchmate

**Your flexible Fetch API companion — extendable, reliable, and built for modern web requests..**

---

## 🚀 What is fetchmate?

`fetchmate` is a lightweight and flexible wrapper around the native [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) that supercharges your HTTP requests with robust retry capabilities, customizable delays, and easy configuration.

Whether you're dealing with flaky network conditions, rate limits, or intermittent server errors, `fetchmate` has got your back — so you can keep your code clean and your apps resilient.

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
npm install fetchmate
# or
yarn add fetchmate

```

## 💡 Usage

```
import { fetchmate } from 'fetchmate';

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

| Option            | Type          | Default                          | Description                                    |
| ----------------- | ------------- | -------------------------------- | ---------------------------------------------- |
| `maxRetries`      | `number`      | `0`                              | Maximum number of retry attempts on failure.   |
| `retryDelay`      | `number`      | `300` (milliseconds)             | Delay between retries in ms.                   |
| `retryOnStatuses` | `number[]`    | `[500, 501, 502, 503, 504, 505]` | HTTP status codes that should trigger a retry. |
| _..._             | `RequestInit` | —                                | All standard options from the Fetch API.       |

## 🔧 Why fetchmate?

- ✅ Resilient networking — Prevent temporary network blips or server hiccups from crashing your app.

- ⚙️ Customizable — You decide what’s retryable and how aggressively to retry.

- 🪶 Lightweight — No heavy dependencies, just a few lines of clean, tested code.

- 🔒 TypeScript-friendly — Write safer code with full type support.

## 🧪 Testing

fetchmate is thoroughly tested with Jest and supports both JavaScript and TypeScript environments.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check the [issues](https://github.com/nursoltan-s/fetchmate/issues) or submit a [pull request](https://github.com/nursoltan-s/fetchmate/pulls).

## 📜 License

MIT License © 2025 [Nursoltan Saipolda]

---

Made with ❤️ by fetchmate — your fetch’s best mate in the wild web.
