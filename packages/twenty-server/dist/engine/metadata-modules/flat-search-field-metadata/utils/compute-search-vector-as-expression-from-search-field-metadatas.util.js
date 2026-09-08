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
    get buildSearchVectorTargetField () {
        return buildSearchVectorTargetField;
    },
    get computeSearchVectorAsExpressionFromSearchFieldMetadatas () {
        return computeSearchVectorAsExpressionFromSearchFieldMetadatas;
    }
});
const _utils = require("twenty-shared/utils");
const _gettsvectorcolumnexpressionutil = require("../../../workspace-manager/utils/get-ts-vector-column-expression.util");
const buildSearchVectorTargetField = ({ field, position, sortKey })=>({
        name: field.name,
        type: field.type,
        position,
        sortKey
    });
const computeSearchVectorAsExpressionFromSearchFieldMetadatas = (targetSearchableFields)=>{
    const orderedSearchableFields = [
        ...targetSearchableFields
    ].sort((a, b)=>{
        if (a.position !== b.position) {
            return a.position - b.position;
        }
        return a.sortKey < b.sortKey ? -1 : a.sortKey > b.sortKey ? 1 : 0;
    }).flatMap((targetField)=>(0, _utils.isSearchableFieldType)(targetField.type) ? [
            {
                name: targetField.name,
                type: targetField.type
            }
        ] : []);
    return (0, _gettsvectorcolumnexpressionutil.getTsVectorColumnExpressionFromFields)(orderedSearchableFields);
};

//# sourceMappingURL=compute-search-vector-as-expression-from-search-field-metadatas.util.js.map