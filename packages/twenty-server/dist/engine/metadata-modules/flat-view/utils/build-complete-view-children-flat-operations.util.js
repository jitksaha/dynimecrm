"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildCompleteViewChildrenFlatOperations", {
    enumerable: true,
    get: function() {
        return buildCompleteViewChildrenFlatOperations;
    }
});
const _utils = require("twenty-shared/utils");
const _fromcreateviewfieldinputtoflatviewfieldtocreateutil = require("../../flat-view-field/utils/from-create-view-field-input-to-flat-view-field-to-create.util");
const _fromcreateviewfilterinputtoflatviewfiltertocreateutil = require("../../flat-view-filter/utils/from-create-view-filter-input-to-flat-view-filter-to-create.util");
const _fromcreateviewsortinputtoflatviewsorttocreateutil = require("../../flat-view-sort/utils/from-create-view-sort-input-to-flat-view-sort-to-create.util");
const buildCompleteViewChildrenFlatOperations = ({ viewId, flatApplication, flatFieldMetadataMaps, flatViewMaps, flatViewFieldMaps, flatViewFilterMaps, flatViewSortMaps, flatViewFieldGroupMaps, flatViewFilterGroupMaps, fields, filters, sorts })=>{
    const operations = {};
    if ((0, _utils.isDefined)(fields)) {
        const existingFlatViewFields = Object.values(flatViewFieldMaps.byUniversalIdentifier).filter(_utils.isDefined).filter((flatViewField)=>flatViewField.viewId === viewId);
        const flatViewFieldsToCreate = fields.map((field, index)=>(0, _fromcreateviewfieldinputtoflatviewfieldtocreateutil.fromCreateViewFieldInputToFlatViewFieldToCreate)({
                createViewFieldInput: {
                    viewId,
                    fieldMetadataId: field.fieldMetadataId,
                    isVisible: field.isVisible,
                    size: field.size,
                    position: index
                },
                flatApplication,
                flatFieldMetadataMaps,
                flatViewMaps,
                flatViewFieldGroupMaps
            }));
        operations.viewField = {
            flatEntityToCreate: flatViewFieldsToCreate,
            flatEntityToDelete: existingFlatViewFields,
            flatEntityToUpdate: []
        };
    }
    if ((0, _utils.isDefined)(filters)) {
        const existingFlatViewFilters = Object.values(flatViewFilterMaps.byUniversalIdentifier).filter(_utils.isDefined).filter((flatViewFilter)=>flatViewFilter.viewId === viewId);
        const flatViewFiltersToCreate = filters.map((filter)=>(0, _fromcreateviewfilterinputtoflatviewfiltertocreateutil.fromCreateViewFilterInputToFlatViewFilterToCreate)({
                createViewFilterInput: {
                    viewId,
                    fieldMetadataId: filter.fieldMetadataId,
                    operand: filter.operand,
                    value: filter.value,
                    subFieldName: filter.subFieldName
                },
                flatApplication,
                flatFieldMetadataMaps,
                flatViewMaps,
                flatViewFilterGroupMaps
            }));
        operations.viewFilter = {
            flatEntityToCreate: flatViewFiltersToCreate,
            flatEntityToDelete: existingFlatViewFilters,
            flatEntityToUpdate: []
        };
    }
    if ((0, _utils.isDefined)(sorts)) {
        const existingFlatViewSorts = Object.values(flatViewSortMaps.byUniversalIdentifier).filter(_utils.isDefined).filter((flatViewSort)=>flatViewSort.viewId === viewId);
        const flatViewSortsToCreate = sorts.map((sort)=>(0, _fromcreateviewsortinputtoflatviewsorttocreateutil.fromCreateViewSortInputToFlatViewSortToCreate)({
                createViewSortInput: {
                    viewId,
                    fieldMetadataId: sort.fieldMetadataId,
                    direction: sort.direction
                },
                flatApplication,
                flatFieldMetadataMaps,
                flatViewMaps
            }));
        operations.viewSort = {
            flatEntityToCreate: flatViewSortsToCreate,
            flatEntityToDelete: existingFlatViewSorts,
            flatEntityToUpdate: []
        };
    }
    return operations;
};

//# sourceMappingURL=build-complete-view-children-flat-operations.util.js.map