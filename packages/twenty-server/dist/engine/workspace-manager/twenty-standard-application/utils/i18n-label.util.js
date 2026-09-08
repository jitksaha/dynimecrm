"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get AUTHORED_STANDARD_METADATA_MESSAGE_IDS () {
        return AUTHORED_STANDARD_METADATA_MESSAGE_IDS;
    },
    get i18nLabel () {
        return i18nLabel;
    }
});
const _guards = require("@sniptt/guards");
const AUTHORED_STANDARD_METADATA_MESSAGE_IDS = new Set();
const i18nLabel = (descriptor)=>{
    if ((0, _guards.isNonEmptyString)(descriptor.id)) {
        AUTHORED_STANDARD_METADATA_MESSAGE_IDS.add(descriptor.id);
    }
    return descriptor.message ?? '';
};

//# sourceMappingURL=i18n-label.util.js.map