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
        jest.useRealTimers();
    });
    it("returns response immediately when no retry needed", async () => {
        const mockResponse = new Response("OK", { status: 200 });
        fetch.mockResolvedValueOnce(mockResponse);
        const response = await fetchmate("https://example.com");
        expect(response).toBe(mockResponse);
        expect(fetch).toHaveBeenCalledTimes(1);
    });
    it("retries up to maxRetries on network error", async () => {
        const mockResponse = new Response("Success", { status: 200 });
        const mockFetch = fetch;
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
        const mockFetch = fetch;
        mockFetch.mockRejectedValue(new Error("Network error"));
        await expect(fetchmate("https://example.com", { maxRetries: 2, retryDelay: 1 })).rejects.toThrow("Network error");
        expect(mockFetch).toHaveBeenCalledTimes(3);
    });
    it("retries on HTTP 5xx status by default", async () => {
        const mockFetch = fetch;
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
        const mockFetch = fetch;
        const clientErrorResponse = new Response("Not Found", { status: 404 });
        mockFetch.mockResolvedValue(clientErrorResponse);
        const response = await fetchmate("https://example.com", {
            maxRetries: 3,
            retryDelay: 1,
        });
        expect(response).toBe(clientErrorResponse);
        expect(mockFetch).toHaveBeenCalledTimes(1);
    });
    it("throws if fetch returns non-ok status NOT in retryOnStatuses", async () => {
        const mockFetch = fetch;
        const forbiddenResponse = new Response("Forbidden", { status: 403 });
        mockFetch.mockResolvedValue(forbiddenResponse);
        const response = await fetchmate("https://example.com", {
            maxRetries: 1,
            retryDelay: 1,
        });
        expect(response).toBe(forbiddenResponse);
        expect(mockFetch).toHaveBeenCalledTimes(1);
    });
});
