"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get getObjectMetadataId () {
        return getObjectMetadataId;
    },
    get resolveConfigurationFieldNamesToIds () {
        return resolveConfigurationFieldNamesToIds;
    },
    get resolveWidgetFieldNamesToIds () {
        return resolveWidgetFieldNamesToIds;
    }
});
const _guards = require("@sniptt/guards");
const _utils = require("twenty-shared/utils");
const _uuid = require("uuid");
const _buildfieldbyobjectidandnamekeyutil = require("../../../../engine/metadata-modules/flat-field-metadata/utils/build-field-by-object-id-and-name-key.util");
const _widgetconfigurationtypetype = require("../../../../engine/metadata-modules/page-layout-widget/enums/widget-configuration-type.type");
const getFieldMetadataIdOrThrow = ({ fieldMetadataId, fieldName, objectMetadataId, maps }, referenceLabel)=>{
    if ((0, _utils.isDefined)(fieldMetadataId)) {
        return fieldMetadataId;
    }
    if (!(0, _guards.isNonEmptyString)(fieldName)) {
        throw new Error(`Missing required ${referenceLabel}: provide either its UUID or its field name.`);
    }
    if (!(0, _utils.isDefined)(objectMetadataId)) {
        throw new Error(`Cannot look up field "${fieldName}": the widget has no object. Provide objectName or objectMetadataId on the widget.`);
    }
    const fieldMetadataIdForName = maps.fieldIdByObjectIdAndName.get((0, _buildfieldbyobjectidandnamekeyutil.buildFieldByObjectIdAndNameKey)(objectMetadataId, fieldName));
    if (!(0, _utils.isDefined)(fieldMetadataIdForName)) {
        throw new Error(`Field "${fieldName}" not found on this object. Use get_object_metadata with includeFields (or get_field_metadata) to list available field names.`);
    }
    return fieldMetadataIdForName;
};
const getObjectMetadataId = ({ objectMetadataId, objectName, maps })=>{
    if ((0, _utils.isDefined)(objectMetadataId)) {
        return objectMetadataId;
    }
    if (!(0, _guards.isNonEmptyString)(objectName)) {
        return undefined;
    }
    const objectMetadataIdForName = maps.objectIdByName[objectName];
    if (!(0, _utils.isDefined)(objectMetadataIdForName)) {
        throw new Error(`Object "${objectName}" not found. Use get_object_metadata to list available objects.`);
    }
    return objectMetadataIdForName;
};
const resolveChartFilterFieldNamesToIds = (filter, objectMetadataId, maps)=>{
    if (!(0, _utils.isDefined)(filter)) {
        return undefined;
    }
    const inputRecordFilters = filter.recordFilters ?? [];
    if (inputRecordFilters.length === 0) {
        return undefined;
    }
    const inputRecordFilterGroups = filter.recordFilterGroups ?? [];
    const existingRootGroup = inputRecordFilterGroups.find((group)=>!(0, _utils.isDefined)(group.parentRecordFilterGroupId));
    const rootGroup = existingRootGroup ?? {
        id: (0, _uuid.v4)(),
        logicalOperator: 'AND'
    };
    const recordFilterGroups = (0, _utils.isDefined)(existingRootGroup) ? inputRecordFilterGroups : [
        rootGroup,
        ...inputRecordFilterGroups
    ];
    const validGroupIds = new Set(recordFilterGroups.map((group)=>group.id));
    const positionByGroupId = new Map();
    const recordFilters = inputRecordFilters.map((recordFilter)=>{
        const { fieldName, fieldMetadataId, ...rest } = recordFilter;
        const resolvedFieldMetadataId = getFieldMetadataIdOrThrow({
            fieldMetadataId,
            fieldName,
            objectMetadataId,
            maps
        }, 'filter field');
        const recordFilterGroupId = rest.recordFilterGroupId ?? rootGroup.id;
        if (!validGroupIds.has(recordFilterGroupId)) {
            throw new Error(`Invalid recordFilterGroupId "${recordFilterGroupId}": no matching filter group exists. Provide a valid group id or omit to use the root group.`);
        }
        const positionInRecordFilterGroup = positionByGroupId.get(recordFilterGroupId) ?? 0;
        positionByGroupId.set(recordFilterGroupId, positionInRecordFilterGroup + 1);
        const field = maps.fieldById.get(resolvedFieldMetadataId);
        const value = rest.value ?? '';
        return {
            id: (0, _uuid.v4)(),
            fieldMetadataId: resolvedFieldMetadataId,
            operand: rest.operand,
            value,
            displayValue: value,
            type: field?.type ?? '',
            recordFilterGroupId,
            positionInRecordFilterGroup,
            ...(0, _utils.isDefined)(rest.subFieldName) ? {
                subFieldName: rest.subFieldName
            } : {}
        };
    });
    return {
        recordFilters,
        recordFilterGroups
    };
};
const resolveConfigurationFieldNamesToIds = (configuration, objectMetadataId, maps)=>{
    switch(configuration.configurationType){
        case _widgetconfigurationtypetype.WidgetConfigurationType.AGGREGATE_CHART:
            {
                const { aggregateFieldName, aggregateFieldMetadataId, ratioAggregateConfig, filter, ...rest } = configuration;
                return {
                    ...rest,
                    aggregateFieldMetadataId: getFieldMetadataIdOrThrow({
                        fieldMetadataId: aggregateFieldMetadataId,
                        fieldName: aggregateFieldName,
                        objectMetadataId,
                        maps
                    }, 'aggregate field'),
                    filter: resolveChartFilterFieldNamesToIds(filter, objectMetadataId, maps),
                    ratioAggregateConfig: (0, _utils.isDefined)(ratioAggregateConfig) ? {
                        optionValue: ratioAggregateConfig.optionValue,
                        fieldMetadataId: getFieldMetadataIdOrThrow({
                            fieldMetadataId: ratioAggregateConfig.fieldMetadataId,
                            fieldName: ratioAggregateConfig.fieldName,
                            objectMetadataId,
                            maps
                        }, 'ratio aggregate field')
                    } : undefined
                };
            }
        case _widgetconfigurationtypetype.WidgetConfigurationType.BAR_CHART:
        case _widgetconfigurationtypetype.WidgetConfigurationType.LINE_CHART:
            {
                const { aggregateFieldName, aggregateFieldMetadataId, primaryAxisGroupByFieldName, primaryAxisGroupByFieldMetadataId, secondaryAxisGroupByFieldName, secondaryAxisGroupByFieldMetadataId, filter, ...rest } = configuration;
                return {
                    ...rest,
                    aggregateFieldMetadataId: getFieldMetadataIdOrThrow({
                        fieldMetadataId: aggregateFieldMetadataId,
                        fieldName: aggregateFieldName,
                        objectMetadataId,
                        maps
                    }, 'aggregate field'),
                    filter: resolveChartFilterFieldNamesToIds(filter, objectMetadataId, maps),
                    primaryAxisGroupByFieldMetadataId: getFieldMetadataIdOrThrow({
                        fieldMetadataId: primaryAxisGroupByFieldMetadataId,
                        fieldName: primaryAxisGroupByFieldName,
                        objectMetadataId,
                        maps
                    }, 'primary axis group-by field'),
                    secondaryAxisGroupByFieldMetadataId: (0, _utils.isDefined)(secondaryAxisGroupByFieldMetadataId) || (0, _guards.isNonEmptyString)(secondaryAxisGroupByFieldName) ? getFieldMetadataIdOrThrow({
                        fieldMetadataId: secondaryAxisGroupByFieldMetadataId,
                        fieldName: secondaryAxisGroupByFieldName,
                        objectMetadataId,
                        maps
                    }, 'secondary axis group-by field') : undefined
                };
            }
        case _widgetconfigurationtypetype.WidgetConfigurationType.PIE_CHART:
            {
                const { aggregateFieldName, aggregateFieldMetadataId, groupByFieldName, groupByFieldMetadataId, filter, ...rest } = configuration;
                return {
                    ...rest,
                    aggregateFieldMetadataId: getFieldMetadataIdOrThrow({
                        fieldMetadataId: aggregateFieldMetadataId,
                        fieldName: aggregateFieldName,
                        objectMetadataId,
                        maps
                    }, 'aggregate field'),
                    filter: resolveChartFilterFieldNamesToIds(filter, objectMetadataId, maps),
                    groupByFieldMetadataId: getFieldMetadataIdOrThrow({
                        fieldMetadataId: groupByFieldMetadataId,
                        fieldName: groupByFieldName,
                        objectMetadataId,
                        maps
                    }, 'group-by field')
                };
            }
        case _widgetconfigurationtypetype.WidgetConfigurationType.STANDALONE_RICH_TEXT:
            return {
                ...configuration,
                body: {
                    ...configuration.body,
                    markdown: configuration.body.markdown ?? null
                }
            };
        case _widgetconfigurationtypetype.WidgetConfigurationType.IFRAME:
        case _widgetconfigurationtypetype.WidgetConfigurationType.RECORD_TABLE:
            return configuration;
    }
};
const resolveWidgetFieldNamesToIds = (widget, maps)=>{
    const objectMetadataId = getObjectMetadataId({
        objectMetadataId: widget.objectMetadataId,
        objectName: widget.objectName,
        maps
    });
    return {
        title: widget.title,
        type: widget.type,
        position: widget.position,
        objectMetadataId,
        configuration: (0, _utils.isDefined)(widget.configuration) ? resolveConfigurationFieldNamesToIds(widget.configuration, objectMetadataId, maps) : undefined
    };
};

//# sourceMappingURL=resolve-widget-field-names-to-metadata-ids.util.js.map