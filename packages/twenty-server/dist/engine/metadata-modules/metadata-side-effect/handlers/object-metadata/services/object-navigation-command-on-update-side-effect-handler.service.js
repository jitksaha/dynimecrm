"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ObjectNavigationCommandOnUpdateSideEffectHandlerService", {
    enumerable: true,
    get: function() {
        return ObjectNavigationCommandOnUpdateSideEffectHandlerService;
    }
});
const _core = require("@lingui/core");
const _common = require("@nestjs/common");
const _application = require("twenty-shared/application");
const _utils = require("twenty-shared/utils");
const _buildobjectnavigationuniversalflatcommandmenuitemutil = require("../../../../flat-command-menu-item/utils/build-object-navigation-universal-flat-command-menu-item.util");
const _metadatasideeffectexceptioncode = require("../../../exceptions/metadata-side-effect-exception-code");
const _basemetadatasideeffecthandlerservice = require("../../../interfaces/base-metadata-side-effect-handler.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ObjectNavigationCommandOnUpdateSideEffectHandlerService = class ObjectNavigationCommandOnUpdateSideEffectHandlerService extends (0, _basemetadatasideeffecthandlerservice.MetadataSideEffectHandler)({
    operation: 'update',
    metadataName: 'objectMetadata',
    name: 'objectNavigationCommandOnUpdate',
    description: 'When an object is updated, keep its navigation command menu item in sync with the fields it denormalizes: follow an isActive toggle (deactivate soft-disables rather than deletes, the correct semantics for an overridable entity), recompute conditionalAvailabilityExpression when nameSingular changes (the expression embeds nameSingular, so a rename would otherwise leave the permission gate pointing at a name that no longer exists), and recompute hotKeys when the shortcut changes. The command is resolved by its derived (application, object) identifier, so a workspace whose rows the 2-38 re-own has not converged yet keeps the stale expression until that command runs rather than being reconciled here. Only an engine-owned command is touched. Noops when none of isActive, nameSingular or shortcut changed and when the resulting state already matches.'
}) {
    buildSideEffects({ flatEntity: updatedFlatObjectMetadata, relatedFlatEntityMaps }) {
        const existingFlatObjectMetadata = relatedFlatEntityMaps.flatObjectMetadataMaps.byUniversalIdentifier[updatedFlatObjectMetadata.universalIdentifier];
        if (!(0, _utils.isDefined)(existingFlatObjectMetadata)) {
            return {
                status: 'fail',
                type: 'update',
                metadataName: 'objectMetadata',
                flatEntityMinimalInformation: {
                    universalIdentifier: updatedFlatObjectMetadata.universalIdentifier
                },
                errors: [
                    {
                        code: _metadatasideeffectexceptioncode.MetadataSideEffectExceptionCode.SIDE_EFFECT_PARENT_METADATA_NOT_FOUND,
                        message: _core.i18n._(/*i18n*/ {
                            id: "jx0Apr",
                            message: "Could not resolve the existing object to reconcile its navigation command menu item"
                        }),
                        userFriendlyMessage: /*i18n*/ {
                            id: "uBRmyY",
                            message: "The object to update could not be found to reconcile its navigation command"
                        }
                    }
                ]
            };
        }
        const isActiveChanged = updatedFlatObjectMetadata.isActive !== existingFlatObjectMetadata.isActive;
        const nameSingularChanged = updatedFlatObjectMetadata.nameSingular !== existingFlatObjectMetadata.nameSingular;
        const shortcutChanged = updatedFlatObjectMetadata.shortcut !== existingFlatObjectMetadata.shortcut;
        if (!isActiveChanged && !nameSingularChanged && !shortcutChanged) {
            return {
                status: 'noop'
            };
        }
        const existingNavigationFlatCommandMenuItem = relatedFlatEntityMaps.flatCommandMenuItemMaps.byUniversalIdentifier[(0, _application.getSystemNavigationCommandMenuItemUniversalIdentifier)({
            objectMetadataApplicationUniversalIdentifier: existingFlatObjectMetadata.applicationUniversalIdentifier,
            objectUniversalIdentifier: existingFlatObjectMetadata.universalIdentifier
        })];
        if (!(0, _utils.isDefined)(existingNavigationFlatCommandMenuItem) || existingNavigationFlatCommandMenuItem.isSystemSideEffect !== true) {
            return {
                status: 'noop'
            };
        }
        const navigationFlatCommandMenuItemToUpdate = {
            ...existingNavigationFlatCommandMenuItem,
            ...isActiveChanged ? {
                isActive: updatedFlatObjectMetadata.isActive
            } : {},
            ...nameSingularChanged ? {
                conditionalAvailabilityExpression: (0, _buildobjectnavigationuniversalflatcommandmenuitemutil.buildNavigationConditionalAvailabilityExpression)({
                    universalIdentifier: updatedFlatObjectMetadata.universalIdentifier,
                    nameSingular: updatedFlatObjectMetadata.nameSingular
                })
            } : {},
            ...shortcutChanged ? {
                hotKeys: (0, _utils.isDefined)(updatedFlatObjectMetadata.shortcut) ? [
                    'G',
                    updatedFlatObjectMetadata.shortcut
                ] : null
            } : {}
        };
        const hasChanges = [
            'isActive',
            'conditionalAvailabilityExpression',
            'hotKeys'
        ].some((property)=>JSON.stringify(navigationFlatCommandMenuItemToUpdate[property]) !== JSON.stringify(existingNavigationFlatCommandMenuItem[property]));
        if (!hasChanges) {
            return {
                status: 'noop'
            };
        }
        return {
            status: 'success',
            operations: {
                commandMenuItem: {
                    flatEntityToUpdate: {
                        [navigationFlatCommandMenuItemToUpdate.universalIdentifier]: navigationFlatCommandMenuItemToUpdate
                    }
                }
            }
        };
    }
};
ObjectNavigationCommandOnUpdateSideEffectHandlerService = _ts_decorate([
    (0, _common.Injectable)()
], ObjectNavigationCommandOnUpdateSideEffectHandlerService);

//# sourceMappingURL=object-navigation-command-on-update-side-effect-handler.service.js.map