import type { BunFile } from 'bun';
import { TAnySchema, TModule, type TSchema } from '@sinclair/typebox';
import { TypeCheck } from '@sinclair/typebox/compiler';
import type { Sucrose } from './sucrose';
import type { CookieOptions } from './cookies';
import type { LifeCycleStore, MaybeArray, InputSchema, LifeCycleType, HookContainer, Replace, SchemaValidator, AnyLocalHook } from './types';
export declare const hasHeaderShorthand: boolean;
export declare const replaceUrlPath: (url: string, pathname: string) => string;
export declare const isClass: (v: Object) => boolean;
export declare const mergeDeep: <A extends Record<string, any>, B extends Record<string, any>>(target: A, source: B, { skipKeys, override }?: {
    skipKeys?: string[];
    override?: boolean;
}) => A & B;
export declare const mergeCookie: <const A extends Object, const B extends Object>(a: A, b: B) => A & B;
export declare const mergeObjectArray: <T extends HookContainer>(a?: T | T[], b?: T | T[]) => T[] | undefined;
export declare const primitiveHooks: readonly ["start", "request", "parse", "transform", "resolve", "beforeHandle", "afterHandle", "mapResponse", "afterResponse", "trace", "error", "stop", "body", "headers", "params", "query", "response", "type", "detail"];
export declare const mergeResponse: (a: InputSchema["response"], b: InputSchema["response"]) => string | TSchema | Record<number, string | TSchema> | undefined;
export declare const mergeSchemaValidator: (a?: SchemaValidator | null, b?: SchemaValidator | null) => SchemaValidator;
export declare const mergeHook: (a?: Partial<LifeCycleStore>, b?: AnyLocalHook) => LifeCycleStore;
interface ReplaceSchemaTypeOptions {
    from: TSchema;
    to(options: Object): TSchema | null;
    excludeRoot?: boolean;
    rootOnly?: boolean;
    original?: TAnySchema;
    /**
     * Traverse until object is found except root object
     **/
    untilObjectFound?: boolean;
}
export declare const replaceSchemaType: (schema: TSchema, options: MaybeArray<ReplaceSchemaTypeOptions>, root?: boolean) => TSchema;
export declare const getSchemaValidator: <T extends TSchema | string | undefined>(s: T, { models, dynamic, modules, normalize, additionalProperties, coerce, additionalCoerce }?: {
    models?: Record<string, TSchema>;
    modules: TModule<any, any>;
    additionalProperties?: boolean;
    dynamic?: boolean;
    normalize?: boolean;
    coerce?: boolean;
    additionalCoerce?: MaybeArray<ReplaceSchemaTypeOptions>;
}) => T extends TSchema ? TypeCheck<TSchema> : undefined;
export declare const getResponseSchemaValidator: (s: InputSchema["response"] | undefined, { models, modules, dynamic, normalize, additionalProperties }: {
    modules: TModule<any, any>;
    models?: Record<string, TSchema>;
    additionalProperties?: boolean;
    dynamic?: boolean;
    normalize?: boolean;
}) => Record<number, TypeCheck<any>> | undefined;
export declare const checksum: (s: string) => number;
export declare const stringToStructureCoercions: () => ReplaceSchemaTypeOptions[];
export declare const coercePrimitiveRoot: () => ReplaceSchemaTypeOptions[];
export declare const getCookieValidator: ({ validator, modules, defaultConfig, config, dynamic, models }: {
    validator: TSchema | string | undefined;
    modules: TModule<any, any>;
    defaultConfig: CookieOptions | undefined;
    config: CookieOptions;
    dynamic: boolean;
    models: Record<string, TSchema> | undefined;
}) => TypeCheck<TSchema> | undefined;
export declare const injectChecksum: (checksum: number | undefined, x: MaybeArray<HookContainer> | undefined) => HookContainer | HookContainer[] | undefined;
export declare const mergeLifeCycle: (a: Partial<LifeCycleStore>, b: Partial<LifeCycleStore | AnyLocalHook>, checksum?: number) => LifeCycleStore;
export declare const asHookType: (fn: HookContainer, inject: LifeCycleType, { skipIfHasType }?: {
    skipIfHasType?: boolean;
}) => HookContainer;
export declare const filterGlobalHook: (hook: AnyLocalHook) => AnyLocalHook;
export declare const StatusMap: {
    readonly Continue: 100;
    readonly 'Switching Protocols': 101;
    readonly Processing: 102;
    readonly 'Early Hints': 103;
    readonly OK: 200;
    readonly Created: 201;
    readonly Accepted: 202;
    readonly 'Non-Authoritative Information': 203;
    readonly 'No Content': 204;
    readonly 'Reset Content': 205;
    readonly 'Partial Content': 206;
    readonly 'Multi-Status': 207;
    readonly 'Already Reported': 208;
    readonly 'Multiple Choices': 300;
    readonly 'Moved Permanently': 301;
    readonly Found: 302;
    readonly 'See Other': 303;
    readonly 'Not Modified': 304;
    readonly 'Temporary Redirect': 307;
    readonly 'Permanent Redirect': 308;
    readonly 'Bad Request': 400;
    readonly Unauthorized: 401;
    readonly 'Payment Required': 402;
    readonly Forbidden: 403;
    readonly 'Not Found': 404;
    readonly 'Method Not Allowed': 405;
    readonly 'Not Acceptable': 406;
    readonly 'Proxy Authentication Required': 407;
    readonly 'Request Timeout': 408;
    readonly Conflict: 409;
    readonly Gone: 410;
    readonly 'Length Required': 411;
    readonly 'Precondition Failed': 412;
    readonly 'Payload Too Large': 413;
    readonly 'URI Too Long': 414;
    readonly 'Unsupported Media Type': 415;
    readonly 'Range Not Satisfiable': 416;
    readonly 'Expectation Failed': 417;
    readonly "I'm a teapot": 418;
    readonly 'Misdirected Request': 421;
    readonly 'Unprocessable Content': 422;
    readonly Locked: 423;
    readonly 'Failed Dependency': 424;
    readonly 'Too Early': 425;
    readonly 'Upgrade Required': 426;
    readonly 'Precondition Required': 428;
    readonly 'Too Many Requests': 429;
    readonly 'Request Header Fields Too Large': 431;
    readonly 'Unavailable For Legal Reasons': 451;
    readonly 'Internal Server Error': 500;
    readonly 'Not Implemented': 501;
    readonly 'Bad Gateway': 502;
    readonly 'Service Unavailable': 503;
    readonly 'Gateway Timeout': 504;
    readonly 'HTTP Version Not Supported': 505;
    readonly 'Variant Also Negotiates': 506;
    readonly 'Insufficient Storage': 507;
    readonly 'Loop Detected': 508;
    readonly 'Not Extended': 510;
    readonly 'Network Authentication Required': 511;
};
export declare const InvertedStatusMap: { [K in keyof StatusMap as StatusMap[K]]: K; };
export type StatusMap = typeof StatusMap;
export type InvertedStatusMap = typeof InvertedStatusMap;
export declare const signCookie: (val: string, secret: string | null) => Promise<string>;
export declare const unsignCookie: (input: string, secret: string | null) => Promise<string | false>;
export declare const traceBackMacro: (extension: unknown, property: Record<string, unknown>, manage: ReturnType<typeof createMacroManager>) => void;
export declare const createMacroManager: ({ globalHook, localHook }: {
    globalHook: Partial<LifeCycleStore>;
    localHook: Partial<AnyLocalHook>;
}) => (stackName: keyof LifeCycleStore) => (type: {
    insert?: "before" | "after";
    stack?: "global" | "local";
} | MaybeArray<HookContainer>, fn?: MaybeArray<HookContainer>) => void;
export declare const isNumericString: (message: string | number) => boolean;
export declare class PromiseGroup implements PromiseLike<void> {
    onError: (error: any) => void;
    root: Promise<any> | null;
    promises: Promise<any>[];
    constructor(onError?: (error: any) => void);
    /**
     * The number of promises still being awaited.
     */
    get size(): number;
    /**
     * Add a promise to the group.
     * @returns The promise that was added.
     */
    add<T>(promise: Promise<T>): Promise<T>;
    private drain;
    then<TResult1 = void, TResult2 = never>(onfulfilled?: ((value: void) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): PromiseLike<TResult1 | TResult2>;
}
export declare const fnToContainer: (fn: MaybeArray<Function | HookContainer>, subType?: HookContainer["subType"]) => MaybeArray<HookContainer>;
export declare const localHookToLifeCycleStore: (a: AnyLocalHook) => LifeCycleStore;
export declare const lifeCycleToFn: (a: Partial<LifeCycleStore>) => AnyLocalHook;
export declare const cloneInference: (inference: Sucrose.Inference) => {
    body: boolean;
    cookie: boolean;
    headers: boolean;
    query: boolean;
    set: boolean;
    server: boolean;
    request: boolean;
    route: boolean;
};
/**
 *
 * @param url URL to redirect to
 * @param HTTP status code to send,
 */
export declare const redirect: (url: string, status?: 301 | 302 | 303 | 307 | 308) => import("undici-types").Response;
export type redirect = typeof redirect;
export declare const ELYSIA_FORM_DATA: unique symbol;
export type ELYSIA_FORM_DATA = typeof ELYSIA_FORM_DATA;
type ElysiaFormData<T extends Record<string | number, unknown>> = FormData & {
    [ELYSIA_FORM_DATA]: Replace<T, BunFile, File>;
};
export declare const ELYSIA_REQUEST_ID: unique symbol;
export type ELYSIA_REQUEST_ID = typeof ELYSIA_REQUEST_ID;
export declare const form: <const T extends Record<string | number, unknown>>(items: T) => ElysiaFormData<T>;
export declare const randomId: () => string;
export declare const deduplicateChecksum: <T extends Function>(array: HookContainer<T>[]) => HookContainer<T>[];
/**
 * Since it's a plugin, which means that ephemeral is demoted to volatile.
 * Which  means there's no volatile and all previous ephemeral become volatile
 * We can just promote back without worry
 */
export declare const promoteEvent: (events?: (HookContainer | Function)[], as?: "scoped" | "global") => void;
export declare const getLoosePath: (path: string) => string;
export declare const isNotEmpty: (obj?: Object) => boolean;
export declare const compressHistoryHook: (hook: LifeCycleStore) => Partial<LifeCycleStore>;
export declare const decompressHistoryHook: (hook: Partial<LifeCycleStore>) => LifeCycleStore;
export declare const encodePath: (path: string, { dynamic }?: {
    dynamic?: boolean | undefined;
}) => string;
export {};
