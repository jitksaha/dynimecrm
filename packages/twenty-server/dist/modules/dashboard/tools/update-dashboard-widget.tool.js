"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "createUpdateDashboardWidgetTool", {
    enumerable: true,
    get: function() {
        return createUpdateDashboardWidgetTool;
    }
});
const _guards = require("@sniptt/guards");
const _utils = require("twenty-shared/utils");
const _zod = require("zod");
const _widgetschema = require("./schemas/widget.schema");
const _computedashboardidentifiermapsutil = require("./utils/compute-dashboard-identifier-maps.util");
const _resolvewidgetfieldnamestometadataidsutil = require("./utils/resolve-widget-field-names-to-metadata-ids.util");
const updateDashboardWidgetSchema = _zod.z.object({
    widgetId: _zod.z.string().uuid().describe('The UUID of the widget to update'),
    title: _zod.z.string().optional().describe('New widget title'),
    type: _widgetschema.widgetTypeSchema.optional().describe('New widget type'),
    position: _widgetschema.widgetPositionSchema.optional().describe('New position and size in the grid layout'),
    objectMetadataId: _zod.z.uuid().optional().describe('New object metadata ID. Provide this or objectName.'),
    objectName: _zod.z.string().optional().describe('New object name, singular or plural. Resolved to a UUID — alternative to objectMetadataId.'),
    configuration: _widgetschema.widgetConfigurationSchemaWithoutDefaults.optional()
});
const createUpdateDashboardWidgetTool = (deps, context)=>({
        name: 'update_dashboard_widget',
        description: `Update an existing widget's properties, position, or configuration.

Use get_dashboard first to find the widgetId.

You can reference the object and fields by NAME instead of UUID: pass objectName and the *FieldName variants in configuration (aggregateFieldName, primaryAxisGroupByFieldName, secondaryAxisGroupByFieldName, groupByFieldName) and fieldName inside filter recordFilters. They are resolved server-side against the widget object, falling back to the widget's existing object when you don't change it. UUID variants still work and take precedence.

Only provide fields you want to change - others remain unchanged.`,
        inputSchema: updateDashboardWidgetSchema,
        execute: async (parameters)=>{
            try {
                const { widgetId, objectName, configuration, ...rest } = parameters;
                const hasConfigurationUpdate = (0, _utils.isDefined)(configuration) && !(0, _utils.isEmptyObject)(configuration);
                const shouldResolveIdentifiers = hasConfigurationUpdate || (0, _guards.isNonEmptyString)(objectName);
                let resolvedObjectMetadataId = rest.objectMetadataId;
                let resolvedConfiguration;
                if (shouldResolveIdentifiers) {
                    const identifierMaps = await (0, _computedashboardidentifiermapsutil.computeDashboardIdentifierMaps)(deps, context);
                    resolvedObjectMetadataId = (0, _resolvewidgetfieldnamestometadataidsutil.getObjectMetadataId)({
                        objectMetadataId: rest.objectMetadataId,
                        objectName,
                        maps: identifierMaps
                    });
                    if ((0, _utils.isDefined)(configuration) && !(0, _utils.isEmptyObject)(configuration)) {
                        const objectMetadataIdForFields = resolvedObjectMetadataId ?? (await deps.pageLayoutWidgetService.findByIdOrThrow({
                            id: widgetId,
                            workspaceId: context.workspaceId
                        })).objectMetadataId;
                        resolvedConfiguration = (0, _resolvewidgetfieldnamestometadataidsutil.resolveConfigurationFieldNamesToIds)(configuration, objectMetadataIdForFields, identifierMaps);
                    }
                }
                const updateData = Object.fromEntries(Object.entries({
                    ...rest,
                    objectMetadataId: resolvedObjectMetadataId,
                    configuration: resolvedConfiguration
                }).filter(([key, value])=>{
                    if (!(0, _utils.isDefined)(value)) {
                        return false;
                    }
                    if (key === 'configuration' && (0, _utils.isEmptyObject)(value)) {
                        return false;
                    }
                    return true;
                }));
                const widget = await deps.pageLayoutWidgetService.update({
                    id: widgetId,
                    workspaceId: context.workspaceId,
                    updateData
                });
                return {
                    success: true,
                    message: `Widget "${widget.title}" updated`,
                    result: {
                        widgetId: widget.id,
                        title: widget.title,
                        type: widget.type,
                        position: widget.position,
                        configuration: widget.configuration
                    }
                };
            } catch (error) {
                return {
                    success: false,
                    message: `Failed to update widget: ${error.message}`,
                    error: error.message
                };
            }
        }
    });

//# sourceMappingURL=update-dashboard-widget.tool.js.map