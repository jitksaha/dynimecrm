"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ObjectSystemSideEffectsOnDeleteSideEffectHandlerService", {
    enumerable: true,
    get: function() {
        return ObjectSystemSideEffectsOnDeleteSideEffectHandlerService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _filtersystemsideeffectflatviewfieldstodeleteutil = require("../../utils/filter-system-side-effect-flat-view-fields-to-delete.util");
const _basemetadatasideeffecthandlerservice = require("../../../interfaces/base-metadata-side-effect-handler.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ObjectSystemSideEffectsOnDeleteSideEffectHandlerService = class ObjectSystemSideEffectsOnDeleteSideEffectHandlerService extends (0, _basemetadatasideeffecthandlerservice.MetadataSideEffectHandler)({
    operation: 'delete',
    metadataName: 'objectMetadata',
    name: 'objectSystemSideEffectsOnDelete',
    description: 'When an object is deleted, cascade-delete its engine-owned side effects: the reserved system fields, the default relation fields (forward field on the deleted object and reverse morph field on the standard object), every system index (reverse join-column indexes, the GIN searchVector index), its searchFieldMetadata rows, its engine-owned views (the INDEX table view and the FIELDS_WIDGET record-page view) with their view fields and view field groups, its engine-owned record-page layout stack (pageLayout, pageLayoutTab, pageLayoutWidget), and its engine-owned navigation command menu item (provisioned by objectNavigationCommandOnCreate). View fields of the deleted system fields are cascaded too even when they live on another object view, which happens for the reverse relation fields. Every lookup walks a foreign key aggregator down from the deleted object (its fields, indexes, searchFieldMetadatas, views, then their view fields and groups, then its page layouts, their tabs and widgets, and its command menu items) and indexes into the flat entity maps. The engine is the sole authority for isSystemSideEffect entities on delete: the API object delete transpiler cascades only user-authored fields and indexes and emits nothing for the layout stack, and manifest deletion inference excludes these entities entirely, so without these buckets the layout stack would only ever disappear through raw DB foreign key cascade, behind the engine back. Caller-provided defaults (e.g. the name field) are NOT engine-owned and are deleted through normal deletion inference / the object delete transpiler.'
}) {
    buildSideEffects({ flatEntity: flatObjectMetadata, relatedFlatEntityMaps }) {
        const fieldMetadataToDelete = this.computeFieldMetadataToDelete({
            flatObjectMetadata,
            relatedFlatEntityMaps
        });
        const flatFieldMetadatasToDelete = Object.values(fieldMetadataToDelete);
        const viewToDelete = this.computeViewToDelete({
            flatObjectMetadata,
            relatedFlatEntityMaps
        });
        const pageLayoutToDelete = this.computePageLayoutToDelete({
            flatObjectMetadata,
            relatedFlatEntityMaps
        });
        const pageLayoutTabToDelete = this.computePageLayoutTabToDelete({
            relatedFlatEntityMaps,
            flatPageLayoutsToDelete: Object.values(pageLayoutToDelete)
        });
        const flatEntityToDeleteByMetadataName = {
            fieldMetadata: fieldMetadataToDelete,
            index: this.computeIndexToDelete({
                flatObjectMetadata,
                relatedFlatEntityMaps,
                flatFieldMetadatasToDelete
            }),
            searchFieldMetadata: this.computeSearchFieldMetadataToDelete({
                flatObjectMetadata,
                relatedFlatEntityMaps
            }),
            view: viewToDelete,
            viewField: this.computeViewFieldToDelete({
                relatedFlatEntityMaps,
                flatViewsToDelete: Object.values(viewToDelete),
                flatFieldMetadatasToDelete
            }),
            viewFieldGroup: this.computeViewFieldGroupToDelete({
                relatedFlatEntityMaps,
                flatViewsToDelete: Object.values(viewToDelete)
            }),
            pageLayout: pageLayoutToDelete,
            pageLayoutTab: pageLayoutTabToDelete,
            pageLayoutWidget: this.computePageLayoutWidgetToDelete({
                relatedFlatEntityMaps,
                flatPageLayoutTabsToDelete: Object.values(pageLayoutTabToDelete)
            }),
            commandMenuItem: this.computeCommandMenuItemToDelete({
                flatObjectMetadata,
                relatedFlatEntityMaps
            })
        };
        const operations = Object.fromEntries(Object.entries(flatEntityToDeleteByMetadataName).filter(([, flatEntityToDelete])=>Object.keys(flatEntityToDelete).length > 0).map(([metadataName, flatEntityToDelete])=>[
                metadataName,
                {
                    flatEntityToDelete
                }
            ]));
        if (Object.keys(operations).length === 0) {
            return {
                status: 'noop'
            };
        }
        return {
            status: 'success',
            operations
        };
    }
    computeFieldMetadataToDelete({ flatObjectMetadata, relatedFlatEntityMaps }) {
        const fieldMetadataToDelete = {};
        for (const fieldUniversalIdentifier of flatObjectMetadata.fieldUniversalIdentifiers){
            const flatFieldMetadata = relatedFlatEntityMaps.flatFieldMetadataMaps.byUniversalIdentifier[fieldUniversalIdentifier];
            if (!(0, _utils.isDefined)(flatFieldMetadata) || flatFieldMetadata.isSystemSideEffect !== true) {
                continue;
            }
            fieldMetadataToDelete[flatFieldMetadata.universalIdentifier] = flatFieldMetadata;
            const { relationTargetFieldMetadataUniversalIdentifier } = flatFieldMetadata;
            if (!(0, _utils.isDefined)(relationTargetFieldMetadataUniversalIdentifier)) {
                continue;
            }
            const reverseFlatFieldMetadata = relatedFlatEntityMaps.flatFieldMetadataMaps.byUniversalIdentifier[relationTargetFieldMetadataUniversalIdentifier];
            if (!(0, _utils.isDefined)(reverseFlatFieldMetadata) || reverseFlatFieldMetadata.isSystemSideEffect !== true) {
                continue;
            }
            fieldMetadataToDelete[reverseFlatFieldMetadata.universalIdentifier] = reverseFlatFieldMetadata;
        }
        return fieldMetadataToDelete;
    }
    computeIndexToDelete({ flatObjectMetadata, relatedFlatEntityMaps, flatFieldMetadatasToDelete }) {
        const deletedFieldUniversalIdentifiers = new Set(flatFieldMetadatasToDelete.map((flatFieldMetadata)=>flatFieldMetadata.universalIdentifier));
        const indexOwnerFlatObjectMetadataByUniversalIdentifier = new Map([
            [
                flatObjectMetadata.universalIdentifier,
                flatObjectMetadata
            ]
        ]);
        for (const flatFieldMetadata of flatFieldMetadatasToDelete){
            const ownerFlatObjectMetadata = relatedFlatEntityMaps.flatObjectMetadataMaps.byUniversalIdentifier[flatFieldMetadata.objectMetadataUniversalIdentifier];
            if ((0, _utils.isDefined)(ownerFlatObjectMetadata)) {
                indexOwnerFlatObjectMetadataByUniversalIdentifier.set(ownerFlatObjectMetadata.universalIdentifier, ownerFlatObjectMetadata);
            }
        }
        const indexToDelete = {};
        for (const indexOwnerFlatObjectMetadata of indexOwnerFlatObjectMetadataByUniversalIdentifier.values()){
            for (const indexUniversalIdentifier of indexOwnerFlatObjectMetadata.indexMetadataUniversalIdentifiers){
                const flatIndexMetadata = relatedFlatEntityMaps.flatIndexMaps.byUniversalIdentifier[indexUniversalIdentifier];
                if (!(0, _utils.isDefined)(flatIndexMetadata) || flatIndexMetadata.isSystemSideEffect !== true) {
                    continue;
                }
                const belongsToObject = flatIndexMetadata.objectMetadataUniversalIdentifier === flatObjectMetadata.universalIdentifier;
                const referencesDeletedField = flatIndexMetadata.universalFlatIndexFieldMetadatas.some((universalFlatIndexFieldMetadata)=>deletedFieldUniversalIdentifiers.has(universalFlatIndexFieldMetadata.fieldMetadataUniversalIdentifier));
                if (!belongsToObject && !referencesDeletedField) {
                    continue;
                }
                indexToDelete[flatIndexMetadata.universalIdentifier] = flatIndexMetadata;
            }
        }
        return indexToDelete;
    }
    computeSearchFieldMetadataToDelete({ flatObjectMetadata, relatedFlatEntityMaps }) {
        const searchFieldMetadataToDelete = {};
        for (const searchFieldMetadataUniversalIdentifier of flatObjectMetadata.searchFieldMetadataUniversalIdentifiers){
            const flatSearchFieldMetadata = relatedFlatEntityMaps.flatSearchFieldMetadataMaps.byUniversalIdentifier[searchFieldMetadataUniversalIdentifier];
            if (!(0, _utils.isDefined)(flatSearchFieldMetadata)) {
                continue;
            }
            searchFieldMetadataToDelete[flatSearchFieldMetadata.universalIdentifier] = flatSearchFieldMetadata;
        }
        return searchFieldMetadataToDelete;
    }
    computeViewToDelete({ flatObjectMetadata, relatedFlatEntityMaps }) {
        const viewToDelete = {};
        for (const viewUniversalIdentifier of flatObjectMetadata.viewUniversalIdentifiers){
            const flatView = relatedFlatEntityMaps.flatViewMaps.byUniversalIdentifier[viewUniversalIdentifier];
            if (!(0, _utils.isDefined)(flatView) || flatView.isSystemSideEffect !== true) {
                continue;
            }
            viewToDelete[flatView.universalIdentifier] = flatView;
        }
        return viewToDelete;
    }
    computeCommandMenuItemToDelete({ flatObjectMetadata, relatedFlatEntityMaps }) {
        const commandMenuItemToDelete = {};
        for (const commandMenuItemUniversalIdentifier of flatObjectMetadata.commandMenuItemUniversalIdentifiers){
            const flatCommandMenuItem = relatedFlatEntityMaps.flatCommandMenuItemMaps.byUniversalIdentifier[commandMenuItemUniversalIdentifier];
            if (!(0, _utils.isDefined)(flatCommandMenuItem) || flatCommandMenuItem.isSystemSideEffect !== true) {
                continue;
            }
            commandMenuItemToDelete[flatCommandMenuItem.universalIdentifier] = flatCommandMenuItem;
        }
        return commandMenuItemToDelete;
    }
    computeViewFieldToDelete({ relatedFlatEntityMaps, flatViewsToDelete, flatFieldMetadatasToDelete }) {
        const viewFieldUniversalIdentifiers = [
            ...flatViewsToDelete.flatMap((flatView)=>flatView.viewFieldUniversalIdentifiers),
            ...flatFieldMetadatasToDelete.flatMap((flatFieldMetadata)=>flatFieldMetadata.viewFieldUniversalIdentifiers)
        ];
        return (0, _filtersystemsideeffectflatviewfieldstodeleteutil.filterSystemSideEffectFlatViewFieldsToDelete)({
            viewFieldUniversalIdentifiers,
            flatViewFieldMaps: relatedFlatEntityMaps.flatViewFieldMaps
        });
    }
    computeViewFieldGroupToDelete({ relatedFlatEntityMaps, flatViewsToDelete }) {
        const viewFieldGroupToDelete = {};
        for (const flatView of flatViewsToDelete){
            for (const viewFieldGroupUniversalIdentifier of flatView.viewFieldGroupUniversalIdentifiers){
                const flatViewFieldGroup = relatedFlatEntityMaps.flatViewFieldGroupMaps.byUniversalIdentifier[viewFieldGroupUniversalIdentifier];
                if (!(0, _utils.isDefined)(flatViewFieldGroup) || flatViewFieldGroup.isSystemSideEffect !== true) {
                    continue;
                }
                viewFieldGroupToDelete[flatViewFieldGroup.universalIdentifier] = flatViewFieldGroup;
            }
        }
        return viewFieldGroupToDelete;
    }
    computePageLayoutToDelete({ flatObjectMetadata, relatedFlatEntityMaps }) {
        const pageLayoutToDelete = {};
        for (const pageLayoutUniversalIdentifier of flatObjectMetadata.pageLayoutUniversalIdentifiers){
            const flatPageLayout = relatedFlatEntityMaps.flatPageLayoutMaps.byUniversalIdentifier[pageLayoutUniversalIdentifier];
            if (!(0, _utils.isDefined)(flatPageLayout) || flatPageLayout.isSystemSideEffect !== true) {
                continue;
            }
            pageLayoutToDelete[flatPageLayout.universalIdentifier] = flatPageLayout;
        }
        return pageLayoutToDelete;
    }
    computePageLayoutTabToDelete({ relatedFlatEntityMaps, flatPageLayoutsToDelete }) {
        const pageLayoutTabToDelete = {};
        for (const flatPageLayout of flatPageLayoutsToDelete){
            for (const tabUniversalIdentifier of flatPageLayout.tabUniversalIdentifiers){
                const flatPageLayoutTab = relatedFlatEntityMaps.flatPageLayoutTabMaps.byUniversalIdentifier[tabUniversalIdentifier];
                if (!(0, _utils.isDefined)(flatPageLayoutTab) || flatPageLayoutTab.isSystemSideEffect !== true) {
                    continue;
                }
                pageLayoutTabToDelete[flatPageLayoutTab.universalIdentifier] = flatPageLayoutTab;
            }
        }
        return pageLayoutTabToDelete;
    }
    computePageLayoutWidgetToDelete({ relatedFlatEntityMaps, flatPageLayoutTabsToDelete }) {
        const pageLayoutWidgetToDelete = {};
        for (const flatPageLayoutTab of flatPageLayoutTabsToDelete){
            for (const widgetUniversalIdentifier of flatPageLayoutTab.widgetUniversalIdentifiers){
                const flatPageLayoutWidget = relatedFlatEntityMaps.flatPageLayoutWidgetMaps.byUniversalIdentifier[widgetUniversalIdentifier];
                if (!(0, _utils.isDefined)(flatPageLayoutWidget) || flatPageLayoutWidget.isSystemSideEffect !== true) {
                    continue;
                }
                pageLayoutWidgetToDelete[flatPageLayoutWidget.universalIdentifier] = flatPageLayoutWidget;
            }
        }
        return pageLayoutWidgetToDelete;
    }
};
ObjectSystemSideEffectsOnDeleteSideEffectHandlerService = _ts_decorate([
    (0, _common.Injectable)()
], ObjectSystemSideEffectsOnDeleteSideEffectHandlerService);

//# sourceMappingURL=object-system-side-effects-on-delete-side-effect-handler.service.js.map