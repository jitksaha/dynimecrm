"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeOrderByLeafColumn", {
    enumerable: true,
    get: function() {
        return computeOrderByLeafColumn;
    }
});
const _utils = require("twenty-shared/utils");
const _computecolumnnameutil = require("../../metadata-modules/field-metadata/utils/compute-column-name.util");
const computeOrderByLeafColumn = (leaf, objectNameSingular)=>{
    switch(leaf.kind){
        case 'relation':
            {
                if (!(0, _utils.isDefined)(leaf.targetFieldMetadata)) {
                    // A relation without a resolvable target contributes no ordering
                    return null;
                }
                return {
                    tableAlias: leaf.path[0],
                    columnName: (0, _utils.isDefined)(leaf.targetCompositeProperty) ? (0, _computecolumnnameutil.computeCompositeColumnName)(leaf.path[1], leaf.targetCompositeProperty) : leaf.path[1],
                    columnType: (leaf.targetCompositeProperty ?? leaf.targetFieldMetadata).type
                };
            }
        case 'composite':
            return {
                tableAlias: objectNameSingular,
                columnName: (0, _computecolumnnameutil.computeCompositeColumnName)(leaf.path[0], leaf.compositeProperty),
                columnType: leaf.compositeProperty.type
            };
        case 'scalar':
            return {
                tableAlias: objectNameSingular,
                columnName: leaf.path[0],
                columnType: leaf.fieldMetadata.type
            };
    }
};

//# sourceMappingURL=compute-order-by-leaf-column.util.js.map