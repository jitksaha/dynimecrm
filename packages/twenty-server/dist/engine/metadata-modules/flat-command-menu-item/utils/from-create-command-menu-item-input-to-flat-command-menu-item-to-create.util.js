"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromCreateCommandMenuItemInputToFlatCommandMenuItemToCreate", {
    enumerable: true,
    get: function() {
        return fromCreateCommandMenuItemInputToFlatCommandMenuItemToCreate;
    }
});
const _utils = require("twenty-shared/utils");
const _uuid = require("uuid");
const _types = require("twenty-shared/types");
const _enginecomponentkeyenum = require("../../command-menu-item/enums/engine-component-key.enum");
const _isobjectmetadatacommandmenuitempayloadutil = require("../../command-menu-item/utils/is-object-metadata-command-menu-item-payload.util");
const _resolveentityrelationuniversalidentifiersutil = require("../../flat-entity/utils/resolve-entity-relation-universal-identifiers.util");
const fromCreateCommandMenuItemInputToFlatCommandMenuItemToCreate = ({ createCommandMenuItemInput, workspaceId, flatApplication, flatObjectMetadataMaps, flatFrontComponentMaps, flatPageLayoutMaps })=>{
    const id = (0, _uuid.v4)();
    const now = new Date().toISOString();
    const isNavigation = createCommandMenuItemInput.engineComponentKey === _enginecomponentkeyenum.EngineComponentKey.NAVIGATION;
    const navigationTargetObjectMetadataId = isNavigation ? createCommandMenuItemInput.navigationTargetObjectMetadataId ?? ((0, _isobjectmetadatacommandmenuitempayloadutil.isObjectMetadataCommandMenuItemPayload)(createCommandMenuItemInput.payload) ? createCommandMenuItemInput.payload.objectMetadataItemId : null) : null;
    const payload = !isNavigation || (0, _utils.isDefined)(navigationTargetObjectMetadataId) ? null : createCommandMenuItemInput.payload ?? null;
    const { availabilityObjectMetadataUniversalIdentifier, frontComponentUniversalIdentifier, pageLayoutUniversalIdentifier, navigationTargetObjectMetadataUniversalIdentifier } = (0, _resolveentityrelationuniversalidentifiersutil.resolveEntityRelationUniversalIdentifiers)({
        metadataName: 'commandMenuItem',
        foreignKeyValues: {
            availabilityObjectMetadataId: createCommandMenuItemInput.availabilityObjectMetadataId,
            frontComponentId: createCommandMenuItemInput.frontComponentId,
            pageLayoutId: createCommandMenuItemInput.pageLayoutId,
            navigationTargetObjectMetadataId
        },
        flatEntityMaps: {
            flatObjectMetadataMaps,
            flatFrontComponentMaps,
            flatPageLayoutMaps
        }
    });
    return {
        id,
        universalIdentifier: id,
        workflowVersionId: createCommandMenuItemInput.workflowVersionId ?? null,
        frontComponentId: createCommandMenuItemInput.frontComponentId ?? null,
        frontComponentUniversalIdentifier,
        engineComponentKey: createCommandMenuItemInput.engineComponentKey,
        label: createCommandMenuItemInput.label,
        icon: createCommandMenuItemInput.icon ?? null,
        shortLabel: createCommandMenuItemInput.shortLabel ?? null,
        position: createCommandMenuItemInput.position ?? 0,
        isPinned: createCommandMenuItemInput.isPinned ?? false,
        payload,
        hotKeys: createCommandMenuItemInput.hotKeys ?? null,
        availabilityType: createCommandMenuItemInput.availabilityType ?? _types.CommandMenuItemAvailabilityType.GLOBAL,
        availabilityObjectMetadataId: createCommandMenuItemInput.availabilityObjectMetadataId ?? null,
        conditionalAvailabilityExpression: createCommandMenuItemInput.conditionalAvailabilityExpression ?? null,
        availabilityObjectMetadataUniversalIdentifier,
        navigationTargetObjectMetadataId,
        navigationTargetObjectMetadataUniversalIdentifier,
        pageLayoutId: createCommandMenuItemInput.pageLayoutId ?? null,
        pageLayoutUniversalIdentifier,
        workspaceId,
        applicationId: flatApplication.id,
        applicationUniversalIdentifier: flatApplication.universalIdentifier,
        isActive: true,
        isSystemSideEffect: false,
        overrides: null,
        universalOverrides: null,
        createdAt: now,
        updatedAt: now
    };
};

//# sourceMappingURL=from-create-command-menu-item-input-to-flat-command-menu-item-to-create.util.js.map