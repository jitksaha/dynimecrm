"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromUpdateCommandMenuItemInputToFlatCommandMenuItemToUpdateOrThrow", {
    enumerable: true,
    get: function() {
        return fromUpdateCommandMenuItemInputToFlatCommandMenuItemToUpdateOrThrow;
    }
});
const _utils = require("twenty-shared/utils");
const _commandmenuitemexception = require("../../command-menu-item/command-menu-item.exception");
const _findflatentitybyidinflatentitymapsutil = require("../../flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util");
const _resolveentityrelationuniversalidentifiersutil = require("../../flat-entity/utils/resolve-entity-relation-universal-identifiers.util");
const _flatcommandmenuitemeditablepropertiesconstant = require("../constants/flat-command-menu-item-editable-properties.constant");
const _fromcommandmenuitemoverridestouniversaloverridesutil = require("./from-command-menu-item-overrides-to-universal-overrides.util");
const _iscalleroverridingentityutil = require("../../utils/is-caller-overriding-entity.util");
const _sanitizeoverridableentityinpututil = require("../../utils/sanitize-overridable-entity-input.util");
const _mergeupdateinexistingrecordutil = require("../../../../utils/merge-update-in-existing-record.util");
const fromUpdateCommandMenuItemInputToFlatCommandMenuItemToUpdateOrThrow = ({ flatCommandMenuItemMaps, updateCommandMenuItemInput, flatObjectMetadataMaps, flatPageLayoutMaps, callerApplicationUniversalIdentifier, workspaceCustomApplicationUniversalIdentifier })=>{
    const existingFlatCommandMenuItem = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
        flatEntityId: updateCommandMenuItemInput.id,
        flatEntityMaps: flatCommandMenuItemMaps
    });
    if (!(0, _utils.isDefined)(existingFlatCommandMenuItem)) {
        throw new _commandmenuitemexception.CommandMenuItemException('Command menu item not found', _commandmenuitemexception.CommandMenuItemExceptionCode.COMMAND_MENU_ITEM_NOT_FOUND);
    }
    const { id: _id, ...updates } = updateCommandMenuItemInput;
    const shouldOverride = (0, _iscalleroverridingentityutil.isCallerOverridingEntity)({
        callerApplicationUniversalIdentifier,
        entityApplicationUniversalIdentifier: existingFlatCommandMenuItem.applicationUniversalIdentifier,
        workspaceCustomApplicationUniversalIdentifier,
        isSystemSideEffect: existingFlatCommandMenuItem.isSystemSideEffect
    });
    const { overrides, updatedEditableProperties } = (0, _sanitizeoverridableentityinpututil.sanitizeOverridableEntityInput)({
        metadataName: 'commandMenuItem',
        existingFlatEntity: existingFlatCommandMenuItem,
        updatedEditableProperties: updates,
        shouldOverride
    });
    const mergedRecord = (0, _mergeupdateinexistingrecordutil.mergeUpdateInExistingRecord)({
        existing: existingFlatCommandMenuItem,
        properties: [
            ..._flatcommandmenuitemeditablepropertiesconstant.FLAT_COMMAND_MENU_ITEM_EDITABLE_PROPERTIES
        ],
        update: updatedEditableProperties
    });
    const flatCommandMenuItemToUpdate = {
        ...mergedRecord,
        overrides,
        updatedAt: new Date().toISOString()
    };
    if (updatedEditableProperties.availabilityObjectMetadataId !== undefined) {
        const { availabilityObjectMetadataUniversalIdentifier } = (0, _resolveentityrelationuniversalidentifiersutil.resolveEntityRelationUniversalIdentifiers)({
            metadataName: 'commandMenuItem',
            foreignKeyValues: {
                availabilityObjectMetadataId: mergedRecord.availabilityObjectMetadataId
            },
            flatEntityMaps: {
                flatObjectMetadataMaps
            }
        });
        flatCommandMenuItemToUpdate.availabilityObjectMetadataUniversalIdentifier = availabilityObjectMetadataUniversalIdentifier;
    }
    if (updatedEditableProperties.pageLayoutId !== undefined) {
        const { pageLayoutUniversalIdentifier } = (0, _resolveentityrelationuniversalidentifiersutil.resolveEntityRelationUniversalIdentifiers)({
            metadataName: 'commandMenuItem',
            foreignKeyValues: {
                pageLayoutId: mergedRecord.pageLayoutId
            },
            flatEntityMaps: {
                flatPageLayoutMaps
            }
        });
        flatCommandMenuItemToUpdate.pageLayoutUniversalIdentifier = pageLayoutUniversalIdentifier;
    }
    if ((0, _utils.isDefined)(overrides)) {
        flatCommandMenuItemToUpdate.universalOverrides = (0, _fromcommandmenuitemoverridestouniversaloverridesutil.fromCommandMenuItemOverridesToUniversalOverrides)({
            overrides: overrides,
            objectMetadataUniversalIdentifierById: flatObjectMetadataMaps.universalIdentifierById,
            pageLayoutUniversalIdentifierById: flatPageLayoutMaps.universalIdentifierById
        });
    } else {
        flatCommandMenuItemToUpdate.universalOverrides = null;
    }
    return flatCommandMenuItemToUpdate;
};

//# sourceMappingURL=from-update-command-menu-item-input-to-flat-command-menu-item-to-update-or-throw.util.js.map