"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ViewToolsFactory", {
    enumerable: true,
    get: function() {
        return ViewToolsFactory;
    }
});
const _common = require("@nestjs/common");
const _types = require("twenty-shared/types");
const _zod = require("zod");
const _formatvalidationerrorsutil = require("../../../core-modules/tool-provider/utils/format-validation-errors.util");
const _workspacemanyorallflatentitymapscacheservice = require("../../flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.service");
const _viewfieldservice = require("../../view-field/services/view-field.service");
const _buildobjectidbynamemapsutil = require("../../flat-object-metadata/utils/build-object-id-by-name-maps.util");
const _completeviewupsertservice = require("./services/complete-view-upsert.service");
const _viewqueryparamsservice = require("../services/view-query-params.service");
const _viewservice = require("../services/view.service");
const _workspacemigrationbuilderexception = require("../../../workspace-manager/workspace-migration/exceptions/workspace-migration-builder-exception");
const _utils = require("twenty-shared/utils");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const CREATABLE_VIEW_TYPES = [
    _types.ViewType.TABLE,
    _types.ViewType.LIST,
    _types.ViewType.KANBAN,
    _types.ViewType.CALENDAR,
    _types.ViewType.TABLE_WIDGET,
    _types.ViewType.KANBAN_WIDGET,
    _types.ViewType.LIST_WIDGET,
    _types.ViewType.CALENDAR_WIDGET
];
const GetViewsInputSchema = _zod.z.object({
    objectNameSingular: _zod.z.string().optional().describe('Filter views by object name (e.g., "task", "person", "company"). If omitted, returns all views.'),
    limit: _zod.z.number().int().min(1).max(100).default(50).describe('Maximum views to return.')
});
const GetViewQueryParamsInputSchema = _zod.z.object({
    viewId: _zod.z.string().uuid().describe('ID of the view to get query parameters for.')
});
const CreateViewInputSchema = _zod.z.object({
    name: _zod.z.string().describe('View name'),
    objectNameSingular: _zod.z.string().describe('Object name this view is for (e.g., "task", "person", "company")'),
    icon: _zod.z.string().optional().default('IconList').describe('Icon identifier (e.g., "IconList", "IconCheckbox")'),
    type: _zod.z.enum(CREATABLE_VIEW_TYPES).optional().default(_types.ViewType.TABLE).describe('View type. Use the *_WIDGET variants (TABLE_WIDGET, KANBAN_WIDGET, LIST_WIDGET, CALENDAR_WIDGET) for views backing a dashboard widget so they stay out of record index view pickers.'),
    visibility: _zod.z.enum([
        _types.ViewVisibility.WORKSPACE,
        _types.ViewVisibility.UNLISTED
    ]).optional().default(_types.ViewVisibility.WORKSPACE).describe('View visibility. ALWAYS prefer WORKSPACE (the default) — it is the right choice for shared views and for any view backing a dashboard widget, so the view is visible to everyone. Only use UNLISTED for a private, personal view explicitly requested by a single user, AND only when a user identity is available. An UNLISTED view created without an owner becomes invisible to everyone (e.g. its dashboard widget renders blank), so never use UNLISTED for widget-backing views.'),
    mainGroupByFieldName: _zod.z.string().optional().describe('Field name to group by (required for KANBAN views, must be a SELECT field, e.g., "stage", "status")'),
    kanbanAggregateOperation: _zod.z.enum(Object.values(_types.AggregateOperations)).optional().describe('Aggregate operation for kanban columns (e.g., "SUM", "AVG", "COUNT")'),
    kanbanAggregateOperationFieldName: _zod.z.string().optional().describe('Field name for the kanban aggregate operation (e.g., "amount")'),
    calendarLayout: _zod.z.enum([
        _types.ViewCalendarLayout.DAY,
        _types.ViewCalendarLayout.WEEK,
        _types.ViewCalendarLayout.MONTH
    ]).optional().describe('Calendar layout (required for CALENDAR views, e.g., "DAY", "WEEK", "MONTH")'),
    calendarFieldName: _zod.z.string().optional().describe('Date field name to use for the calendar (required for CALENDAR views, must be a DATE or DATE_TIME field, e.g., "createdAt", "dueAt")'),
    calendarEndFieldName: _zod.z.string().optional().describe('Optional end date field name for the calendar. It must have the same DATE or DATE_TIME type as calendarFieldName.'),
    fieldNames: _zod.z.array(_zod.z.string()).optional().describe('Field names to display in the view as columns (for TABLE) or cards (for KANBAN/CALENDAR). Fields are displayed in the order provided. Use get_field_metadata to find available field names.')
});
const UpdateViewInputSchema = _zod.z.object({
    id: _zod.z.string().uuid().describe('View ID to update'),
    name: _zod.z.string().optional().describe('New view name'),
    icon: _zod.z.string().optional().describe('New icon identifier')
});
const DeleteViewInputSchema = _zod.z.object({
    id: _zod.z.string().uuid().describe('View ID to delete')
});
const VIEW_FILTER_OPERAND_OPTIONS = Object.values(_types.ViewFilterOperand);
const VIEW_SORT_DIRECTION_OPTIONS = Object.values(_types.ViewSortDirection);
const fieldReferenceShape = {
    fieldName: _zod.z.string().optional().describe('Field name (e.g. "amount", "stage"). Resolved to a UUID server-side. Provide this or fieldMetadataId.'),
    fieldMetadataId: _zod.z.uuid().optional().describe('Field UUID. Alternative to fieldName; takes precedence when both are given.')
};
const UpsertCompleteViewFieldSchema = _zod.z.object({
    ...fieldReferenceShape,
    isVisible: _zod.z.boolean().optional().default(true).describe('Whether the column is visible. Defaults to true.'),
    size: _zod.z.number().int().optional().default(150).describe('Column width. Defaults to 150.')
});
const UpsertCompleteViewFilterSchema = _zod.z.object({
    ...fieldReferenceShape,
    operand: _zod.z.enum(VIEW_FILTER_OPERAND_OPTIONS).describe('Filter operator. Must be valid for the field type (e.g. SELECT: IS, IS_NOT; CURRENCY: GREATER_THAN_OR_EQUAL, LESS_THAN_OR_EQUAL; TEXT: CONTAINS).'),
    value: _zod.z.union([
        _zod.z.string(),
        _zod.z.number(),
        _zod.z.boolean(),
        _zod.z.array(_zod.z.string()),
        _zod.z.record(_zod.z.string(), _zod.z.unknown())
    ]).describe('Filter value. Array of option values for SELECT/MULTI_SELECT (e.g. ["WON"]), number for NUMBER/CURRENCY, "" for IS_EMPTY/IS_NOT_EMPTY.'),
    subFieldName: _zod.z.string().optional().describe('Required for composite fields (e.g. "amountMicros" for CURRENCY, "addressCity" for ADDRESS, "firstName" for FULL_NAME).')
});
const UpsertCompleteViewSortSchema = _zod.z.object({
    ...fieldReferenceShape,
    direction: _zod.z.enum(VIEW_SORT_DIRECTION_OPTIONS).optional().default(_types.ViewSortDirection.ASC).describe('Sort direction: ASC or DESC. Defaults to ASC.')
});
const UpsertCompleteViewInputSchema = _zod.z.object({
    id: _zod.z.uuid().optional().describe('View ID to update. Omit to create a new view.'),
    objectNameSingular: _zod.z.string().optional().describe('Object name this view is for (e.g. "opportunity"). Required when creating (no id); ignored when id is given.'),
    name: _zod.z.string().optional().describe('View name'),
    icon: _zod.z.string().optional().describe('Icon identifier (e.g. "IconList")'),
    type: _zod.z.enum(CREATABLE_VIEW_TYPES).optional().describe('View type. Defaults to TABLE on create. Use the *_WIDGET variants for views backing a dashboard widget so they stay out of record index view pickers.'),
    visibility: _zod.z.enum([
        _types.ViewVisibility.WORKSPACE,
        _types.ViewVisibility.UNLISTED
    ]).optional().describe('View visibility. Defaults to WORKSPACE on create, which is almost always the best fit — it makes the view visible to everyone and is REQUIRED for any view backing a dashboard widget. Only set UNLISTED for a private, personal view a specific user explicitly asked for, AND only when a user identity is available. An UNLISTED view created without an owner is invisible to everyone (its dashboard widget renders blank), so never use UNLISTED for widget-backing views.'),
    mainGroupByFieldName: _zod.z.string().optional().describe('Field name to group by (required for KANBAN, must be a SELECT field, e.g. "stage").'),
    kanbanAggregateOperation: _zod.z.enum(Object.values(_types.AggregateOperations)).optional().describe('Aggregate operation for kanban columns (e.g. "SUM", "COUNT").'),
    kanbanAggregateOperationFieldName: _zod.z.string().optional().describe('Field name for the kanban aggregate operation (e.g. "amount").'),
    calendarLayout: _zod.z.enum([
        _types.ViewCalendarLayout.DAY,
        _types.ViewCalendarLayout.WEEK,
        _types.ViewCalendarLayout.MONTH
    ]).optional().describe('Calendar layout (required for CALENDAR).'),
    calendarFieldName: _zod.z.string().optional().describe('Date field name for the calendar (required for CALENDAR, must be DATE or DATE_TIME).'),
    calendarEndFieldName: _zod.z.string().optional().describe('Optional end date field name for the calendar. It must match the type of calendarFieldName.'),
    fields: _zod.z.array(UpsertCompleteViewFieldSchema).optional().describe('Declarative list of columns, in display order. Provided array REPLACES all existing fields; [] clears them; omit to leave untouched.'),
    filters: _zod.z.array(UpsertCompleteViewFilterSchema).optional().describe('Declarative list of filters. Provided array REPLACES all existing filters; [] clears them; omit to leave untouched.'),
    sorts: _zod.z.array(UpsertCompleteViewSortSchema).optional().describe('Declarative list of sorts. Provided array REPLACES all existing sorts; [] clears them; omit to leave untouched.')
});
let ViewToolsFactory = class ViewToolsFactory {
    async resolveObjectMetadataId(workspaceId, objectNameSingular) {
        const { flatObjectMetadataMaps } = await this.flatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
            workspaceId,
            flatMapsKeys: [
                'flatObjectMetadataMaps'
            ]
        });
        const { idByNameSingular } = (0, _buildobjectidbynamemapsutil.buildObjectIdByNameMaps)(flatObjectMetadataMaps);
        const objectMetadataId = idByNameSingular[objectNameSingular];
        if (!objectMetadataId) {
            throw new Error(`Object "${objectNameSingular}" not found. Use get_object_metadata to list available objects.`);
        }
        return objectMetadataId;
    }
    async resolveFieldMetadataId(workspaceId, objectMetadataId, fieldName) {
        const { flatFieldMetadataMaps } = await this.flatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
            workspaceId,
            flatMapsKeys: [
                'flatFieldMetadataMaps'
            ]
        });
        const fieldMetadata = Object.values(flatFieldMetadataMaps.byUniversalIdentifier).find((field)=>field?.name === fieldName && field?.objectMetadataId === objectMetadataId);
        if (!fieldMetadata) {
            throw new Error(`Field "${fieldName}" not found on this object. Use get_field_metadata to list available fields.`);
        }
        return fieldMetadata.id;
    }
    async resolveGroupByFieldMetadataId(workspaceId, objectMetadataId, fieldName) {
        const { flatFieldMetadataMaps } = await this.flatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
            workspaceId,
            flatMapsKeys: [
                'flatFieldMetadataMaps'
            ]
        });
        const fieldMetadata = Object.values(flatFieldMetadataMaps.byUniversalIdentifier).find((field)=>field?.name === fieldName && field?.objectMetadataId === objectMetadataId);
        if (!fieldMetadata) {
            throw new Error(`Field "${fieldName}" not found on this object. Use get_field_metadata to list available fields.`);
        }
        if (fieldMetadata.type !== _types.FieldMetadataType.SELECT) {
            throw new Error(`Field "${fieldName}" has type "${fieldMetadata.type}" and cannot be used as a group-by field. Only SELECT fields are supported for grouping (board columns and table groups).`);
        }
        return fieldMetadata.id;
    }
    async resolveCalendarFieldMetadataId(workspaceId, objectMetadataId, fieldName) {
        const { flatFieldMetadataMaps } = await this.flatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
            workspaceId,
            flatMapsKeys: [
                'flatFieldMetadataMaps'
            ]
        });
        const fieldMetadata = Object.values(flatFieldMetadataMaps.byUniversalIdentifier).find((field)=>field?.name === fieldName && field?.objectMetadataId === objectMetadataId);
        if (!fieldMetadata) {
            throw new Error(`Field "${fieldName}" not found on this object. Use get_field_metadata to list available fields.`);
        }
        if (!(0, _utils.isFieldMetadataDateKind)(fieldMetadata.type)) {
            throw new Error(`Field "${fieldName}" has type "${fieldMetadata.type}" and cannot be used as a calendar field. Only DATE or DATE_TIME fields are supported.`);
        }
        return fieldMetadata.id;
    }
    async getFieldMetadataIdOrThrow(workspaceId, objectMetadataId, reference) {
        if ((0, _utils.isDefined)(reference.fieldMetadataId)) {
            return reference.fieldMetadataId;
        }
        if ((0, _utils.isDefined)(reference.fieldName)) {
            return this.resolveFieldMetadataId(workspaceId, objectMetadataId, reference.fieldName);
        }
        throw new Error('Each field, filter, and sort entry must provide either fieldName or fieldMetadataId.');
    }
    async resolveUpsertCompleteViewIdentifiersOrThrow({ parameters, workspaceId, userWorkspaceId }) {
        if ((0, _utils.isDefined)(parameters.id)) {
            const existingView = await this.viewService.findById(parameters.id, workspaceId);
            if (!existingView) {
                throw new Error(`View with id ${parameters.id} not found`);
            }
            if (existingView.visibility === _types.ViewVisibility.UNLISTED && existingView.createdByUserWorkspaceId !== userWorkspaceId) {
                throw new Error('You can only update your own unlisted views');
            }
            const calendarEndFieldMetadataId = (0, _utils.isDefined)(parameters.calendarEndFieldName) ? await this.resolveCalendarFieldMetadataId(workspaceId, existingView.objectMetadataId, parameters.calendarEndFieldName) : undefined;
            return {
                existingViewId: existingView.id,
                objectMetadataId: existingView.objectMetadataId,
                calendarEndFieldMetadataId
            };
        }
        if (!(0, _utils.isDefined)(parameters.objectNameSingular)) {
            throw new Error('objectNameSingular is required when creating a view (no id provided).');
        }
        const objectMetadataId = await this.resolveObjectMetadataId(workspaceId, parameters.objectNameSingular);
        if (parameters.type === _types.ViewType.KANBAN && !(0, _utils.isDefined)(parameters.mainGroupByFieldName)) {
            throw new Error('KANBAN views require mainGroupByFieldName. Provide a SELECT field name (e.g. "stage").');
        }
        if (parameters.type === _types.ViewType.CALENDAR) {
            if (!(0, _utils.isDefined)(parameters.calendarFieldName)) {
                throw new Error('CALENDAR views require calendarFieldName (a DATE or DATE_TIME field name).');
            }
            if (!(0, _utils.isDefined)(parameters.calendarLayout)) {
                throw new Error('CALENDAR views require calendarLayout. Provide one of: "DAY", "WEEK", "MONTH".');
            }
        }
        const mainGroupByFieldMetadataId = (0, _utils.isDefined)(parameters.mainGroupByFieldName) ? await this.resolveGroupByFieldMetadataId(workspaceId, objectMetadataId, parameters.mainGroupByFieldName) : undefined;
        const kanbanAggregateOperationFieldMetadataId = (0, _utils.isDefined)(parameters.kanbanAggregateOperationFieldName) ? await this.resolveFieldMetadataId(workspaceId, objectMetadataId, parameters.kanbanAggregateOperationFieldName) : undefined;
        const calendarFieldMetadataId = (0, _utils.isDefined)(parameters.calendarFieldName) ? await this.resolveCalendarFieldMetadataId(workspaceId, objectMetadataId, parameters.calendarFieldName) : undefined;
        const calendarEndFieldMetadataId = (0, _utils.isDefined)(parameters.calendarEndFieldName) ? await this.resolveCalendarFieldMetadataId(workspaceId, objectMetadataId, parameters.calendarEndFieldName) : undefined;
        return {
            objectMetadataId,
            mainGroupByFieldMetadataId,
            kanbanAggregateOperationFieldMetadataId,
            calendarFieldMetadataId,
            calendarEndFieldMetadataId
        };
    }
    generateReadTools(workspaceId, userWorkspaceId, currentWorkspaceMemberId) {
        return {
            get_views: {
                description: 'List views in the workspace. Views define how records are displayed, filtered, and sorted.',
                inputSchema: GetViewsInputSchema,
                execute: async (parameters)=>{
                    let views;
                    if (parameters.objectNameSingular) {
                        const objectMetadataId = await this.resolveObjectMetadataId(workspaceId, parameters.objectNameSingular);
                        views = await this.viewService.findByObjectMetadataId(workspaceId, objectMetadataId, userWorkspaceId);
                    } else {
                        views = await this.viewService.findByWorkspaceId(workspaceId, userWorkspaceId);
                    }
                    const limitedViews = views.slice(0, parameters.limit ?? 50);
                    return limitedViews.map((view)=>({
                            id: view.id,
                            name: view.name,
                            objectMetadataId: view.objectMetadataId,
                            type: view.type,
                            icon: view.icon,
                            visibility: view.visibility,
                            position: view.position
                        }));
                }
            },
            get_view_query_parameters: {
                description: 'Get filter and sort parameters from a view. Use these parameters with find_* tools to query records matching the view.',
                inputSchema: GetViewQueryParamsInputSchema,
                execute: async (parameters)=>{
                    return this.viewQueryParamsService.resolveViewToQueryParams(parameters.viewId, workspaceId, currentWorkspaceMemberId);
                }
            }
        };
    }
    generateWriteTools(workspaceId, userWorkspaceId) {
        return {
            upsert_complete_view: {
                description: `Create or update a complete view — the view plus its fields (columns), filters, and sorts — in a single call.

IDENTITY: Omit "id" to CREATE a new view (requires objectNameSingular). Provide "id" to UPDATE an existing view.

FIELD REFERENCES: In fields/filters/sorts you can reference a field by NAME (fieldName, e.g. "amount") or by UUID (fieldMetadataId). Names are resolved server-side, so you usually do NOT need get_field_metadata first. UUID wins when both are given.

DECLARATIVE CHILDREN (replace semantics): fields, filters, and sorts each describe the FULL desired set.
- A provided array REPLACES all existing entries of that kind (existing ones are deleted, the new ones created in order).
- An empty array [] CLEARS all entries of that kind.
- Omitting the key leaves existing entries untouched.
This means you never need to fetch child ids to edit a view — just pass the desired end state. For surgical single-entry edits, the granular tools (create_view_filter, update_view_sort, etc.) remain available.

VIEW TYPES: TABLE (default), LIST, KANBAN (requires mainGroupByFieldName, a SELECT field), CALENDAR (requires calendarFieldName + calendarLayout).`,
                inputSchema: UpsertCompleteViewInputSchema,
                execute: async (parameters)=>{
                    try {
                        const { existingViewId, objectMetadataId, mainGroupByFieldMetadataId, kanbanAggregateOperationFieldMetadataId, calendarFieldMetadataId, calendarEndFieldMetadataId } = await this.resolveUpsertCompleteViewIdentifiersOrThrow({
                            parameters,
                            workspaceId,
                            userWorkspaceId
                        });
                        const fields = (0, _utils.isDefined)(parameters.fields) ? await Promise.all(parameters.fields.map(async (field)=>({
                                fieldMetadataId: await this.getFieldMetadataIdOrThrow(workspaceId, objectMetadataId, field),
                                isVisible: field.isVisible ?? true,
                                size: field.size ?? 150
                            }))) : undefined;
                        const filters = (0, _utils.isDefined)(parameters.filters) ? await Promise.all(parameters.filters.map(async (filter)=>({
                                fieldMetadataId: await this.getFieldMetadataIdOrThrow(workspaceId, objectMetadataId, filter),
                                operand: filter.operand,
                                value: filter.value,
                                subFieldName: filter.subFieldName
                            }))) : undefined;
                        const sorts = (0, _utils.isDefined)(parameters.sorts) ? await Promise.all(parameters.sorts.map(async (sort)=>({
                                fieldMetadataId: await this.getFieldMetadataIdOrThrow(workspaceId, objectMetadataId, sort),
                                direction: sort.direction ?? _types.ViewSortDirection.ASC
                            }))) : undefined;
                        const view = await this.completeViewUpsertService.upsertCompleteView({
                            workspaceId,
                            userWorkspaceId,
                            existingViewId,
                            objectMetadataId,
                            name: parameters.name,
                            icon: parameters.icon,
                            type: parameters.type,
                            visibility: parameters.visibility,
                            mainGroupByFieldMetadataId,
                            kanbanAggregateOperation: parameters.kanbanAggregateOperation,
                            kanbanAggregateOperationFieldMetadataId,
                            calendarLayout: parameters.calendarLayout,
                            calendarFieldMetadataId,
                            calendarEndFieldMetadataId,
                            fields,
                            filters,
                            sorts
                        });
                        return {
                            id: view.id,
                            name: view.name,
                            objectMetadataId,
                            type: view.type,
                            icon: view.icon,
                            visibility: view.visibility,
                            fieldCount: view.viewFields?.length ?? 0,
                            filterCount: view.viewFilters?.length ?? 0,
                            sortCount: view.viewSorts?.length ?? 0
                        };
                    } catch (error) {
                        if (error instanceof _workspacemigrationbuilderexception.WorkspaceMigrationBuilderException) {
                            throw new Error((0, _formatvalidationerrorsutil.formatValidationErrors)(error));
                        }
                        throw error;
                    }
                }
            },
            create_view: {
                description: 'Create a new view for an object. Views define how records are displayed. For KANBAN views, mainGroupByFieldName is required and must be a SELECT field (e.g., "stage", "status"). For CALENDAR views, calendarFieldName and calendarLayout are required.',
                inputSchema: CreateViewInputSchema,
                execute: async (parameters)=>{
                    try {
                        const objectMetadataId = await this.resolveObjectMetadataId(workspaceId, parameters.objectNameSingular);
                        if (parameters.type === _types.ViewType.KANBAN && !parameters.mainGroupByFieldName) {
                            throw new Error('KANBAN views require mainGroupByFieldName. Provide a SELECT field name (e.g., "stage", "status") to group records into columns.');
                        }
                        if (parameters.type === _types.ViewType.CALENDAR) {
                            if (!parameters.calendarFieldName) {
                                throw new Error('CALENDAR views require calendarFieldName. Provide a DATE or DATE_TIME field name (e.g., "dueAt", "createdAt").');
                            }
                            if (!parameters.calendarLayout) {
                                throw new Error('CALENDAR views require calendarLayout. Provide one of: "DAY", "WEEK", "MONTH".');
                            }
                        }
                        let mainGroupByFieldMetadataId;
                        let kanbanAggregateOperationFieldMetadataId;
                        let calendarFieldMetadataId;
                        let calendarEndFieldMetadataId;
                        if (parameters.mainGroupByFieldName) {
                            mainGroupByFieldMetadataId = await this.resolveGroupByFieldMetadataId(workspaceId, objectMetadataId, parameters.mainGroupByFieldName);
                        }
                        if (parameters.kanbanAggregateOperationFieldName) {
                            kanbanAggregateOperationFieldMetadataId = await this.resolveFieldMetadataId(workspaceId, objectMetadataId, parameters.kanbanAggregateOperationFieldName);
                        }
                        if (parameters.calendarFieldName) {
                            calendarFieldMetadataId = await this.resolveCalendarFieldMetadataId(workspaceId, objectMetadataId, parameters.calendarFieldName);
                        }
                        if (parameters.calendarEndFieldName) {
                            calendarEndFieldMetadataId = await this.resolveCalendarFieldMetadataId(workspaceId, objectMetadataId, parameters.calendarEndFieldName);
                        }
                        const view = await this.viewService.createOne({
                            createViewInput: {
                                name: parameters.name,
                                objectMetadataId,
                                icon: parameters.icon ?? 'IconList',
                                type: parameters.type ?? _types.ViewType.TABLE,
                                visibility: parameters.visibility ?? _types.ViewVisibility.WORKSPACE,
                                mainGroupByFieldMetadataId,
                                kanbanAggregateOperation: parameters.kanbanAggregateOperation,
                                kanbanAggregateOperationFieldMetadataId,
                                calendarLayout: parameters.calendarLayout,
                                calendarFieldMetadataId,
                                calendarEndFieldMetadataId
                            },
                            workspaceId,
                            createdByUserWorkspaceId: userWorkspaceId
                        });
                        if ((0, _utils.isNonEmptyArray)(parameters.fieldNames)) {
                            const resolvedFieldMetadataIds = await Promise.all(parameters.fieldNames.map((fieldName)=>this.resolveFieldMetadataId(workspaceId, objectMetadataId, fieldName)));
                            await this.viewFieldService.createMany({
                                createViewFieldInputs: resolvedFieldMetadataIds.map((fieldMetadataId, index)=>({
                                        viewId: view.id,
                                        fieldMetadataId,
                                        isVisible: true,
                                        size: 150,
                                        position: index
                                    })),
                                workspaceId
                            });
                        }
                        return {
                            id: view.id,
                            name: view.name,
                            objectNameSingular: parameters.objectNameSingular,
                            type: view.type,
                            icon: view.icon,
                            visibility: view.visibility
                        };
                    } catch (error) {
                        if (error instanceof _workspacemigrationbuilderexception.WorkspaceMigrationBuilderException) {
                            throw new Error((0, _formatvalidationerrorsutil.formatValidationErrors)(error));
                        }
                        throw error;
                    }
                }
            },
            update_view: {
                description: 'Update an existing view. You can change the name and icon.',
                inputSchema: UpdateViewInputSchema,
                execute: async (parameters)=>{
                    try {
                        const existingView = await this.viewService.findById(parameters.id, workspaceId);
                        if (!existingView) {
                            throw new Error(`View with id ${parameters.id} not found`);
                        }
                        if (existingView.visibility === _types.ViewVisibility.UNLISTED && existingView.createdByUserWorkspaceId !== userWorkspaceId) {
                            throw new Error('You can only update your own unlisted views');
                        }
                        const view = await this.viewService.updateOne({
                            updateViewInput: {
                                id: parameters.id,
                                name: parameters.name,
                                icon: parameters.icon
                            },
                            workspaceId,
                            userWorkspaceId
                        });
                        return {
                            id: view.id,
                            name: view.name,
                            objectMetadataId: view.objectMetadataId,
                            type: view.type,
                            icon: view.icon,
                            visibility: view.visibility
                        };
                    } catch (error) {
                        if (error instanceof _workspacemigrationbuilderexception.WorkspaceMigrationBuilderException) {
                            throw new Error((0, _formatvalidationerrorsutil.formatValidationErrors)(error));
                        }
                        throw error;
                    }
                }
            },
            delete_view: {
                description: 'Delete a view by its ID.',
                inputSchema: DeleteViewInputSchema,
                execute: async (parameters)=>{
                    try {
                        const existingView = await this.viewService.findById(parameters.id, workspaceId);
                        if (!existingView) {
                            throw new Error(`View with id ${parameters.id} not found`);
                        }
                        if (existingView.visibility === _types.ViewVisibility.UNLISTED && existingView.createdByUserWorkspaceId !== userWorkspaceId) {
                            throw new Error('You can only delete your own unlisted views');
                        }
                        const view = await this.viewService.deleteOne({
                            deleteViewInput: {
                                id: parameters.id
                            },
                            workspaceId
                        });
                        return {
                            id: view.id,
                            name: view.name,
                            deleted: true
                        };
                    } catch (error) {
                        if (error instanceof _workspacemigrationbuilderexception.WorkspaceMigrationBuilderException) {
                            throw new Error((0, _formatvalidationerrorsutil.formatValidationErrors)(error));
                        }
                        throw error;
                    }
                }
            }
        };
    }
    constructor(viewService, completeViewUpsertService, viewFieldService, viewQueryParamsService, flatEntityMapsCacheService){
        this.viewService = viewService;
        this.completeViewUpsertService = completeViewUpsertService;
        this.viewFieldService = viewFieldService;
        this.viewQueryParamsService = viewQueryParamsService;
        this.flatEntityMapsCacheService = flatEntityMapsCacheService;
    }
};
ViewToolsFactory = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _viewservice.ViewService === "undefined" ? Object : _viewservice.ViewService,
        typeof _completeviewupsertservice.CompleteViewUpsertService === "undefined" ? Object : _completeviewupsertservice.CompleteViewUpsertService,
        typeof _viewfieldservice.ViewFieldService === "undefined" ? Object : _viewfieldservice.ViewFieldService,
        typeof _viewqueryparamsservice.ViewQueryParamsService === "undefined" ? Object : _viewqueryparamsservice.ViewQueryParamsService,
        typeof _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService === "undefined" ? Object : _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService
    ])
], ViewToolsFactory);

//# sourceMappingURL=view-tools.factory.js.map