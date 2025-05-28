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
var deuri_exports = {};
__export(deuri_exports, {
  decode: () => decode,
  decodeSegment: () => decodeSegment,
  encode: () => encode
});
module.exports = __toCommonJS(deuri_exports);
const hex = [];
for (let i = 48; i < 58; i++) hex[i] = i - 48;
for (let i = 0; i < 6; i++)
  hex[i + 65] = hex[i + 97] = i + 10;
const calcHex = (a, b) => {
  if (a in hex && b in hex) return hex[a] << 4 | hex[b];
  return 255;
};
const type = [
  ...new Array(128).fill(0),
  ...new Array(16).fill(1),
  ...new Array(16).fill(2),
  ...new Array(32).fill(3),
  4,
  4,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  6,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  8,
  7,
  7,
  10,
  9,
  9,
  9,
  11,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4
];
const next = [
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  12,
  0,
  0,
  0,
  0,
  24,
  36,
  48,
  60,
  72,
  84,
  96,
  0,
  12,
  12,
  12,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  24,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  24,
  24,
  24,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  24,
  24,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  48,
  48,
  48,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  48,
  48,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  48,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0
];
const mask = type.map(
  (val) => [
    127,
    63,
    63,
    63,
    0,
    31,
    15,
    15,
    15,
    7,
    7,
    7
  ][val]
);
const decode = (url) => {
  let percentPosition = url.indexOf("%");
  if (percentPosition === -1) return url;
  let end = url.length - 3;
  if (percentPosition > end) return null;
  let decoded = "", start = 0, codepoint = 0, startOfOctets = percentPosition, state = 12, byte;
  for (; ; ) {
    byte = calcHex(
      url.charCodeAt(percentPosition + 1),
      url.charCodeAt(percentPosition + 2)
    );
    state = next[state + type[byte]];
    if (state === 0) return null;
    if (state === 12) {
      decoded += url.substring(start, startOfOctets);
      codepoint = codepoint << 6 | byte & mask[byte];
      if (codepoint > 65535)
        decoded += String.fromCharCode(
          55232 + (codepoint >> 10),
          56320 + (codepoint & 1023)
        );
      else decoded += String.fromCharCode(codepoint);
      start = percentPosition + 3;
      percentPosition = url.indexOf("%", start);
      if (percentPosition === -1) return decoded + url.substring(start);
      if (percentPosition > end) return null;
      startOfOctets = percentPosition;
      codepoint = 0;
    } else {
      percentPosition += 3;
      if (percentPosition > end || url.charCodeAt(percentPosition) !== 37)
        return null;
      codepoint = codepoint << 6 | byte & mask[byte];
    }
  }
};
const encode = (str) => str.isWellFormed() ? encodeURIComponent(str) : null;
const decodeSegment = (url, start, end) => {
  let percentPosition = url.indexOf("%");
  if (percentPosition === -1) return url;
  end -= 3;
  if (percentPosition > end) return null;
  let decoded = "", codepoint = 0, startOfOctets = percentPosition, state = 12, byte;
  for (; ; ) {
    byte = calcHex(
      url.charCodeAt(percentPosition + 1),
      url.charCodeAt(percentPosition + 2)
    );
    state = next[state + type[byte]];
    if (state === 0) return null;
    if (state === 12) {
      decoded += url.substring(start, startOfOctets);
      codepoint = codepoint << 6 | byte & mask[byte];
      if (codepoint > 65535)
        decoded += String.fromCharCode(
          55232 + (codepoint >> 10),
          56320 + (codepoint & 1023)
        );
      else decoded += String.fromCharCode(codepoint);
      start = percentPosition + 3;
      percentPosition = url.indexOf("%", start);
      if (percentPosition === -1) return decoded + url.substring(start);
      if (percentPosition > end) return null;
      startOfOctets = percentPosition;
      codepoint = 0;
    } else {
      percentPosition += 3;
      if (percentPosition > end || url.charCodeAt(percentPosition) !== 37)
        return null;
      codepoint = codepoint << 6 | byte & mask[byte];
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  decode,
  decodeSegment,
  encode
});
