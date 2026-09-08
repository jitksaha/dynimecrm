import { isDefined as i } from "../../utils/validation/isDefined.js";
var r = (e) => e.type === "file" && i(e.fileId) && i(e.url) && i(e.mediaType);
export {
  r as isExtendedFileUIPart
};

//# sourceMappingURL=DataMessagePart.js.map