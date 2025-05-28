import {
  Kind,
  TransformKind
} from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import{ t }from"./type-system.mjs";
import{ mapValueError }from"./error.mjs";
const hasHeaderShorthand = "toJSON" in new Headers();
const replaceUrlPath = (url, pathname) => {
  const urlObject = new URL(url);
  urlObject.pathname = pathname;
  return urlObject.toString();
};
const isClass = (v) => typeof v === "function" && /^\s*class\s+/.test(v.toString()) || // Handle Object.create(null)
v.toString && // Handle import * as Sentry from '@sentry/bun'
// This also handle [object Date], [object Array]
// and FFI value like [object Prisma]
v.toString().startsWith("[object ") && v.toString() !== "[object Object]" || // If object prototype is not pure, then probably a class-like object
isNotEmpty(Object.getPrototypeOf(v));
const isObject = (item) => item && typeof item === "object" && !Array.isArray(item);
const mergeDeep = (target, source, {
  skipKeys,
  override = true
} = {}) => {
  if (!isObject(target) || !isObject(source)) return target;
  for (const [key, value] of Object.entries(source)) {
    if (skipKeys?.includes(key)) continue;
    if (!isObject(value) || !(key in target) || isClass(value)) {
      if (override || !(key in target))
        target[key] = value;
      continue;
    }
    target[key] = mergeDeep(
      target[key],
      value,
      { skipKeys, override }
    );
  }
  return target;
};
const mergeCookie = (a, b) => {
  const v = mergeDeep(Object.assign({}, a), b, {
    skipKeys: ["properties"]
  });
  if ("properties" in v) delete v.properties;
  return v;
};
const mergeObjectArray = (a = [], b = []) => {
  if (!a) return void 0;
  if (!b) return a;
  const array = [];
  const checksums = [];
  if (!Array.isArray(a)) a = [a];
  if (!Array.isArray(b)) b = [b];
  for (const item of a) {
    array.push(item);
    if (item.checksum) checksums.push(item.checksum);
  }
  for (const item of b)
    if (!checksums.includes(item.checksum)) array.push(item);
  return array;
};
const primitiveHooks = [
  "start",
  "request",
  "parse",
  "transform",
  "resolve",
  "beforeHandle",
  "afterHandle",
  "mapResponse",
  "afterResponse",
  "trace",
  "error",
  "stop",
  "body",
  "headers",
  "params",
  "query",
  "response",
  "type",
  "detail"
];
const primitiveHookMap = primitiveHooks.reduce(
  (acc, x) => (acc[x] = true, acc),
  {}
);
const mergeResponse = (a, b) => {
  const isRecordNumber = (x) => typeof x === "object" && Object.keys(x).every(isNumericString);
  if (isRecordNumber(a) && isRecordNumber(b)) return Object.assign(a, b);
  else if (a && !isRecordNumber(a) && isRecordNumber(b))
    return Object.assign({ 200: a }, b);
  return b ?? a;
};
const mergeSchemaValidator = (a, b) => {
  return {
    body: b?.body ?? a?.body,
    headers: b?.headers ?? a?.headers,
    params: b?.params ?? a?.params,
    query: b?.query ?? a?.query,
    cookie: b?.cookie ?? a?.cookie,
    // @ts-ignore ? This order is correct - SaltyAom
    response: mergeResponse(
      // @ts-ignore
      a?.response,
      // @ts-ignore
      b?.response
    )
  };
};
const mergeHook = (a, b) => {
  const { resolve: resolveA, ...restA } = a ?? {};
  const { resolve: resolveB, ...restB } = b ?? {};
  return {
    ...restA,
    ...restB,
    // Merge local hook first
    // @ts-ignore
    body: b?.body ?? a?.body,
    // @ts-ignore
    headers: b?.headers ?? a?.headers,
    // @ts-ignore
    params: b?.params ?? a?.params,
    // @ts-ignore
    query: b?.query ?? a?.query,
    // @ts-ignore
    cookie: b?.cookie ?? a?.cookie,
    // ? This order is correct - SaltyAom
    response: mergeResponse(
      // @ts-ignore
      a?.response,
      // @ts-ignore
      b?.response
    ),
    type: a?.type || b?.type,
    detail: mergeDeep(
      // @ts-ignore
      b?.detail ?? {},
      // @ts-ignore
      a?.detail ?? {}
    ),
    parse: mergeObjectArray(a?.parse, b?.parse),
    transform: mergeObjectArray(a?.transform, b?.transform),
    beforeHandle: mergeObjectArray(
      mergeObjectArray(
        fnToContainer(resolveA, "resolve"),
        a?.beforeHandle
      ),
      mergeObjectArray(
        fnToContainer(resolveB, "resolve"),
        b?.beforeHandle
      )
    ),
    afterHandle: mergeObjectArray(a?.afterHandle, b?.afterHandle),
    mapResponse: mergeObjectArray(a?.mapResponse, b?.mapResponse),
    afterResponse: mergeObjectArray(
      a?.afterResponse,
      b?.afterResponse
    ),
    trace: mergeObjectArray(a?.trace, b?.trace),
    error: mergeObjectArray(a?.error, b?.error)
  };
};
const replaceSchemaType = (schema, options, root = true) => {
  if (!Array.isArray(options)) {
    options.original = schema;
    return _replaceSchemaType(schema, options, root);
  }
  for (const option of options) {
    option.original = schema;
    schema = _replaceSchemaType(schema, option, root);
  }
  return schema;
};
const _replaceSchemaType = (schema, options, root = true) => {
  if (!schema) return schema;
  if (options.untilObjectFound && !root && schema.type === "object")
    return schema;
  const fromSymbol = options.from[Kind];
  if (schema.oneOf) {
    for (let i = 0; i < schema.oneOf.length; i++)
      schema.oneOf[i] = _replaceSchemaType(schema.oneOf[i], options, root);
    return schema;
  }
  if (schema.anyOf) {
    for (let i = 0; i < schema.anyOf.length; i++)
      schema.anyOf[i] = _replaceSchemaType(schema.anyOf[i], options, root);
    return schema;
  }
  if (schema.allOf) {
    for (let i = 0; i < schema.allOf.length; i++)
      schema.allOf[i] = _replaceSchemaType(schema.allOf[i], options, root);
    return schema;
  }
  if (schema.not) return _replaceSchemaType(schema.not, options, root);
  const isRoot = root && !!options.excludeRoot;
  if (schema[Kind] === fromSymbol) {
    const { anyOf, oneOf, allOf, not, properties: properties2, items, ...rest } = schema;
    const to = options.to(rest);
    if (!to) return schema;
    let transform;
    const composeProperties = (v) => {
      if (properties2 && v.type === "object") {
        const newProperties = {};
        for (const [key, value2] of Object.entries(properties2))
          newProperties[key] = _replaceSchemaType(
            value2,
            options,
            false
          );
        return {
          ...rest,
          ...v,
          properties: newProperties
        };
      }
      if (items && v.type === "array")
        return {
          ...rest,
          ...v,
          items: _replaceSchemaType(items, options, false)
        };
      const value = {
        ...rest,
        ...v
      };
      delete value["required"];
      if (properties2 && v.type === "string" && v.format === "ObjectString" && v.default === "{}") {
        transform = t.ObjectString(properties2, rest);
        value.default = JSON.stringify(
          Value.Create(t.Object(properties2))
        );
        value.properties = properties2;
      }
      if (items && v.type === "string" && v.format === "ArrayString" && v.default === "[]") {
        transform = t.ArrayString(items, rest);
        value.default = JSON.stringify(Value.Create(t.Array(items)));
        value.items = items;
      }
      return value;
    };
    if (isRoot) {
      if (properties2) {
        const newProperties = {};
        for (const [key, value] of Object.entries(properties2))
          newProperties[key] = _replaceSchemaType(
            value,
            options,
            false
          );
        return {
          ...rest,
          properties: newProperties
        };
      } else if (items?.map)
        return {
          ...rest,
          items: items.map(
            (v) => _replaceSchemaType(v, options, false)
          )
        };
      return rest;
    }
    if (to.anyOf)
      for (let i = 0; i < to.anyOf.length; i++)
        to.anyOf[i] = composeProperties(to.anyOf[i]);
    else if (to.oneOf)
      for (let i = 0; i < to.oneOf.length; i++)
        to.oneOf[i] = composeProperties(to.oneOf[i]);
    else if (to.allOf)
      for (let i = 0; i < to.allOf.length; i++)
        to.allOf[i] = composeProperties(to.allOf[i]);
    else if (to.not) to.not = composeProperties(to.not);
    if (transform) to[TransformKind] = transform[TransformKind];
    if (to.anyOf || to.oneOf || to.allOf || to.not) return to;
    if (properties2) {
      const newProperties = {};
      for (const [key, value] of Object.entries(properties2))
        newProperties[key] = _replaceSchemaType(
          value,
          options,
          false
        );
      return {
        ...rest,
        ...to,
        properties: newProperties
      };
    } else if (items?.map)
      return {
        ...rest,
        ...to,
        items: items.map(
          (v) => _replaceSchemaType(v, options, false)
        )
      };
    return {
      ...rest,
      ...to
    };
  }
  const properties = schema?.properties;
  if (properties && root && options.rootOnly !== true)
    for (const [key, value] of Object.entries(properties)) {
      switch (value[Kind]) {
        case fromSymbol:
          const { anyOf, oneOf, allOf, not, type, ...rest } = value;
          const to = options.to(rest);
          if (!to) return schema;
          if (to.anyOf)
            for (let i = 0; i < to.anyOf.length; i++)
              to.anyOf[i] = { ...rest, ...to.anyOf[i] };
          else if (to.oneOf)
            for (let i = 0; i < to.oneOf.length; i++)
              to.oneOf[i] = { ...rest, ...to.oneOf[i] };
          else if (to.allOf)
            for (let i = 0; i < to.allOf.length; i++)
              to.allOf[i] = { ...rest, ...to.allOf[i] };
          else if (to.not) to.not = { ...rest, ...to.not };
          properties[key] = {
            ...rest,
            ..._replaceSchemaType(rest, options, false)
          };
          break;
        case "Object":
        case "Union":
          properties[key] = _replaceSchemaType(value, options, false);
          break;
        default:
          if (Array.isArray(value.items)) {
            for (let i = 0; i < value.items.length; i++) {
              value.items[i] = _replaceSchemaType(
                value.items[i],
                options,
                false
              );
            }
          } else if (value.anyOf || value.oneOf || value.allOf || value.not)
            properties[key] = _replaceSchemaType(
              value,
              options,
              false
            );
          else if (value.type === "array") {
            value.items = _replaceSchemaType(
              value.items,
              options,
              false
            );
          }
          break;
      }
    }
  return schema;
};
const createCleaner = (schema) => (value) => {
  if (typeof value === "object")
    try {
      return Value.Clean(schema, structuredClone(value));
    } catch {
      try {
        return Value.Clean(schema, value);
      } catch {
        return value;
      }
    }
  return value;
};
const getSchemaValidator = (s, {
  models = {},
  dynamic = false,
  modules,
  normalize = false,
  additionalProperties = false,
  coerce = false,
  additionalCoerce = []
} = {
  modules: t.Module({})
}) => {
  if (!s) return void 0;
  let schema;
  if (typeof s !== "string") schema = s;
  else {
    const isArray = s.endsWith("[]");
    const key = isArray ? s.substring(0, s.length - 2) : s;
    schema = modules.Import(key) ?? models[key];
    if (isArray) schema = t.Array(schema);
  }
  if (!schema) return void 0;
  if (coerce || additionalCoerce) {
    if (coerce)
      schema = replaceSchemaType(schema, [
        {
          from: t.Ref(""),
          // @ts-expect-error
          to: (options) => modules.Import(options["$ref"])
        },
        {
          from: t.Number(),
          to: (options) => t.Numeric(options),
          untilObjectFound: true
        },
        {
          from: t.Boolean(),
          to: (options) => t.BooleanString(options),
          untilObjectFound: true
        },
        ...Array.isArray(additionalCoerce) ? additionalCoerce : [additionalCoerce]
      ]);
    else {
      schema = replaceSchemaType(schema, [
        {
          from: t.Ref(""),
          // @ts-expect-error
          to: (options) => modules.Import(options["$ref"])
        },
        ...Array.isArray(additionalCoerce) ? additionalCoerce : [additionalCoerce]
      ]);
    }
  }
  if (schema.type === "object" && "additionalProperties" in schema === false)
    schema.additionalProperties = additionalProperties;
  if (dynamic) {
    const validator = {
      schema,
      references: "",
      checkFunc: () => {
      },
      code: "",
      Check: (value) => Value.Check(schema, value),
      Errors: (value) => Value.Errors(schema, value),
      Code: () => "",
      Clean: createCleaner(schema),
      Decode: (value) => Value.Decode(schema, value),
      Encode: (value) => Value.Encode(schema, value)
    };
    if (normalize && schema.additionalProperties === false)
      validator.Clean = createCleaner(schema);
    if (schema.config) {
      validator.config = schema.config;
      if (validator?.schema?.config)
        delete validator.schema.config;
    }
    validator.parse = (v) => {
      try {
        return validator.Decode(v);
      } catch (error) {
        throw [...validator.Errors(v)].map(mapValueError);
      }
    };
    validator.safeParse = (v) => {
      try {
        return { success: true, data: validator.Decode(v), error: null };
      } catch (error) {
        const errors = [...compiled.Errors(v)].map(mapValueError);
        return {
          success: false,
          data: null,
          error: errors[0]?.summary,
          errors
        };
      }
    };
    return validator;
  }
  const compiled = TypeCompiler.Compile(schema, Object.values(models));
  compiled.Clean = createCleaner(schema);
  if (schema.config) {
    compiled.config = schema.config;
    if (compiled?.schema?.config)
      delete compiled.schema.config;
  }
  compiled.parse = (v) => {
    try {
      return compiled.Decode(v);
    } catch (error) {
      throw [...compiled.Errors(v)].map(mapValueError);
    }
  };
  compiled.safeParse = (v) => {
    try {
      return { success: true, data: compiled.Decode(v), error: null };
    } catch (error) {
      const errors = [...compiled.Errors(v)].map(mapValueError);
      return {
        success: false,
        data: null,
        error: errors[0]?.summary,
        errors
      };
    }
  };
  return compiled;
};
const getResponseSchemaValidator = (s, {
  models = {},
  modules,
  dynamic = false,
  normalize = false,
  additionalProperties = false
}) => {
  if (!s) return;
  let maybeSchemaOrRecord;
  if (typeof s !== "string") maybeSchemaOrRecord = s;
  else {
    const isArray = s.endsWith("[]");
    const key = isArray ? s.substring(0, s.length - 2) : s;
    maybeSchemaOrRecord = modules.Import(key) ?? models[key];
    if (isArray)
      maybeSchemaOrRecord = t.Array(maybeSchemaOrRecord);
  }
  if (!maybeSchemaOrRecord) return;
  const compile = (schema, references) => {
    if (dynamic)
      return {
        schema,
        references: "",
        checkFunc: () => {
        },
        code: "",
        Check: (value) => Value.Check(schema, value),
        Errors: (value) => Value.Errors(schema, value),
        Code: () => "",
        Clean: createCleaner(schema),
        Decode: (value) => Value.Decode(schema, value),
        Encode: (value) => Value.Encode(schema, value)
      };
    const compiledValidator = TypeCompiler.Compile(schema, references);
    if (normalize && schema.additionalProperties === false)
      compiledValidator.Clean = createCleaner(schema);
    return compiledValidator;
  };
  const modelValues = Object.values(models);
  if (Kind in maybeSchemaOrRecord) {
    if ("additionalProperties" in maybeSchemaOrRecord === false)
      maybeSchemaOrRecord.additionalProperties = additionalProperties;
    return {
      200: compile(maybeSchemaOrRecord, modelValues)
    };
  }
  const record = {};
  Object.keys(maybeSchemaOrRecord).forEach((status) => {
    const maybeNameOrSchema = maybeSchemaOrRecord[+status];
    if (typeof maybeNameOrSchema === "string") {
      if (maybeNameOrSchema in models) {
        const schema = models[maybeNameOrSchema];
        schema.type === "object" && "additionalProperties" in schema === false;
        record[+status] = Kind in schema ? compile(schema, modelValues) : schema;
      }
      return void 0;
    }
    if (maybeNameOrSchema.type === "object" && "additionalProperties" in maybeNameOrSchema === false)
      maybeNameOrSchema.additionalProperties = additionalProperties;
    record[+status] = Kind in maybeNameOrSchema ? compile(maybeNameOrSchema, modelValues) : maybeNameOrSchema;
  });
  return record;
};
const isBun = typeof Bun !== "undefined";
const hasHash = isBun && typeof Bun.hash === "function";
const checksum = (s) => {
  if (hasHash) return Bun.hash(s);
  let h = 9;
  for (let i = 0; i < s.length; ) h = Math.imul(h ^ s.charCodeAt(i++), 9 ** 9);
  return h = h ^ h >>> 9;
};
let _stringToStructureCoercions;
const stringToStructureCoercions = () => {
  if (!_stringToStructureCoercions) {
    _stringToStructureCoercions = [
      {
        from: t.Object({}),
        to: () => t.ObjectString({}),
        excludeRoot: true
      },
      {
        from: t.Array(t.Any()),
        to: () => t.ArrayString(t.Any())
      }
    ];
  }
  return _stringToStructureCoercions;
};
let _coercePrimitiveRoot;
const coercePrimitiveRoot = () => {
  if (!_coercePrimitiveRoot)
    _coercePrimitiveRoot = [
      {
        from: t.Number(),
        to: (options) => t.Numeric(options),
        rootOnly: true
      },
      {
        from: t.Boolean(),
        to: (options) => t.BooleanString(options),
        rootOnly: true
      }
    ];
  return _coercePrimitiveRoot;
};
const getCookieValidator = ({
  validator,
  modules,
  defaultConfig = {},
  config,
  dynamic,
  models
}) => {
  let cookieValidator = getSchemaValidator(validator, {
    modules,
    dynamic,
    models,
    additionalProperties: true,
    coerce: true,
    additionalCoerce: stringToStructureCoercions()
  });
  if (isNotEmpty(defaultConfig)) {
    if (cookieValidator) {
      cookieValidator.config = mergeCookie(
        // @ts-expect-error private
        cookieValidator.config,
        config
      );
    } else {
      cookieValidator = getSchemaValidator(t.Cookie({}), {
        modules,
        dynamic,
        models,
        additionalProperties: true
      });
      cookieValidator.config = defaultConfig;
    }
  }
  return cookieValidator;
};
const injectChecksum = (checksum2, x) => {
  if (!x) return;
  if (!Array.isArray(x)) {
    const fn = x;
    if (checksum2 && !fn.checksum) fn.checksum = checksum2;
    if (fn.scope === "scoped") fn.scope = "local";
    return fn;
  }
  const fns = [...x];
  for (const fn of fns) {
    if (checksum2 && !fn.checksum) fn.checksum = checksum2;
    if (fn.scope === "scoped") fn.scope = "local";
  }
  return fns;
};
const mergeLifeCycle = (a, b, checksum2) => {
  return {
    start: mergeObjectArray(
      a.start,
      injectChecksum(checksum2, b?.start)
    ),
    request: mergeObjectArray(
      a.request,
      injectChecksum(checksum2, b?.request)
    ),
    parse: mergeObjectArray(
      a.parse,
      injectChecksum(checksum2, b?.parse)
    ),
    transform: mergeObjectArray(
      a.transform,
      injectChecksum(checksum2, b?.transform)
    ),
    beforeHandle: mergeObjectArray(
      mergeObjectArray(
        // @ts-ignore
        fnToContainer(a.resolve, "resolve"),
        a.beforeHandle
      ),
      injectChecksum(
        checksum2,
        mergeObjectArray(
          fnToContainer(b?.resolve, "resolve"),
          b?.beforeHandle
        )
      )
    ),
    afterHandle: mergeObjectArray(
      a.afterHandle,
      injectChecksum(checksum2, b?.afterHandle)
    ),
    mapResponse: mergeObjectArray(
      a.mapResponse,
      injectChecksum(checksum2, b?.mapResponse)
    ),
    afterResponse: mergeObjectArray(
      a.afterResponse,
      injectChecksum(checksum2, b?.afterResponse)
    ),
    // Already merged on Elysia._use, also logic is more complicated, can't directly merge
    trace: mergeObjectArray(
      a.trace,
      injectChecksum(checksum2, b?.trace)
    ),
    error: mergeObjectArray(
      a.error,
      injectChecksum(checksum2, b?.error)
    ),
    stop: mergeObjectArray(
      a.stop,
      injectChecksum(checksum2, b?.stop)
    )
  };
};
const asHookType = (fn, inject, { skipIfHasType = false } = {}) => {
  if (!fn) return fn;
  if (!Array.isArray(fn)) {
    if (skipIfHasType) fn.scope ??= inject;
    else fn.scope = inject;
    return fn;
  }
  for (const x of fn)
    if (skipIfHasType) x.scope ??= inject;
    else x.scope = inject;
  return fn;
};
const filterGlobal = (fn) => {
  if (!fn) return fn;
  if (!Array.isArray(fn))
    switch (fn.scope) {
      case "global":
      case "scoped":
        return { ...fn };
      default:
        return { fn };
    }
  const array = [];
  for (const x of fn)
    switch (x.scope) {
      case "global":
      case "scoped":
        array.push({
          ...x
        });
        break;
    }
  return array;
};
const filterGlobalHook = (hook) => {
  return {
    // rest is validator
    ...hook,
    type: hook?.type,
    detail: hook?.detail,
    parse: filterGlobal(hook?.parse),
    transform: filterGlobal(hook?.transform),
    beforeHandle: filterGlobal(hook?.beforeHandle),
    afterHandle: filterGlobal(hook?.afterHandle),
    mapResponse: filterGlobal(hook?.mapResponse),
    afterResponse: filterGlobal(hook?.afterResponse),
    error: filterGlobal(hook?.error),
    trace: filterGlobal(hook?.trace)
  };
};
const StatusMap = {
  Continue: 100,
  "Switching Protocols": 101,
  Processing: 102,
  "Early Hints": 103,
  OK: 200,
  Created: 201,
  Accepted: 202,
  "Non-Authoritative Information": 203,
  "No Content": 204,
  "Reset Content": 205,
  "Partial Content": 206,
  "Multi-Status": 207,
  "Already Reported": 208,
  "Multiple Choices": 300,
  "Moved Permanently": 301,
  Found: 302,
  "See Other": 303,
  "Not Modified": 304,
  "Temporary Redirect": 307,
  "Permanent Redirect": 308,
  "Bad Request": 400,
  Unauthorized: 401,
  "Payment Required": 402,
  Forbidden: 403,
  "Not Found": 404,
  "Method Not Allowed": 405,
  "Not Acceptable": 406,
  "Proxy Authentication Required": 407,
  "Request Timeout": 408,
  Conflict: 409,
  Gone: 410,
  "Length Required": 411,
  "Precondition Failed": 412,
  "Payload Too Large": 413,
  "URI Too Long": 414,
  "Unsupported Media Type": 415,
  "Range Not Satisfiable": 416,
  "Expectation Failed": 417,
  "I'm a teapot": 418,
  "Misdirected Request": 421,
  "Unprocessable Content": 422,
  Locked: 423,
  "Failed Dependency": 424,
  "Too Early": 425,
  "Upgrade Required": 426,
  "Precondition Required": 428,
  "Too Many Requests": 429,
  "Request Header Fields Too Large": 431,
  "Unavailable For Legal Reasons": 451,
  "Internal Server Error": 500,
  "Not Implemented": 501,
  "Bad Gateway": 502,
  "Service Unavailable": 503,
  "Gateway Timeout": 504,
  "HTTP Version Not Supported": 505,
  "Variant Also Negotiates": 506,
  "Insufficient Storage": 507,
  "Loop Detected": 508,
  "Not Extended": 510,
  "Network Authentication Required": 511
};
const InvertedStatusMap = Object.fromEntries(
  Object.entries(StatusMap).map(([k, v]) => [v, k])
);
function removeTrailingEquals(digest) {
  let trimmedDigest = digest;
  while (trimmedDigest.endsWith("=")) {
    trimmedDigest = trimmedDigest.slice(0, -1);
  }
  return trimmedDigest;
}
const encoder = new TextEncoder();
const signCookie = async (val, secret) => {
  if (typeof val !== "string")
    throw new TypeError("Cookie value must be provided as a string.");
  if (secret === null) throw new TypeError("Secret key must be provided.");
  const secretKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const hmacBuffer = await crypto.subtle.sign(
    "HMAC",
    secretKey,
    encoder.encode(val)
  );
  return val + "." + removeTrailingEquals(Buffer.from(hmacBuffer).toString("base64"));
};
const unsignCookie = async (input, secret) => {
  if (typeof input !== "string")
    throw new TypeError("Signed cookie string must be provided.");
  if (null === secret) throw new TypeError("Secret key must be provided.");
  const tentativeValue = input.slice(0, input.lastIndexOf("."));
  const expectedInput = await signCookie(tentativeValue, secret);
  return expectedInput === input ? tentativeValue : false;
};
const traceBackMacro = (extension, property, manage) => {
  if (!extension || typeof extension !== "object" || !property) return;
  for (const [key, value] of Object.entries(property)) {
    if (key in primitiveHookMap || !(key in extension)) continue;
    const v = extension[key];
    if (typeof v === "function") {
      const hook = v(value);
      if (typeof hook === "object") {
        for (const [k, v2] of Object.entries(hook)) {
          manage(k)({
            fn: v2
          });
        }
      }
    }
    delete property[key];
  }
};
const createMacroManager = ({
  globalHook,
  localHook
}) => (stackName) => (type, fn) => {
  if (typeof type === "function")
    type = {
      fn: type
    };
  if (stackName === "resolve") {
    type = {
      ...type,
      subType: "resolve"
    };
  }
  if ("fn" in type || Array.isArray(type)) {
    if (!localHook[stackName]) localHook[stackName] = [];
    if (typeof localHook[stackName] === "function")
      localHook[stackName] = [localHook[stackName]];
    if (Array.isArray(type))
      localHook[stackName] = localHook[stackName].concat(type);
    else localHook[stackName].push(type);
    return;
  }
  const { insert = "after", stack = "local" } = type;
  if (typeof fn === "function") fn = { fn };
  if (stack === "global") {
    if (!Array.isArray(fn)) {
      if (insert === "before") {
        ;
        globalHook[stackName].unshift(fn);
      } else {
        ;
        globalHook[stackName].push(fn);
      }
    } else {
      if (insert === "before") {
        globalHook[stackName] = fn.concat(
          globalHook[stackName]
        );
      } else {
        globalHook[stackName] = globalHook[stackName].concat(fn);
      }
    }
  } else {
    if (!localHook[stackName]) localHook[stackName] = [];
    if (typeof localHook[stackName] === "function")
      localHook[stackName] = [localHook[stackName]];
    if (!Array.isArray(fn)) {
      if (insert === "before") {
        ;
        localHook[stackName].unshift(fn);
      } else {
        ;
        localHook[stackName].push(fn);
      }
    } else {
      if (insert === "before") {
        localHook[stackName] = fn.concat(localHook[stackName]);
      } else {
        localHook[stackName] = localHook[stackName].concat(fn);
      }
    }
  }
};
const parseNumericString = (message) => {
  if (typeof message === "number") return message;
  if (message.length < 16) {
    if (message.trim().length === 0) return null;
    const length = Number(message);
    if (Number.isNaN(length)) return null;
    return length;
  }
  if (message.length === 16) {
    if (message.trim().length === 0) return null;
    const number = Number(message);
    if (Number.isNaN(number) || number.toString() !== message) return null;
    return number;
  }
  return null;
};
const isNumericString = (message) => parseNumericString(message) !== null;
class PromiseGroup {
  constructor(onError = console.error) {
    this.onError = onError;
    this.root = null;
    this.promises = [];
  }
  /**
   * The number of promises still being awaited.
   */
  get size() {
    return this.promises.length;
  }
  /**
   * Add a promise to the group.
   * @returns The promise that was added.
   */
  add(promise) {
    this.promises.push(promise);
    this.root ||= this.drain();
    return promise;
  }
  async drain() {
    while (this.promises.length > 0) {
      try {
        await this.promises[0];
      } catch (error) {
        this.onError(error);
      }
      this.promises.shift();
    }
    this.root = null;
  }
  // Allow the group to be awaited.
  then(onfulfilled, onrejected) {
    return (this.root ?? Promise.resolve()).then(onfulfilled, onrejected);
  }
}
const fnToContainer = (fn, subType) => {
  if (!fn) return fn;
  if (!Array.isArray(fn)) {
    if (typeof fn === "function" || typeof fn === "string")
      return subType ? { fn, subType } : { fn };
    else if ("fn" in fn) return fn;
  }
  const fns = [];
  for (const x of fn) {
    if (typeof x === "function" || typeof x === "string")
      fns.push(subType ? { fn: x, subType } : { fn: x });
    else if ("fn" in x) fns.push(x);
  }
  return fns;
};
const localHookToLifeCycleStore = (a) => {
  return {
    ...a,
    start: fnToContainer(a?.start),
    request: fnToContainer(a?.request),
    parse: fnToContainer(a?.parse),
    transform: fnToContainer(a?.transform),
    beforeHandle: fnToContainer(a?.beforeHandle),
    afterHandle: fnToContainer(a?.afterHandle),
    mapResponse: fnToContainer(a?.mapResponse),
    afterResponse: fnToContainer(a?.afterResponse),
    trace: fnToContainer(a?.trace),
    error: fnToContainer(a?.error),
    stop: fnToContainer(a?.stop)
  };
};
const lifeCycleToFn = (a) => {
  const hook = {};
  if (a.start?.map) hook.start = a.start.map((x) => x.fn);
  if (a.request?.map) hook.request = a.request.map((x) => x.fn);
  if (a.parse?.map) hook.parse = a.parse.map((x) => x.fn);
  if (a.transform?.map) hook.transform = a.transform.map((x) => x.fn);
  if (a.beforeHandle?.map) hook.beforeHandle = a.beforeHandle.map((x) => x.fn);
  if (a.afterHandle?.map) hook.afterHandle = a.afterHandle.map((x) => x.fn);
  if (a.mapResponse?.map) hook.mapResponse = a.mapResponse.map((x) => x.fn);
  if (a.afterResponse?.map)
    hook.afterResponse = a.afterResponse.map((x) => x.fn);
  if (a.trace?.map) hook.trace = a.trace.map((x) => x.fn);
  if (a.error?.map) hook.error = a.error.map((x) => x.fn);
  if (a.stop?.map) hook.stop = a.stop.map((x) => x.fn);
  return hook;
};
const cloneInference = (inference) => ({
  body: inference.body,
  cookie: inference.cookie,
  headers: inference.headers,
  query: inference.query,
  set: inference.set,
  server: inference.server,
  request: inference.request,
  route: inference.route
});
const redirect = (url, status = 302) => Response.redirect(url, status);
const ELYSIA_FORM_DATA = Symbol("ElysiaFormData");
const ELYSIA_REQUEST_ID = Symbol("ElysiaRequestId");
const form = (items) => {
  const formData = new FormData();
  for (const [key, value] of Object.entries(items)) {
    if (Array.isArray(value)) {
      for (const v of value) {
        if (value instanceof File)
          formData.append(key, value, value.name);
        formData.append(key, v);
      }
      continue;
    }
    if (value instanceof File) formData.append(key, value, value.name);
    formData.append(key, value);
  }
  return formData;
};
const randomId = () => {
  const uuid = crypto.randomUUID();
  return uuid.slice(0, 8) + uuid.slice(24, 32);
};
const deduplicateChecksum = (array) => {
  const hashes = [];
  for (let i = 0; i < array.length; i++) {
    const item = array[i];
    if (item.checksum) {
      if (hashes.includes(item.checksum)) {
        array.splice(i, 1);
        i--;
      }
      hashes.push(item.checksum);
    }
  }
  return array;
};
const promoteEvent = (events, as = "scoped") => {
  if (!events) return;
  if (as === "scoped") {
    for (const event of events)
      if ("scope" in event && event.scope === "local")
        event.scope = "scoped";
    return;
  }
  for (const event of events) if ("scope" in event) event.scope = "global";
};
const getLoosePath = (path) => {
  if (path.charCodeAt(path.length - 1) === 47)
    return path.slice(0, path.length - 1);
  return path + "/";
};
const isNotEmpty = (obj) => {
  if (!obj) return false;
  for (const x in obj) return true;
  return false;
};
const isEmptyHookProperty = (prop) => {
  if (Array.isArray(prop)) return prop.length === 0;
  return !prop;
};
const compressHistoryHook = (hook) => {
  const history = { ...hook };
  if (isEmptyHookProperty(hook.afterHandle)) delete history.afterHandle;
  if (isEmptyHookProperty(hook.afterResponse)) delete history.afterResponse;
  if (isEmptyHookProperty(hook.beforeHandle)) delete history.beforeHandle;
  if (isEmptyHookProperty(hook.error)) delete history.error;
  if (isEmptyHookProperty(hook.mapResponse)) delete history.mapResponse;
  if (isEmptyHookProperty(hook.parse)) delete history.parse;
  if (isEmptyHookProperty(hook.request)) delete history.request;
  if (isEmptyHookProperty(hook.start)) delete history.start;
  if (isEmptyHookProperty(hook.stop)) delete history.stop;
  if (isEmptyHookProperty(hook.trace)) delete history.trace;
  if (isEmptyHookProperty(hook.transform)) delete history.transform;
  if (!history.type) delete history.type;
  if (history.detail && !Object.keys(history.detail).length)
    delete history.detail;
  if (!history.body) delete history.body;
  if (!history.cookie) delete history.cookie;
  if (!history.headers) delete history.headers;
  if (!history.query) delete history.query;
  if (!history.params) delete history.params;
  if (!history.response) delete history.response;
  return history;
};
const decompressHistoryHook = (hook) => {
  const history = { ...hook };
  if (!history.afterHandle) history.afterHandle = [];
  if (!history.afterResponse) history.afterResponse = [];
  if (!history.beforeHandle) history.beforeHandle = [];
  if (!history.error) history.error = [];
  if (!history.mapResponse) history.mapResponse = [];
  if (!history.parse) history.parse = [];
  if (!history.request) history.request = [];
  if (!history.start) history.start = [];
  if (!history.stop) history.stop = [];
  if (!history.trace) history.trace = [];
  if (!history.transform) history.transform = [];
  if (!history.body) history.body = void 0;
  if (!history.cookie) history.cookie = void 0;
  if (!history.headers) history.headers = void 0;
  if (!history.query) history.query = void 0;
  if (!history.params) history.params = void 0;
  if (!history.response) history.response = void 0;
  return history;
};
const encodePath = (path, { dynamic = false } = {}) => {
  let encoded = encodeURIComponent(path).replace(/%2F/g, "/");
  if (dynamic) encoded = encoded.replace(/%3A/g, ":").replace(/%3F/g, "?");
  return encoded;
};
export {
  ELYSIA_FORM_DATA,
  ELYSIA_REQUEST_ID,
  InvertedStatusMap,
  PromiseGroup,
  StatusMap,
  asHookType,
  checksum,
  cloneInference,
  coercePrimitiveRoot,
  compressHistoryHook,
  createMacroManager,
  decompressHistoryHook,
  deduplicateChecksum,
  encodePath,
  filterGlobalHook,
  fnToContainer,
  form,
  getCookieValidator,
  getLoosePath,
  getResponseSchemaValidator,
  getSchemaValidator,
  hasHeaderShorthand,
  injectChecksum,
  isClass,
  isNotEmpty,
  isNumericString,
  lifeCycleToFn,
  localHookToLifeCycleStore,
  mergeCookie,
  mergeDeep,
  mergeHook,
  mergeLifeCycle,
  mergeObjectArray,
  mergeResponse,
  mergeSchemaValidator,
  primitiveHooks,
  promoteEvent,
  randomId,
  redirect,
  replaceSchemaType,
  replaceUrlPath,
  signCookie,
  stringToStructureCoercions,
  traceBackMacro,
  unsignCookie
};
