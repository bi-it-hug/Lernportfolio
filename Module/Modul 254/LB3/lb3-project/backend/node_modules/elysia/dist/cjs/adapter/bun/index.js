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
var bun_exports = {};
__export(bun_exports, {
  BunAdapter: () => BunAdapter
});
module.exports = __toCommonJS(bun_exports);
var import_web_standard = require("../web-standard/index");
var import_handler = require("../web-standard/handler");
var import_handler2 = require("./handler");
var import_cookies = require("../../cookies");
var import_error = require("../../error");
var import_utils = require("../../utils");
var import_ws = require("../../ws/index");
const BunAdapter = {
  ...import_web_standard.WebStandardAdapter,
  name: "bun",
  handler: {
    ...import_web_standard.WebStandardAdapter.handler,
    createNativeStaticHandler: import_handler2.createNativeStaticHandler
  },
  composeHandler: {
    ...import_web_standard.WebStandardAdapter.composeHandler,
    headers: import_utils.hasHeaderShorthand ? "c.headers = c.request.headers.toJSON()\n" : "c.headers = {}\nfor (const [key, value] of c.request.headers.entries())c.headers[key] = value\n"
  },
  listen(app) {
    return (options, callback) => {
      if (typeof Bun === "undefined")
        throw new Error(
          ".listen() is designed to run on Bun only. If you are running Elysia in other environment please use a dedicated plugin or export the handler via Elysia.fetch"
        );
      app.compile();
      if (typeof options === "string") {
        if (!(0, import_utils.isNumericString)(options))
          throw new Error("Port must be a numeric value");
        options = parseInt(options);
      }
      const fetch = app.fetch;
      const serve = typeof options === "object" ? {
        development: !import_error.isProduction,
        reusePort: true,
        ...app.config.serve || {},
        ...options || {},
        // @ts-ignore
        static: {
          ...app.router.static.http.static,
          ...app.config.serve?.static
        },
        websocket: {
          ...app.config.websocket || {},
          ...import_ws.websocket || {}
        },
        fetch,
        // @ts-expect-error private property
        error: app.outerErrorHandler
      } : {
        development: !import_error.isProduction,
        reusePort: true,
        ...app.config.serve || {},
        // @ts-ignore
        static: app.router.static.http.static,
        websocket: {
          ...app.config.websocket || {},
          ...import_ws.websocket || {}
        },
        port: options,
        fetch,
        // @ts-expect-error private property
        error: app.outerErrorHandler
      };
      app.server = Bun?.serve(serve);
      if (app.event.start)
        for (let i = 0; i < app.event.start.length; i++)
          app.event.start[i].fn(app);
      if (callback) callback(app.server);
      process.on("beforeExit", () => {
        if (app.server) {
          app.server.stop?.();
          app.server = null;
          if (app.event.stop)
            for (let i = 0; i < app.event.stop.length; i++)
              app.event.stop[i].fn(app);
        }
      });
      app.promisedModules.then(() => {
        Bun?.gc(false);
      });
    };
  },
  ws(app, path, options) {
    const { parse, body, response, ...rest } = options;
    const validateMessage = (0, import_utils.getSchemaValidator)(body, {
      // @ts-expect-error private property
      modules: app.definitions.typebox,
      // @ts-expect-error private property
      models: app.definitions.type,
      normalize: app.config.normalize
    });
    const validateResponse = (0, import_utils.getSchemaValidator)(response, {
      // @ts-expect-error private property
      modules: app.definitions.typebox,
      // @ts-expect-error private property
      models: app.definitions.type,
      normalize: app.config.normalize
    });
    app.route(
      "$INTERNALWS",
      path,
      async (context) => {
        const server = app.getServer();
        const { set, path: path2, qi, headers, query, params } = context;
        context.validator = validateResponse;
        if (options.upgrade) {
          if (typeof options.upgrade === "function") {
            const temp = options.upgrade(context);
            if (temp instanceof Promise) await temp;
          } else if (options.upgrade)
            Object.assign(
              set.headers,
              options.upgrade
            );
        }
        if (set.cookie && (0, import_utils.isNotEmpty)(set.cookie)) {
          const cookie = (0, import_cookies.serializeCookie)(set.cookie);
          if (cookie) set.headers["set-cookie"] = cookie;
        }
        if (set.headers["set-cookie"] && Array.isArray(set.headers["set-cookie"]))
          set.headers = (0, import_handler.parseSetCookies)(
            new Headers(set.headers),
            set.headers["set-cookie"]
          );
        const handleResponse = (0, import_ws.createHandleWSResponse)(validateResponse);
        const parseMessage = (0, import_ws.createWSMessageParser)(parse);
        let _id;
        const errorHandlers = [
          ...Array.isArray(options.error) ? options.error : [options.error],
          ...(app.event.error ?? []).map(
            (x) => typeof x === "function" ? x : x.fn
          )
        ];
        const handleErrors = !errorHandlers.length ? () => {
        } : async (ws, error) => {
          for (const handleError of errorHandlers) {
            let response2 = handleError(
              Object.assign(context, { error })
            );
            if (response2 instanceof Promise)
              response2 = await response2;
            await handleResponse(ws, response2);
            if (response2) break;
          }
        };
        if (server?.upgrade(context.request, {
          headers: (0, import_utils.isNotEmpty)(set.headers) ? set.headers : void 0,
          data: {
            ...context,
            get id() {
              if (_id) return _id;
              return _id = (0, import_utils.randomId)();
            },
            validator: validateResponse,
            ping(data) {
              options.ping?.(data);
            },
            pong(data) {
              options.pong?.(data);
            },
            open(ws) {
              try {
                handleResponse(
                  ws,
                  options.open?.(
                    new import_ws.ElysiaWS(ws, context)
                  )
                );
              } catch (error) {
                handleErrors(ws, error);
              }
            },
            message: async (ws, _message) => {
              const message = await parseMessage(ws, _message);
              if (validateMessage?.Check(message) === false)
                return void ws.send(
                  new import_error.ValidationError(
                    "message",
                    validateMessage,
                    message
                  ).message
                );
              try {
                handleResponse(
                  ws,
                  options.message?.(
                    new import_ws.ElysiaWS(
                      ws,
                      context,
                      message
                    ),
                    message
                  )
                );
              } catch (error) {
                handleErrors(ws, error);
              }
            },
            drain(ws) {
              try {
                handleResponse(
                  ws,
                  options.drain?.(
                    new import_ws.ElysiaWS(ws, context)
                  )
                );
              } catch (error) {
                handleErrors(ws, error);
              }
            },
            close(ws, code, reason) {
              try {
                handleResponse(
                  ws,
                  options.close?.(
                    new import_ws.ElysiaWS(ws, context),
                    code,
                    reason
                  )
                );
              } catch (error) {
                handleErrors(ws, error);
              }
            }
          }
        }))
          return;
        set.status = 400;
        return "Expected a websocket connection";
      },
      {
        ...rest,
        websocket: options
      }
    );
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BunAdapter
});
