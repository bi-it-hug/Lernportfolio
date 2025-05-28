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
var error_exports = {};
__export(error_exports, {
  ERROR_CODE: () => ERROR_CODE,
  ElysiaCustomStatusResponse: () => ElysiaCustomStatusResponse,
  InternalServerError: () => InternalServerError,
  InvalidCookieSignature: () => InvalidCookieSignature,
  NotFoundError: () => NotFoundError,
  ParseError: () => ParseError,
  ValidationError: () => ValidationError,
  error: () => error,
  isProduction: () => isProduction,
  mapValueError: () => mapValueError
});
module.exports = __toCommonJS(error_exports);
var import_value = require("@sinclair/typebox/value");
var import_utils = require("./utils");
const env = typeof Bun !== "undefined" ? Bun.env : typeof process !== "undefined" ? process?.env : void 0;
const ERROR_CODE = Symbol("ElysiaErrorCode");
const isProduction = (env?.NODE_ENV ?? env?.ENV) === "production";
class ElysiaCustomStatusResponse {
  constructor(code, response) {
    const res = response ?? (code in import_utils.InvertedStatusMap ? (
      // @ts-expect-error Always correct
      import_utils.InvertedStatusMap[code]
    ) : code);
    this.code = import_utils.StatusMap[code] ?? code;
    this.response = res;
  }
}
const error = (code, response) => new ElysiaCustomStatusResponse(code, response);
class InternalServerError extends Error {
  constructor(message) {
    super(message ?? "INTERNAL_SERVER_ERROR");
    this.code = "INTERNAL_SERVER_ERROR";
    this.status = 500;
  }
}
class NotFoundError extends Error {
  constructor(message) {
    super(message ?? "NOT_FOUND");
    this.code = "NOT_FOUND";
    this.status = 404;
  }
}
class ParseError extends Error {
  constructor() {
    super("Bad Request");
    this.code = "PARSE";
    this.status = 400;
  }
}
class InvalidCookieSignature extends Error {
  constructor(key, message) {
    super(message ?? `"${key}" has invalid cookie signature`);
    this.key = key;
    this.code = "INVALID_COOKIE_SIGNATURE";
    this.status = 400;
  }
}
const mapValueError = (error2) => {
  if (!error2)
    return {
      summary: void 0
    };
  const { message, path, value, type } = error2;
  const property = path.slice(1).replaceAll("/", ".");
  const isRoot = path === "";
  switch (type) {
    case 42:
      return {
        ...error2,
        summary: isRoot ? `Value should not be provided` : `Property '${property}' should not be provided`
      };
    case 45:
      return {
        ...error2,
        summary: isRoot ? `Value is missing` : `Property '${property}' is missing`
      };
    case 50:
      const quoteIndex = message.indexOf("'");
      const format = message.slice(
        quoteIndex + 1,
        message.indexOf("'", quoteIndex + 1)
      );
      return {
        ...error2,
        summary: isRoot ? `Value should be an email` : `Property '${property}' should be ${format}`
      };
    case 54:
      return {
        ...error2,
        summary: `${message.slice(
          0,
          9
        )} property '${property}' to be ${message.slice(
          8
        )} but found: ${value}`
      };
    case 62:
      const union = error2.schema.anyOf.map((x) => `'${x?.format ?? x.type}'`).join(", ");
      return {
        ...error2,
        summary: isRoot ? `Value should be one of ${union}` : `Property '${property}' should be one of: ${union}`
      };
    default:
      return { summary: message, ...error2 };
  }
};
class ValidationError extends Error {
  constructor(type, validator, value) {
    if (value && typeof value === "object" && value instanceof ElysiaCustomStatusResponse)
      value = value.response;
    const error2 = isProduction ? void 0 : "Errors" in validator ? validator.Errors(value).First() : import_value.Value.Errors(validator, value).First();
    const customError = error2?.schema?.message || error2?.schema?.error !== void 0 ? typeof error2.schema.error === "function" ? error2.schema.error({
      type,
      validator,
      value,
      get errors() {
        return [...validator.Errors(value)].map(
          mapValueError
        );
      }
    }) : error2.schema.error : void 0;
    const accessor = error2?.path || "root";
    let message = "";
    if (customError !== void 0) {
      message = typeof customError === "object" ? JSON.stringify(customError) : customError + "";
    } else if (isProduction) {
      message = JSON.stringify({
        type: "validation",
        on: type,
        summary: mapValueError(error2).summary,
        message: error2?.message,
        found: value
      });
    } else {
      const schema = validator?.schema ?? validator;
      const errors = "Errors" in validator ? [...validator.Errors(value)].map(mapValueError) : [...import_value.Value.Errors(validator, value)].map(mapValueError);
      let expected;
      try {
        expected = import_value.Value.Create(schema);
      } catch (error3) {
        expected = {
          type: "Could not create expected value",
          // @ts-expect-error
          message: error3?.message,
          error: error3
        };
      }
      message = JSON.stringify(
        {
          type: "validation",
          on: type,
          summary: mapValueError(error2).summary,
          property: accessor,
          message: error2?.message,
          expected,
          found: value,
          errors
        },
        null,
        2
      );
    }
    super(message);
    this.type = type;
    this.validator = validator;
    this.value = value;
    this.code = "VALIDATION";
    this.status = 422;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
  get all() {
    return "Errors" in this.validator ? [...this.validator.Errors(this.value)].map(mapValueError) : (
      // @ts-ignore
      [...import_value.Value.Errors(this.validator, this.value)].map(mapValueError)
    );
  }
  static simplifyModel(validator) {
    const model = "schema" in validator ? validator.schema : validator;
    try {
      return import_value.Value.Create(model);
    } catch {
      return model;
    }
  }
  get model() {
    return ValidationError.simplifyModel(this.validator);
  }
  toResponse(headers) {
    return new Response(this.message, {
      status: 400,
      headers: {
        ...headers,
        "content-type": "application/json"
      }
    });
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ERROR_CODE,
  ElysiaCustomStatusResponse,
  InternalServerError,
  InvalidCookieSignature,
  NotFoundError,
  ParseError,
  ValidationError,
  error,
  isProduction,
  mapValueError
});
