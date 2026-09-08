var o = (e) => {
  try {
    return decodeURIComponent(e);
  } catch {
    return e;
  }
};
export {
  o as safeDecodeURIComponent
};

//# sourceMappingURL=safeDecodeURIComponent.js.map