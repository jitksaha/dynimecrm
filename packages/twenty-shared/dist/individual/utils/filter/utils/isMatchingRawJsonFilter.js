var s = ({ rawJsonFilter: e, value: t }) => {
  switch (!0) {
    case e.like !== void 0: {
      const i = e.like.replace(/%/g, ".*"), n = new RegExp(`^${i}$`, "is"), r = JSON.stringify(t, null, 1);
      return n.test(r);
    }
    case e.is !== void 0:
      return e.is === "NULL" ? t === null : t !== null;
    default:
      throw new Error(`Unexpected value for string filter : ${JSON.stringify(e)}`);
  }
};
export {
  s as isMatchingRawJsonFilter
};

//# sourceMappingURL=isMatchingRawJsonFilter.js.map