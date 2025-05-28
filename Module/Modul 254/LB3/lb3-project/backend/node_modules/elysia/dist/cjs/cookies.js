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
var cookies_exports = {};
__export(cookies_exports, {
  Cookie: () => Cookie,
  createCookieJar: () => createCookieJar,
  parseCookie: () => parseCookie,
  serializeCookie: () => serializeCookie
});
module.exports = __toCommonJS(cookies_exports);
var import_cookie = require("cookie");
var import_deuri = require("./deuri");
var import_utils = require("./utils");
var import_error = require("./error");
class Cookie {
  constructor(name, jar, initial = {}) {
    this.name = name;
    this.jar = jar;
    this.initial = initial;
  }
  get cookie() {
    return this.jar[this.name] ?? this.initial;
  }
  set cookie(jar) {
    if (!(this.name in this.jar)) this.jar[this.name] = this.initial;
    this.jar[this.name] = jar;
  }
  get setCookie() {
    if (!(this.name in this.jar)) this.jar[this.name] = this.initial;
    return this.jar[this.name];
  }
  set setCookie(jar) {
    this.cookie = jar;
  }
  get value() {
    return this.cookie.value;
  }
  set value(value) {
    this.setCookie.value = value;
  }
  get expires() {
    return this.cookie.expires;
  }
  set expires(expires) {
    this.setCookie.expires = expires;
  }
  get maxAge() {
    return this.cookie.maxAge;
  }
  set maxAge(maxAge) {
    this.setCookie.maxAge = maxAge;
  }
  get domain() {
    return this.cookie.domain;
  }
  set domain(domain) {
    this.setCookie.domain = domain;
  }
  get path() {
    return this.cookie.path;
  }
  set path(path) {
    this.setCookie.path = path;
  }
  get secure() {
    return this.cookie.secure;
  }
  set secure(secure) {
    this.setCookie.secure = secure;
  }
  get httpOnly() {
    return this.cookie.httpOnly;
  }
  set httpOnly(httpOnly) {
    this.setCookie.httpOnly = httpOnly;
  }
  get sameSite() {
    return this.cookie.sameSite;
  }
  set sameSite(sameSite) {
    this.setCookie.sameSite = sameSite;
  }
  get priority() {
    return this.cookie.priority;
  }
  set priority(priority) {
    this.setCookie.priority = priority;
  }
  get partitioned() {
    return this.cookie.partitioned;
  }
  set partitioned(partitioned) {
    this.setCookie.partitioned = partitioned;
  }
  get secrets() {
    return this.cookie.secrets;
  }
  set secrets(secrets) {
    this.setCookie.secrets = secrets;
  }
  update(config) {
    this.setCookie = Object.assign(
      this.cookie,
      typeof config === "function" ? config(this.cookie) : config
    );
    return this;
  }
  set(config) {
    this.setCookie = Object.assign(
      {
        ...this.initial,
        value: this.value
      },
      typeof config === "function" ? config(this.cookie) : config
    );
    return this;
  }
  remove() {
    if (this.value === void 0) return;
    this.set({
      expires: /* @__PURE__ */ new Date(0),
      maxAge: 0,
      value: ""
    });
    return this;
  }
  toString() {
    return typeof this.value === "object" ? JSON.stringify(this.value) : this.value?.toString() ?? "";
  }
}
const createCookieJar = (set, store, initial) => {
  if (!set.cookie) set.cookie = {};
  return new Proxy(store, {
    get(_, key) {
      if (key in store)
        return new Cookie(
          key,
          set.cookie,
          Object.assign({}, initial ?? {}, store[key])
        );
      return new Cookie(
        key,
        set.cookie,
        Object.assign({}, initial)
      );
    }
  });
};
const parseCookie = async (set, cookieString, {
  secrets,
  sign,
  ...initial
} = {}) => {
  if (!cookieString) return createCookieJar(set, {}, initial);
  const isStringKey = typeof secrets === "string";
  if (sign && sign !== true && !Array.isArray(sign)) sign = [sign];
  const jar = {};
  const cookies = (0, import_cookie.parse)(cookieString);
  for (const [name, v] of Object.entries(cookies)) {
    if (v === void 0) continue;
    let value = (0, import_deuri.decode)(v);
    if (sign === true || sign?.includes(name)) {
      if (!secrets)
        throw new Error("No secret is provided to cookie plugin");
      if (isStringKey) {
        const temp = await (0, import_utils.unsignCookie)(value, secrets);
        if (temp === false) throw new import_error.InvalidCookieSignature(name);
        value = temp;
      } else {
        let decoded = true;
        for (let i = 0; i < secrets.length; i++) {
          const temp = await (0, import_utils.unsignCookie)(value, secrets[i]);
          if (temp !== false) {
            decoded = true;
            value = temp;
            break;
          }
        }
        if (!decoded) throw new import_error.InvalidCookieSignature(name);
      }
    }
    jar[name] = {
      value
    };
  }
  return createCookieJar(set, jar, initial);
};
const serializeCookie = (cookies) => {
  if (!cookies || !(0, import_utils.isNotEmpty)(cookies)) return void 0;
  const set = [];
  for (const [key, property] of Object.entries(cookies)) {
    if (!key || !property) continue;
    const value = property.value;
    if (value === void 0 || value === null) continue;
    set.push(
      (0, import_cookie.serialize)(
        key,
        typeof value === "object" ? JSON.stringify(value) : value + "",
        property
      )
    );
  }
  if (set.length === 0) return void 0;
  if (set.length === 1) return set[0];
  return set;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Cookie,
  createCookieJar,
  parseCookie,
  serializeCookie
});
