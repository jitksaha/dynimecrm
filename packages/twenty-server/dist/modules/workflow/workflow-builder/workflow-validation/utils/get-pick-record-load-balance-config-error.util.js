"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getPickRecordLoadBalanceConfigError", {
    enumerable: true,
    get: function() {
        return getPickRecordLoadBalanceConfigError;
    }
});
const _guards = require("@sniptt/guards");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _isflatfieldmetadataoftypeutil = require("../../../../../engine/metadata-modules/flat-field-metadata/utils/is-flat-field-metadata-of-type.util");
const getPickRecordLoadBalanceConfigError = ({ step, objectIdByNameSingular, flatFieldMetadataMaps })=>{
    const input = step.settings?.input;
    if (!(0, _utils.isDefined)(input) || input.strategy !== 'LOAD_BALANCED') {
        return undefined;
    }
    const stepName = step.name ?? step.id;
    const loadBalance = input.loadBalance;
    if (!(0, _guards.isNonEmptyString)(loadBalance?.objectNameSingular) || !(0, _guards.isNonEmptyString)(loadBalance?.fieldName)) {
        return `Step "${stepName}" uses load balancing but is missing the object and field to count by.`;
    }
    const poolObjectId = objectIdByNameSingular[input.objectName];
    if (!(0, _utils.isDefined)(poolObjectId)) {
        return `Step "${stepName}" picks from object "${input.objectName}" which does not exist in this workspace.`;
    }
    const loadBalanceObjectId = objectIdByNameSingular[loadBalance.objectNameSingular];
    if (!(0, _utils.isDefined)(loadBalanceObjectId)) {
        return `Step "${stepName}" balances load by object "${loadBalance.objectNameSingular}" which does not exist in this workspace.`;
    }
    const countByField = Object.values(flatFieldMetadataMaps.byUniversalIdentifier).filter(_utils.isDefined).find((field)=>field.objectMetadataId === loadBalanceObjectId && field.name === loadBalance.fieldName);
    const countsRelatedRecordsForPool = (0, _utils.isDefined)(countByField) && (0, _isflatfieldmetadataoftypeutil.isFlatFieldMetadataOfType)(countByField, _types.FieldMetadataType.RELATION) && countByField.settings?.relationType === _types.RelationType.MANY_TO_ONE && countByField.relationTargetObjectMetadataId === poolObjectId;
    if (!countsRelatedRecordsForPool) {
        return `Step "${stepName}" must balance load by a many-to-one relation on "${loadBalance.objectNameSingular}" that points to "${input.objectName}".`;
    }
    return undefined;
};

//# sourceMappingURL=get-pick-record-load-balance-config-error.util.js.map