export interface FetchmateOptions extends RequestInit {
    maxRetries?: number;
    retryDelay?: number;
}
export declare function fetchmate(url: string, options?: FetchmateOptions): Promise<Response>;
