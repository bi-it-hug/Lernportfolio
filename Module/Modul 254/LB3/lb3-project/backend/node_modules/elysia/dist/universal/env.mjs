import{ isBun }from"./utils.mjs";
const env = isBun ? Bun.env : typeof process !== "undefined" && process?.env ? process.env : {};
export {
  env
};
