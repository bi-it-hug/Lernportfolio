import{ ELYSIA_REQUEST_ID }from"./utils.mjs";
const ELYSIA_TRACE = Symbol("ElysiaTrace");
const createProcess = () => {
  const { promise, resolve } = Promise.withResolvers();
  const { promise: end, resolve: resolveEnd } = Promise.withResolvers();
  const { promise: error, resolve: resolveError } = Promise.withResolvers();
  const callbacks = [];
  const callbacksEnd = [];
  return [
    (callback) => {
      if (callback) callbacks.push(callback);
      return promise;
    },
    (process) => {
      const processes = [];
      const resolvers = [];
      let groupError = null;
      for (let i = 0; i < (process.total ?? 0); i++) {
        const { promise: promise2, resolve: resolve2 } = Promise.withResolvers();
        const { promise: end2, resolve: resolveEnd2 } = Promise.withResolvers();
        const { promise: error2, resolve: resolveError2 } = Promise.withResolvers();
        const callbacks2 = [];
        const callbacksEnd2 = [];
        processes.push((callback) => {
          if (callback) callbacks2.push(callback);
          return promise2;
        });
        resolvers.push((process2) => {
          const result2 = {
            ...process2,
            end: end2,
            error: error2,
            index: i,
            onStop(callback) {
              if (callback) callbacksEnd2.push(callback);
              return end2;
            }
          };
          resolve2(result2);
          for (let i2 = 0; i2 < callbacks2.length; i2++)
            callbacks2[i2](result2);
          return (error3 = null) => {
            const end3 = performance.now();
            if (error3) groupError = error3;
            const detail = {
              end: end3,
              error: error3,
              get elapsed() {
                return end3 - process2.begin;
              }
            };
            for (let i2 = 0; i2 < callbacksEnd2.length; i2++)
              callbacksEnd2[i2](detail);
            resolveEnd2(end3);
            resolveError2(error3);
          };
        });
      }
      const result = {
        ...process,
        end,
        error,
        onEvent(callback) {
          for (let i = 0; i < processes.length; i++)
            processes[i](callback);
        },
        onStop(callback) {
          if (callback) callbacksEnd.push(callback);
          return end;
        }
      };
      resolve(result);
      for (let i = 0; i < callbacks.length; i++) callbacks[i](result);
      return {
        resolveChild: resolvers,
        resolve(error2 = null) {
          const end2 = performance.now();
          if (!error2 && groupError) error2 = groupError;
          const detail = {
            end: end2,
            error: error2,
            get elapsed() {
              return end2 - process.begin;
            }
          };
          for (let i = 0; i < callbacksEnd.length; i++)
            callbacksEnd[i](detail);
          resolveEnd(end2);
          resolveError(error2);
        }
      };
    }
  ];
};
const createTracer = (traceListener) => {
  return (context) => {
    const [onRequest, resolveRequest] = createProcess();
    const [onParse, resolveParse] = createProcess();
    const [onTransform, resolveTransform] = createProcess();
    const [onBeforeHandle, resolveBeforeHandle] = createProcess();
    const [onHandle, resolveHandle] = createProcess();
    const [onAfterHandle, resolveAfterHandle] = createProcess();
    const [onError, resolveError] = createProcess();
    const [onMapResponse, resolveMapResponse] = createProcess();
    const [onAfterResponse, resolveAfterResponse] = createProcess();
    traceListener({
      // @ts-ignore
      id: context[ELYSIA_REQUEST_ID],
      context,
      set: context.set,
      // @ts-ignore
      onRequest,
      // @ts-ignore
      onParse,
      // @ts-ignore
      onTransform,
      // @ts-ignore
      onBeforeHandle,
      // @ts-ignore
      onHandle,
      // @ts-ignore
      onAfterHandle,
      // @ts-ignore
      onMapResponse,
      // @ts-ignore
      onAfterResponse,
      // @ts-ignore
      onError
    });
    return {
      request: resolveRequest,
      parse: resolveParse,
      transform: resolveTransform,
      beforeHandle: resolveBeforeHandle,
      handle: resolveHandle,
      afterHandle: resolveAfterHandle,
      error: resolveError,
      mapResponse: resolveMapResponse,
      afterResponse: resolveAfterResponse
    };
  };
};
export {
  ELYSIA_TRACE,
  createTracer
};
