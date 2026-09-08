"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _createemptyallflatentitymapsconstant = require("../../constant/create-empty-all-flat-entity-maps.constant");
const _prunedanglingforeignkeyaggregatorsinallflatentitymapsthroughmutationutil = require("../prune-dangling-foreign-key-aggregators-in-all-flat-entity-maps-through-mutation.util");
const buildFlatViewField = (universalIdentifier)=>({
        id: universalIdentifier,
        universalIdentifier
    });
const buildFlatView = ({ universalIdentifier, viewFieldUniversalIdentifiers })=>({
        id: universalIdentifier,
        universalIdentifier,
        viewFieldUniversalIdentifiers,
        viewFilterUniversalIdentifiers: [],
        viewGroupUniversalIdentifiers: [],
        viewFilterGroupUniversalIdentifiers: [],
        viewFieldGroupUniversalIdentifiers: [],
        viewSortUniversalIdentifiers: []
    });
const buildAllFlatEntityMapsWithView = ({ view, viewFields })=>{
    const allFlatEntityMaps = (0, _createemptyallflatentitymapsconstant.createEmptyAllFlatEntityMaps)();
    allFlatEntityMaps.flatViewMaps.byUniversalIdentifier[view.universalIdentifier] = view;
    for (const viewField of viewFields){
        allFlatEntityMaps.flatViewFieldMaps.byUniversalIdentifier[viewField.universalIdentifier] = viewField;
    }
    return allFlatEntityMaps;
};
describe('pruneDanglingForeignKeyAggregatorsInAllFlatEntityMapsThroughMutation', ()=>{
    it('should drop references to children missing from the slice while keeping present ones', ()=>{
        const view = buildFlatView({
            universalIdentifier: 'view-body',
            viewFieldUniversalIdentifiers: [
                'vf-arm',
                'vf-head',
                'vf-leg'
            ]
        });
        // vf-leg is owned by another application and therefore not part of the slice
        const allFlatEntityMaps = buildAllFlatEntityMapsWithView({
            view,
            viewFields: [
                buildFlatViewField('vf-arm'),
                buildFlatViewField('vf-head')
            ]
        });
        (0, _prunedanglingforeignkeyaggregatorsinallflatentitymapsthroughmutationutil.pruneDanglingForeignKeyAggregatorsInAllFlatEntityMapsThroughMutation)({
            allFlatEntityMapsToMutate: allFlatEntityMaps
        });
        expect(allFlatEntityMaps.flatViewMaps.byUniversalIdentifier['view-body']?.viewFieldUniversalIdentifiers).toEqual([
            'vf-arm',
            'vf-head'
        ]);
    });
    it('should leave aggregators untouched when every reference is present in the slice', ()=>{
        const view = buildFlatView({
            universalIdentifier: 'view-body',
            viewFieldUniversalIdentifiers: [
                'vf-arm',
                'vf-head'
            ]
        });
        const allFlatEntityMaps = buildAllFlatEntityMapsWithView({
            view,
            viewFields: [
                buildFlatViewField('vf-arm'),
                buildFlatViewField('vf-head')
            ]
        });
        (0, _prunedanglingforeignkeyaggregatorsinallflatentitymapsthroughmutationutil.pruneDanglingForeignKeyAggregatorsInAllFlatEntityMapsThroughMutation)({
            allFlatEntityMapsToMutate: allFlatEntityMaps
        });
        const prunedView = allFlatEntityMaps.flatViewMaps.byUniversalIdentifier['view-body'];
        expect(prunedView?.viewFieldUniversalIdentifiers).toEqual([
            'vf-arm',
            'vf-head'
        ]);
        // No dangling reference means the entity reference is preserved as-is
        expect(prunedView).toBe(view);
    });
    it('should drop all references when no children remain in the slice', ()=>{
        const view = buildFlatView({
            universalIdentifier: 'view-body',
            viewFieldUniversalIdentifiers: [
                'vf-arm',
                'vf-head'
            ]
        });
        const allFlatEntityMaps = buildAllFlatEntityMapsWithView({
            view,
            viewFields: []
        });
        (0, _prunedanglingforeignkeyaggregatorsinallflatentitymapsthroughmutationutil.pruneDanglingForeignKeyAggregatorsInAllFlatEntityMapsThroughMutation)({
            allFlatEntityMapsToMutate: allFlatEntityMaps
        });
        expect(allFlatEntityMaps.flatViewMaps.byUniversalIdentifier['view-body']?.viewFieldUniversalIdentifiers).toEqual([]);
    });
    it('should prune dangling references generically across entity types (objectMetadata fields)', ()=>{
        const allFlatEntityMaps = (0, _createemptyallflatentitymapsconstant.createEmptyAllFlatEntityMaps)();
        allFlatEntityMaps.flatObjectMetadataMaps.byUniversalIdentifier['object-1'] = {
            id: 'object-1',
            universalIdentifier: 'object-1',
            fieldUniversalIdentifiers: [
                'field-present',
                'field-missing'
            ],
            viewUniversalIdentifiers: [],
            indexMetadataUniversalIdentifiers: [],
            objectPermissionUniversalIdentifiers: [],
            fieldPermissionUniversalIdentifiers: []
        };
        allFlatEntityMaps.flatFieldMetadataMaps.byUniversalIdentifier['field-present'] = {
            id: 'field-present',
            universalIdentifier: 'field-present'
        };
        (0, _prunedanglingforeignkeyaggregatorsinallflatentitymapsthroughmutationutil.pruneDanglingForeignKeyAggregatorsInAllFlatEntityMapsThroughMutation)({
            allFlatEntityMapsToMutate: allFlatEntityMaps
        });
        expect(allFlatEntityMaps.flatObjectMetadataMaps.byUniversalIdentifier['object-1']?.fieldUniversalIdentifiers).toEqual([
            'field-present'
        ]);
    });
    it('should not mutate the shared parent entity object when pruning', ()=>{
        const view = buildFlatView({
            universalIdentifier: 'view-body',
            viewFieldUniversalIdentifiers: [
                'vf-arm',
                'vf-leg'
            ]
        });
        const allFlatEntityMaps = buildAllFlatEntityMapsWithView({
            view,
            viewFields: [
                buildFlatViewField('vf-arm')
            ]
        });
        (0, _prunedanglingforeignkeyaggregatorsinallflatentitymapsthroughmutationutil.pruneDanglingForeignKeyAggregatorsInAllFlatEntityMapsThroughMutation)({
            allFlatEntityMapsToMutate: allFlatEntityMaps
        });
        // The map entry is swapped for a new pruned object, leaving the original
        // (shared with other slices/cache) entity untouched
        expect(view.viewFieldUniversalIdentifiers).toEqual([
            'vf-arm',
            'vf-leg'
        ]);
        expect(allFlatEntityMaps.flatViewMaps.byUniversalIdentifier['view-body']).not.toBe(view);
        expect(allFlatEntityMaps.flatViewMaps.byUniversalIdentifier['view-body']?.viewFieldUniversalIdentifiers).toEqual([
            'vf-arm'
        ]);
    });
});

//# sourceMappingURL=prune-dangling-foreign-key-aggregators-in-all-flat-entity-maps-through-mutation.util.spec.js.map