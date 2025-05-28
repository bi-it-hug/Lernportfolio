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
var sucrose_exports = {};
__export(sucrose_exports, {
  bracketPairRange: () => bracketPairRange,
  bracketPairRangeReverse: () => bracketPairRangeReverse,
  extractMainParameter: () => extractMainParameter,
  findAlias: () => findAlias,
  findParameterReference: () => findParameterReference,
  hasReturn: () => hasReturn,
  inferBodyReference: () => inferBodyReference,
  isContextPassToFunction: () => isContextPassToFunction,
  removeColonAlias: () => removeColonAlias,
  removeDefaultParameter: () => removeDefaultParameter,
  retrieveRootParamters: () => retrieveRootParamters,
  separateFunction: () => separateFunction,
  sucrose: () => sucrose
});
module.exports = __toCommonJS(sucrose_exports);
const hasReturn = (fn) => {
  const fnLiteral = typeof fn === "object" ? fn.fn.toString() : typeof fn === "string" ? fn.toString() : fn;
  const parenthesisEnd = fnLiteral.indexOf(")");
  if (fnLiteral.charCodeAt(parenthesisEnd + 2) === 61 && fnLiteral.charCodeAt(parenthesisEnd + 5) !== 123) {
    return true;
  }
  return fnLiteral.includes("return");
};
const separateFunction = (code) => {
  if (code.startsWith("async")) code = code.slice(5);
  code = code.trimStart();
  let index = -1;
  if (code.charCodeAt(0) === 40) {
    index = code.indexOf("=>", code.indexOf(")"));
    if (index !== -1) {
      let bracketEndIndex = index;
      while (bracketEndIndex > 0)
        if (code.charCodeAt(--bracketEndIndex) === 41) break;
      let body = code.slice(index + 2);
      if (body.charCodeAt(0) === 32) body = body.trimStart();
      return [
        code.slice(1, bracketEndIndex),
        body,
        {
          isArrowReturn: body.charCodeAt(0) !== 123
        }
      ];
    }
  }
  if (/^(\w+)=>/g.test(code)) {
    index = code.indexOf("=>");
    if (index !== -1) {
      let body = code.slice(index + 2);
      if (body.charCodeAt(0) === 32) body = body.trimStart();
      return [
        code.slice(0, index),
        body,
        {
          isArrowReturn: body.charCodeAt(0) !== 123
        }
      ];
    }
  }
  if (code.startsWith("function")) {
    index = code.indexOf("(");
    const end = code.indexOf(")");
    return [
      code.slice(index + 1, end),
      code.slice(end + 2),
      {
        isArrowReturn: false
      }
    ];
  }
  const start = code.indexOf("(");
  if (start !== -1) {
    const sep = code.indexOf("\n", 2);
    const parameter = code.slice(0, sep);
    const end = parameter.lastIndexOf(")") + 1;
    const body = code.slice(sep + 1);
    return [
      parameter.slice(start, end),
      "{" + body,
      {
        isArrowReturn: false
      }
    ];
  }
  const x = code.split("\n", 2);
  return [x[0], x[1], { isArrowReturn: false }];
};
const bracketPairRange = (parameter) => {
  const start = parameter.indexOf("{");
  if (start === -1) return [-1, 0];
  let end = start + 1;
  let deep = 1;
  for (; end < parameter.length; end++) {
    const char = parameter.charCodeAt(end);
    if (char === 123) deep++;
    else if (char === 125) deep--;
    if (deep === 0) break;
  }
  if (deep !== 0) return [0, parameter.length];
  return [start, end + 1];
};
const bracketPairRangeReverse = (parameter) => {
  const end = parameter.lastIndexOf("}");
  if (end === -1) return [-1, 0];
  let start = end - 1;
  let deep = 1;
  for (; start >= 0; start--) {
    const char = parameter.charCodeAt(start);
    if (char === 125) deep++;
    else if (char === 123) deep--;
    if (deep === 0) break;
  }
  if (deep !== 0) return [-1, 0];
  return [start, end + 1];
};
const removeColonAlias = (parameter) => {
  while (true) {
    const start = parameter.indexOf(":");
    if (start === -1) break;
    let end = parameter.indexOf(",", start);
    if (end === -1) end = parameter.indexOf("}", start) - 1;
    if (end === -2) end = parameter.length;
    parameter = parameter.slice(0, start) + parameter.slice(end);
  }
  return parameter;
};
const retrieveRootParamters = (parameter) => {
  let hasParenthesis = false;
  if (parameter.charCodeAt(0) === 40) parameter = parameter.slice(1, -1);
  if (parameter.charCodeAt(0) === 123) {
    hasParenthesis = true;
    parameter = parameter.slice(1, -1);
  }
  parameter = parameter.replace(/( |\t|\n)/g, "").trim();
  let parameters = [];
  while (true) {
    let [start, end] = bracketPairRange(parameter);
    if (start === -1) break;
    parameters.push(parameter.slice(0, start - 1));
    if (parameter.charCodeAt(end) === 44) end++;
    parameter = parameter.slice(end);
  }
  parameter = removeColonAlias(parameter);
  if (parameter) parameters = parameters.concat(parameter.split(","));
  const newParameters = [];
  for (const p of parameters) {
    if (p.indexOf(",") === -1) {
      newParameters.push(p);
      continue;
    }
    for (const q of p.split(",")) newParameters.push(q.trim());
  }
  parameters = newParameters;
  return {
    hasParenthesis,
    parameters
  };
};
const findParameterReference = (parameter, inference) => {
  const { parameters, hasParenthesis } = retrieveRootParamters(parameter);
  if (!inference.query && parameters.includes("query")) inference.query = true;
  if (!inference.headers && parameters.includes("headers"))
    inference.headers = true;
  if (!inference.body && parameters.includes("body")) inference.body = true;
  if (!inference.cookie && parameters.includes("cookie"))
    inference.cookie = true;
  if (!inference.set && parameters.includes("set")) inference.set = true;
  if (!inference.server && parameters.includes("server"))
    inference.server = true;
  if (!inference.request && parameters.includes("request"))
    inference.request = true;
  if (!inference.route && parameters.includes("route")) inference.route = true;
  if (hasParenthesis) return `{ ${parameters.join(", ")} }`;
  return parameters.join(", ");
};
const findEndIndex = (type, content, index) => {
  const newLineIndex = content.indexOf(type + "\n", index);
  const newTabIndex = content.indexOf(type + "	", index);
  const commaIndex = content.indexOf(type + ",", index);
  const semicolonIndex = content.indexOf(type + ";", index);
  const emptyIndex = content.indexOf(type + " ", index);
  return [newLineIndex, newTabIndex, commaIndex, semicolonIndex, emptyIndex].filter((i) => i > 0).sort((a, b) => a - b)[0] || -1;
};
const findEndQueryBracketIndex = (type, content, index) => {
  const bracketEndIndex = content.indexOf(type + "]", index);
  const singleQuoteIndex = content.indexOf(type + "'", index);
  const doubleQuoteIndex = content.indexOf(type + '"', index);
  return [bracketEndIndex, singleQuoteIndex, doubleQuoteIndex].filter((i) => i > 0).sort((a, b) => a - b)[0] || -1;
};
const findAlias = (type, body, depth = 0) => {
  if (depth > 5) return [];
  const aliases = [];
  let content = body;
  while (true) {
    let index = findEndIndex(" = " + type, content);
    if (index === -1) index = findEndIndex("=" + type, content);
    if (index === -1) {
      let lastIndex = content.indexOf(" = " + type);
      if (lastIndex === -1) lastIndex = content.indexOf("=" + type);
      if (lastIndex + 3 + type.length !== content.length) break;
      index = lastIndex;
    }
    const part = content.slice(0, index);
    const lastPart = part.lastIndexOf(" ");
    let variable = part.slice(lastPart !== -1 ? lastPart + 1 : -1);
    if (variable === "}") {
      const [start, end] = bracketPairRangeReverse(part);
      aliases.push(removeColonAlias(content.slice(start, end)));
      content = content.slice(index + 3 + type.length);
      continue;
    }
    while (variable.charCodeAt(0) === 44) variable = variable.slice(1);
    while (variable.charCodeAt(0) === 9) variable = variable.slice(1);
    if (!variable.includes("(")) aliases.push(variable);
    content = content.slice(index + 3 + type.length);
  }
  for (const alias of aliases) {
    if (alias.charCodeAt(0) === 123) continue;
    const deepAlias = findAlias(alias, body);
    if (deepAlias.length > 0) aliases.push(...deepAlias);
  }
  return aliases;
};
const extractMainParameter = (parameter) => {
  if (!parameter) return;
  if (parameter.charCodeAt(0) !== 123) return parameter;
  parameter = parameter.slice(2, -2);
  const hasComma = parameter.includes(",");
  if (!hasComma) {
    if (parameter.includes("..."))
      return parameter.slice(parameter.indexOf("...") + 3);
    return;
  }
  const spreadIndex = parameter.indexOf("...");
  if (spreadIndex === -1) return;
  return parameter.slice(spreadIndex + 3).trimEnd();
};
const inferBodyReference = (code, aliases, inference) => {
  const access = (type, alias) => code.includes(alias + "." + type) || code.includes(alias + '["' + type + '"]') || code.includes(alias + "['" + type + "']");
  for (const alias of aliases) {
    if (!alias) continue;
    if (alias.charCodeAt(0) === 123) {
      const parameters = retrieveRootParamters(alias).parameters;
      if (!inference.query && parameters.includes("query"))
        inference.query = true;
      if (!inference.headers && parameters.includes("headers"))
        inference.headers = true;
      if (!inference.body && parameters.includes("body"))
        inference.body = true;
      if (!inference.cookie && parameters.includes("cookie"))
        inference.cookie = true;
      if (!inference.set && parameters.includes("set"))
        inference.set = true;
      if (!inference.query && parameters.includes("server"))
        inference.server = true;
      if (!inference.request && parameters.includes("request"))
        inference.request = true;
      if (!inference.route && parameters.includes("route"))
        inference.route = true;
      continue;
    }
    if (!inference.query && access("query", alias)) inference.query = true;
    if (code.includes("return " + alias) || code.includes("return " + alias + ".query"))
      inference.query = true;
    if (!inference.headers && access("headers", alias))
      inference.headers = true;
    if (!inference.body && access("body", alias)) inference.body = true;
    if (!inference.cookie && access("cookie", alias))
      inference.cookie = true;
    if (!inference.set && access("set", alias)) inference.set = true;
    if (!inference.server && access("server", alias))
      inference.server = true;
    if (inference.query && inference.headers && inference.body && inference.cookie && inference.set && inference.server && inference.server && inference.route)
      break;
  }
  return aliases;
};
const removeDefaultParameter = (parameter) => {
  while (true) {
    const index = parameter.indexOf("=");
    if (index === -1) break;
    const commaIndex = parameter.indexOf(",", index);
    const bracketIndex = parameter.indexOf("}", index);
    const end = [commaIndex, bracketIndex].filter((i) => i > 0).sort((a, b) => a - b)[0] || -1;
    if (end === -1) {
      parameter = parameter.slice(0, index);
      break;
    }
    parameter = parameter.slice(0, index) + parameter.slice(end);
  }
  return parameter.split(",").map((i) => i.trim()).join(", ");
};
const isContextPassToFunction = (context, body, inference) => {
  try {
    const captureFunction = new RegExp(`(?:\\w)\\((?:.*)?${context}`, "gs");
    captureFunction.test(body);
    const nextChar = body.charCodeAt(captureFunction.lastIndex);
    if (nextChar === 41 || nextChar === 44) {
      inference.query = true;
      inference.headers = true;
      inference.body = true;
      inference.cookie = true;
      inference.set = true;
      inference.server = true;
      inference.route = true;
      inference.request = true;
      return true;
    }
    return false;
  } catch (error) {
    console.log(
      "[Sucrose] warning: unexpected isContextPassToFunction error, you may continue development as usual but please report the following to maintainers:"
    );
    console.log("--- body ---");
    console.log(body);
    console.log("--- context ---");
    console.log(context);
    return true;
  }
};
const sucrose = (lifeCycle, inference = {
  query: false,
  headers: false,
  body: false,
  cookie: false,
  set: false,
  server: false,
  request: false,
  route: false
}) => {
  const events = [];
  if (lifeCycle.handler && typeof lifeCycle.handler === "function")
    events.push(lifeCycle.handler);
  if (lifeCycle.request?.length) events.push(...lifeCycle.request);
  if (lifeCycle.beforeHandle?.length) events.push(...lifeCycle.beforeHandle);
  if (lifeCycle.parse?.length) events.push(...lifeCycle.parse);
  if (lifeCycle.error?.length) events.push(...lifeCycle.error);
  if (lifeCycle.transform?.length) events.push(...lifeCycle.transform);
  if (lifeCycle.afterHandle?.length) events.push(...lifeCycle.afterHandle);
  if (lifeCycle.mapResponse?.length) events.push(...lifeCycle.mapResponse);
  if (lifeCycle.afterResponse?.length) events.push(...lifeCycle.afterResponse);
  for (const e of events) {
    if (!e) continue;
    const event = "fn" in e ? e.fn : e;
    if (typeof event !== "function") continue;
    const [parameter, body, { isArrowReturn }] = separateFunction(
      event.toString()
    );
    const rootParameters = findParameterReference(parameter, inference);
    const mainParameter = extractMainParameter(rootParameters);
    if (mainParameter) {
      const aliases = findAlias(mainParameter, body.slice(1, -1));
      aliases.splice(0, -1, mainParameter);
      let code = body;
      if (code.charCodeAt(0) === 123 && code.charCodeAt(body.length - 1) === 125)
        code = code.slice(1, -1);
      if (!isContextPassToFunction(mainParameter, code, inference))
        inferBodyReference(code, aliases, inference);
      if (!inference.query && code.includes("return " + mainParameter + ".query"))
        inference.query = true;
    }
    if (inference.query && inference.headers && inference.body && inference.cookie && inference.set && inference.server && inference.request && inference.route)
      break;
  }
  return inference;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  bracketPairRange,
  bracketPairRangeReverse,
  extractMainParameter,
  findAlias,
  findParameterReference,
  hasReturn,
  inferBodyReference,
  isContextPassToFunction,
  removeColonAlias,
  removeDefaultParameter,
  retrieveRootParamters,
  separateFunction,
  sucrose
});
