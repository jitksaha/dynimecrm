import { isNonEmptyString as n } from "@sniptt/guards";
var s = ({ path: t, token: e }) => {
  if (t.startsWith("https:") || t.startsWith("http:")) return t;
  const r = t.split("/"), i = r.pop();
  if (!n(i)) throw new Error(`Filename empty: cannot build signed path from folderPath '${t}'`);
  return `${r.join("/")}/${e}/${i}`;
};
export {
  s as buildSignedPath
};

//# sourceMappingURL=buildSignedPath.js.map