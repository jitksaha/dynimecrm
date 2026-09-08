import e from "addressparser";
var t = (a) => a.flatMap((r) => r.group ? t(r.group) : [r]), n = (a) => {
  try {
    return t(e(a)).map((r) => ({
      address: r.address ?? "",
      name: (r.name ?? "").trim()
    })).filter((r) => r.address.length > 0 || r.name.length > 0);
  } catch {
    return [];
  }
};
export {
  n as parseEmailAddressList
};

//# sourceMappingURL=parseEmailAddressList.js.map