import { isNonEmptyString as i } from "@sniptt/guards";
var o = /[()<>[\]:;@\\,."]/, E = ({ address: t, name: r }) => i(r) ? `${o.test(r) ? `"${r.replace(/[\\"]/g, "\\$&")}"` : r} <${t}>` : t;
export {
  E as formatEmailAddress
};

//# sourceMappingURL=formatEmailAddress.js.map