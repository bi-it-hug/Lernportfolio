import { TString } from '@sinclair/typebox';
import { ArrayOptions, DateOptions, Kind, NumberOptions, TArray, TDate, TUnsafe, TInteger, IntegerOptions, SchemaOptions, TSchema, TProperties, ObjectOptions, TObject, TNumber, TBoolean } from '@sinclair/typebox';
import { type ValueError, type TypeCheck } from '@sinclair/typebox/compiler';
import type { CookieOptions } from './cookies';
import type { MaybeArray } from './types';
declare const t: import("@sinclair/typebox").JavaScriptTypeBuilder;
export declare namespace ElysiaTypeOptions {
    type Numeric = NumberOptions;
    type FileUnit = number | `${number}${'k' | 'm'}`;
    type StrictFileType = 'image' | 'image/*' | 'image/jpeg' | 'image/png' | 'image/gif' | 'image/tiff' | 'image/x-icon' | 'image/svg' | 'image/webp' | 'image/avif' | 'audio' | 'audio/*' | 'audio/aac' | 'audio/mpeg' | 'audio/x-ms-wma' | 'audio/vnd.rn-realaudio' | 'audio/x-wav' | 'video' | 'video/*' | 'video/mpeg' | 'video/mp4' | 'video/quicktime' | 'video/x-ms-wmv' | 'video/x-msvideo' | 'video/x-flv' | 'video/webm' | 'text' | 'text/*' | 'text/css' | 'text/csv' | 'text/html' | 'text/javascript' | 'text/plain' | 'text/xml' | 'application' | 'application/*' | 'application/graphql' | 'application/graphql-response+json' | 'application/ogg' | 'application/pdf' | 'application/xhtml' | 'application/xhtml+html' | 'application/xml-dtd' | 'application/html' | 'application/json' | 'application/ld+json' | 'application/xml' | 'application/zip' | 'font' | 'font/*' | 'font/woff2' | 'font/woff' | 'font/ttf' | 'font/otf';
    type FileType = (string & {}) | StrictFileType;
    interface File extends SchemaOptions {
        type?: MaybeArray<FileType>;
        minSize?: FileUnit;
        maxSize?: FileUnit;
    }
    interface Files extends File {
        minItems?: number;
        maxItems?: number;
    }
    interface CookieValidatorOption<T extends Object = {}> extends ObjectOptions, CookieOptions {
        /**
         * Secret key for signing cookie
         *
         * If array is passed, will use Key Rotation.
         *
         * Key rotation is when an encryption key is retired
         * and replaced by generating a new cryptographic key.
         */
        secrets?: string | string[];
        /**
         * Specified cookie name to be signed globally
         */
        sign?: Readonly<(keyof T | (string & {}))[]>;
    }
}
type ElysiaFile = (options?: Partial<ElysiaTypeOptions.Files> | undefined) => TUnsafe<File>;
type NonEmptyArray<T> = [T, ...T[]];
export type TEnumValue = number | string | null;
export interface TUnionEnum<T extends NonEmptyArray<TEnumValue> | Readonly<NonEmptyArray<TEnumValue>> = [TEnumValue]> extends TSchema {
    type?: 'number' | 'string' | 'null';
    [Kind]: 'UnionEnum';
    static: T[number];
    enum: T;
}
export declare const ElysiaType: {
    readonly Numeric: (property?: NumberOptions) => TNumber;
    readonly Integer: (property?: IntegerOptions) => TInteger;
    readonly Date: (property?: DateOptions) => TDate;
    readonly BooleanString: (property?: SchemaOptions) => TBoolean;
    readonly ObjectString: <T extends TProperties>(properties: T, options?: ObjectOptions) => TObject<T>;
    readonly ArrayString: <T extends TSchema = TString>(children?: T, options?: ArrayOptions) => TArray<T>;
    readonly File: ElysiaFile;
    readonly Files: (options?: ElysiaTypeOptions.Files) => import("@sinclair/typebox").TTransform<TUnsafe<File[]>, File[]>;
    readonly Nullable: <T extends TSchema>(schema: T, options?: SchemaOptions) => import("@sinclair/typebox").TUnion<[T, import("@sinclair/typebox").TNull]>;
    /**
     * Allow Optional, Nullable and Undefined
     */
    readonly MaybeEmpty: <T extends TSchema>(schema: T, options?: SchemaOptions) => import("@sinclair/typebox").TUnion<[T, import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUndefined]>;
    readonly Cookie: <T extends TProperties>(properties: T, { domain, expires, httpOnly, maxAge, path, priority, sameSite, secure, secrets, sign, ...options }?: ElysiaTypeOptions.CookieValidatorOption<T>) => TObject<T>;
    readonly UnionEnum: <const T extends NonEmptyArray<TEnumValue> | Readonly<NonEmptyArray<TEnumValue>>>(values: T, options?: SchemaOptions) => TUnionEnum<T>;
};
export type TCookie = (typeof ElysiaType)['Cookie'];
declare module '@sinclair/typebox' {
    interface JavaScriptTypeBuilder {
        BooleanString: typeof ElysiaType.BooleanString;
        ObjectString: typeof ElysiaType.ObjectString;
        ArrayString: typeof ElysiaType.ArrayString;
        Numeric: typeof ElysiaType.Numeric;
        Integer: typeof ElysiaType.Integer;
        File: typeof ElysiaType.File;
        Files: typeof ElysiaType.Files;
        Nullable: typeof ElysiaType.Nullable;
        MaybeEmpty: typeof ElysiaType.MaybeEmpty;
        Cookie: typeof ElysiaType.Cookie;
        UnionEnum: typeof ElysiaType.UnionEnum;
    }
    interface SchemaOptions {
        error?: string | boolean | number | Object | ((validation: {
            errors: ValueError[];
            type: string;
            validator: TypeCheck<any>;
            value: unknown;
        }) => string | boolean | number | Object | void);
    }
}
export { t };
export { TypeSystemPolicy, TypeSystem, TypeSystemDuplicateFormat, TypeSystemDuplicateTypeKind } from '@sinclair/typebox/system';
export { TypeRegistry, FormatRegistry } from '@sinclair/typebox';
export { TypeCompiler, TypeCheck } from '@sinclair/typebox/compiler';
