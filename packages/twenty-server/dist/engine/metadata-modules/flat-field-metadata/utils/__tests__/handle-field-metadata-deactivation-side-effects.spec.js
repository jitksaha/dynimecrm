"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _createemptyflatentitymapsconstant = require("../../../flat-entity/constant/create-empty-flat-entity-maps.constant");
const _addflatentitytoflatentitymapsorthrowutil = require("../../../flat-entity/utils/add-flat-entity-to-flat-entity-maps-or-throw.util");
const _getflatfieldmetadatamock = require("../../__mocks__/get-flat-field-metadata.mock");
const _handlefieldmetadatadeactivationsideeffectsutil = require("../handle-field-metadata-deactivation-side-effects.util");
const getFlatView = (id)=>({
        id,
        universalIdentifier: `${id}-universal-identifier`,
        applicationId: 'application-id',
        calendarEndFieldMetadataId: 'calendar-end-field-id',
        calendarEndFieldMetadataUniversalIdentifier: 'calendar-end-field-universal-identifier'
    });
describe('handleFieldMetadataDeactivationSideEffects', ()=>{
    const getEmptyRelatedMaps = ()=>({
            flatViewFieldMaps: (0, _createemptyflatentitymapsconstant.createEmptyFlatEntityMaps)(),
            flatViewFilterMaps: (0, _createemptyflatentitymapsconstant.createEmptyFlatEntityMaps)(),
            flatViewGroupMaps: (0, _createemptyflatentitymapsconstant.createEmptyFlatEntityMaps)()
        });
    it('clears an optional calendar end field without deleting the view', ()=>{
        const view = getFlatView('calendar-view-id');
        const fromFlatFieldMetadata = (0, _getflatfieldmetadatamock.getFlatFieldMetadataMock)({
            id: 'calendar-end-field-id',
            objectMetadataId: 'object-id',
            universalIdentifier: 'calendar-end-field-universal-identifier',
            type: _types.FieldMetadataType.DATE_TIME,
            calendarEndViewIds: [
                view.id
            ]
        });
        const result = (0, _handlefieldmetadatadeactivationsideeffectsutil.handleFieldMetadataDeactivationSideEffects)({
            fromFlatFieldMetadata,
            toFlatFieldMetadata: {
                ...fromFlatFieldMetadata,
                isActive: false
            },
            flatViewMaps: (0, _addflatentitytoflatentitymapsorthrowutil.addFlatEntityToFlatEntityMapsOrThrow)({
                flatEntity: view,
                flatEntityMaps: (0, _createemptyflatentitymapsconstant.createEmptyFlatEntityMaps)()
            }),
            ...getEmptyRelatedMaps()
        });
        expect(result.flatViewsToDelete).toEqual([]);
        expect(result.flatViewsToUpdate).toEqual([
            expect.objectContaining({
                id: view.id,
                calendarEndFieldMetadataId: null,
                calendarEndFieldMetadataUniversalIdentifier: null
            })
        ]);
    });
    it('deletes the view when the deactivated field is both its start and end field', ()=>{
        const view = getFlatView('calendar-view-id');
        const fromFlatFieldMetadata = (0, _getflatfieldmetadatamock.getFlatFieldMetadataMock)({
            id: 'calendar-field-id',
            objectMetadataId: 'object-id',
            universalIdentifier: 'calendar-field-universal-identifier',
            type: _types.FieldMetadataType.DATE,
            calendarViewIds: [
                view.id
            ],
            calendarEndViewIds: [
                view.id
            ]
        });
        const result = (0, _handlefieldmetadatadeactivationsideeffectsutil.handleFieldMetadataDeactivationSideEffects)({
            fromFlatFieldMetadata,
            toFlatFieldMetadata: {
                ...fromFlatFieldMetadata,
                isActive: false
            },
            flatViewMaps: (0, _addflatentitytoflatentitymapsorthrowutil.addFlatEntityToFlatEntityMapsOrThrow)({
                flatEntity: view,
                flatEntityMaps: (0, _createemptyflatentitymapsconstant.createEmptyFlatEntityMaps)()
            }),
            ...getEmptyRelatedMaps()
        });
        expect(result.flatViewsToDelete).toEqual([
            view
        ]);
        expect(result.flatViewsToUpdate).toEqual([]);
    });
});

//# sourceMappingURL=handle-field-metadata-deactivation-side-effects.spec.js.map