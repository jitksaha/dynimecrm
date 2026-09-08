var r = (i) => {
  try {
    if (i === void 0) return "undefined";
    if (i === null) return "null";
    if (i === 1 / 0) return "Infinity";
    if (i === -1 / 0) return "-Infinity";
    if (typeof i == "number" && isNaN(i)) return "NaN";
    const n = JSON.stringify(i);
    return n === void 0 ? String(i) : n;
  } catch {
    return String(i);
  }
};
export {
  r as stringifySafely
};

//# sourceMappingURL=stringifySafely.js.map