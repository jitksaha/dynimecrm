"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "filterSystemSideEffectFlatViewFieldsToDelete", {
    enumerable: true,
    get: function() {
        return filterSystemSideEffectFlatViewFieldsToDelete;
    }
});
const _utils = require("twenty-shared/utils");
const filterSystemSideEffectFlatViewFieldsToDelete = ({ viewFieldUniversalIdentifiers, flatViewFieldMaps })=>{
    const viewFieldToDelete = {};
    for (const viewFieldUniversalIdentifier of viewFieldUniversalIdentifiers){
        const flatViewField = flatViewFieldMaps.byUniversalIdentifier[viewFieldUniversalIdentifier];
        if (!(0, _utils.isDefined)(flatViewField) || flatViewField.isSystemSideEffect !== true) {
            continue;
        }
        viewFieldToDelete[flatViewField.universalIdentifier] = flatViewField;
    }
    return viewFieldToDelete;
};

//# sourceMappingURL=filter-system-side-effect-flat-view-fields-to-delete.util.js.map