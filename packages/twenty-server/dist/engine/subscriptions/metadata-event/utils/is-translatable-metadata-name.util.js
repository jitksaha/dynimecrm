"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isTranslatableMetadataName", {
    enumerable: true,
    get: function() {
        return isTranslatableMetadataName;
    }
});
const _i18n = require("twenty-shared/i18n");
const isTranslatableMetadataName = (metadataName)=>Object.prototype.hasOwnProperty.call(_i18n.TRANSLATABLE_PROPERTIES_BY_METADATA_NAME, metadataName);

//# sourceMappingURL=is-translatable-metadata-name.util.js.map