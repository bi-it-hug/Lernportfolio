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
var web_standard_exports = {};
__export(web_standard_exports, {
  WebStandardAdapter: () => WebStandardAdapter
});
module.exports = __toCommonJS(web_standard_exports);
var import_handler = require("./handler");
var import_utils = require("../../utils");
const WebStandardAdapter = {
  name: "web-standard",
  isWebStandard: true,
  handler: {
    mapResponse: import_handler.mapResponse,
    mapEarlyResponse: import_handler.mapEarlyResponse,
    mapCompactResponse: import_handler.mapCompactResponse,
    createStaticHandler: import_handler.createStaticHandler
  },
  composeHandler: {
    mapResponseContext: "c.request",
    preferWebstandardHeaders: true,
    // @ts-ignore Bun specific
    headers: "c.headers = {}\nfor (const [key, value] of c.request.headers.entries())c.headers[key] = value\n",
    parser: {
      json(isOptional) {
        if (isOptional)
          return `try{c.body=await c.request.json()}catch{}
`;
        return `c.body=await c.request.json()
`;
      },
      text() {
        return `c.body=await c.request.text()
`;
      },
      urlencoded() {
        return `c.body=parseQuery(await c.request.text())
`;
      },
      arrayBuffer() {
        return `c.body=await c.request.arrayBuffer()
`;
      },
      formData(isOptional) {
        let fnLiteral = "\nc.body={}\n";
        if (isOptional)
          fnLiteral += `let form;try{form=await c.request.formData()}catch{}`;
        else fnLiteral += `const form=await c.request.formData()
`;
        return fnLiteral + `for(const key of form.keys()){if(c.body[key]) continue
const value=form.getAll(key)
if(value.length===1)c.body[key]=value[0]
else c.body[key]=value}`;
      }
    }
  },
  composeGeneralHandler: {
    parameters: "r",
    createContext(app) {
      let decoratorsLiteral = "";
      let fnLiteral = "";
      const defaultHeaders = app.setHeaders;
      for (const key of Object.keys(app.singleton.decorator))
        decoratorsLiteral += `,${key}: decorator['${key}']`;
      const standardHostname = app.config.handler?.standardHostname ?? true;
      const hasTrace = !!app.event.trace?.length;
      fnLiteral += `const u=r.url,s=u.indexOf('/',${standardHostname ? 11 : 7}),qi=u.indexOf('?', s + 1)
let p
if(qi===-1)p=u.substring(s)
else p=u.substring(s, qi)
`;
      if (hasTrace) fnLiteral += `const id=randomId()
`;
      fnLiteral += `const c={request:r,store,qi,path:p,url:u,redirect,error,set:{headers:`;
      fnLiteral += Object.keys(defaultHeaders ?? {}).length ? "Object.assign({}, app.setHeaders)" : "{}";
      fnLiteral += `,status:200}`;
      if (app.inference.server)
        fnLiteral += `,get server(){return app.getServer()}`;
      if (hasTrace) fnLiteral += ",[ELYSIA_REQUEST_ID]:id";
      fnLiteral += decoratorsLiteral;
      fnLiteral += `}
`;
      return fnLiteral;
    },
    websocket(app) {
      let fnLiteral = "";
      const wsPaths = app.router.static.ws;
      const router = app.router.http;
      router.build();
      if (Object.keys(wsPaths).length || router.root.ws || router.history.find((x) => x["0"] === "ws")) {
        fnLiteral += `if(r.method==='GET'){switch(p){`;
        for (const [path, index] of Object.entries(wsPaths)) {
          fnLiteral += `case'${path}':` + (app.config.strictPath !== true ? `case'${(0, import_utils.getLoosePath)(path)}':` : "") + `if(r.headers.get('upgrade')==='websocket')return ht[${index}].composed(c)
`;
        }
        fnLiteral += `default:if(r.headers.get('upgrade')==='websocket'){const route=router.find('ws',p)
if(route){c.params=route.params
if(route.store.handler)return route.store.handler(c)
return (route.store.handler=route.store.compile())(c)}}break}}`;
      }
      return fnLiteral;
    },
    error404(hasEventHook, hasErrorHook) {
      let findDynamicRoute = `if(route===null)return `;
      if (hasErrorHook)
        findDynamicRoute += `app.handleError(c,notFound,false,${this.parameters})`;
      else
        findDynamicRoute += hasEventHook ? `new Response(error404Message,{status:c.set.status===200?404:c.set.status,headers:c.set.headers})` : `error404.clone()`;
      return {
        declare: hasErrorHook ? "" : `const error404Message=notFound.message.toString()
const error404=new Response(error404Message,{status:404})
`,
        code: findDynamicRoute
      };
    }
  },
  composeError: {
    mapResponseContext: "",
    validationError: `return new Response(error.message,{headers:Object.assign({'content-type':'application/json'},set.headers),status:set.status})`,
    unknownError: `return new Response(error.message,{headers:set.headers,status:error.status??set.status??500})`
  },
  listen() {
    return () => {
      throw new Error(
        "WebStandard does not support listen, you might want to export default Elysia.fetch instead"
      );
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  WebStandardAdapter
});
