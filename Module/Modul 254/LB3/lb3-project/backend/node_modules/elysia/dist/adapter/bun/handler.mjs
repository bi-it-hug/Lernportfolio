import{
  mapResponse,
  mapEarlyResponse,
  mapCompactResponse,
  createStaticHandler
}from"../web-standard/handler.mjs";
const createNativeStaticHandler = (handle, hooks, setHeaders = {}) => {
  if (typeof handle === "function" || handle instanceof Blob) return;
  if (typeof handle === "object" && handle?.toString() === "[object HTMLBundle]")
    return () => handle;
  const response = mapResponse(handle, {
    headers: setHeaders
  });
  if (!hooks.parse?.length && !hooks.transform?.length && !hooks.beforeHandle?.length && !hooks.afterHandle?.length) {
    if (!response.headers.has("content-type"))
      response.headers.append("content-type", "text/plain;charset=utf-8");
    return response.clone.bind(response);
  }
};
export {
  createNativeStaticHandler,
  createStaticHandler,
  mapCompactResponse,
  mapEarlyResponse,
  mapResponse
};
