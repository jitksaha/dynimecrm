"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ObjectNavigationCommandOnCreateSideEffectHandlerService", {
    enumerable: true,
    get: function() {
        return ObjectNavigationCommandOnCreateSideEffectHandlerService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _buildobjectnavigationuniversalflatcommandmenuitemutil = require("../../../../flat-command-menu-item/utils/build-object-navigation-universal-flat-command-menu-item.util");
const _basemetadatasideeffecthandlerservice = require("../../../interfaces/base-metadata-side-effect-handler.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ObjectNavigationCommandOnCreateSideEffectHandlerService = class ObjectNavigationCommandOnCreateSideEffectHandlerService extends (0, _basemetadatasideeffecthandlerservice.MetadataSideEffectHandler)({
    operation: 'create',
    metadataName: 'objectMetadata',
    name: 'objectNavigationCommandOnCreate',
    description: 'When an object is created, provision its singleton "Go to" navigation command menu item (engineComponentKey NAVIGATION, a null payload and the target in navigationTargetObjectMetadataId), isSystemSideEffect so the engine owns its lifecycle, and isActive mirrors the object so an object created inactive gets a disabled command rather than none. Label, shortLabel and icon are interpolation templates resolved from the object at render time, the availability expression gates on the object read permission plus a feature flag for gated standard objects, and hotKeys derive from the object shortcut. The identifier is name-free and keyed on (application, object), so an object rename keeps the same command. Position is derived from the synced maximum plus the object index in the creation batch, so batch object creation never double-books a position. Noops when the object create carries no workspace id (the manifest sync path mints entity ids after side-effect expansion). twenty-standard is not concerned: it synchronizes through the from/to migration path, which never runs the side-effect engine, and seeds one navigation command per active object itself.'
}) {
    buildSideEffects({ flatEntity, allFlatEntityOperationRecordByMetadataName, relatedFlatEntityMaps }) {
        const sourceFlatObjectMetadata = flatEntity;
        if (!(0, _utils.isDefined)(sourceFlatObjectMetadata.id)) {
            return {
                status: 'noop'
            };
        }
        const syncedMaxPosition = Object.values(relatedFlatEntityMaps.flatCommandMenuItemMaps.byUniversalIdentifier).filter(_utils.isDefined).reduce((maxPosition, flatCommandMenuItem)=>Math.max(maxPosition, flatCommandMenuItem.position), -1);
        const indexInBatch = Math.max(Object.keys(allFlatEntityOperationRecordByMetadataName.objectMetadata?.flatEntityToCreate ?? {}).indexOf(sourceFlatObjectMetadata.universalIdentifier), 0);
        const navigationFlatCommandMenuItemToCreate = (0, _buildobjectnavigationuniversalflatcommandmenuitemutil.buildObjectNavigationUniversalFlatCommandMenuItem)({
            objectMetadata: {
                id: sourceFlatObjectMetadata.id,
                universalIdentifier: sourceFlatObjectMetadata.universalIdentifier,
                nameSingular: sourceFlatObjectMetadata.nameSingular,
                shortcut: sourceFlatObjectMetadata.shortcut,
                isActive: sourceFlatObjectMetadata.isActive
            },
            applicationUniversalIdentifier: sourceFlatObjectMetadata.applicationUniversalIdentifier,
            position: syncedMaxPosition + 1 + indexInBatch,
            now: new Date().toISOString()
        });
        return {
            status: 'success',
            operations: {
                commandMenuItem: {
                    flatEntityToCreate: {
                        [navigationFlatCommandMenuItemToCreate.universalIdentifier]: navigationFlatCommandMenuItemToCreate
                    }
                }
            }
        };
    }
};
ObjectNavigationCommandOnCreateSideEffectHandlerService = _ts_decorate([
    (0, _common.Injectable)()
], ObjectNavigationCommandOnCreateSideEffectHandlerService);

//# sourceMappingURL=object-navigation-command-on-create-side-effect-handler.service.js.map