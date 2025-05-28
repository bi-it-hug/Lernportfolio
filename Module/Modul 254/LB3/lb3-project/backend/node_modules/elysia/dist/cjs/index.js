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
var src_exports = {};
__export(src_exports, {
  Cookie: () => import_cookies.Cookie,
  ELYSIA_FORM_DATA: () => import_utils3.ELYSIA_FORM_DATA,
  ELYSIA_REQUEST_ID: () => import_utils3.ELYSIA_REQUEST_ID,
  ELYSIA_TRACE: () => import_trace2.ELYSIA_TRACE,
  ERROR_CODE: () => import_error2.ERROR_CODE,
  Elysia: () => Elysia,
  ElysiaFile: () => import_file.ElysiaFile,
  InternalServerError: () => import_error2.InternalServerError,
  InvalidCookieSignature: () => import_error2.InvalidCookieSignature,
  InvertedStatusMap: () => import_utils3.InvertedStatusMap,
  NotFoundError: () => import_error2.NotFoundError,
  ParseError: () => import_error2.ParseError,
  StatusMap: () => import_utils3.StatusMap,
  TypeSystemPolicy: () => import_system.TypeSystemPolicy,
  ValidationError: () => import_error2.ValidationError,
  checksum: () => import_utils3.checksum,
  cloneInference: () => import_utils3.cloneInference,
  deduplicateChecksum: () => import_utils3.deduplicateChecksum,
  default: () => Elysia,
  env: () => import_env2.env,
  error: () => import_error2.error,
  file: () => import_file.file,
  form: () => import_utils3.form,
  getResponseSchemaValidator: () => import_utils3.getResponseSchemaValidator,
  getSchemaValidator: () => import_utils3.getSchemaValidator,
  mapValueError: () => import_error2.mapValueError,
  mergeHook: () => import_utils3.mergeHook,
  mergeObjectArray: () => import_utils3.mergeObjectArray,
  redirect: () => import_utils3.redirect,
  replaceSchemaType: () => import_utils3.replaceSchemaType,
  replaceUrlPath: () => import_utils3.replaceUrlPath,
  serializeCookie: () => import_cookies.serializeCookie,
  t: () => import_type_system2.t
});
module.exports = __toCommonJS(src_exports);
var import_memoirist = require("memoirist");
var import_type_system = require("./type-system");
var import_sucrose = require("./sucrose");
var import_bun = require("./adapter/bun/index");
var import_web_standard = require("./adapter/web-standard/index");
var import_env = require("./universal/env");
var import_utils = require("./utils");
var import_compose = require("./compose");
var import_trace = require("./trace");
var import_utils2 = require("./utils");
var import_dynamic_handle = require("./dynamic-handle");
var import_error = require("./error");
var import_type_system2 = require("./type-system");
var import_cookies = require("./cookies");
var import_trace2 = require("./trace");
var import_utils3 = require("./utils");
var import_error2 = require("./error");
var import_env2 = require("./universal/env");
var import_file = require("./universal/file");
var import_system = require("@sinclair/typebox/system");
class Elysia {
  constructor(config = {}) {
    this.server = null;
    this.dependencies = {};
    this._routes = {};
    this._types = {
      Prefix: "",
      Singleton: {},
      Definitions: {},
      Metadata: {}
    };
    this._ephemeral = {};
    this._volatile = {};
    this.singleton = {
      decorator: {},
      store: {},
      derive: {},
      resolve: {}
    };
    this.definitions = {
      typebox: import_type_system.t.Module({}),
      type: {},
      error: {}
    };
    this.extender = {
      macros: [],
      higherOrderFunctions: []
    };
    this.validator = {
      global: null,
      scoped: null,
      local: null,
      getCandidate() {
        return (0, import_utils.mergeSchemaValidator)(
          (0, import_utils.mergeSchemaValidator)(this.global, this.scoped),
          this.local
        );
      }
    };
    this.event = {};
    this.telemetry = {
      stack: void 0
    };
    this.router = {
      "~http": void 0,
      get http() {
        if (!this["~http"]) this["~http"] = new import_memoirist.Memoirist({ lazy: true });
        return this["~http"];
      },
      "~dynamic": void 0,
      // Use in non-AOT mode
      get dynamic() {
        if (!this["~dynamic"]) this["~dynamic"] = new import_memoirist.Memoirist();
        return this["~dynamic"];
      },
      static: {
        http: {
          static: {},
          // handlers: [] as ComposedHandler[],
          map: {},
          all: ""
        },
        // Static WS Router is consists of pathname and websocket handler index to compose
        ws: {}
      },
      history: []
    };
    this.routeTree = /* @__PURE__ */ new Map();
    this.inference = {
      body: false,
      cookie: false,
      headers: false,
      query: false,
      set: false,
      server: false,
      request: false,
      route: false
    };
    this["~parser"] = {};
    this.handle = async (request) => this.fetch(request);
    /**
     * Use handle can be either sync or async to save performance.
     *
     * Beside benchmark purpose, please use 'handle' instead.
     */
    this.fetch = (request) => {
      return (this.fetch = this.config.aot ? (0, import_compose.composeGeneralHandler)(this) : (0, import_dynamic_handle.createDynamicHandler)(this))(request);
    };
    this.handleError = async (context, error2) => {
      return (this.handleError = this.config.aot ? (0, import_compose.composeErrorHandler)(this) : (0, import_dynamic_handle.createDynamicErrorHandler)(this))(context, error2);
    };
    this.outerErrorHandler = (error2) => new Response(error2.message || error2.name || "Error", {
      // @ts-ignore
      status: error2?.status ?? 500
    });
    /**
     * ### listen
     * Assign current instance to port and start serving
     *
     * ---
     * @example
     * ```typescript
     * new Elysia()
     *     .get("/", () => 'hi')
     *     .listen(3000)
     * ```
     */
    this.listen = (options, callback) => {
      this["~adapter"].listen(this)(options, callback);
      return this;
    };
    /**
     * ### stop
     * Stop server from serving
     *
     * ---
     * @example
     * ```typescript
     * const app = new Elysia()
     *     .get("/", () => 'hi')
     *     .listen(3000)
     *
     * // Sometime later
     * app.stop()
     * ```
     *
     * @example
     * ```typescript
     * const app = new Elysia()
     *     .get("/", () => 'hi')
     *     .listen(3000)
     *
     * app.stop(true) // Abruptly any requests inflight
     * ```
     */
    this.stop = async (closeActiveConnections) => {
      if (!this.server)
        throw new Error(
          "Elysia isn't running. Call `app.listen` to start the server."
        );
      if (this.server) {
        this.server.stop(closeActiveConnections);
        this.server = null;
        if (this.event.stop?.length)
          for (let i = 0; i < this.event.stop.length; i++)
            this.event.stop[i].fn(this);
      }
    };
    if (config.tags) {
      if (!config.detail)
        config.detail = {
          tags: config.tags
        };
      else config.detail.tags = config.tags;
    }
    if (config.nativeStaticResponse === void 0)
      config.nativeStaticResponse = true;
    this.config = {};
    this.applyConfig(config ?? {});
    this["~adapter"] = config.adapter ?? (typeof Bun !== "undefined" ? import_bun.BunAdapter : import_web_standard.WebStandardAdapter);
    if (config?.analytic && (config?.name || config?.seed !== void 0))
      this.telemetry.stack = new Error().stack;
  }
  get store() {
    return this.singleton.store;
  }
  get decorator() {
    return this.singleton.decorator;
  }
  get routes() {
    return this.router.history;
  }
  getGlobalRoutes() {
    return this.router.history;
  }
  getServer() {
    return this.server;
  }
  getParent() {
    return null;
  }
  get promisedModules() {
    if (!this._promisedModules) this._promisedModules = new import_utils.PromiseGroup();
    return this._promisedModules;
  }
  env(model, _env = import_env.env) {
    const validator = (0, import_utils2.getSchemaValidator)(model, {
      modules: this.definitions.typebox,
      dynamic: true,
      additionalProperties: true,
      coerce: true
    });
    if (validator.Check(_env) === false) {
      const error2 = new import_error.ValidationError("env", model, _env);
      throw new Error(error2.all.map((x) => x.summary).join("\n"));
    }
    return this;
  }
  /**
   * @private DO_NOT_USE_OR_YOU_WILL_BE_FIRED
   * @version 1.1.0
   *
   * ! Do not use unless you know exactly what you are doing
   * ? Add Higher order function to Elysia.fetch
   */
  wrap(fn) {
    this.extender.higherOrderFunctions.push({
      checksum: (0, import_utils2.checksum)(
        JSON.stringify({
          name: this.config.name,
          seed: this.config.seed,
          content: fn.toString()
        })
      ),
      fn
    });
    return this;
  }
  applyMacro(localHook) {
    if (this.extender.macros.length) {
      const manage = (0, import_utils2.createMacroManager)({
        globalHook: this.event,
        localHook
      });
      const manager = {
        events: {
          global: this.event,
          local: localHook
        },
        get onParse() {
          return manage("parse");
        },
        get onTransform() {
          return manage("transform");
        },
        get onBeforeHandle() {
          return manage("beforeHandle");
        },
        get onAfterHandle() {
          return manage("afterHandle");
        },
        get mapResponse() {
          return manage("mapResponse");
        },
        get onAfterResponse() {
          return manage("afterResponse");
        },
        get onError() {
          return manage("error");
        }
      };
      for (const macro of this.extender.macros)
        (0, import_utils2.traceBackMacro)(macro.fn(manager), localHook, manage);
    }
  }
  applyConfig(config) {
    this.config = {
      prefix: "",
      aot: import_env.env.ELYSIA_AOT !== "false",
      normalize: true,
      ...config,
      cookie: {
        path: "/",
        ...config?.cookie
      },
      experimental: config?.experimental ?? {},
      seed: config?.seed === void 0 ? "" : config?.seed
    };
    return this;
  }
  get models() {
    const models = {};
    for (const name of Object.keys(this.definitions.type))
      models[name] = (0, import_utils2.getSchemaValidator)(
        // @ts-expect-error
        this.definitions.typebox.Import(name)
      );
    models.modules = this.definitions.typebox;
    return models;
  }
  add(method, path, handle, localHook, { allowMeta = false, skipPrefix = false } = {
    allowMeta: false,
    skipPrefix: false
  }) {
    localHook = (0, import_utils.compressHistoryHook)((0, import_utils.localHookToLifeCycleStore)(localHook));
    if (path !== "" && path.charCodeAt(0) !== 47) path = "/" + path;
    if (this.config.prefix && !skipPrefix) path = this.config.prefix + path;
    if (localHook?.type)
      switch (localHook.type) {
        case "text":
          localHook.type = "text/plain";
          break;
        case "json":
          localHook.type = "application/json";
          break;
        case "formdata":
          localHook.type = "multipart/form-data";
          break;
        case "urlencoded":
          localHook.type = "application/x-www-form-urlencoded";
          break;
        case "arrayBuffer":
          localHook.type = "application/octet-stream";
          break;
        default:
          break;
      }
    const models = this.definitions.type;
    const dynamic = !this.config.aot;
    const instanceValidator = { ...this.validator.getCandidate() };
    const cloned = {
      body: localHook?.body ?? instanceValidator?.body,
      headers: localHook?.headers ?? instanceValidator?.headers,
      params: localHook?.params ?? instanceValidator?.params,
      query: localHook?.query ?? instanceValidator?.query,
      cookie: localHook?.cookie ?? instanceValidator?.cookie,
      response: localHook?.response ?? instanceValidator?.response
    };
    const cookieValidator = () => cloned.cookie ? (0, import_utils2.getCookieValidator)({
      modules,
      validator: cloned.cookie,
      defaultConfig: this.config.cookie,
      config: cloned.cookie?.config ?? {},
      dynamic,
      models
    }) : void 0;
    const normalize = this.config.normalize;
    const modules = this.definitions.typebox;
    const validator = this.config.precompile === true || typeof this.config.precompile === "object" && this.config.precompile.schema === true ? {
      body: (0, import_utils2.getSchemaValidator)(cloned.body, {
        modules,
        dynamic,
        models,
        normalize,
        additionalCoerce: (0, import_utils.coercePrimitiveRoot)()
      }),
      headers: (0, import_utils2.getSchemaValidator)(cloned.headers, {
        modules,
        dynamic,
        models,
        additionalProperties: !this.config.normalize,
        coerce: true,
        additionalCoerce: (0, import_utils.stringToStructureCoercions)()
      }),
      params: (0, import_utils2.getSchemaValidator)(cloned.params, {
        modules,
        dynamic,
        models,
        coerce: true,
        additionalCoerce: (0, import_utils.stringToStructureCoercions)()
      }),
      query: (0, import_utils2.getSchemaValidator)(cloned.query, {
        modules,
        dynamic,
        models,
        normalize,
        coerce: true,
        additionalCoerce: (0, import_utils.stringToStructureCoercions)()
      }),
      cookie: cookieValidator(),
      response: (0, import_utils2.getResponseSchemaValidator)(cloned.response, {
        modules,
        dynamic,
        models,
        normalize
      })
    } : {
      createBody() {
        if (this.body) return this.body;
        return this.body = (0, import_utils2.getSchemaValidator)(
          cloned.body,
          {
            modules,
            dynamic,
            models,
            normalize,
            additionalCoerce: (0, import_utils.coercePrimitiveRoot)()
          }
        );
      },
      createHeaders() {
        if (this.headers) return this.headers;
        return this.headers = (0, import_utils2.getSchemaValidator)(
          cloned.headers,
          {
            modules,
            dynamic,
            models,
            additionalProperties: !normalize,
            coerce: true,
            additionalCoerce: (0, import_utils.stringToStructureCoercions)()
          }
        );
      },
      createParams() {
        if (this.params) return this.params;
        return this.params = (0, import_utils2.getSchemaValidator)(
          cloned.params,
          {
            modules,
            dynamic,
            models,
            coerce: true,
            additionalCoerce: (0, import_utils.stringToStructureCoercions)()
          }
        );
      },
      createQuery() {
        if (this.query) return this.query;
        return this.query = (0, import_utils2.getSchemaValidator)(
          cloned.query,
          {
            modules,
            dynamic,
            models,
            coerce: true,
            additionalCoerce: (0, import_utils.stringToStructureCoercions)()
          }
        );
      },
      createCookie() {
        if (this.cookie) return this.cookie;
        return this.cookie = cookieValidator();
      },
      createResponse() {
        if (this.response) return this.response;
        return this.response = (0, import_utils2.getResponseSchemaValidator)(
          cloned.response,
          {
            modules,
            dynamic,
            models,
            normalize
          }
        );
      }
    };
    localHook = (0, import_utils2.mergeHook)(
      localHook,
      (0, import_utils.compressHistoryHook)(instanceValidator)
    );
    if (localHook.tags) {
      if (!localHook.detail)
        localHook.detail = {
          tags: localHook.tags
        };
      else localHook.detail.tags = localHook.tags;
    }
    if ((0, import_utils.isNotEmpty)(this.config.detail))
      localHook.detail = (0, import_utils.mergeDeep)(
        Object.assign({}, this.config.detail),
        localHook.detail
      );
    this.applyMacro(localHook);
    const hooks = (0, import_utils.compressHistoryHook)((0, import_utils2.mergeHook)(this.event, localHook));
    if (this.config.aot === false) {
      this.router.dynamic.add(method, path, {
        validator,
        hooks,
        content: localHook?.type,
        handle,
        route: path
      });
      const encoded = (0, import_utils.encodePath)(path, { dynamic: true });
      if (path !== encoded) {
        this.router.dynamic.add(method, encoded, {
          validator,
          hooks,
          content: localHook?.type,
          handle,
          route: path
        });
      }
      if (this.config.strictPath === false) {
        const loosePath = (0, import_utils.getLoosePath)(path);
        this.router.dynamic.add(method, loosePath, {
          validator,
          hooks,
          content: localHook?.type,
          handle,
          route: path
        });
        const encoded2 = (0, import_utils.encodePath)(loosePath);
        if (loosePath !== encoded2)
          this.router.dynamic.add(method, loosePath, {
            validator,
            hooks,
            content: localHook?.type,
            handle,
            route: path
          });
      }
      this.router.history.push({
        method,
        path,
        composed: null,
        handler: handle,
        hooks
      });
      return;
    }
    const shouldPrecompile = this.config.precompile === true || typeof this.config.precompile === "object" && this.config.precompile.compose === true;
    const inference = (0, import_utils.cloneInference)(this.inference);
    const adapter = this["~adapter"].handler;
    const staticHandler = typeof handle !== "function" && typeof adapter.createStaticHandler === "function" ? adapter.createStaticHandler(handle, hooks, this.setHeaders) : void 0;
    const nativeStaticHandler = typeof handle !== "function" ? adapter.createNativeStaticHandler?.(
      handle,
      hooks,
      this.setHeaders
    ) : void 0;
    if (this.config.nativeStaticResponse === true && nativeStaticHandler && (method === "GET" || method === "ALL"))
      this.router.static.http.static[path] = nativeStaticHandler();
    let compile = (asManifest = false) => (0, import_compose.composeHandler)({
      app: this,
      path,
      method,
      hooks,
      validator,
      handler: typeof handle !== "function" && typeof adapter.createStaticHandler !== "function" ? () => handle : handle,
      allowMeta,
      inference,
      asManifest
    });
    let oldIndex;
    if (this.routeTree.has(method + path))
      for (let i = 0; i < this.router.history.length; i++) {
        const route = this.router.history[i];
        if (route.path === path && route.method === method) {
          oldIndex = i;
          break;
        }
      }
    else this.routeTree.set(method + path, this.router.history.length);
    const history = this.router.history;
    const index = oldIndex ?? this.router.history.length;
    const mainHandler = shouldPrecompile ? compile() : (ctx) => {
      const temp = (history[index].composed = compile())(ctx);
      compile = void 0;
      return temp;
    };
    if (shouldPrecompile) compile = void 0;
    const isWebSocket = method === "$INTERNALWS";
    if (oldIndex !== void 0)
      this.router.history[oldIndex] = // @ts-ignore
      Object.assign(
        {
          method,
          path,
          composed: mainHandler,
          handler: handle,
          hooks
        },
        localHook.webSocket ? { websocket: localHook.websocket } : {}
      );
    else
      this.router.history.push(
        // @ts-ignore
        Object.assign(
          {
            method,
            path,
            composed: mainHandler,
            handler: handle,
            hooks
          },
          localHook.webSocket ? { websocket: localHook.websocket } : {}
        )
      );
    const staticRouter = this.router.static.http;
    const handler = {
      handler: shouldPrecompile ? mainHandler : void 0,
      compile() {
        return this.handler = compile();
      }
    };
    if (isWebSocket) {
      this.router.http.add("ws", path, handler);
      if (!this.config.strictPath)
        this.router.http.add("ws", (0, import_utils.getLoosePath)(path), handler);
      const encoded = (0, import_utils.encodePath)(path, { dynamic: true });
      if (encoded !== path) this.router.http.add("ws", encoded, handler);
      return;
    }
    if (path.indexOf(":") === -1 && path.indexOf("*") === -1) {
      if (!staticRouter.map[path])
        staticRouter.map[path] = {
          code: ""
        };
      const ctx = staticHandler ? "" : "c";
      if (method === "ALL")
        staticRouter.map[path].all = `default:return ht[${index}].composed(${ctx})
`;
      else
        staticRouter.map[path].code = `case '${method}':return ht[${index}].composed(${ctx})
${staticRouter.map[path].code}`;
      if (!this.config.strictPath && this.config.nativeStaticResponse === true && nativeStaticHandler && (method === "GET" || method === "ALL"))
        this.router.static.http.static[(0, import_utils.getLoosePath)(path)] = nativeStaticHandler();
    } else {
      this.router.http.add(method, path, handler);
      if (!this.config.strictPath) {
        const loosePath = (0, import_utils.getLoosePath)(path);
        if (this.config.nativeStaticResponse === true && staticHandler && (method === "GET" || method === "ALL"))
          this.router.static.http.static[loosePath] = staticHandler();
        this.router.http.add(method, loosePath, handler);
      }
      const encoded = (0, import_utils.encodePath)(path, { dynamic: true });
      if (path !== encoded) {
        this.router.http.add(method, encoded, handler);
        if (this.config.nativeStaticResponse === true && staticHandler && (method === "GET" || method === "ALL"))
          this.router.static.http.static[encoded] = staticHandler();
        this.router.http.add(method, encoded, handler);
      }
    }
  }
  headers(header) {
    if (!header) return this;
    if (!this.setHeaders) this.setHeaders = {};
    this.setHeaders = (0, import_utils.mergeDeep)(this.setHeaders, header);
    return this;
  }
  /**
   * ### start | Life cycle event
   * Called after server is ready for serving
   *
   * ---
   * @example
   * ```typescript
   * new Elysia()
   *     .onStart(({ server }) => {
   *         console.log("Running at ${server?.url}:${server?.port}")
   *     })
   *     .listen(3000)
   * ```
   */
  onStart(handler) {
    this.on("start", handler);
    return this;
  }
  /**
   * ### request | Life cycle event
   * Called on every new request is accepted
   *
   * ---
   * @example
   * ```typescript
   * new Elysia()
   *     .onRequest(({ method, url }) => {
   *         saveToAnalytic({ method, url })
   *     })
   * ```
   */
  onRequest(handler) {
    this.on("request", handler);
    return this;
  }
  onParse(options, handler) {
    if (!handler) {
      if (typeof options === "string")
        return this.on("parse", this["~parser"][options]);
      return this.on("parse", options);
    }
    return this.on(
      options,
      "parse",
      handler
    );
  }
  /**
   * ### parse | Life cycle event
   * Callback function to handle body parsing
   *
   * If truthy value is returned, will be assigned to `context.body`
   * Otherwise will skip the callback and look for the next one.
   *
   * Equivalent to Express's body parser
   *
   * ---
   * @example
   * ```typescript
   * new Elysia()
   *     .onParse((request, contentType) => {
   *         if(contentType === "application/json")
   *             return request.json()
   *     })
   * ```
   */
  parser(name, parser) {
    this["~parser"][name] = parser;
    return this;
  }
  onTransform(options, handler) {
    if (!handler) return this.on("transform", options);
    return this.on(
      options,
      "transform",
      handler
    );
  }
  resolve(optionsOrResolve, resolve) {
    if (!resolve) {
      resolve = optionsOrResolve;
      optionsOrResolve = { as: "local" };
    }
    const hook = {
      subType: "resolve",
      fn: resolve
    };
    return this.onBeforeHandle(optionsOrResolve, hook);
  }
  mapResolve(optionsOrResolve, mapper) {
    if (!mapper) {
      mapper = optionsOrResolve;
      optionsOrResolve = { as: "local" };
    }
    const hook = {
      subType: "mapResolve",
      fn: mapper
    };
    return this.onBeforeHandle(optionsOrResolve, hook);
  }
  onBeforeHandle(options, handler) {
    if (!handler) return this.on("beforeHandle", options);
    return this.on(
      options,
      "beforeHandle",
      handler
    );
  }
  onAfterHandle(options, handler) {
    if (!handler) return this.on("afterHandle", options);
    return this.on(
      options,
      "afterHandle",
      handler
    );
  }
  mapResponse(options, handler) {
    if (!handler) return this.on("mapResponse", options);
    return this.on(
      options,
      "mapResponse",
      handler
    );
  }
  onAfterResponse(options, handler) {
    if (!handler) return this.on("afterResponse", options);
    return this.on(
      options,
      "afterResponse",
      handler
    );
  }
  /**
   * ### After Handle | Life cycle event
   * Intercept request **after** main handler is called.
   *
   * If truthy value is returned, will be assigned as `Response`
   *
   * ---
   * @example
   * ```typescript
   * new Elysia()
   *     .onAfterHandle((context, response) => {
   *         if(typeof response === "object")
   *             return JSON.stringify(response)
   *     })
   * ```
   */
  trace(options, handler) {
    if (!handler) {
      handler = options;
      options = { as: "local" };
    }
    if (!Array.isArray(handler)) handler = [handler];
    for (const fn of handler)
      this.on(
        options,
        "trace",
        (0, import_trace.createTracer)(fn)
      );
    return this;
  }
  error(name, error2) {
    switch (typeof name) {
      case "string":
        error2.prototype[import_error.ERROR_CODE] = name;
        this.definitions.error[name] = error2;
        return this;
      case "function":
        this.definitions.error = name(this.definitions.error);
        return this;
    }
    for (const [code, error3] of Object.entries(name)) {
      error3.prototype[import_error.ERROR_CODE] = code;
      this.definitions.error[code] = error3;
    }
    return this;
  }
  /**
   * ### Error | Life cycle event
   * Called when error is thrown during processing request
   *
   * ---
   * @example
   * ```typescript
   * new Elysia()
   *     .onError(({ code }) => {
   *         if(code === "NOT_FOUND")
   *             return "Path not found :("
   *     })
   * ```
   */
  onError(options, handler) {
    if (!handler) return this.on("error", options);
    return this.on(
      options,
      "error",
      handler
    );
  }
  /**
   * ### stop | Life cycle event
   * Called after server stop serving request
   *
   * ---
   * @example
   * ```typescript
   * new Elysia()
   *     .onStop((app) => {
   *         cleanup()
   *     })
   * ```
   */
  onStop(handler) {
    this.on("stop", handler);
    return this;
  }
  on(optionsOrType, typeOrHandlers, handlers) {
    let type;
    switch (typeof optionsOrType) {
      case "string":
        type = optionsOrType;
        handlers = typeOrHandlers;
        break;
      case "object":
        type = typeOrHandlers;
        if (!Array.isArray(typeOrHandlers) && typeof typeOrHandlers === "object")
          handlers = typeOrHandlers;
        break;
    }
    if (Array.isArray(handlers)) handlers = (0, import_utils.fnToContainer)(handlers);
    else {
      if (typeof handlers === "function")
        handlers = [
          {
            fn: handlers
          }
        ];
      else handlers = [handlers];
    }
    const handles = handlers;
    for (const handle of handles) {
      handle.scope = typeof optionsOrType === "string" ? "local" : optionsOrType?.as ?? "local";
      if (type === "resolve" || type === "derive") handle.subType = type;
    }
    if (type !== "trace")
      (0, import_sucrose.sucrose)(
        {
          [type]: handles.map((x) => x.fn)
        },
        this.inference
      );
    for (const handle of handles) {
      const fn = (0, import_utils2.asHookType)(handle, "global", { skipIfHasType: true });
      switch (type) {
        case "start":
          this.event.start ??= [];
          this.event.start.push(fn);
          break;
        case "request":
          this.event.request ??= [];
          this.event.request.push(fn);
          break;
        case "parse":
          this.event.parse ??= [];
          this.event.parse.push(fn);
          break;
        case "transform":
          this.event.transform ??= [];
          this.event.transform.push(fn);
          break;
        // @ts-expect-error
        case "derive":
          this.event.transform ??= [];
          this.event.transform.push(
            (0, import_utils.fnToContainer)(fn, "derive")
          );
          break;
        case "beforeHandle":
          this.event.beforeHandle ??= [];
          this.event.beforeHandle.push(fn);
          break;
        // @ts-expect-error
        // eslint-disable-next-line sonarjs/no-duplicated-branches
        case "resolve":
          this.event.beforeHandle ??= [];
          this.event.beforeHandle.push(
            (0, import_utils.fnToContainer)(fn, "resolve")
          );
          break;
        case "afterHandle":
          this.event.afterHandle ??= [];
          this.event.afterHandle.push(fn);
          break;
        case "mapResponse":
          this.event.mapResponse ??= [];
          this.event.mapResponse.push(fn);
          break;
        case "afterResponse":
          this.event.afterResponse ??= [];
          this.event.afterResponse.push(fn);
          break;
        case "trace":
          this.event.trace ??= [];
          this.event.trace.push(fn);
          break;
        case "error":
          this.event.error ??= [];
          this.event.error.push(fn);
          break;
        case "stop":
          this.event.stop ??= [];
          this.event.stop.push(fn);
          break;
      }
    }
    return this;
  }
  /**
   * @deprecated use `Elysia.as` instead
   *
   * Will be removed in Elysia 1.2
   */
  propagate() {
    (0, import_utils.promoteEvent)(this.event.parse);
    (0, import_utils.promoteEvent)(this.event.transform);
    (0, import_utils.promoteEvent)(this.event.beforeHandle);
    (0, import_utils.promoteEvent)(this.event.afterHandle);
    (0, import_utils.promoteEvent)(this.event.mapResponse);
    (0, import_utils.promoteEvent)(this.event.afterResponse);
    (0, import_utils.promoteEvent)(this.event.trace);
    (0, import_utils.promoteEvent)(this.event.error);
    return this;
  }
  as(type) {
    const castType = { plugin: "scoped", scoped: "scoped", global: "global" }[type];
    (0, import_utils.promoteEvent)(this.event.parse, castType);
    (0, import_utils.promoteEvent)(this.event.transform, castType);
    (0, import_utils.promoteEvent)(this.event.beforeHandle, castType);
    (0, import_utils.promoteEvent)(this.event.afterHandle, castType);
    (0, import_utils.promoteEvent)(this.event.mapResponse, castType);
    (0, import_utils.promoteEvent)(this.event.afterResponse, castType);
    (0, import_utils.promoteEvent)(this.event.trace, castType);
    (0, import_utils.promoteEvent)(this.event.error, castType);
    if (type === "plugin") {
      this.validator.scoped = (0, import_utils.mergeSchemaValidator)(
        this.validator.scoped,
        this.validator.local
      );
      this.validator.local = null;
    } else if (type === "global") {
      this.validator.global = (0, import_utils.mergeSchemaValidator)(
        this.validator.global,
        (0, import_utils.mergeSchemaValidator)(
          this.validator.scoped,
          this.validator.local
        )
      );
      this.validator.scoped = null;
      this.validator.local = null;
    }
    return this;
  }
  /**
   * ### group
   * Encapsulate and group path with prefix
   *
   * ---
   * @example
   * ```typescript
   * new Elysia()
   *     .group('/v1', app => app
   *         .get('/', () => 'Hi')
   *         .get('/name', () => 'Elysia')
   *     })
   * ```
   */
  group(prefix, schemaOrRun, run) {
    const instance = new Elysia({
      ...this.config,
      prefix: ""
    });
    instance.singleton = { ...this.singleton };
    instance.definitions = { ...this.definitions };
    instance.getServer = () => this.getServer();
    instance.inference = (0, import_utils.cloneInference)(this.inference);
    instance.extender = { ...this.extender };
    const isSchema = typeof schemaOrRun === "object";
    const sandbox = (isSchema ? run : schemaOrRun)(instance);
    this.singleton = (0, import_utils.mergeDeep)(this.singleton, instance.singleton);
    this.definitions = (0, import_utils.mergeDeep)(this.definitions, instance.definitions);
    if (sandbox.event.request?.length)
      this.event.request = [
        ...this.event.request || [],
        ...sandbox.event.request || []
      ];
    if (sandbox.event.mapResponse?.length)
      this.event.mapResponse = [
        ...this.event.mapResponse || [],
        ...sandbox.event.mapResponse || []
      ];
    this.model(sandbox.definitions.type);
    Object.values(instance.router.history).forEach(
      ({ method, path, handler, hooks }) => {
        path = (isSchema ? "" : this.config.prefix) + prefix + path;
        if (isSchema) {
          const hook = schemaOrRun;
          const localHook = hooks;
          this.add(
            method,
            path,
            handler,
            (0, import_utils2.mergeHook)(hook, {
              ...localHook || {},
              error: !localHook.error ? sandbox.event.error : Array.isArray(localHook.error) ? [
                ...localHook.error || {},
                ...sandbox.event.error || {}
              ] : [
                localHook.error,
                ...sandbox.event.error || {}
              ]
            })
          );
        } else {
          this.add(
            method,
            path,
            handler,
            (0, import_utils2.mergeHook)(hooks, {
              error: sandbox.event.error
            }),
            {
              skipPrefix: true
            }
          );
        }
      }
    );
    return this;
  }
  /**
   * ### guard
   * Encapsulate and pass hook into all child handler
   *
   * ---
   * @example
   * ```typescript
   * import { t } from 'elysia'
   *
   * new Elysia()
   *     .guard({
   *          schema: {
   *              body: t.Object({
   *                  username: t.String(),
   *                  password: t.String()
   *              })
   *          }
   *     }, app => app
   *         .get("/", () => 'Hi')
   *         .get("/name", () => 'Elysia')
   *     })
   * ```
   */
  guard(hook, run) {
    if (!run) {
      if (typeof hook === "object") {
        this.applyMacro(hook);
        const type = hook.as ?? "local";
        this.validator[type] = {
          body: hook.body ?? this.validator[type]?.body,
          headers: hook.headers ?? this.validator[type]?.headers,
          params: hook.params ?? this.validator[type]?.params,
          query: hook.query ?? this.validator[type]?.query,
          response: hook.response ?? this.validator[type]?.response,
          cookie: hook.cookie ?? this.validator[type]?.cookie
        };
        if (hook.parse) this.on({ as: type }, "parse", hook.parse);
        if (hook.transform)
          this.on({ as: type }, "transform", hook.transform);
        if (hook.derive) this.on({ as: type }, "derive", hook.derive);
        if (hook.beforeHandle)
          this.on({ as: type }, "beforeHandle", hook.beforeHandle);
        if (hook.resolve) this.on({ as: type }, "resolve", hook.resolve);
        if (hook.afterHandle)
          this.on({ as: type }, "afterHandle", hook.afterHandle);
        if (hook.mapResponse)
          this.on({ as: type }, "mapResponse", hook.mapResponse);
        if (hook.afterResponse)
          this.on({ as: type }, "afterResponse", hook.afterResponse);
        if (hook.error) this.on({ as: type }, "error", hook.error);
        if (hook.detail) {
          if (this.config.detail)
            this.config.detail = (0, import_utils.mergeDeep)(
              Object.assign({}, this.config.detail),
              hook.detail
            );
          else this.config.detail = hook.detail;
        }
        if (hook?.tags) {
          if (!this.config.detail)
            this.config.detail = {
              tags: hook.tags
            };
          else this.config.detail.tags = hook.tags;
        }
        return this;
      }
      return this.guard({}, hook);
    }
    const instance = new Elysia({
      ...this.config,
      prefix: ""
    });
    instance.singleton = { ...this.singleton };
    instance.definitions = { ...this.definitions };
    instance.inference = (0, import_utils.cloneInference)(this.inference);
    instance.extender = { ...this.extender };
    const sandbox = run(instance);
    this.singleton = (0, import_utils.mergeDeep)(this.singleton, instance.singleton);
    this.definitions = (0, import_utils.mergeDeep)(this.definitions, instance.definitions);
    sandbox.getServer = () => this.server;
    if (sandbox.event.request?.length)
      this.event.request = [
        ...this.event.request || [],
        ...sandbox.event.request || []
      ];
    if (sandbox.event.mapResponse?.length)
      this.event.mapResponse = [
        ...this.event.mapResponse || [],
        ...sandbox.event.mapResponse || []
      ];
    this.model(sandbox.definitions.type);
    Object.values(instance.router.history).forEach(
      ({ method, path, handler, hooks: localHook }) => {
        this.add(
          method,
          path,
          handler,
          (0, import_utils2.mergeHook)(hook, {
            ...localHook || {},
            error: !localHook.error ? sandbox.event.error : Array.isArray(localHook.error) ? [
              ...localHook.error || {},
              ...sandbox.event.error || []
            ] : [
              localHook.error,
              ...sandbox.event.error || []
            ]
          })
        );
      }
    );
    return this;
  }
  /**
   * ### use
   * Merge separate logic of Elysia with current
   *
   * ---
   * @example
   * ```typescript
   * const plugin = (app: Elysia) => app
   *     .get('/plugin', () => 'hi')
   *
   * new Elysia()
   *     .use(plugin)
   * ```
   */
  use(plugin, options) {
    if (Array.isArray(plugin)) {
      let app = this;
      for (const p of plugin) app = app.use(p);
      return app;
    }
    if (options?.scoped)
      return this.guard({}, (app) => app.use(plugin));
    if (Array.isArray(plugin)) {
      let current = this;
      for (const p of plugin) current = this.use(p);
      return current;
    }
    if (plugin instanceof Promise) {
      this.promisedModules.add(
        plugin.then((plugin2) => {
          if (typeof plugin2 === "function") return plugin2(this);
          if (plugin2 instanceof Elysia)
            return this._use(plugin2).compile();
          if (plugin2.constructor.name === "Elysia")
            return this._use(
              plugin2
            ).compile();
          if (typeof plugin2.default === "function")
            return plugin2.default(this);
          if (plugin2.default instanceof Elysia)
            return this._use(plugin2.default);
          if (plugin2.constructor.name === "Elysia")
            return this._use(plugin2.default);
          if (plugin2.constructor.name === "_Elysia")
            return this._use(plugin2.default);
          try {
            return this._use(plugin2.default);
          } catch (error2) {
            console.error(
              'Invalid plugin type. Expected Elysia instance, function, or module with "default" as Elysia instance or function that returns Elysia instance.'
            );
            throw error2;
          }
        }).then((v) => {
          if (v && typeof v.compile === "function") v.compile();
          return v;
        })
      );
      return this;
    }
    return this._use(plugin);
  }
  propagatePromiseModules(plugin) {
    if (plugin.promisedModules.size <= 0) return this;
    for (const promise of plugin.promisedModules.promises)
      this.promisedModules.add(
        promise.then((v) => {
          if (!v) return;
          const t3 = this._use(v);
          if (t3 instanceof Promise)
            return t3.then((v2) => {
              if (v2) v2.compile();
              else v.compile();
            });
          return v.compile();
        })
      );
    return this;
  }
  _use(plugin) {
    if (typeof plugin === "function") {
      const instance = plugin(this);
      if (instance instanceof Promise) {
        this.promisedModules.add(
          instance.then((plugin2) => {
            if (plugin2 instanceof Elysia) {
              plugin2.getServer = () => this.getServer();
              plugin2.getGlobalRoutes = () => this.getGlobalRoutes();
              plugin2.model(this.definitions.type);
              plugin2.error(this.definitions.error);
              for (const {
                method,
                path,
                handler,
                hooks
              } of Object.values(plugin2.router.history))
                this.add(
                  method,
                  path,
                  handler,
                  (0, import_utils2.mergeHook)(hooks, {
                    error: plugin2.event.error
                  })
                );
              plugin2.compile();
              if (plugin2 === this) return;
              this.propagatePromiseModules(plugin2);
              return plugin2;
            }
            if (typeof plugin2 === "function")
              return plugin2(
                this
              );
            if (typeof plugin2.default === "function")
              return plugin2.default(
                this
              );
            return this._use(plugin2);
          }).then((v) => {
            if (v && typeof v.compile === "function")
              v.compile();
            return v;
          })
        );
        return this;
      }
      return instance;
    }
    this.propagatePromiseModules(plugin);
    const { name, seed } = plugin.config;
    plugin.getParent = () => this;
    plugin.getServer = () => this.getServer();
    plugin.getGlobalRoutes = () => this.getGlobalRoutes();
    plugin.model(this.definitions.type);
    plugin.error(this.definitions.error);
    this["~parser"] = {
      ...plugin["~parser"],
      ...this["~parser"]
    };
    this.headers(plugin.setHeaders);
    if (name) {
      if (!(name in this.dependencies)) this.dependencies[name] = [];
      const current = seed !== void 0 ? (0, import_utils2.checksum)(name + JSON.stringify(seed)) : 0;
      if (!this.dependencies[name].some(
        ({ checksum: checksum3 }) => current === checksum3
      )) {
        this.extender.macros = this.extender.macros.concat(
          plugin.extender.macros
        );
        this.extender.higherOrderFunctions = this.extender.higherOrderFunctions.concat(
          plugin.extender.higherOrderFunctions
        );
      }
    } else {
      this.extender.macros = this.extender.macros.concat(
        plugin.extender.macros
      );
      this.extender.higherOrderFunctions = this.extender.higherOrderFunctions.concat(
        plugin.extender.higherOrderFunctions
      );
    }
    (0, import_utils.deduplicateChecksum)(this.extender.macros);
    (0, import_utils.deduplicateChecksum)(this.extender.higherOrderFunctions);
    const hofHashes = [];
    for (let i = 0; i < this.extender.higherOrderFunctions.length; i++) {
      const hof = this.extender.higherOrderFunctions[i];
      if (hof.checksum) {
        if (hofHashes.includes(hof.checksum)) {
          this.extender.higherOrderFunctions.splice(i, 1);
          i--;
        }
        hofHashes.push(hof.checksum);
      }
    }
    this.inference = {
      body: this.inference.body || plugin.inference.body,
      cookie: this.inference.cookie || plugin.inference.cookie,
      headers: this.inference.headers || plugin.inference.headers,
      query: this.inference.query || plugin.inference.query,
      set: this.inference.set || plugin.inference.set,
      server: this.inference.server || plugin.inference.server,
      request: this.inference.request || plugin.inference.request,
      route: this.inference.route || plugin.inference.route
    };
    this.decorate(plugin.singleton.decorator);
    this.state(plugin.singleton.store);
    this.model(plugin.definitions.type);
    this.error(plugin.definitions.error);
    plugin.extender.macros = this.extender.macros.concat(
      plugin.extender.macros
    );
    for (const { method, path, handler, hooks } of Object.values(
      plugin.router.history
    )) {
      this.add(
        method,
        path,
        handler,
        (0, import_utils2.mergeHook)(hooks, {
          error: plugin.event.error
        })
      );
    }
    if (name) {
      if (!(name in this.dependencies)) this.dependencies[name] = [];
      const current = seed !== void 0 ? (0, import_utils2.checksum)(name + JSON.stringify(seed)) : 0;
      if (this.dependencies[name].some(
        ({ checksum: checksum3 }) => current === checksum3
      ))
        return this;
      this.dependencies[name].push(
        this.config?.analytic ? {
          name: plugin.config.name,
          seed: plugin.config.seed,
          checksum: current,
          dependencies: plugin.dependencies,
          stack: plugin.telemetry.stack,
          routes: plugin.router.history,
          decorators: plugin.singleton,
          store: plugin.singleton.store,
          error: plugin.definitions.error,
          derive: plugin.event.transform?.filter((x) => x?.subType === "derive").map((x) => ({
            fn: x.toString(),
            stack: new Error().stack ?? ""
          })),
          resolve: plugin.event.transform?.filter((x) => x?.subType === "resolve").map((x) => ({
            fn: x.toString(),
            stack: new Error().stack ?? ""
          }))
        } : {
          name: plugin.config.name,
          seed: plugin.config.seed,
          checksum: current,
          dependencies: plugin.dependencies
        }
      );
      this.event = (0, import_utils2.mergeLifeCycle)(
        this.event,
        (0, import_utils2.filterGlobalHook)(plugin.event),
        current
      );
    } else {
      this.event = (0, import_utils2.mergeLifeCycle)(
        this.event,
        (0, import_utils2.filterGlobalHook)(plugin.event)
      );
    }
    this.validator.global = (0, import_utils2.mergeHook)(this.validator.global, {
      ...plugin.validator.global
    });
    this.validator.local = (0, import_utils2.mergeHook)(this.validator.local, {
      ...plugin.validator.scoped
    });
    return this;
  }
  macro(macro) {
    if (typeof macro === "function") {
      const hook = {
        checksum: (0, import_utils2.checksum)(
          JSON.stringify({
            name: this.config.name,
            seed: this.config.seed,
            content: macro.toString()
          })
        ),
        fn: macro
      };
      this.extender.macros.push(hook);
    } else if (typeof macro === "object") {
      for (const name of Object.keys(macro))
        if (typeof macro[name] === "object") {
          const actualValue = { ...macro[name] };
          macro[name] = (v) => {
            if (v === true) return actualValue;
          };
        }
      const hook = {
        checksum: (0, import_utils2.checksum)(
          JSON.stringify({
            name: this.config.name,
            seed: this.config.seed,
            content: Object.entries(macro).map(([k, v]) => `${k}+${v}`).join(",")
          })
        ),
        fn: () => macro
      };
      this.extender.macros.push(hook);
    }
    return this;
  }
  mount(path, handle) {
    if (path instanceof Elysia || typeof path === "function" || path.length === 0 || path === "/") {
      const run = typeof path === "function" ? path : path instanceof Elysia ? path.compile().fetch : handle instanceof Elysia ? handle.compile().fetch : handle;
      const handler2 = ({ request, path: path2 }) => run(
        new Request((0, import_utils2.replaceUrlPath)(request.url, path2), {
          method: request.method,
          headers: request.headers,
          signal: request.signal,
          credentials: request.credentials,
          referrerPolicy: request.referrerPolicy,
          duplex: request.duplex,
          redirect: request.redirect,
          mode: request.mode,
          keepalive: request.keepalive,
          integrity: request.integrity,
          body: request.body
        })
      );
      this.all("/*", handler2, {
        parse: "none"
      });
      return this;
    }
    if (!handle) return this;
    const length = path.length - (path.endsWith("*") ? 1 : 0);
    if (handle instanceof Elysia) handle = handle.compile().fetch;
    const handler = ({ request, path: path2 }) => handle(
      new Request(
        (0, import_utils2.replaceUrlPath)(request.url, path2.slice(length) || "/"),
        {
          method: request.method,
          headers: request.headers,
          signal: request.signal,
          credentials: request.credentials,
          referrerPolicy: request.referrerPolicy,
          duplex: request.duplex,
          redirect: request.redirect,
          mode: request.mode,
          keepalive: request.keepalive,
          integrity: request.integrity,
          body: request.body
        }
      )
    );
    this.all(path, handler, {
      parse: "none"
    });
    this.all(path + (path.endsWith("/") ? "*" : "/*"), handler, {
      parse: "none"
    });
    return this;
  }
  /**
   * ### get
   * Register handler for path with method [GET]
   *
   * ---
   * @example
   * ```typescript
   * import { Elysia, t } from 'elysia'
   *
   * new Elysia()
   *     .get('/', () => 'hi')
   *     .get('/with-hook', () => 'hi', {
   *         response: t.String()
   *     })
   * ```
   */
  get(path, handler, hook) {
    this.add("GET", path, handler, hook);
    return this;
  }
  /**
   * ### post
   * Register handler for path with method [POST]
   *
   * ---
   * @example
   * ```typescript
   * import { Elysia, t } from 'elysia'
   *
   * new Elysia()
   *     .post('/', () => 'hi')
   *     .post('/with-hook', () => 'hi', {
   *         response: t.String()
   *     })
   * ```
   */
  post(path, handler, hook) {
    this.add("POST", path, handler, hook);
    return this;
  }
  /**
   * ### put
   * Register handler for path with method [PUT]
   *
   * ---
   * @example
   * ```typescript
   * import { Elysia, t } from 'elysia'
   *
   * new Elysia()
   *     .put('/', () => 'hi')
   *     .put('/with-hook', () => 'hi', {
   *         response: t.String()
   *     })
   * ```
   */
  put(path, handler, hook) {
    this.add("PUT", path, handler, hook);
    return this;
  }
  /**
   * ### patch
   * Register handler for path with method [PATCH]
   *
   * ---
   * @example
   * ```typescript
   * import { Elysia, t } from 'elysia'
   *
   * new Elysia()
   *     .patch('/', () => 'hi')
   *     .patch('/with-hook', () => 'hi', {
   *         response: t.String()
   *     })
   * ```
   */
  patch(path, handler, hook) {
    this.add("PATCH", path, handler, hook);
    return this;
  }
  /**
   * ### delete
   * Register handler for path with method [DELETE]
   *
   * ---
   * @example
   * ```typescript
   * import { Elysia, t } from 'elysia'
   *
   * new Elysia()
   *     .delete('/', () => 'hi')
   *     .delete('/with-hook', () => 'hi', {
   *         response: t.String()
   *     })
   * ```
   */
  delete(path, handler, hook) {
    this.add("DELETE", path, handler, hook);
    return this;
  }
  /**
   * ### options
   * Register handler for path with method [POST]
   *
   * ---
   * @example
   * ```typescript
   * import { Elysia, t } from 'elysia'
   *
   * new Elysia()
   *     .options('/', () => 'hi')
   *     .options('/with-hook', () => 'hi', {
   *         response: t.String()
   *     })
   * ```
   */
  options(path, handler, hook) {
    this.add("OPTIONS", path, handler, hook);
    return this;
  }
  /**
   * ### all
   * Register handler for path with method [ALL]
   *
   * ---
   * @example
   * ```typescript
   * import { Elysia, t } from 'elysia'
   *
   * new Elysia()
   *     .all('/', () => 'hi')
   *     .all('/with-hook', () => 'hi', {
   *         response: t.String()
   *     })
   * ```
   */
  all(path, handler, hook) {
    this.add("ALL", path, handler, hook);
    return this;
  }
  /**
   * ### head
   * Register handler for path with method [HEAD]
   *
   * ---
   * @example
   * ```typescript
   * import { Elysia, t } from 'elysia'
   *
   * new Elysia()
   *     .head('/', () => 'hi')
   *     .head('/with-hook', () => 'hi', {
   *         response: t.String()
   *     })
   * ```
   */
  head(path, handler, hook) {
    this.add("HEAD", path, handler, hook);
    return this;
  }
  /**
   * ### connect
   * Register handler for path with method [CONNECT]
   *
   * ---
   * @example
   * ```typescript
   * import { Elysia, t } from 'elysia'
   *
   * new Elysia()
   *     .connect('/', () => 'hi')
   *     .connect('/with-hook', () => 'hi', {
   *         response: t.String()
   *     })
   * ```
   */
  connect(path, handler, hook) {
    this.add("CONNECT", path, handler, hook);
    return this;
  }
  /**
   * ### route
   * Register handler for path with method [ROUTE]
   *
   * ---
   * @example
   * ```typescript
   * import { Elysia, t } from 'elysia'
   *
   * new Elysia()
   *     .route('/', () => 'hi')
   *     .route('/with-hook', () => 'hi', {
   *         response: t.String()
   *     })
   * ```
   */
  route(method, path, handler, hook) {
    this.add(method.toUpperCase(), path, handler, hook, hook?.config);
    return this;
  }
  /**
   * ### ws
   * Register handler for path with method [ws]
   *
   * ---
   * @example
   * ```typescript
   * import { Elysia, t } from 'elysia'
   *
   * new Elysia()
   *     .ws('/', {
   *         message(ws, message) {
   *             ws.send(message)
   *         }
   *     })
   * ```
   */
  ws(path, options) {
    if (this["~adapter"].ws) this["~adapter"].ws(this, path, options);
    else console.warn(`Current adapter doesn't support WebSocket`);
    return this;
  }
  /**
   * ### state
   * Assign global mutatable state accessible for all handler
   *
   * ---
   * @example
   * ```typescript
   * new Elysia()
   *     .state('counter', 0)
   *     .get('/', (({ counter }) => ++counter)
   * ```
   */
  state(options, name, value) {
    if (name === void 0) {
      value = options;
      options = { as: "append" };
      name = "";
    } else if (value === void 0) {
      if (typeof options === "string") {
        value = name;
        name = options;
        options = { as: "append" };
      } else if (typeof options === "object") {
        value = name;
        name = "";
      }
    }
    const { as } = options;
    if (typeof name !== "string") return this;
    switch (typeof value) {
      case "object":
        if (name) {
          if (name in this.singleton.store)
            this.singleton.store[name] = (0, import_utils.mergeDeep)(
              this.singleton.store[name],
              value,
              {
                override: as === "override"
              }
            );
          else this.singleton.store[name] = value;
          return this;
        }
        if (value === null) return this;
        this.singleton.store = (0, import_utils.mergeDeep)(this.singleton.store, value, {
          override: as === "override"
        });
        return this;
      case "function":
        if (name) {
          if (as === "override" || !(name in this.singleton.store))
            this.singleton.store[name] = value;
        } else this.singleton.store = value(this.singleton.store);
        return this;
      default:
        if (as === "override" || !(name in this.singleton.store))
          this.singleton.store[name] = value;
        return this;
    }
  }
  /**
   * ### decorate
   * Define custom method to `Context` accessible for all handler
   *
   * ---
   * @example
   * ```typescript
   * new Elysia()
   *     .decorate('getDate', () => Date.now())
   *     .get('/', (({ getDate }) => getDate())
   * ```
   */
  decorate(options, name, value) {
    if (name === void 0) {
      value = options;
      options = { as: "append" };
      name = "";
    } else if (value === void 0) {
      if (typeof options === "string") {
        value = name;
        name = options;
        options = { as: "append" };
      } else if (typeof options === "object") {
        value = name;
        name = "";
      }
    }
    const { as } = options;
    if (typeof name !== "string") return this;
    switch (typeof value) {
      case "object":
        if (name) {
          if (name in this.singleton.decorator)
            this.singleton.decorator[name] = (0, import_utils.mergeDeep)(
              this.singleton.decorator[name],
              value,
              {
                override: as === "override"
              }
            );
          else this.singleton.decorator[name] = value;
          return this;
        }
        if (value === null) return this;
        this.singleton.decorator = (0, import_utils.mergeDeep)(
          this.singleton.decorator,
          value,
          {
            override: as === "override"
          }
        );
        return this;
      case "function":
        if (name) {
          if (as === "override" || !(name in this.singleton.decorator))
            this.singleton.decorator[name] = value;
        } else
          this.singleton.decorator = value(this.singleton.decorator);
        return this;
      default:
        if (as === "override" || !(name in this.singleton.decorator))
          this.singleton.decorator[name] = value;
        return this;
    }
  }
  derive(optionsOrTransform, transform) {
    if (!transform) {
      transform = optionsOrTransform;
      optionsOrTransform = { as: "local" };
    }
    const hook = {
      subType: "derive",
      fn: transform
    };
    return this.onTransform(optionsOrTransform, hook);
  }
  model(name, model) {
    const coerce = (schema) => (0, import_utils.replaceSchemaType)(schema, [
      {
        from: import_type_system.t.Number(),
        to: (options) => import_type_system.t.Numeric(options),
        untilObjectFound: true
      },
      {
        from: import_type_system.t.Boolean(),
        to: (options) => import_type_system.t.BooleanString(options),
        untilObjectFound: true
      }
    ]);
    switch (typeof name) {
      case "object":
        const parsedSchemas = {};
        const kvs = Object.entries(name);
        for (const [key, value] of kvs) {
          if (key in this.definitions.type) continue;
          parsedSchemas[key] = this.definitions.type[key] = coerce(
            value
          );
          parsedSchemas[key].$id ??= `#/components/schemas/${key}`;
        }
        this.definitions.typebox = import_type_system.t.Module({
          ...this.definitions.typebox["$defs"],
          ...parsedSchemas
        });
        return this;
      case "function":
        const result = coerce(name(this.definitions.type));
        this.definitions.type = result;
        this.definitions.typebox = import_type_system.t.Module(result);
        return this;
      case "string":
        if (!model) break;
        const newModel = {
          ...model,
          id: model.$id ?? `#/components/schemas/${name}`
        };
        this.definitions.type[name] = model;
        this.definitions.typebox = import_type_system.t.Module({
          ...this.definitions.typebox["$defs"],
          ...newModel
        });
        return this;
    }
    ;
    this.definitions.type[name] = model;
    this.definitions.typebox = import_type_system.t.Module({
      ...this.definitions.typebox["$defs"],
      [name]: model
    });
    return this;
  }
  mapDerive(optionsOrDerive, mapper) {
    if (!mapper) {
      mapper = optionsOrDerive;
      optionsOrDerive = { as: "local" };
    }
    const hook = {
      subType: "mapDerive",
      fn: mapper
    };
    return this.onTransform(optionsOrDerive, hook);
  }
  affix(base, type, word) {
    if (word === "") return this;
    const delimieter = ["_", "-", " "];
    const capitalize = (word2) => word2[0].toUpperCase() + word2.slice(1);
    const joinKey = base === "prefix" ? (prefix, word2) => delimieter.includes(prefix.at(-1) ?? "") ? prefix + word2 : prefix + capitalize(word2) : delimieter.includes(word.at(-1) ?? "") ? (suffix, word2) => word2 + suffix : (suffix, word2) => word2 + capitalize(suffix);
    const remap = (type2) => {
      const store = {};
      switch (type2) {
        case "decorator":
          for (const key in this.singleton.decorator) {
            store[joinKey(word, key)] = this.singleton.decorator[key];
          }
          this.singleton.decorator = store;
          break;
        case "state":
          for (const key in this.singleton.store)
            store[joinKey(word, key)] = this.singleton.store[key];
          this.singleton.store = store;
          break;
        case "model":
          for (const key in this.definitions.type)
            store[joinKey(word, key)] = this.definitions.type[key];
          this.definitions.type = store;
          break;
        case "error":
          for (const key in this.definitions.error)
            store[joinKey(word, key)] = this.definitions.error[key];
          this.definitions.error = store;
          break;
      }
    };
    const types = Array.isArray(type) ? type : [type];
    for (const type2 of types.some((x) => x === "all") ? ["decorator", "state", "model", "error"] : types)
      remap(type2);
    return this;
  }
  prefix(type, word) {
    return this.affix("prefix", type, word);
  }
  suffix(type, word) {
    return this.affix("suffix", type, word);
  }
  compile() {
    if (this["~adapter"].isWebStandard) {
      this.fetch = this.config.aot ? (0, import_compose.composeGeneralHandler)(this) : (0, import_dynamic_handle.createDynamicHandler)(this);
      if (typeof this.server?.reload === "function")
        this.server.reload({
          ...this.server || {},
          fetch: this.fetch
        });
      return this;
    }
    if (typeof this.server?.reload === "function")
      this.server.reload(this.server || {});
    this._handle = (0, import_compose.composeGeneralHandler)(this);
    return this;
  }
  /**
   * Wait until all lazy loaded modules all load is fully
   */
  get modules() {
    return this.promisedModules;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Cookie,
  ELYSIA_FORM_DATA,
  ELYSIA_REQUEST_ID,
  ELYSIA_TRACE,
  ERROR_CODE,
  Elysia,
  ElysiaFile,
  InternalServerError,
  InvalidCookieSignature,
  InvertedStatusMap,
  NotFoundError,
  ParseError,
  StatusMap,
  TypeSystemPolicy,
  ValidationError,
  checksum,
  cloneInference,
  deduplicateChecksum,
  env,
  error,
  file,
  form,
  getResponseSchemaValidator,
  getSchemaValidator,
  mapValueError,
  mergeHook,
  mergeObjectArray,
  redirect,
  replaceSchemaType,
  replaceUrlPath,
  serializeCookie,
  t
});
