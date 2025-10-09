import { fetchmate } from "../src/index";

global.fetch = jest.fn();

describe("fetchmate - maxRetries", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("retries the correct number of times on failure", async () => {
    const mockFetch = fetch as jest.Mock;

    mockFetch
      .mockRejectedValueOnce(new Error("Network error"))
      .mockResolvedValueOnce(new Response("Success", { status: 200 }));

    const response = await fetchmate("https://example.com", {
      maxRetries: 1,
      retryDelay: 10,
    });

    expect(response.status).toBe(200);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it("throws after maxRetries are exceeded", async () => {
    const mockFetch = fetch as jest.Mock;

    mockFetch.mockRejectedValue(new Error("Network error"));

    await expect(
      fetchmate("https://example.com", {
        maxRetries: 2,
        retryDelay: 10,
      })
    ).rejects.toThrow("Network error");

    expect(mockFetch).toHaveBeenCalledTimes(3);
  });
});
