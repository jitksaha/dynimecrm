import { isNonEmptyString as e } from "@sniptt/guards";
var i = (a) => [a.handle, ...a.handleAliases ?? []].filter(e);
export {
  i as getSendableEmailHandles
};

//# sourceMappingURL=getSendableEmailHandles.js.map