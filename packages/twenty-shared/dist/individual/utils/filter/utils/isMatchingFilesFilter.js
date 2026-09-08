var i = ({ filesFilter: e, value: n }) => {
  switch (!0) {
    case e.like !== void 0: {
      const t = e.like.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/%/g, ".*"), r = new RegExp(`^${t}$`, "is"), s = JSON.stringify(n, null, 1);
      return r.test(s);
    }
    case e.is !== void 0:
      return e.is === "NULL" ? n === null || n.length === 0 : n !== null && n.length > 0;
    default:
      throw new Error(`Unexpected value for files filter : ${JSON.stringify(e)}`);
  }
};
export {
  i as isMatchingFilesFilter
};

//# sourceMappingURL=isMatchingFilesFilter.js.map