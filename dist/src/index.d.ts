export interface FetchmateOptions extends RequestInit {
    maxRetries?: number;
    retryDelay?: number;
    retryOnStatuses?: number[];
    backoff?: boolean;
}
export declare function fetchmate(url: string, options?: FetchmateOptions): Promise<Response>;
