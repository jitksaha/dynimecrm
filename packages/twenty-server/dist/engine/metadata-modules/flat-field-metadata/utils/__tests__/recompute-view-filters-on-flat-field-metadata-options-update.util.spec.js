"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _createemptyflatentitymapsconstant = require("../../../flat-entity/constant/create-empty-flat-entity-maps.constant");
const _addflatentitytoflatentitymapsorthrowutil = require("../../../flat-entity/utils/add-flat-entity-to-flat-entity-maps-or-throw.util");
const _getflatfieldmetadatamock = require("../../__mocks__/get-flat-field-metadata.mock");
const _recomputeviewfiltersonflatfieldmetadataoptionsupdateutil = require("../recompute-view-filters-on-flat-field-metadata-options-update.util");
const FILTER_ID = '11111111-1111-4111-8111-111111111111';
const fromFlatFieldMetadata = (0, _getflatfieldmetadatamock.getFlatFieldMetadataMock)({
    id: '22222222-2222-4222-8222-222222222222',
    universalIdentifier: '22222222-2222-4222-8222-222222222222',
    objectMetadataId: '33333333-3333-4333-8333-333333333333',
    type: _types.FieldMetadataType.SELECT,
    options: [
        {
            id: '44444444-4444-4444-8444-444444444444',
            color: 'blue',
            label: 'Shortlisted',
            position: 0,
            value: 'SHORTLISTED'
        }
    ],
    viewFilterIds: [
        FILTER_ID
    ]
});
const toOptions = [
    {
        ...fromFlatFieldMetadata.options[0],
        label: 'Selected',
        value: 'SELECTED'
    }
];
const recomputeForViewFilter = (viewFilter)=>(0, _recomputeviewfiltersonflatfieldmetadataoptionsupdateutil.recomputeViewFiltersOnFlatFieldMetadataOptionsUpdate)({
        fromFlatFieldMetadata,
        toOptions,
        flatViewFilterMaps: (0, _addflatentitytoflatentitymapsorthrowutil.addFlatEntityToFlatEntityMapsOrThrow)({
            flatEntity: viewFilter,
            flatEntityMaps: (0, _createemptyflatentitymapsconstant.createEmptyFlatEntityMaps)()
        })
    });
describe('recomputeViewFiltersOnFlatFieldMetadataOptionsUpdate', ()=>{
    it('updates a legacy scalar select filter value', ()=>{
        const viewFilter = {
            id: FILTER_ID,
            universalIdentifier: FILTER_ID,
            operand: _types.ViewFilterOperand.IS,
            subFieldName: null,
            value: 'SHORTLISTED'
        };
        expect(recomputeForViewFilter(viewFilter)).toEqual({
            flatViewFiltersToDelete: [],
            flatViewFiltersToUpdate: [
                {
                    ...viewFilter,
                    value: [
                        'SELECTED'
                    ]
                }
            ]
        });
    });
    it('leaves a value-less select filter unchanged', ()=>{
        const viewFilter = {
            id: FILTER_ID,
            universalIdentifier: FILTER_ID,
            operand: _types.ViewFilterOperand.IS_NOT_EMPTY,
            subFieldName: null,
            value: ''
        };
        expect(recomputeForViewFilter(viewFilter)).toEqual({
            flatViewFiltersToDelete: [],
            flatViewFiltersToUpdate: []
        });
    });
});

//# sourceMappingURL=recompute-view-filters-on-flat-field-metadata-options-update.util.spec.js.map