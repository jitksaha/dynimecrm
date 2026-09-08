"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "deleteFlatEntityForeignKeyAggregators", {
    enumerable: true,
    get: function() {
        return deleteFlatEntityForeignKeyAggregators;
    }
});
const _utils = require("twenty-shared/utils");
const _allentitypropertiesconfigurationbymetadatanameconstant = require("../../../../metadata-modules/flat-entity/constant/all-entity-properties-configuration-by-metadata-name.constant");
const _allonetomanymetadatarelationsconstant = require("../../../../metadata-modules/flat-entity/constant/all-one-to-many-metadata-relations.constant");
const _fromentitytoscalarentityutil = require("../../../../metadata-modules/flat-entity/utils/from-entity-to-scalar-entity.util");
const BASE_WORKSPACE_SCOPED_PROPERTIES = [
    _fromentitytoscalarentityutil.BASE_SCALAR_PROPERTY_NAME.id,
    _fromentitytoscalarentityutil.BASE_SCALAR_PROPERTY_NAME.workspaceId,
    _fromentitytoscalarentityutil.BASE_SCALAR_PROPERTY_NAME.applicationId
];
const deleteFlatEntityForeignKeyAggregators = ({ universalFlatEntity, metadataName })=>{
    const result = {
        ...universalFlatEntity
    };
    for (const baseProperty of BASE_WORKSPACE_SCOPED_PROPERTIES){
        delete result[baseProperty];
    }
    const propertiesConfiguration = _allentitypropertiesconfigurationbymetadatanameconstant.ALL_ENTITY_PROPERTIES_CONFIGURATION_BY_METADATA_NAME[metadataName];
    for (const [propertyName, propertyConfiguration] of Object.entries(propertiesConfiguration)){
        if ((0, _utils.isDefined)(propertyConfiguration.universalProperty)) {
            delete result[propertyName];
        }
    }
    const oneToManyRelations = _allonetomanymetadatarelationsconstant.ALL_ONE_TO_MANY_METADATA_RELATIONS[metadataName];
    for (const relation of Object.values(oneToManyRelations)){
        if (!(0, _utils.isDefined)(relation)) {
            continue;
        }
        delete result[relation.flatEntityForeignKeyAggregator];
    }
    return result;
};

//# sourceMappingURL=delete-flat-entity-foreign-key-aggregators.util.js.map