var n = "__twentyHttpResponse", r = (t) => typeof t == "number" && Number.isInteger(t) && t >= 100 && t <= 599, s = (t) => typeof t == "object" && t !== null && !Array.isArray(t) && Object.values(t).every((e) => typeof e == "string"), o = (t) => {
  if (typeof t != "object" || t === null) return !1;
  const e = t;
  return e.__twentyHttpResponse === !0 && (e.status === void 0 || r(e.status)) && (e.headers === void 0 || s(e.headers));
};
export {
  n as LOGIC_FUNCTION_HTTP_RESPONSE_MARKER,
  o as isLogicFunctionHttpResponse
};

//# sourceMappingURL=LogicFunctionResponse.js.map