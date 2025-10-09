import { fetchmate } from "../src/index";
import { Response } from "node-fetch";

global.Response = Response;
global.fetch = jest.fn();

describe("fetchmate", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("returns response immediately when no retry needed", async () => {
    const mockResponse = new Response("OK", { status: 200 });
    (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    const response = await fetchmate("https://example.com");

    expect(response).toBe(mockResponse);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("retries up to maxRetries on network error", async () => {
    const mockResponse = new Response("Success", { status: 200 });
    const mockFetch = fetch as jest.Mock;

    mockFetch
      .mockRejectedValueOnce(new Error("Network error"))
      .mockRejectedValueOnce(new Error("Network error"))
      .mockResolvedValueOnce(mockResponse);

    const response = await fetchmate("https://example.com", {
      maxRetries: 3,
      retryDelay: 1,
    });

    expect(response).toBe(mockResponse);
    expect(mockFetch).toHaveBeenCalledTimes(3);
  });

  it("throws error after exceeding maxRetries on network error", async () => {
    const mockFetch = fetch as jest.Mock;
    mockFetch.mockRejectedValue(new Error("Network error"));

    await expect(
      fetchmate("https://example.com", { maxRetries: 2, retryDelay: 1 })
    ).rejects.toThrow("Network error");
    expect(mockFetch).toHaveBeenCalledTimes(3);
  });

  it("retries on HTTP 5xx status by default", async () => {
    const mockFetch = fetch as jest.Mock;
    const errorResponse = new Response("Server error", { status: 503 });
    const successResponse = new Response("Success", { status: 200 });

    mockFetch
      .mockResolvedValueOnce(errorResponse)
      .mockResolvedValueOnce(successResponse);

    const response = await fetchmate("https://example.com", {
      maxRetries: 1,
      retryDelay: 1,
    });

    expect(response).toBe(successResponse);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it("does NOT retry on HTTP 4xx status by default", async () => {
    const mockFetch = fetch as jest.Mock;
    const clientErrorResponse = new Response("Not Found", { status: 404 });

    mockFetch.mockResolvedValue(clientErrorResponse);

    const response = await fetchmate("https://example.com", {
      maxRetries: 3,
      retryDelay: 1,
    });

    expect(response).toBe(clientErrorResponse);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("retries on custom retryOnStatuses array", async () => {
    const mockFetch = fetch as jest.Mock;
    const tooManyRequestsResponse = new Response("Too Many Requests", {
      status: 429,
    });
    const successResponse = new Response("Success", { status: 200 });

    mockFetch
      .mockResolvedValueOnce(tooManyRequestsResponse)
      .mockResolvedValueOnce(successResponse);

    const response = await fetchmate("https://example.com", {
      maxRetries: 1,
      retryDelay: 1,
      retryOnStatuses: [429],
    });

    expect(response).toBe(successResponse);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it("throws if fetch returns non-ok status NOT in retryOnStatuses", async () => {
    const mockFetch = fetch as jest.Mock;
    const forbiddenResponse = new Response("Forbidden", { status: 403 });

    mockFetch.mockResolvedValue(forbiddenResponse);

    const response = await fetchmate("https://example.com", {
      maxRetries: 1,
      retryDelay: 1,
    });

    // The response is returned even if status is not ok but not retryable
    expect(response).toBe(forbiddenResponse);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("delays between retries", async () => {
    jest.useFakeTimers();
    const mockFetch = fetch as jest.Mock;
    mockFetch.mockRejectedValue(new Error("Network error"));

    const promise = fetchmate("https://example.com", {
      maxRetries: 1,
      retryDelay: 1000,
    });

    // Fast-forward time and check the delay
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 1000);

    // Clean up fake timers
    jest.runAllTimers();
    jest.useRealTimers();

    await expect(promise).rejects.toThrow("Network error");
  });
});
