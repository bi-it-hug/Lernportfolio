import type { AnyElysia } from '.';
import { type TAnySchema } from '@sinclair/typebox';
import { Sucrose } from './sucrose';
import type { ComposedHandler, Handler, HookContainer, LifeCycleStore, SchemaValidator } from './types';
import { type TypeCheck } from './type-system';
export declare const hasAdditionalProperties: (_schema: TAnySchema | TypeCheck<any>) => any;
export declare const hasType: (type: string, schema: TAnySchema) => any;
export declare const hasProperty: (expectedProperty: string, _schema: TAnySchema | TypeCheck<any>) => any;
export declare const hasRef: (schema: TAnySchema) => boolean;
export declare const hasTransform: (schema: TAnySchema) => boolean;
export declare const isAsyncName: (v: Function | HookContainer) => boolean;
export declare const isAsync: (v: Function | HookContainer) => boolean;
export declare const isGenerator: (v: Function | HookContainer) => boolean;
export declare const composeHandler: ({ app, path, method, hooks, validator, handler, allowMeta, inference, asManifest }: {
    app: AnyElysia;
    path: string;
    method: string;
    hooks: Partial<LifeCycleStore>;
    validator: SchemaValidator;
    handler: unknown | Handler<any, any>;
    allowMeta?: boolean;
    inference: Sucrose.Inference;
    asManifest?: boolean;
}) => ComposedHandler;
export interface ComposerGeneralHandlerOptions {
    /**
     * optimization for standard internet hostname
     * this will assume hostname is always use a standard internet hostname
     * assuming hostname is at minimum of 11 length of string (http://a.bc)
     *
     * setting this to true will skip the first 11 character of the hostname
     *
     * @default true
     */
    standardHostname?: boolean;
}
export declare const composeGeneralHandler: (app: AnyElysia, { asManifest }?: {
    asManifest?: false;
}) => any;
export declare const composeErrorHandler: (app: AnyElysia) => any;
