"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getBareRelationOrderBy", {
    enumerable: true,
    get: function() {
        return getBareRelationOrderBy;
    }
});
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _findflatentitybyidinflatentitymapsutil = require("../../../../engine/metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util");
const _getchartlabelidentifierfieldutil = require("./get-chart-label-identifier-field.util");
const getBareRelationOrderBy = ({ groupByFieldMetadata, direction, flatObjectMetadataMaps, flatFieldMetadataMaps })=>{
    const orderById = {
        [groupByFieldMetadata.name]: {
            id: direction
        }
    };
    const { relationTargetObjectMetadataId } = groupByFieldMetadata;
    if (!(0, _utils.isDefined)(relationTargetObjectMetadataId)) {
        return [
            orderById
        ];
    }
    const targetObjectMetadata = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
        flatEntityId: relationTargetObjectMetadataId,
        flatEntityMaps: flatObjectMetadataMaps
    });
    if (!(0, _utils.isDefined)(targetObjectMetadata)) {
        return [
            orderById
        ];
    }
    const labelIdentifierField = (0, _getchartlabelidentifierfieldutil.getChartLabelIdentifierField)({
        flatObjectMetadata: targetObjectMetadata,
        flatFieldMetadataMaps
    });
    if (!(0, _utils.isDefined)(labelIdentifierField)) {
        return [
            orderById
        ];
    }
    if (labelIdentifierField.type === _types.FieldMetadataType.FULL_NAME) {
        const compositeType = _types.compositeTypeDefinitions.get(_types.FieldMetadataType.FULL_NAME);
        if (!(0, _utils.isDefined)(compositeType)) {
            return [
                orderById
            ];
        }
        return [
            ...compositeType.properties.map((property)=>({
                    [groupByFieldMetadata.name]: {
                        [labelIdentifierField.name]: {
                            [property.name]: direction
                        }
                    }
                })),
            orderById
        ];
    }
    return [
        {
            [groupByFieldMetadata.name]: {
                [labelIdentifierField.name]: direction
            }
        },
        orderById
    ];
};

//# sourceMappingURL=get-bare-relation-order-by.util.js.map