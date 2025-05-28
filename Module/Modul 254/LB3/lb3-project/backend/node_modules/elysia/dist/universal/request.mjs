class ElysiaRequest {
  constructor(input, init) {
    this.input = input;
    this.init = init;
    this.cache = "default";
    this.credentials = "omit";
    this.destination = "";
    this.integrity = "";
    this.method = "GET";
    this.mode = "no-cors";
    this.redirect = "manual";
    this.referrerPolicy = "";
    this.keepalive = false;
    this.duplex = "half";
    this.bodyUsed = false;
    if (typeof input === "string") this.url = input;
    else if (input instanceof URL) this.url = input.href;
    else if (input instanceof Request) this.url = input.url;
    else throw new TypeError("Invalid url");
    if (init) {
      if (init.method) this.method = init.method;
      if (init.keepalive) this.keepalive = init.keepalive;
      if (init.redirect) this.redirect = init.redirect;
      if (init.integrity) this.integrity = init.integrity;
      if (init.signal) this._signal = init.signal;
      if (init.credentials) this.credentials = init.credentials;
      if (init.mode) this.mode = init.mode;
      if (init.referrerPolicy) this.referrerPolicy = init.referrerPolicy;
      if (init.duplex) this.duplex = init.duplex;
    }
  }
  get headers() {
    if (this._headers) return this._headers;
    if (!this.init?.headers) return this._headers = new Headers();
    const headers = this.init.headers;
    if (Array.isArray(headers))
      return this._headers = new Headers(headers);
    if (headers instanceof Headers)
      return this._headers = headers;
    if (headers)
      return this._headers = new Headers(headers);
    return this._headers = new Headers();
  }
  get signal() {
    if (this._signal) return this._signal;
    return this._signal = new AbortController().signal;
  }
  get body() {
    if (this.method === "GET" || this.method === "HEAD" || !this.init?.body)
      return null;
    const body = this.init.body;
    if (body instanceof ReadableStream) return body;
    if (body instanceof ArrayBuffer)
      return new ReadableStream({
        start(controller) {
          controller.enqueue(body);
          controller.close();
        }
      });
    if (body instanceof Blob) return body.stream();
    if (typeof body === "string")
      return new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode(body));
          controller.close();
        }
      });
    if (body instanceof URLSearchParams || body instanceof FormData)
      return new ReadableStream({
        start(controller) {
          controller.enqueue(
            new TextEncoder().encode(body.toString())
          );
          controller.close();
        }
      });
    if (body instanceof DataView)
      return new ReadableStream({
        start(controller) {
          controller.enqueue(body.buffer);
          controller.close();
        }
      });
    if (Symbol.iterator in body)
      return new ReadableStream({
        start(controller) {
          for (const chunk of body) controller.enqueue(chunk);
          controller.close();
        }
      });
    if (Symbol.asyncIterator in body)
      return new ReadableStream({
        async start(controller) {
          for await (const chunk of body) controller.enqueue(chunk);
          controller.close();
        }
      });
    return null;
  }
  async arrayBuffer() {
    if (this.init?.body instanceof ArrayBuffer) return this.init.body;
    if (!this.body) return new ArrayBuffer(0);
    const chunks = [];
    for await (const chunk of this.body) chunks.push(chunk);
    return Buffer.concat(chunks);
  }
  async blob() {
    if (this.init?.body instanceof Blob) return this.init.body;
    const buffer = await this.arrayBuffer();
    return new Blob([buffer]);
  }
  async formData() {
    if (this.init?.body instanceof FormData) return this.init.body;
    throw new Error("Unable to parse body as FormData");
  }
  async json() {
    if (this.init?.body instanceof ReadableStream)
      return JSON.parse(await readableStreamToString(this.init.body));
    if (typeof this.init?.body === "string")
      return JSON.parse(this.init.body);
    if (this.init?.body instanceof ArrayBuffer)
      return JSON.parse(Buffer.from(this.init.body).toString());
    return JSON.parse(Buffer.from(await this.arrayBuffer()).toString());
  }
  async text() {
    if (this.init?.body instanceof ReadableStream)
      return readableStreamToString(this.init.body);
    if (typeof this.init?.body === "string") return this.init.body;
    if (this.init?.body instanceof ArrayBuffer)
      return Buffer.from(this.init.body).toString();
    const buffer = await this.arrayBuffer();
    return Buffer.from(buffer).toString();
  }
  clone() {
    return new ElysiaRequest(this.input, this.init);
  }
}
async function readableStreamToString(stream) {
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  return Buffer.from(Buffer.concat(chunks)).toString();
}
export {
  ElysiaRequest
};
