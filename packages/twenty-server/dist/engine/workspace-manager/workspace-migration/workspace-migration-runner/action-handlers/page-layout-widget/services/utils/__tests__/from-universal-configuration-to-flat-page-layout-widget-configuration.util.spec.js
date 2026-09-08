"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _createemptyflatentitymapsconstant = require("../../../../../../../../metadata-modules/flat-entity/constant/create-empty-flat-entity-maps.constant");
const _getflatfieldmetadatamock = require("../../../../../../../../metadata-modules/flat-field-metadata/__mocks__/get-flat-field-metadata.mock");
const _widgetconfigurationtypetype = require("../../../../../../../../metadata-modules/page-layout-widget/enums/widget-configuration-type.type");
const _fromuniversalconfigurationtoflatpagelayoutwidgetconfigurationutil = require("../from-universal-configuration-to-flat-page-layout-widget-configuration.util");
const OBJECT_METADATA_ID = '00000000-0000-4000-8000-000000000000';
const RELATION_FIELD_ID = '11111111-1111-4111-8111-000000000001';
const RELATION_FIELD_UNIVERSAL_IDENTIFIER = '20202020-1111-4111-8111-000000000001';
const TARGET_TEXT_FIELD_ID = '11111111-2222-4222-8222-000000000002';
const TARGET_TEXT_FIELD_UNIVERSAL_IDENTIFIER = '20202020-2222-4222-8222-000000000002';
const AGGREGATE_FIELD_ID = '11111111-3333-4333-8333-000000000003';
const AGGREGATE_FIELD_UNIVERSAL_IDENTIFIER = '20202020-3333-4333-8333-000000000003';
const buildFlatFieldMetadataMaps = (flatFieldMetadatas)=>({
        byUniversalIdentifier: Object.fromEntries(flatFieldMetadatas.map((flatFieldMetadata)=>[
                flatFieldMetadata.universalIdentifier,
                flatFieldMetadata
            ])),
        universalIdentifierById: Object.fromEntries(flatFieldMetadatas.map((flatFieldMetadata)=>[
                flatFieldMetadata.id,
                flatFieldMetadata.universalIdentifier
            ])),
        universalIdentifiersByApplicationId: {}
    });
const flatFieldMetadataMaps = buildFlatFieldMetadataMaps([
    (0, _getflatfieldmetadatamock.getFlatFieldMetadataMock)({
        id: RELATION_FIELD_ID,
        universalIdentifier: RELATION_FIELD_UNIVERSAL_IDENTIFIER,
        objectMetadataId: OBJECT_METADATA_ID,
        type: _types.FieldMetadataType.RELATION
    }),
    (0, _getflatfieldmetadatamock.getFlatFieldMetadataMock)({
        id: TARGET_TEXT_FIELD_ID,
        universalIdentifier: TARGET_TEXT_FIELD_UNIVERSAL_IDENTIFIER,
        objectMetadataId: OBJECT_METADATA_ID,
        type: _types.FieldMetadataType.TEXT
    }),
    (0, _getflatfieldmetadatamock.getFlatFieldMetadataMock)({
        id: AGGREGATE_FIELD_ID,
        universalIdentifier: AGGREGATE_FIELD_UNIVERSAL_IDENTIFIER,
        objectMetadataId: OBJECT_METADATA_ID,
        type: _types.FieldMetadataType.NUMBER
    })
]);
const getChartRecordFilters = (recordFilters)=>{
    const configuration = (0, _fromuniversalconfigurationtoflatpagelayoutwidgetconfigurationutil.fromUniversalConfigurationToFlatPageLayoutWidgetConfiguration)({
        universalConfiguration: {
            configurationType: _widgetconfigurationtypetype.WidgetConfigurationType.AGGREGATE_CHART,
            aggregateFieldMetadataUniversalIdentifier: AGGREGATE_FIELD_UNIVERSAL_IDENTIFIER,
            aggregateOperation: _types.AggregateOperations.SUM,
            filter: {
                recordFilters
            }
        },
        flatFieldMetadataMaps,
        flatFrontComponentMaps: (0, _createemptyflatentitymapsconstant.createEmptyFlatEntityMaps)(),
        flatViewMaps: (0, _createemptyflatentitymapsconstant.createEmptyFlatEntityMaps)(),
        flatViewFieldGroupMaps: (0, _createemptyflatentitymapsconstant.createEmptyFlatEntityMaps)()
    });
    if (configuration.configurationType !== _widgetconfigurationtypetype.WidgetConfigurationType.AGGREGATE_CHART) {
        throw new Error('Expected an aggregate chart configuration');
    }
    return configuration.filter?.recordFilters;
};
describe('fromUniversalConfigurationToFlatPageLayoutWidgetConfiguration', ()=>{
    it('should preserve front component widget header command menu item references', ()=>{
        const frontComponentId = '11111111-4444-4444-8444-000000000004';
        const frontComponentUniversalIdentifier = '20202020-4444-4444-8444-000000000004';
        const headerCommandMenuItemUniversalIdentifiers = [
            '30303030-3333-4333-8333-000000000003'
        ];
        const flatFrontComponentMaps = (0, _createemptyflatentitymapsconstant.createEmptyFlatEntityMaps)();
        const flatFrontComponent = {
            id: frontComponentId,
            universalIdentifier: frontComponentUniversalIdentifier
        };
        flatFrontComponentMaps.byUniversalIdentifier[frontComponentUniversalIdentifier] = flatFrontComponent;
        flatFrontComponentMaps.universalIdentifierById[frontComponentId] = frontComponentUniversalIdentifier;
        expect((0, _fromuniversalconfigurationtoflatpagelayoutwidgetconfigurationutil.fromUniversalConfigurationToFlatPageLayoutWidgetConfiguration)({
            universalConfiguration: {
                configurationType: _widgetconfigurationtypetype.WidgetConfigurationType.FRONT_COMPONENT,
                frontComponentUniversalIdentifier,
                headerCommandMenuItemUniversalIdentifiers
            },
            flatFieldMetadataMaps,
            flatFrontComponentMaps,
            flatViewMaps: (0, _createemptyflatentitymapsconstant.createEmptyFlatEntityMaps)(),
            flatViewFieldGroupMaps: (0, _createemptyflatentitymapsconstant.createEmptyFlatEntityMaps)()
        })).toEqual({
            configurationType: _widgetconfigurationtypetype.WidgetConfigurationType.FRONT_COMPONENT,
            frontComponentId,
            headerCommandMenuItemUniversalIdentifiers
        });
    });
    it('should resolve the relation target universal identifier of a relation-traversal chart filter back to a field metadata id', ()=>{
        const recordFilters = getChartRecordFilters([
            {
                fieldMetadataUniversalIdentifier: RELATION_FIELD_UNIVERSAL_IDENTIFIER,
                relationTargetFieldMetadataUniversalIdentifier: TARGET_TEXT_FIELD_UNIVERSAL_IDENTIFIER,
                operand: _types.ViewFilterOperand.DOES_NOT_CONTAIN,
                value: 'foo'
            }
        ]);
        expect(recordFilters).toEqual([
            {
                fieldMetadataId: RELATION_FIELD_ID,
                relationTargetFieldMetadataId: TARGET_TEXT_FIELD_ID,
                operand: _types.ViewFilterOperand.DOES_NOT_CONTAIN,
                value: 'foo'
            }
        ]);
    });
});

//# sourceMappingURL=from-universal-configuration-to-flat-page-layout-widget-configuration.util.spec.js.map