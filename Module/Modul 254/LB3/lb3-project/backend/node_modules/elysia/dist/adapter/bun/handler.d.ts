import type { Context } from '../../context';
import type { AnyLocalHook } from '../../types';
import { mapResponse, mapEarlyResponse, mapCompactResponse, createStaticHandler } from '../web-standard/handler';
export declare const createNativeStaticHandler: (handle: unknown, hooks: AnyLocalHook, setHeaders?: Context["set"]["headers"]) => (() => Response) | undefined;
export { mapResponse, mapEarlyResponse, mapCompactResponse, createStaticHandler };
