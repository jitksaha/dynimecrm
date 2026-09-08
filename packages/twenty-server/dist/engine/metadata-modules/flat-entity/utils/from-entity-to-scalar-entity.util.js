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
    get BASE_SCALAR_PROPERTY_NAME () {
        return BASE_SCALAR_PROPERTY_NAME;
    },
    get fromEntityToScalarEntity () {
        return fromEntityToScalarEntity;
    }
});
const _allentitypropertiesconfigurationbymetadatanameconstant = require("../constant/all-entity-properties-configuration-by-metadata-name.constant");
const serializeScalarValue = (value)=>{
    if (value instanceof Date) {
        return value.toISOString();
    }
    return value ?? null;
};
const BASE_SCALAR_PROPERTY_NAME = {
    id: 'id',
    workspaceId: 'workspaceId',
    applicationId: 'applicationId',
    universalIdentifier: 'universalIdentifier'
};
const fromEntityToScalarEntity = ({ metadataName, entity })=>{
    const propertiesConfiguration = _allentitypropertiesconfigurationbymetadatanameconstant.ALL_ENTITY_PROPERTIES_CONFIGURATION_BY_METADATA_NAME[metadataName];
    const entityRecord = entity;
    const scalarProperties = {};
    for (const propertyName of [
        ...Object.values(BASE_SCALAR_PROPERTY_NAME),
        ...Object.keys(propertiesConfiguration)
    ]){
        scalarProperties[propertyName] = serializeScalarValue(entityRecord[propertyName]);
    }
    return scalarProperties;
};

//# sourceMappingURL=from-entity-to-scalar-entity.util.js.map