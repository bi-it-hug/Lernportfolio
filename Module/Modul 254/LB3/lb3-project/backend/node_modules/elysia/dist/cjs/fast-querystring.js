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
var fast_querystring_exports = {};
__export(fast_querystring_exports, {
  parseQuery: () => parseQuery,
  parseQueryFromURL: () => parseQueryFromURL
});
module.exports = __toCommonJS(fast_querystring_exports);
var import_deuri = require("./deuri");
const plusRegex = /\+/g;
function parseQueryFromURL(input) {
  const result = {};
  if (typeof input !== "string") return result;
  let key = "";
  let value = "";
  let startingIndex = -1;
  let equalityIndex = -1;
  let flags = 0;
  const l = input.length;
  for (let i = 0; i < l; i++) {
    switch (input.charCodeAt(i)) {
      case 38:
        const hasBothKeyValuePair = equalityIndex > startingIndex;
        if (!hasBothKeyValuePair) equalityIndex = i;
        key = input.slice(startingIndex + 1, equalityIndex);
        if (hasBothKeyValuePair || key.length > 0) {
          if (flags & 1) key = key.replace(plusRegex, " ");
          if (flags & 2) key = (0, import_deuri.decode)(key) || key;
          if (!result[key]) {
            if (hasBothKeyValuePair) {
              value = input.slice(equalityIndex + 1, i);
              if (flags & 4)
                value = value.replace(plusRegex, " ");
              if (flags & 8)
                value = (0, import_deuri.decode)(value) || value;
            }
            result[key] = value;
          }
        }
        key = "";
        value = "";
        startingIndex = i;
        equalityIndex = i;
        flags = 0;
        break;
      case 61:
        if (equalityIndex <= startingIndex) equalityIndex = i;
        else flags |= 8;
        break;
      case 43:
        if (equalityIndex > startingIndex) flags |= 4;
        else flags |= 1;
        break;
      case 37:
        if (equalityIndex > startingIndex) flags |= 8;
        else flags |= 2;
        break;
    }
  }
  if (startingIndex < l) {
    const hasBothKeyValuePair = equalityIndex > startingIndex;
    key = input.slice(
      startingIndex + 1,
      hasBothKeyValuePair ? equalityIndex : l
    );
    if (hasBothKeyValuePair || key.length > 0) {
      if (flags & 1) key = key.replace(plusRegex, " ");
      if (flags & 2) key = (0, import_deuri.decode)(key) || key;
      if (!result[key]) {
        if (hasBothKeyValuePair) {
          value = input.slice(equalityIndex + 1, l);
          if (flags & 4)
            value = value.replace(plusRegex, " ");
          if (flags & 8) value = (0, import_deuri.decode)(value) || value;
        }
        result[key] = value;
      }
    }
  }
  return result;
}
const parseQuery = (input) => {
  const result = {};
  if (typeof input !== "string") return result;
  const inputLength = input.length;
  let key = "";
  let value = "";
  let startingIndex = -1;
  let equalityIndex = -1;
  let shouldDecodeKey = false;
  let shouldDecodeValue = false;
  let keyHasPlus = false;
  let valueHasPlus = false;
  let hasBothKeyValuePair = false;
  let c = 0;
  for (let i = 0; i < inputLength + 1; i++) {
    if (i !== inputLength) c = input.charCodeAt(i);
    else c = 38;
    switch (c) {
      case 38: {
        hasBothKeyValuePair = equalityIndex > startingIndex;
        if (!hasBothKeyValuePair) equalityIndex = i;
        key = input.slice(startingIndex + 1, equalityIndex);
        if (hasBothKeyValuePair || key.length > 0) {
          if (keyHasPlus) key = key.replace(plusRegex, " ");
          if (shouldDecodeKey) key = (0, import_deuri.decode)(key) || key;
          if (hasBothKeyValuePair) {
            value = input.slice(equalityIndex + 1, i);
            if (valueHasPlus) value = value.replace(plusRegex, " ");
            if (shouldDecodeValue)
              value = (0, import_deuri.decode)(value) || value;
          }
          const currentValue = result[key];
          if (currentValue === void 0)
            result[key] = value;
          else {
            if (currentValue.pop) currentValue.push(value);
            else result[key] = [currentValue, value];
          }
        }
        value = "";
        startingIndex = i;
        equalityIndex = i;
        shouldDecodeKey = false;
        shouldDecodeValue = false;
        keyHasPlus = false;
        valueHasPlus = false;
        break;
      }
      // Check '='
      case 61:
        if (equalityIndex <= startingIndex) equalityIndex = i;
        else shouldDecodeValue = true;
        break;
      // Check '+', and remember to replace it with empty space.
      case 43:
        if (equalityIndex > startingIndex) valueHasPlus = true;
        else keyHasPlus = true;
        break;
      // Check '%' character for encoding
      case 37:
        if (equalityIndex > startingIndex) shouldDecodeValue = true;
        else shouldDecodeKey = true;
        break;
    }
  }
  return result;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  parseQuery,
  parseQueryFromURL
});
