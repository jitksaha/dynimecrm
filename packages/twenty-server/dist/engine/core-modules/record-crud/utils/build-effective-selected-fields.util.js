"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildEffectiveSelectedFields", {
    enumerable: true,
    get: function() {
        return buildEffectiveSelectedFields;
    }
});
const _fuse = /*#__PURE__*/ _interop_require_default(require("fuse.js"));
const _types = require("twenty-shared/types");
const _guards = require("@sniptt/guards");
const _buildunselectablerelationwarningsutil = require("./build-unselectable-relation-warnings.util");
const _findflatentitybyidinflatentitymapsutil = require("../../../metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util");
const _utils = require("twenty-shared/utils");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const SEARCH_VECTOR_FIELD = 'searchVector';
const LOGICAL_OPERATORS = new Set([
    'and',
    'or',
    'not'
]);
const SUB_FIELDS_TO_EXCLUDE_BY_FIELD_TYPE = {
    [_types.FieldMetadataType.RICH_TEXT]: new Set([
        'blocknote'
    ])
};
const buildSelectedField = ({ rawSelect, filterFieldNames, orderByFieldNames, allSelectableFieldNames, labelIdentifierFieldName, objectName, selectableRelationFieldNames, unselectableRelationWarningsByFieldName })=>{
    const cleanFieldNames = allSelectableFieldNames.filter((name)=>name !== SEARCH_VECTOR_FIELD);
    const implicitFields = [
        'id',
        labelIdentifierFieldName,
        ...filterFieldNames,
        ...orderByFieldNames
    ].filter((name)=>cleanFieldNames.includes(name) && !selectableRelationFieldNames.includes(name));
    if (rawSelect.includes('*')) {
        return {
            select: cleanFieldNames,
            relationSelect: selectableRelationFieldNames,
            warnings: []
        };
    }
    const warnings = [];
    const validFields = [
        ...implicitFields
    ];
    const relationSelect = [];
    for (const requestedName of rawSelect){
        if (implicitFields.includes(requestedName)) {
            continue;
        }
        // Relation names are checked before scalars: ONE_TO_MANY fields are also
        // listed as selectable booleans, which the query parser cannot resolve
        if (selectableRelationFieldNames.includes(requestedName)) {
            relationSelect.push(requestedName);
            continue;
        }
        const unselectableRelationWarning = unselectableRelationWarningsByFieldName.get(requestedName);
        if ((0, _utils.isDefined)(unselectableRelationWarning)) {
            warnings.push(unselectableRelationWarning);
            continue;
        }
        if (cleanFieldNames.includes(requestedName)) {
            validFields.push(requestedName);
            continue;
        }
        const suggestions = findSimilarFieldNames(requestedName, [
            ...cleanFieldNames,
            ...selectableRelationFieldNames
        ]);
        const hint = suggestions.length > 0 ? ` Did you mean: ${suggestions.map((s)=>`'${s}'`).join(', ')}?` : '';
        warnings.push(`Field '${requestedName}' not found on ${objectName}.${hint}`);
    }
    return {
        select: [
            ...new Set(validFields)
        ],
        relationSelect: [
            ...new Set(relationSelect)
        ],
        warnings
    };
};
const extractFilterFieldNames = (filter)=>{
    if (Array.isArray(filter)) {
        return filter.flatMap((filterItem)=>extractFilterFieldNames(filterItem));
    }
    if (!(0, _utils.isDefined)(filter)) {
        return [];
    }
    return Object.entries(filter).flatMap(([key, value])=>{
        if (LOGICAL_OPERATORS.has(key)) {
            return extractFilterFieldNames(value);
        }
        return [
            key
        ];
    });
};
const extractOrderByFieldNames = (orderBy)=>{
    if (!Array.isArray(orderBy)) {
        return [];
    }
    return orderBy.flatMap((item)=>(0, _guards.isObject)(item) ? Object.keys(item) : []);
};
const buildSelectedFieldsOverride = (select, allSelectableFields, fieldNameToType)=>{
    const fieldsToInclude = new Set([
        ...select,
        'id'
    ]);
    const fieldsToProcess = Object.fromEntries(Object.entries(allSelectableFields).filter(([fieldName])=>fieldsToInclude.has(fieldName)));
    return stripSubFieldsByType(fieldsToProcess, fieldNameToType);
};
const buildEffectiveSelectedFields = ({ select, filter, orderBy, objectName, flatObjectMetadata, flatFieldMetadataMaps, flatObjectMetadataMaps, selectedFields, selectableRelationFields, objectsPermissions })=>{
    const filterFieldNames = extractFilterFieldNames(filter);
    const orderByFieldNames = extractOrderByFieldNames(orderBy);
    const labelIdentifierField = flatObjectMetadata.labelIdentifierFieldMetadataId ? (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
        flatEntityMaps: flatFieldMetadataMaps,
        flatEntityId: flatObjectMetadata.labelIdentifierFieldMetadataId
    }) : undefined;
    const labelIdentifierFieldName = labelIdentifierField?.name ?? 'id';
    const unselectableRelationWarningsByFieldName = (0, _buildunselectablerelationwarningsutil.buildUnselectableRelationWarningsByFieldName)({
        objectName,
        flatObjectMetadata,
        flatFieldMetadataMaps,
        flatObjectMetadataMaps,
        selectableRelationFields,
        objectsPermissions
    });
    const { select: cleanSelect, relationSelect, warnings } = buildSelectedField({
        rawSelect: select,
        filterFieldNames,
        orderByFieldNames,
        allSelectableFieldNames: Object.keys(selectedFields),
        labelIdentifierFieldName,
        objectName,
        selectableRelationFieldNames: Object.keys(selectableRelationFields),
        unselectableRelationWarningsByFieldName
    });
    const fieldNameToType = buildFieldNameToTypeMap(flatObjectMetadata, flatFieldMetadataMaps);
    const selectedRelationFields = {};
    for (const fieldName of relationSelect){
        const fieldValue = selectableRelationFields[fieldName];
        if ((0, _utils.isDefined)(fieldValue)) {
            selectedRelationFields[fieldName] = fieldValue;
        }
    }
    return {
        effectiveSelectedFields: {
            ...buildSelectedFieldsOverride(cleanSelect, selectedFields, fieldNameToType),
            ...selectedRelationFields
        },
        warnings
    };
};
const buildFieldNameToTypeMap = (flatObjectMetadata, flatFieldMetadataMaps)=>{
    const map = new Map();
    for (const fieldId of flatObjectMetadata.fieldIds){
        const field = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
            flatEntityMaps: flatFieldMetadataMaps,
            flatEntityId: fieldId
        });
        if ((0, _utils.isDefined)(field)) {
            map.set(field.name, field.type);
        }
    }
    return map;
};
const stripSubFieldsByType = (fields, fieldNameToType)=>{
    const result = {};
    for (const [fieldName, fieldValue] of Object.entries(fields)){
        result[fieldName] = stripFieldSubFieldsByType(fieldName, fieldValue, fieldNameToType);
    }
    return result;
};
const stripFieldSubFieldsByType = (fieldName, fieldValue, fieldNameToType)=>{
    if (!(0, _guards.isObject)(fieldValue) || (0, _guards.isNull)(fieldValue)) {
        return fieldValue;
    }
    const fieldType = fieldNameToType.get(fieldName);
    const subFieldsToExclude = (0, _utils.isDefined)(fieldType) ? SUB_FIELDS_TO_EXCLUDE_BY_FIELD_TYPE[fieldType] : undefined;
    if (!(0, _utils.isDefined)(subFieldsToExclude)) {
        return fieldValue;
    }
    const stripped = {};
    for (const [subFieldName, subFieldValue] of Object.entries(fieldValue)){
        if (!subFieldsToExclude.has(subFieldName)) {
            stripped[subFieldName] = subFieldValue;
        }
    }
    return stripped;
};
const findSimilarFieldNames = (name, fieldNames)=>{
    const fuse = new _fuse.default(fieldNames, {
        includeScore: true,
        threshold: 0.4
    });
    return fuse.search(name).slice(0, 3).map((result)=>result.item);
};

//# sourceMappingURL=build-effective-selected-fields.util.js.map