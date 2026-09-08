"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeSystemViewFieldsToCreate", {
    enumerable: true,
    get: function() {
        return computeSystemViewFieldsToCreate;
    }
});
const _application = require("twenty-shared/application");
const _defaultviewfieldsizeconstant = require("../../../flat-view-field/constants/default-view-field-size.constant");
const _isflatfieldmetadatadisplayableindefaultviewutil = require("../../../object-metadata/utils/is-flat-field-metadata-displayable-in-default-view.util");
const _orderflatfieldmetadatasforsystemindexviewutil = require("../../../object-metadata/utils/order-flat-field-metadatas-for-system-index-view.util");
const computeSystemViewFieldsToCreate = ({ objectFlatFieldMetadatas, viewUniversalIdentifier, applicationUniversalIdentifier, labelIdentifierFieldMetadataUniversalIdentifier, excludeLabelIdentifier = false, startPosition = 0 })=>{
    const createdAt = new Date().toISOString();
    const defaultViewFields = (0, _orderflatfieldmetadatasforsystemindexviewutil.orderFlatFieldMetadatasForSystemIndexView)({
        labelIdentifierFieldMetadataUniversalIdentifier,
        flatFieldMetadatas: objectFlatFieldMetadatas.filter((field)=>(0, _isflatfieldmetadatadisplayableindefaultviewutil.isFlatFieldMetadataDisplayableInDefaultView)({
                flatFieldMetadata: field,
                labelIdentifierFieldMetadataUniversalIdentifier
            }) && (!excludeLabelIdentifier || field.universalIdentifier !== labelIdentifierFieldMetadataUniversalIdentifier))
    }).map((field, index)=>({
            fieldMetadataUniversalIdentifier: field.universalIdentifier,
            viewUniversalIdentifier,
            viewFieldGroupUniversalIdentifier: null,
            createdAt,
            updatedAt: createdAt,
            deletedAt: null,
            // Keyed on the displayed field's application, per the engine convention.
            universalIdentifier: (0, _application.getSystemViewFieldUniversalIdentifier)({
                fieldMetadataApplicationUniversalIdentifier: field.applicationUniversalIdentifier,
                viewUniversalIdentifier,
                fieldMetadataUniversalIdentifier: field.universalIdentifier
            }),
            isVisible: true,
            size: _defaultviewfieldsizeconstant.DEFAULT_VIEW_FIELD_SIZE,
            position: startPosition + index,
            aggregateOperation: null,
            isActive: true,
            isSystemSideEffect: true,
            universalOverrides: null,
            applicationUniversalIdentifier
        }));
    return defaultViewFields;
};

//# sourceMappingURL=compute-system-view-fields-to-create.util.js.map