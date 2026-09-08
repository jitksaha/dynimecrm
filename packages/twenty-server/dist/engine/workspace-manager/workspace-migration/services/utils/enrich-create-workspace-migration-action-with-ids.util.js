"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "enrichCreateWorkspaceMigrationActionsWithIds", {
    enumerable: true,
    get: function() {
        return enrichCreateWorkspaceMigrationActionsWithIds;
    }
});
const _utils = require("twenty-shared/utils");
const _uuid = require("uuid");
const buildFieldIdByUniversalIdentifierForObjectAction = ({ action, fieldMetadataIdByUniversalIdentifier })=>{
    const fieldIdByUniversalIdentifier = {
        ...action.fieldIdByUniversalIdentifier
    };
    for (const universalFlatFieldMetadata of action.universalFlatFieldMetadatas){
        const { universalIdentifier } = universalFlatFieldMetadata;
        const providedFieldId = fieldMetadataIdByUniversalIdentifier[universalIdentifier];
        if ((0, _utils.isDefined)(providedFieldId)) {
            fieldIdByUniversalIdentifier[universalIdentifier] = providedFieldId;
        } else if (!(0, _utils.isDefined)(fieldIdByUniversalIdentifier[universalIdentifier])) {
            fieldIdByUniversalIdentifier[universalIdentifier] = (0, _uuid.v4)();
        }
    }
    if (Object.keys(fieldIdByUniversalIdentifier).length === 0) {
        return undefined;
    }
    return fieldIdByUniversalIdentifier;
};
const buildFieldIdByUniversalIdentifierForFieldActions = ({ actions, providedFieldIdByUniversalIdentifier })=>{
    const fieldIdByUniversalIdentifier = {
        ...providedFieldIdByUniversalIdentifier
    };
    const setFieldIdIfMissing = ({ universalIdentifier, fallbackId })=>{
        if ((0, _utils.isDefined)(fieldIdByUniversalIdentifier[universalIdentifier])) {
            return;
        }
        fieldIdByUniversalIdentifier[universalIdentifier] = fallbackId ?? (0, _uuid.v4)();
    };
    for (const action of actions){
        if (action.type !== 'create' || action.metadataName !== 'fieldMetadata') {
            continue;
        }
        setFieldIdIfMissing({
            universalIdentifier: action.flatEntity.universalIdentifier,
            fallbackId: action.id
        });
        if ((0, _utils.isDefined)(action.relatedUniversalFlatFieldMetadata)) {
            setFieldIdIfMissing({
                universalIdentifier: action.relatedUniversalFlatFieldMetadata.universalIdentifier,
                fallbackId: action.relatedFieldId
            });
        }
    }
    if (Object.keys(fieldIdByUniversalIdentifier).length === 0) {
        return undefined;
    }
    return fieldIdByUniversalIdentifier;
};
const getJunctionTargetFieldUniversalIdentifier = (universalSettings)=>{
    if (!(0, _utils.isDefined)(universalSettings) || !('junctionTargetFieldUniversalIdentifier' in universalSettings)) {
        return undefined;
    }
    return universalSettings.junctionTargetFieldUniversalIdentifier;
};
const buildReferencedFieldIdByUniversalIdentifierForFieldAction = ({ action, fieldIdByUniversalIdentifier })=>{
    if (!(0, _utils.isDefined)(fieldIdByUniversalIdentifier)) {
        return undefined;
    }
    const referencedFieldIdByUniversalIdentifier = {};
    const addReference = (universalIdentifier)=>{
        if (!(0, _utils.isDefined)(universalIdentifier) || !(0, _utils.isDefined)(fieldIdByUniversalIdentifier[universalIdentifier])) {
            return;
        }
        referencedFieldIdByUniversalIdentifier[universalIdentifier] = fieldIdByUniversalIdentifier[universalIdentifier];
    };
    for (const universalFlatFieldMetadata of [
        action.flatEntity,
        action.relatedUniversalFlatFieldMetadata
    ].filter(_utils.isDefined)){
        addReference(universalFlatFieldMetadata.relationTargetFieldMetadataUniversalIdentifier);
        addReference(getJunctionTargetFieldUniversalIdentifier(universalFlatFieldMetadata.universalSettings));
    }
    if (Object.keys(referencedFieldIdByUniversalIdentifier).length === 0) {
        return undefined;
    }
    return referencedFieldIdByUniversalIdentifier;
};
const enrichCreateWorkspaceMigrationActionsWithIds = ({ workspaceMigration, idByUniversalIdentifierByMetadataName })=>{
    const fieldMetadataIdByUniversalIdentifier = idByUniversalIdentifierByMetadataName.fieldMetadata;
    const fieldIdByUniversalIdentifier = buildFieldIdByUniversalIdentifierForFieldActions({
        actions: workspaceMigration.actions,
        providedFieldIdByUniversalIdentifier: fieldMetadataIdByUniversalIdentifier
    });
    const enrichedActions = workspaceMigration.actions.map((action)=>{
        if (action.type !== 'create') {
            return action;
        }
        const providedId = idByUniversalIdentifierByMetadataName[action.metadataName]?.[action.flatEntity.universalIdentifier];
        switch(action.metadataName){
            case 'objectMetadata':
                {
                    const objectFieldIdByUniversalIdentifier = buildFieldIdByUniversalIdentifierForObjectAction({
                        action,
                        fieldMetadataIdByUniversalIdentifier: fieldMetadataIdByUniversalIdentifier ?? {}
                    });
                    return {
                        ...action,
                        id: providedId ?? action.id ?? (0, _uuid.v4)(),
                        fieldIdByUniversalIdentifier: objectFieldIdByUniversalIdentifier
                    };
                }
            case 'fieldMetadata':
                {
                    const typedAction = action;
                    const id = fieldIdByUniversalIdentifier?.[typedAction.flatEntity.universalIdentifier];
                    const relatedFieldId = (0, _utils.isDefined)(typedAction.relatedUniversalFlatFieldMetadata) && (0, _utils.isDefined)(fieldIdByUniversalIdentifier) ? fieldIdByUniversalIdentifier[typedAction.relatedUniversalFlatFieldMetadata.universalIdentifier] : typedAction.relatedFieldId;
                    const referencedFieldIdByUniversalIdentifier = buildReferencedFieldIdByUniversalIdentifierForFieldAction({
                        action: typedAction,
                        fieldIdByUniversalIdentifier
                    });
                    return {
                        ...typedAction,
                        id,
                        relatedFieldId,
                        ...(0, _utils.isDefined)(referencedFieldIdByUniversalIdentifier) && {
                            fieldIdByUniversalIdentifier: referencedFieldIdByUniversalIdentifier
                        }
                    };
                }
            default:
                {
                    return {
                        ...action,
                        id: providedId ?? action.id ?? (0, _uuid.v4)()
                    };
                }
        }
    });
    return {
        ...workspaceMigration,
        actions: enrichedActions
    };
};

//# sourceMappingURL=enrich-create-workspace-migration-action-with-ids.util.js.map