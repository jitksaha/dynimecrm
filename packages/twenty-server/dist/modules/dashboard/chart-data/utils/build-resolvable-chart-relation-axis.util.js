"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildResolvableChartRelationAxis", {
    enumerable: true,
    get: function() {
        return buildResolvableChartRelationAxis;
    }
});
const _guards = require("@sniptt/guards");
const _utils = require("twenty-shared/utils");
const _findflatentitybyidinflatentitymapsutil = require("../../../../engine/metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util");
const _ismorphorrelationflatfieldmetadatautil = require("../../../../engine/metadata-modules/flat-field-metadata/utils/is-morph-or-relation-flat-field-metadata.util");
const _getchartlabelidentifiercolumnnamesutil = require("./get-chart-label-identifier-column-names.util");
const buildResolvableChartRelationAxis = ({ dimensionIndex, axis, rawResults, flatObjectMetadataMaps, flatFieldMetadataMaps })=>{
    if (!(0, _ismorphorrelationflatfieldmetadatautil.isMorphOrRelationFlatFieldMetadata)(axis.groupByField) || (0, _utils.isDefined)(axis.subFieldName)) {
        return undefined;
    }
    const targetObjectMetadataId = axis.groupByField.relationTargetObjectMetadataId;
    if (!(0, _utils.isDefined)(targetObjectMetadataId)) {
        return undefined;
    }
    const targetFlatObjectMetadata = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
        flatEntityId: targetObjectMetadataId,
        flatEntityMaps: flatObjectMetadataMaps
    });
    if (!(0, _utils.isDefined)(targetFlatObjectMetadata)) {
        return undefined;
    }
    const labelIdentifierColumnNames = (0, _getchartlabelidentifiercolumnnamesutil.getChartLabelIdentifierColumnNames)({
        flatObjectMetadata: targetFlatObjectMetadata,
        flatFieldMetadataMaps
    });
    if (!(0, _utils.isDefined)(labelIdentifierColumnNames)) {
        return undefined;
    }
    const recordIds = [
        ...new Set(rawResults.map((result)=>result.groupByDimensionValues?.[dimensionIndex]).filter(_guards.isNonEmptyString))
    ];
    if (!(0, _utils.isNonEmptyArray)(recordIds)) {
        return undefined;
    }
    return {
        dimensionIndex,
        targetFlatObjectMetadata,
        labelIdentifierColumnNames,
        recordIds
    };
};

//# sourceMappingURL=build-resolvable-chart-relation-axis.util.js.map