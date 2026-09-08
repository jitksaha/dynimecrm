"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromFlatCommandMenuItemToCommandMenuItemDto", {
    enumerable: true,
    get: function() {
        return fromFlatCommandMenuItemToCommandMenuItemDto;
    }
});
const _isobjectmetadatacommandmenuitempayloadutil = require("../../command-menu-item/utils/is-object-metadata-command-menu-item-payload.util");
const fromFlatCommandMenuItemToCommandMenuItemDto = (flatCommandMenuItem)=>{
    const effectiveFlatCommandMenuItem = {
        ...flatCommandMenuItem,
        ...flatCommandMenuItem.overrides ?? {}
    };
    return {
        id: effectiveFlatCommandMenuItem.id,
        workflowVersionId: effectiveFlatCommandMenuItem.workflowVersionId ?? undefined,
        frontComponentId: effectiveFlatCommandMenuItem.frontComponentId ?? undefined,
        engineComponentKey: effectiveFlatCommandMenuItem.engineComponentKey,
        label: effectiveFlatCommandMenuItem.label,
        icon: effectiveFlatCommandMenuItem.icon ?? undefined,
        shortLabel: effectiveFlatCommandMenuItem.shortLabel ?? undefined,
        position: effectiveFlatCommandMenuItem.position,
        isPinned: effectiveFlatCommandMenuItem.isPinned,
        payload: (0, _isobjectmetadatacommandmenuitempayloadutil.isObjectMetadataCommandMenuItemPayload)(effectiveFlatCommandMenuItem.payload) ? undefined : effectiveFlatCommandMenuItem.payload ?? undefined,
        hotKeys: effectiveFlatCommandMenuItem.hotKeys ?? undefined,
        availabilityType: effectiveFlatCommandMenuItem.availabilityType,
        conditionalAvailabilityExpression: effectiveFlatCommandMenuItem.conditionalAvailabilityExpression ?? undefined,
        availabilityObjectMetadataId: effectiveFlatCommandMenuItem.availabilityObjectMetadataId ?? undefined,
        navigationTargetObjectMetadataId: effectiveFlatCommandMenuItem.navigationTargetObjectMetadataId ?? undefined,
        pageLayoutId: effectiveFlatCommandMenuItem.pageLayoutId ?? undefined,
        workspaceId: effectiveFlatCommandMenuItem.workspaceId,
        applicationId: effectiveFlatCommandMenuItem.applicationId ?? undefined,
        isActive: effectiveFlatCommandMenuItem.isActive,
        overrides: flatCommandMenuItem.overrides,
        createdAt: new Date(effectiveFlatCommandMenuItem.createdAt),
        updatedAt: new Date(effectiveFlatCommandMenuItem.updatedAt)
    };
};

//# sourceMappingURL=from-flat-command-menu-item-to-command-menu-item-dto.util.js.map