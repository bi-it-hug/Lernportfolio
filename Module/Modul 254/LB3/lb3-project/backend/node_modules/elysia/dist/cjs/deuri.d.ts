/**
 * Decode the full string
 */
export declare const decode: (url: string) => string | null;
/**
 * Encode URI components
 */
export declare const encode: (str: string) => string | null;
/**
 * Decode a substring of an input string
 */
export declare const decodeSegment: (url: string, start: number, end: number) => string | null;
