"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeMetadataOverridesBlob", {
    enumerable: true,
    get: function() {
        return computeMetadataOverridesBlob;
    }
});
const _utils = require("twenty-shared/utils");
const computeMetadataOverridesBlob = ({ overridableProperties, updatedProperties, existingEntity, existingOverrides })=>{
    const remainingRecord = {
        ...updatedProperties
    };
    const existingRecord = existingEntity;
    const overrides = overridableProperties.reduce((acc, property)=>{
        if (remainingRecord[property] === undefined) {
            return acc;
        }
        const propertyValue = remainingRecord[property];
        delete remainingRecord[property];
        if ((0, _utils.fastDeepEqual)(propertyValue, existingRecord[property])) {
            if ((0, _utils.isDefined)(acc) && Object.prototype.hasOwnProperty.call(acc, property)) {
                const { [property]: _removedProperty, ...restOverrides } = acc;
                return restOverrides;
            }
            return acc;
        }
        return {
            ...acc,
            [property]: propertyValue
        };
    }, existingOverrides);
    const remainingProperties = remainingRecord;
    if ((0, _utils.isDefined)(overrides) && Object.keys(overrides).length === 0) {
        return {
            overrides: null,
            remainingProperties
        };
    }
    return {
        overrides: overrides,
        remainingProperties
    };
};

//# sourceMappingURL=compute-metadata-overrides-blob.util.js.map