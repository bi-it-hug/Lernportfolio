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
var handler_exports = {};
__export(handler_exports, {
  createNativeStaticHandler: () => createNativeStaticHandler,
  createStaticHandler: () => import_handler.createStaticHandler,
  mapCompactResponse: () => import_handler.mapCompactResponse,
  mapEarlyResponse: () => import_handler.mapEarlyResponse,
  mapResponse: () => import_handler.mapResponse
});
module.exports = __toCommonJS(handler_exports);
var import_handler = require("../web-standard/handler");
const createNativeStaticHandler = (handle, hooks, setHeaders = {}) => {
  if (typeof handle === "function" || handle instanceof Blob) return;
  if (typeof handle === "object" && handle?.toString() === "[object HTMLBundle]")
    return () => handle;
  const response = (0, import_handler.mapResponse)(handle, {
    headers: setHeaders
  });
  if (!hooks.parse?.length && !hooks.transform?.length && !hooks.beforeHandle?.length && !hooks.afterHandle?.length) {
    if (!response.headers.has("content-type"))
      response.headers.append("content-type", "text/plain;charset=utf-8");
    return response.clone.bind(response);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createNativeStaticHandler,
  createStaticHandler,
  mapCompactResponse,
  mapEarlyResponse,
  mapResponse
});
