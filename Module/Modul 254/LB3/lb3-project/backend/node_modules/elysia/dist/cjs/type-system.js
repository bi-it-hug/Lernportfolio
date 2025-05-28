"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var type_system_exports = {};
__export(type_system_exports, {
  ElysiaType: () => ElysiaType,
  FormatRegistry: () => import_typebox3.FormatRegistry,
  TypeCheck: () => import_compiler2.TypeCheck,
  TypeCompiler: () => import_compiler2.TypeCompiler,
  TypeRegistry: () => import_typebox3.TypeRegistry,
  TypeSystem: () => import_system.TypeSystem,
  TypeSystemDuplicateFormat: () => import_system.TypeSystemDuplicateFormat,
  TypeSystemDuplicateTypeKind: () => import_system.TypeSystemDuplicateTypeKind,
  TypeSystemPolicy: () => import_system.TypeSystemPolicy,
  t: () => t
});
module.exports = __toCommonJS(type_system_exports);
var import_typebox = require("@sinclair/typebox");
var import_typebox2 = require("@sinclair/typebox");
var import_compiler = require("@sinclair/typebox/compiler");
var import_value = require("@sinclair/typebox/value");
var import_formats = require("./formats");
var import_error = require("./error");
var import_system = require("@sinclair/typebox/system");
var import_typebox3 = require("@sinclair/typebox");
var import_compiler2 = require("@sinclair/typebox/compiler");
const isISO8601 = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/;
const isFormalDate = /(?:Sun|Mon|Tue|Wed|Thu|Fri|Sat)\s(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s\d{2}\s\d{4}\s\d{2}:\d{2}:\d{2}\sGMT(?:\+|-)\d{4}\s\([^)]+\)/;
const isShortenDate = /^(?:(?:(?:(?:0?[1-9]|[12][0-9]|3[01])[/\s-](?:0?[1-9]|1[0-2])[/\s-](?:19|20)\d{2})|(?:(?:19|20)\d{2}[/\s-](?:0?[1-9]|1[0-2])[/\s-](?:0?[1-9]|[12][0-9]|3[01]))))(?:\s(?:1[012]|0?[1-9]):[0-5][0-9](?::[0-5][0-9])?(?:\s[AP]M)?)?$/;
const _validateDate = import_formats.fullFormats.date;
const _validateDateTime = import_formats.fullFormats["date-time"];
if (!import_typebox.FormatRegistry.Has("date"))
  import_typebox.FormatRegistry.Set("date", (value) => {
    const temp = value.replace(/"/g, "");
    if (isISO8601.test(temp) || isFormalDate.test(temp) || isShortenDate.test(temp) || _validateDate(temp)) {
      const date = new Date(temp);
      if (!Number.isNaN(date.getTime())) return true;
    }
    return false;
  });
if (!import_typebox.FormatRegistry.Has("date-time"))
  import_typebox.FormatRegistry.Set("date-time", (value) => {
    const temp = value.replace(/"/g, "");
    if (isISO8601.test(temp) || isFormalDate.test(temp) || isShortenDate.test(temp) || _validateDateTime(temp)) {
      const date = new Date(temp);
      if (!Number.isNaN(date.getTime())) return true;
    }
    return false;
  });
Object.entries(import_formats.fullFormats).forEach((formatEntry) => {
  const [formatName, formatValue] = formatEntry;
  if (!import_typebox.FormatRegistry.Has(formatName)) {
    if (formatValue instanceof RegExp)
      import_typebox.FormatRegistry.Set(formatName, (value) => formatValue.test(value));
    else if (typeof formatValue === "function")
      import_typebox.FormatRegistry.Set(formatName, formatValue);
  }
});
const t = Object.assign({}, import_typebox.Type);
const parseFileUnit = (size) => {
  if (typeof size === "string")
    switch (size.slice(-1)) {
      case "k":
        return +size.slice(0, size.length - 1) * 1024;
      case "m":
        return +size.slice(0, size.length - 1) * 1048576;
      default:
        return +size;
    }
  return size;
};
const checkFileExtension = (type, extension) => {
  if (type.startsWith(extension)) return true;
  return extension.charCodeAt(extension.length - 1) === 42 && extension.charCodeAt(extension.length - 2) === 47 && type.startsWith(extension.slice(0, -1));
};
const validateFile = (options, value) => {
  if (!(value instanceof Blob)) return false;
  if (options.minSize && value.size < parseFileUnit(options.minSize))
    return false;
  if (options.maxSize && value.size > parseFileUnit(options.maxSize))
    return false;
  if (options.extension) {
    if (typeof options.extension === "string")
      return checkFileExtension(value.type, options.extension);
    for (let i = 0; i < options.extension.length; i++)
      if (checkFileExtension(value.type, options.extension[i]))
        return true;
    return false;
  }
  return true;
};
const File = getOrSetType(
  "File",
  validateFile
);
const Files = getOrSetType(
  "Files",
  (options, value) => {
    if (!Array.isArray(value)) return validateFile(options, value);
    if (options.minItems && value.length < options.minItems) return false;
    if (options.maxItems && value.length > options.maxItems) return false;
    for (let i = 0; i < value.length; i++)
      if (!validateFile(options, value[i])) return false;
    return true;
  }
);
if (!import_typebox.FormatRegistry.Has("numeric"))
  import_typebox.FormatRegistry.Set("numeric", (value) => !!value && !isNaN(+value));
if (!import_typebox.FormatRegistry.Has("integer"))
  import_typebox.FormatRegistry.Set(
    "integer",
    (value) => !!value && Number.isInteger(+value)
  );
if (!import_typebox.FormatRegistry.Has("boolean"))
  import_typebox.FormatRegistry.Set(
    "boolean",
    (value) => value === "true" || value === "false"
  );
if (!import_typebox.FormatRegistry.Has("ObjectString"))
  import_typebox.FormatRegistry.Set("ObjectString", (value) => {
    let start = value.charCodeAt(0);
    if (start === 9 || start === 10 || start === 32)
      start = value.trimStart().charCodeAt(0);
    if (start !== 123 && start !== 91) return false;
    try {
      JSON.parse(value);
      return true;
    } catch {
      return false;
    }
  });
if (!import_typebox.FormatRegistry.Has("ArrayString"))
  import_typebox.FormatRegistry.Set("ArrayString", (value) => {
    let start = value.charCodeAt(0);
    if (start === 9 || start === 10 || start === 32)
      start = value.trimStart().charCodeAt(0);
    if (start !== 123 && start !== 91) return false;
    try {
      JSON.parse(value);
      return true;
    } catch {
      return false;
    }
  });
if (!import_typebox.TypeRegistry.Has("UnionEnum"))
  import_typebox.TypeRegistry.Set("UnionEnum", (schema, value) => {
    return (typeof value === "number" || typeof value === "string" || value === null) && schema.enum.includes(value);
  });
const ElysiaType = {
  Numeric: (property) => {
    const schema = import_typebox.Type.Number(property);
    return t.Transform(
      t.Union(
        [
          t.String({
            format: "numeric",
            default: 0
          }),
          t.Number(property)
        ],
        property
      )
    ).Decode((value) => {
      const number = +value;
      if (isNaN(number)) return value;
      if (property && !import_value.Value.Check(schema, number))
        throw new import_error.ValidationError("property", schema, number);
      return number;
    }).Encode((value) => value);
  },
  Integer: (property) => {
    const schema = import_typebox.Type.Integer(property);
    return t.Transform(
      t.Union(
        [
          t.String({
            format: "integer",
            default: 0
          }),
          import_typebox.Type.Integer(property)
        ],
        property
      )
    ).Decode((value) => {
      const number = +value;
      if (!import_value.Value.Check(schema, number))
        throw new import_error.ValidationError("property", schema, number);
      return number;
    }).Encode((value) => value);
  },
  Date: (property) => {
    const schema = import_typebox.Type.Date(property);
    const _default = property?.default ? new Date(property.default) : void 0;
    return t.Transform(
      t.Union(
        [
          import_typebox.Type.Date(property),
          t.String({
            format: "date",
            default: _default?.toISOString()
          }),
          t.String({
            format: "date-time",
            default: _default?.toISOString()
          }),
          t.Number({ default: _default?.getTime() })
        ],
        property
      )
    ).Decode((value) => {
      if (typeof value === "number") {
        const date2 = new Date(value);
        if (!import_value.Value.Check(schema, date2))
          throw new import_error.ValidationError("property", schema, date2);
        return date2;
      }
      if (value instanceof Date) return value;
      const date = new Date(value);
      if (!date || isNaN(date.getTime()))
        throw new import_error.ValidationError("property", schema, date);
      if (!import_value.Value.Check(schema, date))
        throw new import_error.ValidationError("property", schema, date);
      return date;
    }).Encode((value) => value.toISOString());
  },
  BooleanString: (property) => {
    const schema = import_typebox.Type.Boolean(property);
    return t.Transform(
      t.Union(
        [
          t.Boolean(property),
          t.String({
            format: "boolean",
            default: false
          })
        ],
        property
      )
    ).Decode((value) => {
      if (typeof value === "string") return value === "true";
      if (value !== void 0 && !import_value.Value.Check(schema, value))
        throw new import_error.ValidationError("property", schema, value);
      return value;
    }).Encode((value) => value);
  },
  ObjectString: (properties, options) => {
    const schema = t.Object(properties, options);
    const defaultValue = JSON.stringify(import_value.Value.Create(schema));
    let compiler;
    try {
      compiler = import_compiler.TypeCompiler.Compile(schema);
    } catch {
    }
    return t.Transform(
      t.Union([
        t.String({
          format: "ObjectString",
          default: defaultValue
        }),
        schema
      ])
    ).Decode((value) => {
      if (typeof value === "string") {
        if (value.charCodeAt(0) !== 123)
          throw new import_error.ValidationError("property", schema, value);
        try {
          value = JSON.parse(value);
        } catch {
          throw new import_error.ValidationError("property", schema, value);
        }
        if (compiler) {
          if (!compiler.Check(value))
            throw new import_error.ValidationError("property", schema, value);
          return compiler.Decode(value);
        }
        if (!import_value.Value.Check(schema, value))
          throw new import_error.ValidationError("property", schema, value);
        return import_value.Value.Decode(schema, value);
      }
      return value;
    }).Encode((value) => {
      if (typeof value === "string")
        try {
          value = JSON.parse(value);
        } catch {
          throw new import_error.ValidationError("property", schema, value);
        }
      if (!import_value.Value.Check(schema, value))
        throw new import_error.ValidationError("property", schema, value);
      return JSON.stringify(value);
    });
  },
  ArrayString: (children = t.String(), options) => {
    const schema = t.Array(children, options);
    let compiler;
    try {
      compiler = import_compiler.TypeCompiler.Compile(schema);
    } catch {
    }
    const decode = (value, isProperty = false) => {
      if (value.charCodeAt(0) === 91) {
        try {
          value = JSON.parse(value);
        } catch {
          throw new import_error.ValidationError("property", schema, value);
        }
        if (compiler) {
          if (!compiler.Check(value))
            throw new import_error.ValidationError("property", schema, value);
          return compiler.Decode(value);
        }
        if (!import_value.Value.Check(schema, value))
          throw new import_error.ValidationError("property", schema, value);
        return import_value.Value.Decode(schema, value);
      }
      if (value.indexOf(",") !== -1) {
        const newValue = value.split(",").map((v) => v.trim());
        if (compiler) {
          if (!compiler.Check(newValue))
            throw new import_error.ValidationError("property", schema, value);
          return compiler.Decode(newValue);
        }
        if (!import_value.Value.Check(schema, newValue))
          throw new import_error.ValidationError("property", schema, newValue);
        return import_value.Value.Decode(schema, newValue);
      }
      if (isProperty) return value;
      throw new import_error.ValidationError("property", schema, value);
    };
    return t.Transform(
      t.Union([
        t.String({
          format: "ArrayString",
          default: options?.default
        }),
        schema
      ])
    ).Decode((value) => {
      if (Array.isArray(value)) {
        let values = [];
        for (let i = 0; i < value.length; i++) {
          const v = value[i];
          if (typeof v === "string") {
            const t2 = decode(v, true);
            if (Array.isArray(t2)) values = values.concat(t2);
            else values.push(t2);
            continue;
          }
          values.push(v);
        }
        return values;
      }
      if (typeof value === "string") return decode(value);
      return value;
    }).Encode((value) => {
      if (typeof value === "string")
        try {
          value = JSON.parse(value);
        } catch {
          throw new import_error.ValidationError("property", schema, value);
        }
      if (!import_value.Value.Check(schema, value))
        throw new import_error.ValidationError("property", schema, value);
      return JSON.stringify(value);
    });
  },
  File,
  Files: (options = {}) => t.Transform(Files(options)).Decode((value) => {
    if (Array.isArray(value)) return value;
    return [value];
  }).Encode((value) => value),
  Nullable: (schema, options) => t.Union([schema, t.Null()], options),
  /**
   * Allow Optional, Nullable and Undefined
   */
  MaybeEmpty: (schema, options) => t.Union([schema, t.Null(), t.Undefined()], options),
  Cookie: (properties, {
    domain,
    expires,
    httpOnly,
    maxAge,
    path,
    priority,
    sameSite,
    secure,
    secrets,
    sign,
    ...options
  } = {}) => {
    const v = t.Object(properties, options);
    v.config = {
      domain,
      expires,
      httpOnly,
      maxAge,
      path,
      priority,
      sameSite,
      secure,
      secrets,
      sign
    };
    return v;
  },
  // based on https://github.com/elysiajs/elysia/issues/512#issuecomment-1980134955
  UnionEnum: (values, options = {}) => {
    const type = values.every((value) => typeof value === "string") ? { type: "string" } : values.every((value) => typeof value === "number") ? { type: "number" } : values.every((value) => value === null) ? { type: "null" } : {};
    if (values.some((x) => typeof x === "object" && x !== null))
      throw new Error("This type does not support objects or arrays");
    return {
      // why it need default??
      default: values[0],
      ...options,
      [import_typebox2.Kind]: "UnionEnum",
      ...type,
      enum: values
    };
  }
};
t.BooleanString = ElysiaType.BooleanString;
t.ObjectString = ElysiaType.ObjectString;
t.ArrayString = ElysiaType.ArrayString;
t.Numeric = ElysiaType.Numeric;
t.Integer = ElysiaType.Integer;
t.File = (arg = {}) => ElysiaType.File({
  default: "File",
  ...arg,
  extension: arg?.type,
  type: "string",
  format: "binary"
});
t.Files = (arg = {}) => ElysiaType.Files({
  ...arg,
  elysiaMeta: "Files",
  default: "Files",
  extension: arg?.type,
  type: "array",
  items: {
    ...arg,
    default: "Files",
    type: "string",
    format: "binary"
  }
});
t.Nullable = (schema) => ElysiaType.Nullable(schema);
t.MaybeEmpty = ElysiaType.MaybeEmpty;
t.Cookie = ElysiaType.Cookie;
t.Date = ElysiaType.Date;
t.UnionEnum = ElysiaType.UnionEnum;
function getOrSetType(kind, func) {
  if (!import_typebox.TypeRegistry.Has(kind)) {
    import_typebox.TypeRegistry.Set(kind, func);
  }
  return (options = {}) => (0, import_typebox2.Unsafe)({ ...options, [import_typebox2.Kind]: kind });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ElysiaType,
  FormatRegistry,
  TypeCheck,
  TypeCompiler,
  TypeRegistry,
  TypeSystem,
  TypeSystemDuplicateFormat,
  TypeSystemDuplicateTypeKind,
  TypeSystemPolicy,
  t
});
