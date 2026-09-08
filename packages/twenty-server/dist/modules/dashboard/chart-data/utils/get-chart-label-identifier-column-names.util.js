"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getChartLabelIdentifierColumnNames", {
    enumerable: true,
    get: function() {
        return getChartLabelIdentifierColumnNames;
    }
});
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _computecolumnnameutil = require("../../../../engine/metadata-modules/field-metadata/utils/compute-column-name.util");
const _getchartlabelidentifierfieldutil = require("./get-chart-label-identifier-field.util");
const getChartLabelIdentifierColumnNames = ({ flatObjectMetadata, flatFieldMetadataMaps })=>{
    const labelIdentifierField = (0, _getchartlabelidentifierfieldutil.getChartLabelIdentifierField)({
        flatObjectMetadata,
        flatFieldMetadataMaps
    });
    if (!(0, _utils.isDefined)(labelIdentifierField)) {
        return null;
    }
    if (labelIdentifierField.type === _types.FieldMetadataType.FULL_NAME) {
        const compositeType = _types.compositeTypeDefinitions.get(_types.FieldMetadataType.FULL_NAME);
        if (!(0, _utils.isDefined)(compositeType)) {
            return null;
        }
        return [
            'id',
            ...compositeType.properties.map((property)=>(0, _computecolumnnameutil.computeCompositeColumnName)(labelIdentifierField.name, property))
        ];
    }
    return [
        'id',
        labelIdentifierField.name
    ];
};

//# sourceMappingURL=get-chart-label-identifier-column-names.util.js.map