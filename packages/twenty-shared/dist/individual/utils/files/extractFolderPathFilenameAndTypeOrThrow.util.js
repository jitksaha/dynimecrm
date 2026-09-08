import { isNonEmptyString as i } from "@sniptt/guards";
var p = (r) => {
  if (!i(r)) throw new Error("Invalid fullPath provided");
  const o = r.split("/"), t = o.pop() || "", n = o.join("/"), e = t.lastIndexOf(".");
  return {
    folderPath: n,
    filename: t,
    type: e !== -1 ? t.slice(e + 1) : ""
  };
};
export {
  p as extractFolderPathFilenameAndTypeOrThrow
};

//# sourceMappingURL=extractFolderPathFilenameAndTypeOrThrow.util.js.map