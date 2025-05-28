import { Value } from "@sinclair/typebox/value";
import {
  Kind,
  TypeBoxError
} from "@sinclair/typebox";
import{ parseQuery, parseQueryFromURL }from"./fast-querystring.mjs";
import{ decode as decodeURIComponent }from"./deuri.mjs";
import{
  ELYSIA_REQUEST_ID,
  getCookieValidator,
  getLoosePath,
  lifeCycleToFn,
  randomId,
  redirect,
  signCookie,
  isNotEmpty,
  encodePath
}from"./utils.mjs";
import{ ParseError, error }from"./error.mjs";
import{
  NotFoundError,
  ValidationError,
  InternalServerError,
  ERROR_CODE,
  ElysiaCustomStatusResponse
}from"./error.mjs";
import{ ELYSIA_TRACE }from"./trace.mjs";
import{ hasReturn, sucrose }from"./sucrose.mjs";
import{ parseCookie }from"./cookies.mjs";
const TypeBoxSymbol = {
  optional: Symbol.for("TypeBox.Optional"),
  kind: Symbol.for("TypeBox.Kind")
};
const isOptional = (validator) => {
  if (!validator) return false;
  const schema = validator?.schema;
  if (schema?.[TypeBoxSymbol.kind] === "Import")
    return validator.References().some(isOptional);
  return !!schema && TypeBoxSymbol.optional in schema;
};
const allocateIf = (value, condition) => condition ? value : "";
const defaultParsers = [
  "json",
  "text",
  "urlencoded",
  "arrayBuffer",
  "formdata",
  "application/json",
  // eslint-disable-next-line sonarjs/no-duplicate-string
  "text/plain",
  // eslint-disable-next-line sonarjs/no-duplicate-string
  "application/x-www-form-urlencoded",
  // eslint-disable-next-line sonarjs/no-duplicate-string
  "application/octet-stream",
  // eslint-disable-next-line sonarjs/no-duplicate-string
  "multipart/form-data"
];
const hasAdditionalProperties = (_schema) => {
  if (!_schema) return false;
  const schema = _schema?.schema ?? _schema;
  if (schema[TypeBoxSymbol.kind] === "Import" && _schema.References()) {
    return _schema.References().some(hasAdditionalProperties);
  }
  if (schema.anyOf) return schema.anyOf.some(hasAdditionalProperties);
  if (schema.someOf) return schema.someOf.some(hasAdditionalProperties);
  if (schema.allOf) return schema.allOf.some(hasAdditionalProperties);
  if (schema.not) return schema.not.some(hasAdditionalProperties);
  if (schema.type === "object") {
    const properties = schema.properties;
    if ("additionalProperties" in schema) return schema.additionalProperties;
    if ("patternProperties" in schema) return false;
    for (const key of Object.keys(properties)) {
      const property = properties[key];
      if (property.type === "object") {
        if (hasAdditionalProperties(property)) return true;
      } else if (property.anyOf) {
        for (let i = 0; i < property.anyOf.length; i++)
          if (hasAdditionalProperties(property.anyOf[i])) return true;
      }
      return property.additionalProperties;
    }
    return false;
  }
  return false;
};
const createReport = ({
  context = "c",
  trace = [],
  addFn
}) => {
  if (!trace.length)
    return () => {
      return {
        resolveChild() {
          return () => {
          };
        },
        resolve() {
        }
      };
    };
  for (let i = 0; i < trace.length; i++)
    addFn(
      `let report${i}, reportChild${i}, reportErr${i}, reportErrChild${i};let trace${i} = ${context}[ELYSIA_TRACE]?.[${i}] ?? trace[${i}](${context});
`
    );
  return (event, {
    name,
    total = 0
  } = {}) => {
    if (!name) name = "anonymous";
    const reporter = event === "error" ? "reportErr" : "report";
    for (let i = 0; i < trace.length; i++)
      addFn(
        `${reporter}${i} = trace${i}.${event}({id,event:'${event}',name:'${name}',begin:performance.now(),total:${total}})
`
      );
    return {
      resolve() {
        for (let i = 0; i < trace.length; i++)
          addFn(`${reporter}${i}.resolve()
`);
      },
      resolveChild(name2) {
        for (let i = 0; i < trace.length; i++)
          addFn(
            `${reporter}Child${i}=${reporter}${i}.resolveChild?.shift()?.({id,event:'${event}',name:'${name2}',begin:performance.now()})
`
          );
        return (binding) => {
          for (let i = 0; i < trace.length; i++) {
            if (binding)
              addFn(
                `if(${binding} instanceof Error){${reporter}Child${i}?.(${binding}) }else{${reporter}Child${i}?.()}`
              );
            else addFn(`${reporter}Child${i}?.()
`);
          }
        };
      }
    };
  };
};
const composeValidationFactory = ({
  injectResponse = "",
  normalize = false,
  validator,
  encodeSchema = false
}) => ({
  composeValidation: (type, value = `c.${type}`) => `c.set.status=422;throw new ValidationError('${type}',validator.${type},${value})`,
  composeResponseValidation: (name = "r") => {
    let code = injectResponse + "\n";
    code += `if(${name} instanceof ElysiaCustomStatusResponse){c.set.status=${name}.code
${name}=${name}.response}const isResponse=${name} instanceof Response
switch(c.set.status){`;
    for (const [status, value] of Object.entries(
      validator.response
    )) {
      code += `
case ${status}:if(!isResponse){`;
      if (normalize && "Clean" in value && !hasAdditionalProperties(value))
        code += `${name}=validator.response['${status}'].Clean(${name})
`;
      if (encodeSchema && // @ts-expect-error hasTransform is appended by getResponseSchemaValidator
      (value.hasTransform || typeof value.Decode === "function"))
        code += `${name}=validator.response['${status}'].Encode(${name})
`;
      code += `if(validator.response['${status}'].Check(${name})===false){c.set.status=422
throw new ValidationError('response',validator.response['${status}'],${name})}c.set.status = ${status}}
`;
      code += "break\n";
    }
    return code + "}";
  }
});
const KindSymbol = Symbol.for("TypeBox.Kind");
const hasType = (type, schema) => {
  if (!schema) return;
  if (KindSymbol in schema && schema[KindSymbol] === type) return true;
  if (schema.type === "object") {
    const properties = schema.properties;
    for (const key of Object.keys(properties)) {
      const property = properties[key];
      if (property.type === "object") {
        if (hasType(type, property)) return true;
      } else if (property.anyOf) {
        for (let i = 0; i < property.anyOf.length; i++)
          if (hasType(type, property.anyOf[i])) return true;
      }
      if (KindSymbol in property && property[KindSymbol] === type)
        return true;
    }
    return false;
  }
  return schema.properties && KindSymbol in schema.properties && schema.properties[KindSymbol] === type;
};
const hasProperty = (expectedProperty, _schema) => {
  if (!_schema) return;
  const schema = _schema.schema ?? _schema;
  if (schema[TypeBoxSymbol.kind] === "Import")
    return _schema.References().some((schema2) => hasProperty(expectedProperty, schema2));
  if (schema.type === "object") {
    const properties = schema.properties;
    if (!properties) return false;
    for (const key of Object.keys(properties)) {
      const property = properties[key];
      if (expectedProperty in property) return true;
      if (property.type === "object") {
        if (hasProperty(expectedProperty, property)) return true;
      } else if (property.anyOf) {
        for (let i = 0; i < property.anyOf.length; i++) {
          if (hasProperty(expectedProperty, property.anyOf[i]))
            return true;
        }
      }
    }
    return false;
  }
  return expectedProperty in schema;
};
const TransformSymbol = Symbol.for("TypeBox.Transform");
const hasRef = (schema) => {
  if (!schema) return false;
  if (schema.oneOf) {
    for (let i = 0; i < schema.oneOf.length; i++)
      if (hasRef(schema.oneOf[i])) return true;
  }
  if (schema.anyOf) {
    for (let i = 0; i < schema.anyOf.length; i++)
      if (hasRef(schema.anyOf[i])) return true;
  }
  if (schema.oneOf) {
    for (let i = 0; i < schema.oneOf.length; i++)
      if (hasRef(schema.oneOf[i])) return true;
  }
  if (schema.allOf) {
    for (let i = 0; i < schema.allOf.length; i++)
      if (hasRef(schema.allOf[i])) return true;
  }
  if (schema.not && hasRef(schema.not)) return true;
  if (schema.type === "object" && schema.properties) {
    const properties = schema.properties;
    for (const key of Object.keys(properties)) {
      const property = properties[key];
      if (hasRef(property)) return true;
      if (property.type === "array" && property.items && hasRef(property.items))
        return true;
    }
  }
  if (schema.type === "array" && schema.items && hasRef(schema.items))
    return true;
  return schema[Kind] === "Ref" && "$ref" in schema;
};
const hasTransform = (schema) => {
  if (!schema) return false;
  if (schema.$ref && schema.$defs && schema.$ref in schema.$defs && hasTransform(schema.$defs[schema.$ref]))
    return true;
  if (schema.oneOf) {
    for (let i = 0; i < schema.oneOf.length; i++)
      if (hasTransform(schema.oneOf[i])) return true;
  }
  if (schema.anyOf) {
    for (let i = 0; i < schema.anyOf.length; i++)
      if (hasTransform(schema.anyOf[i])) return true;
  }
  if (schema.allOf) {
    for (let i = 0; i < schema.allOf.length; i++)
      if (hasTransform(schema.allOf[i])) return true;
  }
  if (schema.not && hasTransform(schema.not)) return true;
  if (schema.type === "object" && schema.properties) {
    const properties = schema.properties;
    for (const key of Object.keys(properties)) {
      const property = properties[key];
      if (hasTransform(property)) return true;
      if (property.type === "array" && property.items && hasTransform(property.items))
        return true;
    }
  }
  if (schema.type === "array" && schema.items && hasTransform(schema.items))
    return true;
  return TransformSymbol in schema;
};
const matchFnReturn = /(?:return|=>) \S+\(/g;
const isAsyncName = (v) => {
  const fn = v?.fn ?? v;
  return fn.constructor.name === "AsyncFunction";
};
const isAsync = (v) => {
  const fn = v?.fn ?? v;
  if (fn.constructor.name === "AsyncFunction") return true;
  const literal = fn.toString();
  if (literal.includes("=> response.clone(")) return false;
  if (literal.includes("await")) return true;
  if (literal.includes("async")) return true;
  if (literal.includes("=>response.clone(")) return false;
  return !!literal.match(matchFnReturn);
};
const isGenerator = (v) => {
  const fn = v?.fn ?? v;
  return fn.constructor.name === "AsyncGeneratorFunction" || fn.constructor.name === "GeneratorFunction";
};
const composeHandler = ({
  app,
  path,
  method,
  hooks,
  validator,
  handler,
  allowMeta = false,
  inference,
  asManifest = false
}) => {
  const adapter = app["~adapter"].composeHandler;
  const adapterHandler = app["~adapter"].handler;
  const isHandleFn = typeof handler === "function";
  if (!isHandleFn) {
    handler = adapterHandler.mapResponse(handler, {
      // @ts-expect-error private property
      headers: app.setHeaders ?? {}
    });
    if (hooks.parse?.length && hooks.transform?.length && hooks.beforeHandle?.length && hooks.afterHandle?.length) {
      if (handler instanceof Response)
        return Function(
          "a",
          `return function(){return a.clone()}`
        )(handler);
      return Function("a", "return function(){return a}")(handler);
    }
  }
  const handle = isHandleFn ? `handler(c)` : `handler`;
  const hasAfterResponse = !!hooks.afterResponse?.length;
  const hasTrace = !!hooks.trace?.length;
  let fnLiteral = "";
  inference = sucrose(
    Object.assign({}, hooks, {
      handler
    }),
    inference
  );
  if (adapter.declare) {
    const literal = adapter.declare(inference);
    if (literal) fnLiteral += literal;
  }
  if (inference.server)
    fnLiteral += "Object.defineProperty(c,'server',{get:function(){return getServer()}})\n";
  validator.createBody?.();
  validator.createQuery?.();
  validator.createHeaders?.();
  validator.createParams?.();
  validator.createCookie?.();
  validator.createResponse?.();
  const hasValidation = validator.body || validator.headers || validator.params || validator.query || validator.cookie || validator.response;
  const hasQuery = inference.query || !!validator.query;
  const requestNoBody = hooks.parse?.length === 1 && // @ts-expect-error
  hooks.parse[0].fn === "none";
  const hasBody = method !== "$INTERNALWS" && method !== "GET" && method !== "HEAD" && (inference.body || !!validator.body || !!hooks.parse?.length) && !requestNoBody;
  if (hasBody) fnLiteral += `let isParsing=false
`;
  const defaultHeaders = app.setHeaders;
  const hasDefaultHeaders = defaultHeaders && !!Object.keys(defaultHeaders).length;
  const hasHeaders = inference.headers || validator.headers || adapter.preferWebstandardHeaders !== true && inference.body;
  const hasCookie = inference.cookie || !!validator.cookie;
  const cookieValidator = hasCookie ? getCookieValidator({
    // @ts-expect-error private property
    modules: app.definitions.typebox,
    validator: validator.cookie,
    defaultConfig: app.config.cookie,
    dynamic: !!app.config.aot,
    // @ts-expect-error
    config: validator.cookie?.config ?? {},
    // @ts-expect-error
    models: app.definitions.type
  }) : void 0;
  const cookieMeta = cookieValidator?.config;
  let encodeCookie = "";
  if (cookieMeta?.sign) {
    if (!cookieMeta.secrets)
      throw new Error(
        `t.Cookie required secret which is not set in (${method}) ${path}.`
      );
    const secret = !cookieMeta.secrets ? void 0 : typeof cookieMeta.secrets === "string" ? cookieMeta.secrets : cookieMeta.secrets[0];
    encodeCookie += "const _setCookie = c.set.cookie\nif(_setCookie){";
    if (cookieMeta.sign === true) {
      encodeCookie += `for(const [key, cookie] of Object.entries(_setCookie)){c.set.cookie[key].value=await signCookie(cookie.value,'${secret}')}`;
    } else
      for (const name of cookieMeta.sign)
        encodeCookie += `if(_setCookie['${name}']?.value){c.set.cookie['${name}'].value=await signCookie(_setCookie['${name}'].value,'${secret}')}`;
    encodeCookie += "}\n";
  }
  const normalize = app.config.normalize;
  const encodeSchema = app.config.experimental?.encodeSchema;
  const { composeValidation, composeResponseValidation } = composeValidationFactory({
    normalize,
    validator,
    encodeSchema
  });
  if (hasHeaders) fnLiteral += adapter.headers;
  if (hasTrace) fnLiteral += "const id=c[ELYSIA_REQUEST_ID]\n";
  const report = createReport({
    trace: hooks.trace,
    addFn: (word) => {
      fnLiteral += word;
    }
  });
  fnLiteral += "try{";
  if (hasCookie) {
    const get = (name, defaultValue) => {
      const value = cookieMeta?.[name] ?? defaultValue;
      if (!value)
        return typeof defaultValue === "string" ? `${name}:"${defaultValue}",` : `${name}:${defaultValue},`;
      if (typeof value === "string") return `${name}:'${value}',`;
      if (value instanceof Date)
        return `${name}: new Date(${value.getTime()}),`;
      return `${name}:${value},`;
    };
    const options = cookieMeta ? `{secrets:${cookieMeta.secrets !== void 0 ? typeof cookieMeta.secrets === "string" ? `'${cookieMeta.secrets}'` : "[" + cookieMeta.secrets.reduce(
      (a, b) => a + `'${b}',`,
      ""
    ) + "]" : "undefined"},sign:${cookieMeta.sign === true ? true : cookieMeta.sign !== void 0 ? "[" + cookieMeta.sign.reduce(
      (a, b) => a + `'${b}',`,
      ""
    ) + "]" : "undefined"},` + get("domain") + get("expires") + get("httpOnly") + get("maxAge") + get("path", "/") + get("priority") + get("sameSite") + get("secure") + "}" : "undefined";
    if (hasHeaders)
      fnLiteral += `
c.cookie=await parseCookie(c.set,c.headers.cookie,${options})
`;
    else
      fnLiteral += `
c.cookie=await parseCookie(c.set,c.request.headers.get('cookie'),${options})
`;
  }
  if (hasQuery) {
    const destructured = [];
    if (validator.query && validator.query.schema.type === "object") {
      const properties = validator.query.schema.properties;
      if (!hasAdditionalProperties(validator.query))
        for (let [key, _value] of Object.entries(properties)) {
          let value = _value;
          const isArray = value.type === "array" || !!value.anyOf?.some(
            (v) => v.type === "string" && v.format === "ArrayString"
          );
          if (value && TypeBoxSymbol.optional in value && value.type === "array" && value.items)
            value = value.items;
          const { type, anyOf } = value;
          destructured.push({
            key,
            isArray,
            isNestedObjectArray: isArray && value.items?.type === "object" || !!value.items?.anyOf?.some(
              // @ts-expect-error
              (x) => x.type === "object" || x.type === "array"
            ),
            isObject: type === "object" || anyOf?.some(
              (v) => v.type === "string" && v.format === "ArrayString"
            ),
            anyOf: !!anyOf
          });
        }
    }
    if (!destructured.length) {
      fnLiteral += "if(c.qi===-1){c.query={}}else{c.query=parseQueryFromURL(c.url.slice(c.qi + 1))}";
    } else {
      fnLiteral += `if(c.qi!==-1){let url='&'+c.url.slice(c.qi + 1)
`;
      let index = 0;
      for (const {
        key,
        isArray,
        isObject,
        isNestedObjectArray,
        anyOf
      } of destructured) {
        const init2 = (index === 0 ? "let " : "") + `memory=url.indexOf('&${key}=')
let a${index}
`;
        if (isArray) {
          fnLiteral += init2;
          if (isNestedObjectArray)
            fnLiteral += `while(memory!==-1){const start=memory+${key.length + 2}
memory=url.indexOf('&',start)
if(a${index}===undefined)
a${index}=''
else
a${index}+=','
let temp
if(memory===-1)temp=decodeURIComponent(url.slice(start).replace(/\\+/g,' '))
else temp=decodeURIComponent(url.slice(start, memory).replace(/\\+/g,' '))
const charCode=temp.charCodeAt(0)
if(charCode!==91&&charCode !== 123)
temp='"'+temp+'"'
a${index}+=temp
if(memory===-1)break
memory=url.indexOf('&${key}=',memory)
if(memory===-1)break}try{if(a${index}.charCodeAt(0)===91)a${index} = JSON.parse(a${index})
else
a${index}=JSON.parse('['+a${index}+']')}catch{}
`;
          else
            fnLiteral += `while(memory!==-1){const start=memory+${key.length + 2}
memory=url.indexOf('&',start)
if(a${index}===undefined)a${index}=[]
if(memory===-1){const temp=decodeURIComponent(url.slice(start)).replace(/\\+/g,' ')
if(temp.includes(',')){a${index}=a${index}.concat(temp.split(','))}else{a${index}.push(decodeURIComponent(url.slice(start)).replace(/\\+/g,' '))}
break}else{const temp=decodeURIComponent(url.slice(start, memory)).replace(/\\+/g,' ')
if(temp.includes(',')){a${index}=a${index}.concat(temp.split(','))}else{a${index}.push(temp)}
}memory=url.indexOf('&${key}=',memory)
if(memory===-1) break
}`;
        } else if (isObject)
          fnLiteral += init2 + `if(memory!==-1){const start=memory+${key.length + 2}
memory=url.indexOf('&',start)
if(memory===-1)a${index}=decodeURIComponent(url.slice(start).replace(/\\+/g,' '))else a${index}=decodeURIComponent(url.slice(start,memory).replace(/\\+/g,' '))if(a${index}!==undefined)try{a${index}=JSON.parse(a${index})}catch{}}`;
        else {
          fnLiteral += init2 + `if(memory!==-1){const start=memory+${key.length + 2}
memory=url.indexOf('&',start)
if(memory===-1)a${index}=decodeURIComponent(url.slice(start).replace(/\\+/g,' '))
else{a${index}=decodeURIComponent(url.slice(start,memory).replace(/\\+/g,' '))`;
          if (anyOf)
            fnLiteral += `
let deepMemory=url.indexOf('&${key}=',memory)
if(deepMemory!==-1){a${index}=[a${index}]
let first=true
while(true){const start=deepMemory+${key.length + 2}
if(first)first=false
else deepMemory = url.indexOf('&', start)
let value
if(deepMemory===-1)value=url.slice(start).replace(/\\+/g,' ')
else value=url.slice(start, deepMemory).replace(/\\+/g,' ')
value=decodeURIComponent(value)
if(value===null){if(deepMemory===-1){break}else{continue}}
const vStart=value.charCodeAt(0)
const vEnd=value.charCodeAt(value.length - 1)
if((vStart===91&&vEnd===93)||(vStart===123&&vEnd===125))
try{a${index}.push(JSON.parse(value))}catch{a${index}.push(value)}if(deepMemory===-1)break}}`;
          fnLiteral += "}}";
        }
        index++;
        fnLiteral += "\n";
      }
      fnLiteral += `c.query={` + destructured.map(({ key }, index2) => `'${key}':a${index2}`).join(",") + `}`;
      fnLiteral += `} else c.query = {}
`;
    }
  }
  const isAsyncHandler = typeof handler === "function" && isAsync(handler);
  const saveResponse = hasTrace || hooks.afterResponse?.length ? "c.response= " : "";
  const maybeAsync = hasCookie || hasBody || isAsyncHandler || !!hooks.parse?.length || !!hooks.afterHandle?.some(isAsync) || !!hooks.beforeHandle?.some(isAsync) || !!hooks.transform?.some(isAsync) || !!hooks.mapResponse?.some(isAsync);
  const maybeStream = (typeof handler === "function" ? isGenerator(handler) : false) || !!hooks.beforeHandle?.some(isGenerator) || !!hooks.afterHandle?.some(isGenerator) || !!hooks.transform?.some(isGenerator);
  const hasSet = inference.cookie || inference.set || hasHeaders || hasTrace || validator.response || isHandleFn && hasDefaultHeaders || maybeStream;
  const mapResponseContext = adapter.mapResponseContext ? `,${adapter.mapResponseContext}` : "";
  if (hasTrace || inference.route) fnLiteral += `c.route=\`${path}\`
`;
  const parseReporter = report("parse", {
    total: hooks.parse?.length
  });
  if (hasBody) {
    const isOptionalBody = isOptional(validator.body);
    const hasBodyInference = !!hooks.parse?.length || inference.body || validator.body;
    if (adapter.parser.declare) fnLiteral += adapter.parser.declare;
    fnLiteral += "\nisParsing=true\n";
    const parser = typeof hooks.parse === "string" ? hooks.parse : Array.isArray(hooks.parse) && hooks.parse.length === 1 ? typeof hooks.parse[0] === "string" ? hooks.parse[0] : typeof hooks.parse[0].fn === "string" ? hooks.parse[0].fn : void 0 : void 0;
    if (parser && defaultParsers.includes(parser)) {
      const reporter = report("parse", {
        total: hooks.parse?.length
      });
      switch (parser) {
        case "json":
        case "application/json":
          fnLiteral += adapter.parser.json(isOptionalBody);
          break;
        case "text":
        case "text/plain":
          fnLiteral += adapter.parser.text(isOptionalBody);
          break;
        case "urlencoded":
        case "application/x-www-form-urlencoded":
          fnLiteral += adapter.parser.urlencoded(isOptionalBody);
          break;
        case "arrayBuffer":
        case "application/octet-stream":
          fnLiteral += adapter.parser.arrayBuffer(isOptionalBody);
          break;
        case "formdata":
        case "multipart/form-data":
          fnLiteral += adapter.parser.formData(isOptionalBody);
          break;
        default:
          if (parser[0] in app["~parser"]) {
            fnLiteral += hasHeaders ? `let contentType = c.headers['content-type']` : `let contentType = c.request.headers.get('content-type')`;
            fnLiteral += `
if(contentType){const index=contentType.indexOf(';')
if(index!==-1)contentType=contentType.substring(0, index)}
else{contentType=''}c.contentType=contentType
`;
            fnLiteral += `let result=parser['${parser}'](c, contentType)
if(result instanceof Promise)result=await result
if(result instanceof ElysiaCustomStatusResponse)throw result
if(result!==undefined)c.body=result
delete c.contentType
`;
          }
          break;
      }
      reporter.resolve();
    } else if (hasBodyInference) {
      fnLiteral += "\n";
      fnLiteral += hasHeaders ? `let contentType = c.headers['content-type']` : `let contentType = c.request.headers.get('content-type')`;
      fnLiteral += `
if(contentType){const index=contentType.indexOf(';')
if(index!==-1)contentType=contentType.substring(0, index)}
else{contentType=''}c.contentType=contentType
`;
      if (hooks.parse?.length) fnLiteral += `let used=false
`;
      const reporter = report("parse", {
        total: hooks.parse?.length
      });
      let hasDefaultParser = false;
      if (hooks.parse)
        for (let i = 0; i < hooks.parse.length; i++) {
          const name = `bo${i}`;
          if (i !== 0) fnLiteral += `
if(!used){`;
          if (typeof hooks.parse[i].fn === "string") {
            const endUnit = reporter.resolveChild(
              hooks.parse[i].fn
            );
            switch (hooks.parse[i].fn) {
              case "json":
              case "application/json":
                hasDefaultParser = true;
                fnLiteral += adapter.parser.json(isOptionalBody);
                break;
              case "text":
              case "text/plain":
                hasDefaultParser = true;
                fnLiteral += adapter.parser.text(isOptionalBody);
                break;
              case "urlencoded":
              case "application/x-www-form-urlencoded":
                hasDefaultParser = true;
                fnLiteral += adapter.parser.urlencoded(isOptionalBody);
                break;
              case "arrayBuffer":
              case "application/octet-stream":
                hasDefaultParser = true;
                fnLiteral += adapter.parser.arrayBuffer(isOptionalBody);
                break;
              case "formdata":
              case "multipart/form-data":
                hasDefaultParser = true;
                fnLiteral += adapter.parser.formData(isOptionalBody);
                break;
              default:
                fnLiteral += `${name}=parser['${hooks.parse[i].fn}'](c,contentType)
if(${name} instanceof Promise)${name}=await ${name}
if(${name}!==undefined){c.body=${name};used=true}
`;
            }
            endUnit();
          } else {
            const endUnit = reporter.resolveChild(
              hooks.parse[i].fn.name
            );
            fnLiteral += `let ${name}=e.parse[${i}]
${name}=${name}(c,contentType)
if(${name} instanceof Promise)${name}=await ${name}
if(${name}!==undefined){c.body=${name};used=true}`;
            endUnit();
          }
          if (i !== 0) fnLiteral += `}`;
          if (hasDefaultParser) break;
        }
      reporter.resolve();
      if (!hasDefaultParser) {
        if (hooks.parse?.length)
          fnLiteral += `
if(!used){
if(!contentType) throw new ParseError()
`;
        fnLiteral += `switch(contentType){`;
        fnLiteral += `case 'application/json':
` + adapter.parser.json(isOptionalBody) + `break
case 'text/plain':` + adapter.parser.text(isOptionalBody) + `break
case 'application/x-www-form-urlencoded':` + adapter.parser.urlencoded(isOptionalBody) + `break
case 'application/octet-stream':` + adapter.parser.arrayBuffer(isOptionalBody) + `break
case 'multipart/form-data':` + adapter.parser.formData(isOptionalBody) + `break
`;
        for (const key of Object.keys(app["~parser"]))
          fnLiteral += `case '${key}':let bo${key}=parser['${key}'](c,contentType)
if(bo${key} instanceof Promise)bo${key}=await bo${key}
if(bo${key} instanceof ElysiaCustomStatusResponse)throw result
if(bo${key}!==undefined)c.body=bo${key}
break
`;
        if (hooks.parse?.length) fnLiteral += "}";
        fnLiteral += "}";
      }
    }
    fnLiteral += "\ndelete c.contentType";
    fnLiteral += "\nisParsing=false\n";
  }
  parseReporter.resolve();
  if (hooks?.transform) {
    const reporter = report("transform", {
      total: hooks.transform.length
    });
    if (hooks.transform.length) fnLiteral += "let transformed\n";
    for (let i = 0; i < hooks.transform.length; i++) {
      const transform = hooks.transform[i];
      const endUnit = reporter.resolveChild(transform.fn.name);
      fnLiteral += isAsync(transform) ? `transformed=await e.transform[${i}](c)
` : `transformed=e.transform[${i}](c)
`;
      if (transform.subType === "mapDerive")
        fnLiteral += `if(transformed instanceof ElysiaCustomStatusResponse)throw transformed
else{transformed.request=c.request
transformed.store=c.store
transformed.qi=c.qi
transformed.path=c.path
transformed.url=c.url
transformed.redirect=c.redirect
transformed.set=c.set
transformed.error=c.error
c=transformed}`;
      else
        fnLiteral += `if(transformed instanceof ElysiaCustomStatusResponse)throw transformed
else Object.assign(c,transformed)
`;
      endUnit();
    }
    reporter.resolve();
  }
  if (validator) {
    if (validator.headers) {
      if (normalize && "Clean" in validator.headers && !hasAdditionalProperties(validator.headers))
        fnLiteral += "c.headers=validator.headers.Clean(c.headers);\n";
      if (hasProperty("default", validator.headers))
        for (const [key, value] of Object.entries(
          Value.Default(
            // @ts-ignore
            validator.headers.schema,
            {}
          )
        )) {
          const parsed = typeof value === "object" ? JSON.stringify(value) : typeof value === "string" ? `'${value}'` : value;
          if (parsed !== void 0)
            fnLiteral += `c.headers['${key}']??=${parsed}
`;
        }
      if (isOptional(validator.headers))
        fnLiteral += `if(isNotEmpty(c.headers)){`;
      fnLiteral += `if(validator.headers.Check(c.headers) === false){` + composeValidation("headers") + "}";
      if (hasTransform(validator.headers.schema))
        fnLiteral += `c.headers=validator.headers.Decode(c.headers)
`;
      if (isOptional(validator.headers)) fnLiteral += "}";
    }
    if (validator.params) {
      if (hasProperty("default", validator.params))
        for (const [key, value] of Object.entries(
          Value.Default(
            // @ts-ignore
            validator.params.schema,
            {}
          )
        )) {
          const parsed = typeof value === "object" ? JSON.stringify(value) : typeof value === "string" ? `'${value}'` : value;
          if (parsed !== void 0)
            fnLiteral += `c.params['${key}']??=${parsed}
`;
        }
      fnLiteral += `if(validator.params.Check(c.params)===false){` + composeValidation("params") + "}";
      if (hasTransform(validator.params.schema))
        fnLiteral += `c.params=validator.params.Decode(c.params)
`;
    }
    if (validator.query) {
      if (normalize && "Clean" in validator.query && !hasAdditionalProperties(validator.query))
        fnLiteral += "c.query=validator.query.Clean(c.query)\n";
      if (hasProperty("default", validator.query))
        for (const [key, value] of Object.entries(
          Value.Default(
            // @ts-ignore
            validator.query.schema,
            {}
          )
        )) {
          const parsed = typeof value === "object" ? JSON.stringify(value) : typeof value === "string" ? `'${value}'` : value;
          if (parsed !== void 0)
            fnLiteral += `if(c.query['${key}']===undefined)c.query['${key}']=${parsed}
`;
        }
      if (isOptional(validator.query))
        fnLiteral += `if(isNotEmpty(c.query)){`;
      fnLiteral += `if(validator.query.Check(c.query)===false){` + composeValidation("query") + `}`;
      if (hasTransform(validator.query.schema))
        fnLiteral += `c.query=validator.query.Decode(Object.assign({},c.query))
`;
      if (isOptional(validator.query)) fnLiteral += `}`;
    }
    if (validator.body) {
      if (normalize && "Clean" in validator.body && !hasAdditionalProperties(validator.body))
        fnLiteral += "c.body=validator.body.Clean(c.body)\n";
      const doesHaveTransform = hasTransform(validator.body.schema);
      if (doesHaveTransform || isOptional(validator.body))
        fnLiteral += `const isNotEmptyObject=c.body&&(typeof c.body==="object"&&isNotEmpty(c.body))
`;
      if (hasProperty("default", validator.body)) {
        const schema = validator.body.schema;
        const value = Value.Default(
          schema,
          schema.type === "object" || schema[TypeBoxSymbol.kind] === "Import" && schema.$defs[schema.$ref][TypeBoxSymbol.kind] === "Object" ? {} : void 0
        );
        const parsed = typeof value === "object" ? JSON.stringify(value) : typeof value === "string" ? `'${value}'` : value;
        fnLiteral += `if(validator.body.Check(c.body)===false){`;
        if (value !== void 0 && value !== null)
          fnLiteral += `if(typeof c.body==='object')c.body=Object.assign(${parsed},c.body)
else c.body=${parsed}
`;
        if (isOptional(validator.body))
          fnLiteral += `if(isNotEmptyObject&&validator.body.Check(c.body)===false){` + composeValidation("body") + "}";
        else
          fnLiteral += `if(validator.body.Check(c.body)===false){` + composeValidation("body") + `}`;
        fnLiteral += "}";
      } else {
        if (isOptional(validator.body))
          fnLiteral += `if(isNotEmptyObject&&validator.body.Check(c.body)===false){` + composeValidation("body") + "}";
        else
          fnLiteral += `if(validator.body.Check(c.body)===false){` + composeValidation("body") + "}";
      }
      if (doesHaveTransform)
        fnLiteral += `if(isNotEmptyObject)c.body=validator.body.Decode(c.body)
`;
    }
    if (cookieValidator && isNotEmpty(
      // @ts-ignore
      cookieValidator?.schema?.properties ?? // @ts-ignore
      cookieValidator?.schema?.schema ?? {}
    )) {
      fnLiteral += `const cookieValue={}
for(const [key,value] of Object.entries(c.cookie))cookieValue[key]=value.value
`;
      if (hasProperty("default", cookieValidator))
        for (const [key, value] of Object.entries(
          Value.Default(
            // @ts-ignore
            cookieValidator.schema,
            {}
          )
        )) {
          fnLiteral += `cookieValue['${key}'] = ${typeof value === "object" ? JSON.stringify(value) : value}
`;
        }
      if (isOptional(validator.cookie))
        fnLiteral += `if(isNotEmpty(c.cookie)){`;
      fnLiteral += `if(validator.cookie.Check(cookieValue)===false){` + composeValidation("cookie", "cookieValue") + "}";
      if (hasTransform(validator.cookie.schema))
        fnLiteral += `for(const [key,value] of Object.entries(validator.cookie.Decode(cookieValue)))c.cookie[key].value=value
`;
      if (isOptional(validator.cookie)) fnLiteral += `}`;
    }
  }
  if (hooks?.beforeHandle) {
    const reporter = report("beforeHandle", {
      total: hooks.beforeHandle.length
    });
    let hasResolve = false;
    for (let i = 0; i < hooks.beforeHandle.length; i++) {
      const beforeHandle = hooks.beforeHandle[i];
      const endUnit = reporter.resolveChild(beforeHandle.fn.name);
      const returning = hasReturn(beforeHandle);
      const isResolver = beforeHandle.subType === "resolve" || beforeHandle.subType === "mapResolve";
      if (isResolver) {
        if (!hasResolve) {
          hasResolve = true;
          fnLiteral += "\nlet resolved\n";
        }
        fnLiteral += isAsync(beforeHandle) ? `resolved=await e.beforeHandle[${i}](c);
` : `resolved=e.beforeHandle[${i}](c);
`;
        if (beforeHandle.subType === "mapResolve")
          fnLiteral += `if(resolved instanceof ElysiaCustomStatusResponse)throw resolved
else{resolved.request = c.request
resolved.store = c.store
resolved.qi = c.qi
resolved.path = c.path
resolved.url = c.url
resolved.redirect = c.redirect
resolved.set = c.set
resolved.error = c.error
c = resolved}`;
        else
          fnLiteral += `if(resolved instanceof ElysiaCustomStatusResponse)throw resolved
else Object.assign(c, resolved)
`;
      } else if (!returning) {
        fnLiteral += isAsync(beforeHandle) ? `await e.beforeHandle[${i}](c)
` : `e.beforeHandle[${i}](c)
`;
        endUnit();
      } else {
        fnLiteral += isAsync(beforeHandle) ? `be=await e.beforeHandle[${i}](c)
` : `be=e.beforeHandle[${i}](c)
`;
        endUnit("be");
        fnLiteral += `if(be!==undefined){`;
        reporter.resolve();
        if (hooks.afterHandle?.length) {
          report("handle", {
            name: isHandleFn ? handler.name : void 0
          }).resolve();
          const reporter2 = report("afterHandle", {
            total: hooks.afterHandle.length
          });
          for (let i2 = 0; i2 < hooks.afterHandle.length; i2++) {
            const hook = hooks.afterHandle[i2];
            const returning2 = hasReturn(hook);
            const endUnit2 = reporter2.resolveChild(hook.fn.name);
            fnLiteral += `c.response = be
`;
            if (!returning2) {
              fnLiteral += isAsync(hook.fn) ? `await e.afterHandle[${i2}](c, be)
` : `e.afterHandle[${i2}](c, be)
`;
            } else {
              fnLiteral += isAsync(hook.fn) ? `af = await e.afterHandle[${i2}](c)
` : `af = e.afterHandle[${i2}](c)
`;
              fnLiteral += `if(af!==undefined) c.response=be=af
`;
            }
            endUnit2("af");
          }
          reporter2.resolve();
        }
        if (validator.response)
          fnLiteral += composeResponseValidation("be");
        const mapResponseReporter = report("mapResponse", {
          total: hooks.mapResponse?.length
        });
        if (hooks.mapResponse?.length) {
          fnLiteral += `c.response=be
`;
          for (let i2 = 0; i2 < hooks.mapResponse.length; i2++) {
            const mapResponse = hooks.mapResponse[i2];
            const endUnit2 = mapResponseReporter.resolveChild(
              mapResponse.fn.name
            );
            fnLiteral += `if(mr===undefined){mr=${isAsyncName(mapResponse) ? "await " : ""}e.mapResponse[${i2}](c)
if(mr!==undefined)be=c.response=mr}`;
            endUnit2();
          }
        }
        mapResponseReporter.resolve();
        fnLiteral += encodeCookie;
        fnLiteral += `return mapEarlyResponse(${saveResponse}be,c.set${mapResponseContext})}
`;
      }
    }
    reporter.resolve();
  }
  if (hooks.afterHandle?.length) {
    const handleReporter = report("handle", {
      name: isHandleFn ? handler.name : void 0
    });
    if (hooks.afterHandle.length)
      fnLiteral += isAsyncHandler ? `let r=c.response=await ${handle}
` : `let r=c.response=${handle}
`;
    else
      fnLiteral += isAsyncHandler ? `let r=await ${handle}
` : `let r=${handle}
`;
    handleReporter.resolve();
    const reporter = report("afterHandle", {
      total: hooks.afterHandle.length
    });
    for (let i = 0; i < hooks.afterHandle.length; i++) {
      const hook = hooks.afterHandle[i];
      const returning = hasReturn(hook);
      const endUnit = reporter.resolveChild(hook.fn.name);
      if (!returning) {
        fnLiteral += isAsync(hook.fn) ? `await e.afterHandle[${i}](c)
` : `e.afterHandle[${i}](c)
`;
        endUnit();
      } else {
        fnLiteral += isAsync(hook.fn) ? `af=await e.afterHandle[${i}](c)
` : `af=e.afterHandle[${i}](c)
`;
        endUnit("af");
        if (validator.response) {
          fnLiteral += `if(af!==undefined){`;
          reporter.resolve();
          fnLiteral += composeResponseValidation("af");
          fnLiteral += `c.response=af}`;
        } else {
          fnLiteral += `if(af!==undefined){`;
          reporter.resolve();
          fnLiteral += `c.response=af}`;
        }
      }
    }
    reporter.resolve();
    fnLiteral += `r=c.response
`;
    if (validator.response) fnLiteral += composeResponseValidation();
    fnLiteral += encodeCookie;
    const mapResponseReporter = report("mapResponse", {
      total: hooks.mapResponse?.length
    });
    if (hooks.mapResponse?.length) {
      for (let i = 0; i < hooks.mapResponse.length; i++) {
        const mapResponse = hooks.mapResponse[i];
        const endUnit = mapResponseReporter.resolveChild(
          mapResponse.fn.name
        );
        fnLiteral += `mr=${isAsyncName(mapResponse) ? "await " : ""}e.mapResponse[${i}](c)
if(mr!==undefined)r=c.response=mr
`;
        endUnit();
      }
    }
    mapResponseReporter.resolve();
    if (hasSet)
      fnLiteral += `return mapResponse(${saveResponse}r,c.set${mapResponseContext})
`;
    else
      fnLiteral += `return mapCompactResponse(${saveResponse}r${mapResponseContext})
`;
  } else {
    const handleReporter = report("handle", {
      name: isHandleFn ? handler.name : void 0
    });
    if (validator.response || hooks.mapResponse?.length) {
      fnLiteral += isAsyncHandler ? `let r=await ${handle}
` : `let r=${handle}
`;
      handleReporter.resolve();
      if (validator.response) fnLiteral += composeResponseValidation();
      report("afterHandle").resolve();
      const mapResponseReporter = report("mapResponse", {
        total: hooks.mapResponse?.length
      });
      if (hooks.mapResponse?.length) {
        fnLiteral += "\nc.response=r\n";
        for (let i = 0; i < hooks.mapResponse.length; i++) {
          const mapResponse = hooks.mapResponse[i];
          const endUnit = mapResponseReporter.resolveChild(
            mapResponse.fn.name
          );
          fnLiteral += `
if(mr===undefined){mr=${isAsyncName(mapResponse) ? "await " : ""}e.mapResponse[${i}](c)
if(mr!==undefined)r=c.response=mr}
`;
          endUnit();
        }
      }
      mapResponseReporter.resolve();
      fnLiteral += encodeCookie;
      if (handler instanceof Response) {
        fnLiteral += inference.set ? `if(isNotEmpty(c.set.headers)||c.set.status!==200||c.set.redirect||c.set.cookie)return mapResponse(${saveResponse}${handle}.clone(),c.set${mapResponseContext})else return ${handle}.clone()` : `return ${handle}.clone()`;
        fnLiteral += "\n";
      } else if (hasSet)
        fnLiteral += `return mapResponse(${saveResponse}r,c.set${mapResponseContext})
`;
      else
        fnLiteral += `return mapCompactResponse(${saveResponse}r${mapResponseContext})
`;
    } else if (hasCookie || hasTrace) {
      fnLiteral += isAsyncHandler ? `let r=await ${handle}
` : `let r=${handle}
`;
      handleReporter.resolve();
      report("afterHandle").resolve();
      const mapResponseReporter = report("mapResponse", {
        total: hooks.mapResponse?.length
      });
      if (hooks.mapResponse?.length) {
        fnLiteral += "c.response= r\n";
        for (let i = 0; i < hooks.mapResponse.length; i++) {
          const mapResponse = hooks.mapResponse[i];
          const endUnit = mapResponseReporter.resolveChild(
            mapResponse.fn.name
          );
          fnLiteral += `if(mr===undefined){mr=${isAsyncName(mapResponse) ? "await " : ""}e.mapResponse[${i}](c)
if(mr!==undefined)r=c.response=mr}`;
          endUnit();
        }
      }
      mapResponseReporter.resolve();
      fnLiteral += encodeCookie;
      if (hasSet)
        fnLiteral += `return mapResponse(${saveResponse}r,c.set${mapResponseContext})
`;
      else
        fnLiteral += `return mapCompactResponse(${saveResponse}r${mapResponseContext})
`;
    } else {
      handleReporter.resolve();
      const handled = isAsyncHandler ? `await ${handle}` : handle;
      report("afterHandle").resolve();
      if (handler instanceof Response) {
        fnLiteral += inference.set ? `if(isNotEmpty(c.set.headers)||c.set.status!==200||c.set.redirect||c.set.cookie)return mapResponse(${saveResponse}${handle}.clone(),c.set${mapResponseContext})
else return ${handle}.clone()
` : `return ${handle}.clone()
`;
      } else if (hasSet)
        fnLiteral += `return mapResponse(${saveResponse}${handled},c.set${mapResponseContext})
`;
      else
        fnLiteral += `return mapCompactResponse(${saveResponse}${handled}${mapResponseContext})
`;
    }
  }
  fnLiteral += `
}catch(error){`;
  if (hasBody) fnLiteral += `if(isParsing)error=new ParseError()
`;
  if (!maybeAsync) fnLiteral += `return(async()=>{`;
  fnLiteral += `const set=c.set
if(!set.status||set.status<300)set.status=error?.status||500
`;
  if (hasTrace && hooks.trace)
    for (let i = 0; i < hooks.trace.length; i++)
      fnLiteral += `report${i}?.resolve(error);reportChild${i}?.(error)
`;
  const errorReporter = report("error", {
    total: hooks.error?.length
  });
  if (hooks.error?.length) {
    fnLiteral += `c.error=error
`;
    if (hasValidation)
      fnLiteral += `if(error instanceof TypeBoxError){c.code="VALIDATION"
c.set.status=422}else{c.code=error.code??error[ERROR_CODE]??"UNKNOWN"}`;
    else fnLiteral += `c.code=error.code??error[ERROR_CODE]??"UNKNOWN"
`;
    fnLiteral += `let er
`;
    for (let i = 0; i < hooks.error.length; i++) {
      const endUnit = errorReporter.resolveChild(hooks.error[i].fn.name);
      if (isAsync(hooks.error[i]))
        fnLiteral += `er=await e.error[${i}](c)
`;
      else
        fnLiteral += `er=e.error[${i}](c)
if(er instanceof Promise)er=await er
`;
      endUnit();
      const mapResponseReporter = report("mapResponse", {
        total: hooks.mapResponse?.length
      });
      if (hooks.mapResponse?.length) {
        for (let i2 = 0; i2 < hooks.mapResponse.length; i2++) {
          const mapResponse = hooks.mapResponse[i2];
          const endUnit2 = mapResponseReporter.resolveChild(
            mapResponse.fn.name
          );
          fnLiteral += `c.response=er
er=e.mapResponse[${i2}](c)
if(er instanceof Promise)er=await er
`;
          endUnit2();
        }
      }
      mapResponseReporter.resolve();
      fnLiteral += `er=mapEarlyResponse(er,set${mapResponseContext})
`;
      fnLiteral += `if(er){`;
      if (hasTrace && hooks.trace) {
        for (let i2 = 0; i2 < hooks.trace.length; i2++)
          fnLiteral += `report${i2}.resolve()
`;
        errorReporter.resolve();
      }
      fnLiteral += `return er}`;
    }
  }
  errorReporter.resolve();
  fnLiteral += `return handleError(c,error,true)`;
  if (!maybeAsync) fnLiteral += "})()";
  fnLiteral += "}";
  if (hasAfterResponse || hasTrace) {
    fnLiteral += `finally{ `;
    if (!maybeAsync) fnLiteral += ";(async()=>{";
    const reporter = report("afterResponse", {
      total: hooks.afterResponse?.length
    });
    if (hasAfterResponse && hooks.afterResponse) {
      for (let i = 0; i < hooks.afterResponse.length; i++) {
        const endUnit = reporter.resolveChild(
          hooks.afterResponse[i].fn.name
        );
        fnLiteral += `
await e.afterResponse[${i}](c)
`;
        endUnit();
      }
    }
    reporter.resolve();
    if (!maybeAsync) fnLiteral += "})()";
    fnLiteral += `}`;
  }
  const adapterVariables = adapter.inject ? Object.keys(adapter.inject).join(",") + "," : "";
  let init = `const {handler,handleError,hooks:e, ` + allocateIf(`validator,`, hasValidation) + `mapResponse,mapCompactResponse,mapEarlyResponse,isNotEmpty,utils:{` + allocateIf(`parseQuery,`, hasBody) + allocateIf(`parseQueryFromURL,`, hasQuery) + `},error:{` + allocateIf(`ValidationError,`, hasValidation) + `InternalServerError,` + allocateIf(`ParseError`, hasBody) + `},schema,definitions,ERROR_CODE,` + allocateIf(`parseCookie,`, hasCookie) + allocateIf(`signCookie,`, hasCookie) + allocateIf(`decodeURIComponent,`, hasQuery) + `ElysiaCustomStatusResponse,` + allocateIf(`ELYSIA_TRACE,`, hasTrace) + allocateIf(`ELYSIA_REQUEST_ID,`, hasTrace) + allocateIf("parser,", hooks.parse?.length) + allocateIf(`getServer,`, inference.server) + adapterVariables + allocateIf("TypeBoxError", hasValidation) + `}=hooks
const trace=e.trace?.map(x=>typeof x==='function'?x:x.fn)??[]
return ${maybeAsync ? "async " : ""}function handle(c){`;
  if (hooks.beforeHandle?.length) init += "let be\n";
  if (hooks.afterHandle?.length) init += "let af\n";
  if (hooks.mapResponse?.length) init += "let mr\n";
  if (allowMeta) init += "c.schema = schema\nc.defs = definitions\n";
  init += fnLiteral + "}";
  try {
    if (asManifest) return Function("hooks", init);
    return Function(
      "hooks",
      init
    )({
      handler,
      hooks: lifeCycleToFn(hooks),
      validator: hasValidation ? validator : void 0,
      // @ts-expect-error
      handleError: app.handleError,
      mapResponse: adapterHandler.mapResponse,
      mapCompactResponse: adapterHandler.mapCompactResponse,
      mapEarlyResponse: adapterHandler.mapEarlyResponse,
      isNotEmpty,
      utils: {
        parseQuery: hasBody ? parseQuery : void 0,
        parseQueryFromURL: hasQuery ? parseQueryFromURL : void 0
      },
      error: {
        ValidationError: hasValidation ? ValidationError : void 0,
        InternalServerError,
        ParseError: hasBody ? ParseError : void 0
      },
      schema: app.router.history,
      // @ts-expect-error
      definitions: app.definitions.type,
      ERROR_CODE,
      parseCookie: hasCookie ? parseCookie : void 0,
      signCookie: hasCookie ? signCookie : void 0,
      decodeURIComponent: hasQuery ? decodeURIComponent : void 0,
      ElysiaCustomStatusResponse,
      ELYSIA_TRACE: hasTrace ? ELYSIA_TRACE : void 0,
      ELYSIA_REQUEST_ID: hasTrace ? ELYSIA_REQUEST_ID : void 0,
      // @ts-expect-error private property
      getServer: () => app.getServer(),
      TypeBoxError: hasValidation ? TypeBoxError : void 0,
      parser: app["~parser"],
      ...adapter.inject
    });
  } catch (error2) {
    const debugHooks = lifeCycleToFn(hooks);
    console.log("[Composer] failed to generate optimized handler");
    console.log("---");
    console.log({
      handler: typeof handler === "function" ? handler.toString() : handler,
      instruction: init,
      hooks: {
        ...debugHooks,
        // @ts-expect-error
        transform: debugHooks?.transform?.map?.((x) => x.toString()),
        // @ts-expect-error
        resolve: debugHooks?.resolve?.map?.((x) => x.toString()),
        // @ts-expect-error
        beforeHandle: debugHooks?.beforeHandle?.map?.(
          (x) => x.toString()
        ),
        // @ts-expect-error
        afterHandle: debugHooks?.afterHandle?.map?.(
          (x) => x.toString()
        ),
        // @ts-expect-error
        mapResponse: debugHooks?.mapResponse?.map?.(
          (x) => x.toString()
        ),
        // @ts-expect-error
        parse: debugHooks?.parse?.map?.((x) => x.toString()),
        // @ts-expect-error
        error: debugHooks?.error?.map?.((x) => x.toString()),
        // @ts-expect-error
        afterResponse: debugHooks?.afterResponse?.map?.(
          (x) => x.toString()
        ),
        // @ts-expect-error
        stop: debugHooks?.stop?.map?.((x) => x.toString())
      },
      validator,
      // @ts-expect-error
      definitions: app.definitions.type,
      error: error2,
      fnLiteral
    });
    console.log("---");
    process.exit(1);
  }
};
const composeGeneralHandler = (app, { asManifest = false } = {}) => {
  const adapter = app["~adapter"].composeGeneralHandler;
  app.router.http.build();
  const error404 = adapter.error404(
    !!app.event.request?.length,
    !!app.event.error?.length
  );
  const hasTrace = app.event.trace?.length;
  let fnLiteral = "";
  const router = app.router;
  let findDynamicRoute = `const route=router.find(r.method,p)`;
  findDynamicRoute += router.http.root.ALL ? '??router.find("ALL",p)\n' : "\n";
  findDynamicRoute += error404.code;
  findDynamicRoute += `
c.params=route.params
if(route.store.handler)return route.store.handler(c)
return (route.store.handler=route.store.compile())(c)
`;
  let switchMap = ``;
  for (const [path, v] of Object.entries(router.static.http.map)) {
    switchMap += `case'${path}':`;
    if (app.config.strictPath !== true)
      switchMap += `case'${getLoosePath(path)}':`;
    const encoded = encodePath(path);
    if (path !== encoded) switchMap += `case'${encoded}':`;
    switchMap += `switch(r.method){${v.code}
` + (v.all ?? `default: break map`) + "}";
  }
  const maybeAsync = !!app.event.request?.some(isAsync);
  const adapterVariables = adapter.inject ? Object.keys(adapter.inject).join(",") + "," : "";
  fnLiteral += `
const {app,mapEarlyResponse,NotFoundError,randomId,handleError,error,redirect,` + allocateIf(`ELYSIA_TRACE,`, hasTrace) + allocateIf(`ELYSIA_REQUEST_ID,`, hasTrace) + adapterVariables + `}=data
const store=app.singleton.store
const decorator=app.singleton.decorator
const staticRouter=app.router.static.http
const ht=app.router.history
const router=app.router.http
const trace=app.event.trace?.map(x=>typeof x==='function'?x:x.fn)??[]
const notFound=new NotFoundError()
const hoc=app.extender.higherOrderFunctions.map(x=>x.fn)
`;
  if (app.event.request?.length)
    fnLiteral += `const onRequest=app.event.request.map(x=>x.fn)
`;
  fnLiteral += error404.declare;
  if (app.event.trace?.length)
    fnLiteral += `const ` + app.event.trace.map((_, i) => `tr${i}=app.event.trace[${i}].fn`).join(",") + "\n";
  fnLiteral += `${maybeAsync ? "async " : ""}function map(${adapter.parameters}){`;
  if (app.event.request?.length) fnLiteral += `let re
`;
  fnLiteral += adapter.createContext(app);
  if (app.event.trace?.length)
    fnLiteral += `c[ELYSIA_TRACE]=[` + app.event.trace.map((_, i) => `tr${i}(c)`).join(",") + `]
`;
  const report = createReport({
    trace: app.event.trace,
    addFn(word) {
      fnLiteral += word;
    }
  });
  const reporter = report("request", {
    total: app.event.request?.length
  });
  if (app.event.request?.length) {
    fnLiteral += `try{`;
    for (let i = 0; i < app.event.request.length; i++) {
      const hook = app.event.request[i];
      const withReturn = hasReturn(hook);
      const maybeAsync2 = isAsync(hook);
      const endUnit = reporter.resolveChild(app.event.request[i].fn.name);
      if (withReturn) {
        fnLiteral += `re=mapEarlyResponse(${maybeAsync2 ? "await " : ""}onRequest[${i}](c),c.set)
`;
        endUnit("re");
        fnLiteral += `if(re!==undefined)return re
`;
      } else {
        fnLiteral += `${maybeAsync2 ? "await " : ""}onRequest[${i}](c)
`;
        endUnit();
      }
    }
    fnLiteral += `}catch(error){return app.handleError(c,error,false)}`;
  }
  reporter.resolve();
  fnLiteral += adapter.websocket(app);
  fnLiteral += `
map:switch(p){
` + switchMap + `default:break}` + findDynamicRoute + `}
`;
  if (app.extender.higherOrderFunctions.length) {
    let handler = "map";
    for (let i = 0; i < app.extender.higherOrderFunctions.length; i++)
      handler = `hoc[${i}](${handler},${adapter.parameters})`;
    fnLiteral += `return function hocMap(${adapter.parameters}){return ${handler}(${adapter.parameters})}`;
  } else fnLiteral += `return map`;
  const handleError = composeErrorHandler(app);
  app.handleError = handleError;
  return Function(
    "data",
    fnLiteral
  )({
    app,
    mapEarlyResponse: app["~adapter"]["handler"].mapEarlyResponse,
    NotFoundError,
    randomId,
    handleError,
    error,
    redirect,
    ELYSIA_TRACE: hasTrace ? ELYSIA_TRACE : void 0,
    ELYSIA_REQUEST_ID: hasTrace ? ELYSIA_REQUEST_ID : void 0,
    ...adapter.inject
  });
};
const composeErrorHandler = (app) => {
  const hooks = app.event;
  let fnLiteral = "";
  const adapter = app["~adapter"].composeError;
  const adapterVariables = adapter.inject ? Object.keys(adapter.inject).join(",") + "," : "";
  const hasTrace = !!app.event.trace?.length;
  fnLiteral += `const {app:{event:{error:onErrorContainer,afterResponse:resContainer,mapResponse:_onMapResponse,trace:_trace}},mapResponse,ERROR_CODE,ElysiaCustomStatusResponse,` + allocateIf(`ELYSIA_TRACE,`, hasTrace) + allocateIf(`ELYSIA_REQUEST_ID,`, hasTrace) + adapterVariables + `}=inject
`;
  fnLiteral += `const trace=_trace?.map(x=>typeof x==='function'?x:x.fn)??[]
const onMapResponse=[]
if(_onMapResponse)for(let i=0;i<_onMapResponse.length;i++)onMapResponse.push(_onMapResponse[i].fn??_onMapResponse[i])
delete _onMapResponse
const onError=onErrorContainer?.map(x=>x.fn)??[]
const res=resContainer?.map(x=>x.fn)??[]
return ${app.event.error?.find(isAsync) || app.event.mapResponse?.find(isAsync) ? "async " : ""}function(context,error,skipGlobal){`;
  fnLiteral += "";
  if (hasTrace) fnLiteral += "const id=context[ELYSIA_REQUEST_ID]\n";
  const report = createReport({
    context: "context",
    trace: hooks.trace,
    addFn: (word) => {
      fnLiteral += word;
    }
  });
  fnLiteral += `const set=context.set
let _r
if(!context.code)context.code=error.code??error[ERROR_CODE]
if(!(context.error instanceof Error))context.error=error
if(error instanceof ElysiaCustomStatusResponse){set.status=error.status=error.code
error.message=error.response}`;
  if (adapter.declare) fnLiteral += adapter.declare;
  const saveResponse = hasTrace || !!hooks.afterResponse?.length || !!hooks.afterResponse?.length ? "context.response = " : "";
  if (app.event.error)
    for (let i = 0; i < app.event.error.length; i++) {
      const handler = app.event.error[i];
      const response = `${isAsync(handler) ? "await " : ""}onError[${i}](context)
`;
      fnLiteral += "if(skipGlobal!==true){";
      if (hasReturn(handler)) {
        fnLiteral += `_r=${response}
if(_r!==undefined){if(_r instanceof Response)return mapResponse(_r,set${adapter.mapResponseContext})
if(_r instanceof ElysiaCustomStatusResponse){error.status=error.code
error.message = error.response}if(set.status===200||!set.status)set.status=error.status
`;
        const mapResponseReporter2 = report("mapResponse", {
          total: hooks.mapResponse?.length,
          name: "context"
        });
        if (hooks.mapResponse?.length) {
          for (let i2 = 0; i2 < hooks.mapResponse.length; i2++) {
            const mapResponse = hooks.mapResponse[i2];
            const endUnit = mapResponseReporter2.resolveChild(
              mapResponse.fn.name
            );
            fnLiteral += `context.response=_r_r=${isAsyncName(mapResponse) ? "await " : ""}onMapResponse[${i2}](context)
`;
            endUnit();
          }
        }
        mapResponseReporter2.resolve();
        fnLiteral += `return mapResponse(${saveResponse}_r,set${adapter.mapResponseContext})}`;
      } else fnLiteral += response;
      fnLiteral += "}";
    }
  fnLiteral += `if(error.constructor.name==="ValidationError"||error.constructor.name==="TransformDecodeError"){if(error.error)error=error.error
set.status=error.status??422
` + adapter.validationError + `}`;
  fnLiteral += `if(error instanceof Error){` + adapter.unknownError + `}`;
  const mapResponseReporter = report("mapResponse", {
    total: hooks.mapResponse?.length,
    name: "context"
  });
  fnLiteral += "\nif(!context.response)context.response=error.message??error\n";
  if (hooks.mapResponse?.length) {
    fnLiteral += "let mr\n";
    for (let i = 0; i < hooks.mapResponse.length; i++) {
      const mapResponse = hooks.mapResponse[i];
      const endUnit = mapResponseReporter.resolveChild(
        mapResponse.fn.name
      );
      fnLiteral += `if(mr===undefined){mr=${isAsyncName(mapResponse) ? "await " : ""}onMapResponse[${i}](context)
if(mr!==undefined)error=context.response=mr}`;
      endUnit();
    }
  }
  mapResponseReporter.resolve();
  fnLiteral += `
return mapResponse(${saveResponse}error,set${adapter.mapResponseContext})}`;
  return Function(
    "inject",
    fnLiteral
  )({
    app,
    mapResponse: app["~adapter"].handler.mapResponse,
    ERROR_CODE,
    ElysiaCustomStatusResponse,
    ELYSIA_TRACE: hasTrace ? ELYSIA_TRACE : void 0,
    ELYSIA_REQUEST_ID: hasTrace ? ELYSIA_REQUEST_ID : void 0,
    ...adapter.inject
  });
};
export {
  composeErrorHandler,
  composeGeneralHandler,
  composeHandler,
  hasAdditionalProperties,
  hasProperty,
  hasRef,
  hasTransform,
  hasType,
  isAsync,
  isAsyncName,
  isGenerator
};
