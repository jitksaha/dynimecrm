"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkflowSchemaWorkspaceService", {
    enumerable: true,
    get: function() {
        return WorkflowSchemaWorkspaceService;
    }
});
const _common = require("@nestjs/common");
const _guards = require("@sniptt/guards");
const _logicfunction = require("twenty-shared/logic-function");
const _utils = require("twenty-shared/utils");
const _workflow = require("twenty-shared/workflow");
const _checkstringisdatabaseeventaction = require("../../../../engine/api/graphql/graphql-query-runner/utils/check-string-is-database-event-action");
const _workspacemanyorallflatentitymapscacheservice = require("../../../../engine/metadata-modules/flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.service");
const _findflatentitybyidinflatentitymapsutil = require("../../../../engine/metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util");
const _generatefakevalue = require("../../../../engine/utils/generate-fake-value");
const _workflowcommonworkspaceservice = require("../../common/workspace-services/workflow-common.workspace-service");
const _defaultiteratorcurrentitemconst = require("./constants/default-iterator-current-item.const");
const _extractpropertypathfromvariable = require("./utils/extract-property-path-from-variable");
const _generatefakearrayitem = require("./utils/generate-fake-array-item");
const _generatefakeformresponse = require("./utils/generate-fake-form-response");
const _generatefakeobjectrecord = require("./utils/generate-fake-object-record");
const _generatefakeobjectrecordevent = require("./utils/generate-fake-object-record-event");
const _inferarrayitemschema = require("./utils/infer-array-item-schema");
const _workflowtriggertype = require("../../workflow-trigger/types/workflow-trigger.type");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let WorkflowSchemaWorkspaceService = class WorkflowSchemaWorkspaceService {
    async computeStepOutputSchema({ step, workspaceId, workflowVersionId }) {
        const stepType = step.type;
        switch(stepType){
            case _workflowtriggertype.WorkflowTriggerType.DATABASE_EVENT:
                {
                    return this.computeDatabaseEventTriggerOutputSchema({
                        eventName: step.settings.eventName,
                        workspaceId
                    });
                }
            case _workflowtriggertype.WorkflowTriggerType.MANUAL:
                {
                    const { availability } = step.settings;
                    if ((0, _utils.isDefined)(availability)) {
                        return this.computeTriggerOutputSchemaFromAvailability({
                            availability,
                            workspaceId
                        });
                    }
                    return {};
                }
            case _workflowtriggertype.WorkflowTriggerType.CRON:
                {
                    return {};
                }
            case _workflow.WorkflowActionType.SEND_EMAIL:
                {
                    return this.computeSendEmailActionOutputSchema();
                }
            case _workflow.WorkflowActionType.CREATE_RECORD:
            case _workflow.WorkflowActionType.UPDATE_RECORD:
            case _workflow.WorkflowActionType.DELETE_RECORD:
            case _workflow.WorkflowActionType.UPSERT_RECORD:
            case _workflow.WorkflowActionType.PICK_RECORD:
                return this.computeRecordOutputSchema({
                    objectType: step.settings.input.objectName,
                    workspaceId
                });
            case _workflow.WorkflowActionType.FIND_RECORDS:
                return this.computeFindRecordsOutputSchema({
                    objectType: step.settings.input.objectName,
                    workspaceId
                });
            case _workflow.WorkflowActionType.FORM:
                return this.computeFormActionOutputSchema({
                    formFieldMetadataItems: step.settings.input,
                    workspaceId
                });
            case _workflow.WorkflowActionType.ITERATOR:
                {
                    const items = step.settings.input.items;
                    return {
                        currentItem: await this.computeLoopCurrentItemOutputSchema({
                            items,
                            workspaceId,
                            workflowVersionId
                        }),
                        currentItemIndex: {
                            label: 'Current Item Index',
                            isLeaf: true,
                            type: 'number',
                            value: (0, _generatefakevalue.generateFakeValue)('number')
                        },
                        hasProcessedAllItems: {
                            label: 'Has Processed All Items',
                            isLeaf: true,
                            type: 'boolean',
                            value: false
                        }
                    };
                }
            case _workflow.WorkflowActionType.AI_AGENT:
                {
                    return this.computeAiAgentActionOutputSchema({
                        agentId: step.settings.input.agentId,
                        workspaceId
                    });
                }
            case _workflowtriggertype.WorkflowTriggerType.WEBHOOK:
            case _workflow.WorkflowActionType.CODE:
            case _workflow.WorkflowActionType.HTTP_REQUEST:
                {
                    const expectedOutputSchema = 'expectedOutputSchema' in step.settings ? step.settings.expectedOutputSchema : undefined;
                    return this.computeOutputSchemaFromExpectedSample(expectedOutputSchema);
                }
            case _workflow.WorkflowActionType.LOGIC_FUNCTION:
                {
                    return this.computeLogicFunctionOutputSchema({
                        logicFunctionId: step.settings.input.logicFunctionId,
                        expectedOutputSchema: step.settings.expectedOutputSchema,
                        workspaceId
                    });
                }
            default:
                return {};
        }
    }
    async enrichOutputSchema({ step, workspaceId, workflowVersionId }) {
        const BACKEND_ENRICHED_TYPES = [
            _workflow.WorkflowActionType.ITERATOR,
            _workflow.WorkflowActionType.AI_AGENT
        ];
        if (!BACKEND_ENRICHED_TYPES.includes(step.type)) {
            return step;
        }
        const result = {
            ...step
        };
        const outputSchema = await this.computeStepOutputSchema({
            step,
            workspaceId,
            workflowVersionId
        });
        result.settings = {
            ...result.settings,
            outputSchema: outputSchema || {}
        };
        return result;
    }
    computeOutputSchemaFromExpectedSample(expectedOutputSchema) {
        if ((0, _utils.isDefined)(expectedOutputSchema) && Object.keys(expectedOutputSchema).length > 0) {
            return (0, _logicfunction.getOutputSchemaFromValue)(expectedOutputSchema);
        }
        return {};
    }
    getOutputSchemaWithExpectedFallback(settings) {
        const outputSchema = settings.outputSchema;
        if ((0, _workflow.isBaseOutputSchemaV2)(outputSchema)) {
            return outputSchema;
        }
        const expectedOutputSchema = this.computeOutputSchemaFromExpectedSample(settings.expectedOutputSchema);
        return (0, _workflow.isBaseOutputSchemaV2)(expectedOutputSchema) ? expectedOutputSchema : {};
    }
    async computeLogicFunctionOutputSchema({ logicFunctionId, expectedOutputSchema, workspaceId }) {
        const declaredOutputSchema = await this.getLogicFunctionDeclaredOutputSchema({
            logicFunctionId,
            workspaceId
        });
        if ((0, _utils.isDefined)(declaredOutputSchema)) {
            return declaredOutputSchema;
        }
        return this.computeOutputSchemaFromExpectedSample(expectedOutputSchema);
    }
    async getLogicFunctionDeclaredOutputSchema({ logicFunctionId, workspaceId }) {
        if (!(0, _utils.isDefined)(logicFunctionId)) {
            return undefined;
        }
        const { flatLogicFunctionMaps } = await this.flatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
            workspaceId,
            flatMapsKeys: [
                'flatLogicFunctionMaps'
            ]
        });
        const flatLogicFunction = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
            flatEntityId: logicFunctionId,
            flatEntityMaps: flatLogicFunctionMaps
        });
        const declaredInputSchema = flatLogicFunction?.workflowActionTriggerSettings?.outputSchema;
        if (!(0, _utils.isDefined)(declaredInputSchema)) {
            return undefined;
        }
        const declaredOutputSchema = (0, _logicfunction.inputSchemaToOutputSchema)(declaredInputSchema);
        if (Object.keys(declaredOutputSchema).length === 0) {
            return undefined;
        }
        return declaredOutputSchema;
    }
    async computeDatabaseEventTriggerOutputSchema({ eventName, workspaceId }) {
        const [nameSingular, action] = eventName.split('.');
        if (!(0, _checkstringisdatabaseeventaction.checkStringIsDatabaseEventAction)(action)) {
            return {};
        }
        const objectMetadataInfo = await this.workflowCommonWorkspaceService.getObjectMetadataInfo(nameSingular, workspaceId);
        return (0, _generatefakeobjectrecordevent.generateFakeObjectRecordEvent)(objectMetadataInfo, action);
    }
    async computeFindRecordsOutputSchema({ objectType, workspaceId }) {
        const recordOutputSchema = await this.computeRecordOutputSchema({
            objectType,
            workspaceId
        });
        const objectMetadataInfo = await this.workflowCommonWorkspaceService.getObjectMetadataInfo(objectType, workspaceId);
        const first = {
            isLeaf: false,
            label: `First ${objectMetadataInfo.flatObjectMetadata.labelSingular ?? 'Record'}`,
            icon: 'IconAlpha',
            type: 'object',
            value: recordOutputSchema
        };
        const all = {
            isLeaf: true,
            label: `All ${objectMetadataInfo.flatObjectMetadata.labelPlural ?? 'Records'}`,
            type: 'array',
            icon: 'IconListDetails',
            value: 'Returns an array of records'
        };
        const totalCount = {
            isLeaf: true,
            label: 'Total Count',
            icon: 'IconSum',
            type: 'number',
            value: 'Count of matching records'
        };
        return {
            first,
            all,
            totalCount
        };
    }
    async computeRecordOutputSchema({ objectType, workspaceId }) {
        const objectMetadataInfo = await this.workflowCommonWorkspaceService.getObjectMetadataInfo(objectType, workspaceId);
        return (0, _generatefakeobjectrecord.generateFakeObjectRecord)({
            objectMetadataInfo
        });
    }
    computeSendEmailActionOutputSchema() {
        return {
            success: {
                isLeaf: true,
                type: 'boolean',
                value: true
            },
            headerMessageId: {
                isLeaf: true,
                type: 'string',
                label: 'Message-ID header',
                value: '<message-id@mail.example.com>'
            },
            messageId: {
                isLeaf: true,
                type: 'string',
                label: 'Message record ID',
                value: ''
            },
            messageThreadId: {
                isLeaf: true,
                type: 'string',
                label: 'Message thread ID',
                value: ''
            }
        };
    }
    async computeAiAgentActionOutputSchema({ agentId, workspaceId }) {
        const textResponseOutputSchema = {
            response: {
                label: 'Response',
                isLeaf: true,
                type: 'string',
                value: 'Response of the agent'
            }
        };
        if (!(0, _utils.isDefined)(agentId)) {
            return textResponseOutputSchema;
        }
        const { flatAgentMaps } = await this.flatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
            workspaceId,
            flatMapsKeys: [
                'flatAgentMaps'
            ]
        });
        const flatAgent = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
            flatEntityId: agentId,
            flatEntityMaps: flatAgentMaps
        });
        const responseFormat = flatAgent?.responseFormat;
        if (responseFormat?.type !== 'json') {
            return textResponseOutputSchema;
        }
        return Object.entries(responseFormat.schema.properties || {}).reduce((outputSchema, [propertyName, property])=>{
            outputSchema[propertyName] = {
                isLeaf: true,
                type: property.type,
                label: propertyName,
                ...(0, _utils.isDefined)(property.description) ? {
                    description: property.description
                } : {},
                value: (0, _generatefakevalue.generateFakeValue)(property.type)
            };
            return outputSchema;
        }, {});
    }
    async computeFormActionOutputSchema({ formFieldMetadataItems, workspaceId }) {
        const { flatObjectMetadataMaps, flatFieldMetadataMaps, objectIdByNameSingular } = await this.workflowCommonWorkspaceService.getFlatEntityMaps(workspaceId);
        return (0, _generatefakeformresponse.generateFakeFormResponse)({
            formFieldMetadataItems,
            flatObjectMetadataMaps,
            flatFieldMetadataMaps,
            objectIdByNameSingular
        });
    }
    async computeTriggerOutputSchemaFromAvailability({ availability, workspaceId }) {
        if (availability.type === 'GLOBAL') {
            return {
                [_workflow.WORKFLOW_TRIGGER_METADATA_KEY]: (0, _workflow.buildManualTriggerMetadataNode)()
            };
        }
        if (availability.type === 'SINGLE_RECORD') {
            const recordOutputSchema = await this.computeRecordOutputSchema({
                objectType: availability.objectNameSingular,
                workspaceId
            });
            const payload = {
                isLeaf: false,
                type: 'object',
                label: _workflow.WORKFLOW_TRIGGER_RECORD_LABEL,
                value: recordOutputSchema
            };
            return {
                [_workflow.WORKFLOW_TRIGGER_PAYLOAD_KEY]: payload,
                [_workflow.WORKFLOW_TRIGGER_METADATA_KEY]: (0, _workflow.buildManualTriggerMetadataNode)()
            };
        }
        if (availability.type === 'BULK_RECORDS') {
            const objectMetadataInfo = await this.workflowCommonWorkspaceService.getObjectMetadataInfo(availability.objectNameSingular, workspaceId);
            const payload = {
                isLeaf: false,
                type: 'object',
                label: _workflow.WORKFLOW_TRIGGER_RECORDS_LABEL,
                value: {
                    [objectMetadataInfo.flatObjectMetadata.namePlural]: {
                        label: objectMetadataInfo.flatObjectMetadata.labelPlural,
                        isLeaf: true,
                        type: 'array',
                        value: 'Array of ' + objectMetadataInfo.flatObjectMetadata.labelPlural
                    }
                }
            };
            return {
                [_workflow.WORKFLOW_TRIGGER_PAYLOAD_KEY]: payload,
                [_workflow.WORKFLOW_TRIGGER_METADATA_KEY]: (0, _workflow.buildManualTriggerMetadataNode)()
            };
        }
        return {};
    }
    async computeLoopCurrentItemOutputSchema({ items, workspaceId, workflowVersionId }) {
        if (!(0, _utils.isDefined)(items)) {
            return _defaultiteratorcurrentitemconst.DEFAULT_ITERATOR_CURRENT_ITEM;
        }
        if ((0, _guards.isString)(items) && (0, _utils.isValidVariable)(items)) {
            return this.computeIteratorCurrentItemFromVariable({
                items,
                workspaceId,
                workflowVersionId
            });
        }
        return (0, _generatefakearrayitem.generateFakeArrayItem)({
            items
        });
    }
    async computeIteratorCurrentItemFromVariable({ items, workspaceId, workflowVersionId }) {
        if (!(0, _utils.isDefined)(workflowVersionId)) {
            return _defaultiteratorcurrentitemconst.DEFAULT_ITERATOR_CURRENT_ITEM;
        }
        const workflowVersion = await this.workflowCommonWorkspaceService.getWorkflowVersionOrFail({
            workflowVersionId,
            workspaceId
        });
        const stepId = (0, _workflow.extractRawVariableNamePart)({
            rawVariableName: items,
            part: 'stepId'
        });
        if (stepId === _workflow.TRIGGER_STEP_ID) {
            const trigger = workflowVersion.trigger;
            if (!(0, _utils.isDefined)(trigger)) {
                return _defaultiteratorcurrentitemconst.DEFAULT_ITERATOR_CURRENT_ITEM;
            }
            switch(trigger.type){
                case _workflowtriggertype.WorkflowTriggerType.MANUAL:
                    {
                        if (trigger.settings.availability?.type === 'BULK_RECORDS') {
                            const objectMetadataInfo = await this.workflowCommonWorkspaceService.getObjectMetadataInfo(trigger.settings.availability.objectNameSingular, workspaceId);
                            return {
                                label: 'Current Item (' + objectMetadataInfo.flatObjectMetadata.labelSingular + ')',
                                isLeaf: false,
                                type: 'object',
                                value: await this.computeRecordOutputSchema({
                                    objectType: trigger.settings.availability.objectNameSingular,
                                    workspaceId
                                })
                            };
                        }
                        return _defaultiteratorcurrentitemconst.DEFAULT_ITERATOR_CURRENT_ITEM;
                    }
                case _workflowtriggertype.WorkflowTriggerType.WEBHOOK:
                    {
                        const propertyPath = (0, _extractpropertypathfromvariable.extractPropertyPathFromVariable)(items);
                        const schemaNode = (0, _workflow.navigateOutputSchemaProperty)({
                            schema: trigger.settings.outputSchema,
                            propertyPath
                        });
                        if (!(0, _utils.isDefined)(schemaNode)) {
                            return _defaultiteratorcurrentitemconst.DEFAULT_ITERATOR_CURRENT_ITEM;
                        }
                        return (0, _inferarrayitemschema.inferArrayItemSchema)({
                            schemaNode
                        });
                    }
                default:
                    {
                        return _defaultiteratorcurrentitemconst.DEFAULT_ITERATOR_CURRENT_ITEM;
                    }
            }
        }
        const step = workflowVersion.steps?.find((step)=>step.id === stepId);
        if (!(0, _utils.isDefined)(step)) {
            return _defaultiteratorcurrentitemconst.DEFAULT_ITERATOR_CURRENT_ITEM;
        }
        switch(step.type){
            case _workflow.WorkflowActionType.FIND_RECORDS:
                {
                    const objectMetadataInfo = await this.workflowCommonWorkspaceService.getObjectMetadataInfo(step.settings.input.objectName, workspaceId);
                    return {
                        label: 'Current Item (' + objectMetadataInfo.flatObjectMetadata.labelSingular + ')',
                        isLeaf: false,
                        type: 'object',
                        value: await this.computeRecordOutputSchema({
                            objectType: step.settings.input.objectName,
                            workspaceId
                        })
                    };
                }
            case _workflow.WorkflowActionType.CODE:
            case _workflow.WorkflowActionType.HTTP_REQUEST:
            case _workflow.WorkflowActionType.LOGIC_FUNCTION:
                {
                    const propertyPath = (0, _extractpropertypathfromvariable.extractPropertyPathFromVariable)(items);
                    const outputSchema = this.getOutputSchemaWithExpectedFallback(step.settings);
                    const variableTargetsWholeStepOutput = propertyPath.length === 0;
                    if (variableTargetsWholeStepOutput) {
                        if (!(0, _workflow.isFlattenedArrayOutputSchema)(outputSchema)) {
                            return _defaultiteratorcurrentitemconst.DEFAULT_ITERATOR_CURRENT_ITEM;
                        }
                        return (0, _workflow.getCurrentItemSchemaFromFlattenedArrayOutputSchema)({
                            schema: outputSchema
                        }) ?? _defaultiteratorcurrentitemconst.DEFAULT_ITERATOR_CURRENT_ITEM;
                    }
                    const schemaNode = (0, _workflow.navigateOutputSchemaProperty)({
                        schema: outputSchema,
                        propertyPath
                    });
                    if (!(0, _utils.isDefined)(schemaNode)) {
                        return _defaultiteratorcurrentitemconst.DEFAULT_ITERATOR_CURRENT_ITEM;
                    }
                    return (0, _inferarrayitemschema.inferArrayItemSchema)({
                        schemaNode
                    });
                }
            default:
                {
                    return _defaultiteratorcurrentitemconst.DEFAULT_ITERATOR_CURRENT_ITEM;
                }
        }
    }
    constructor(workflowCommonWorkspaceService, flatEntityMapsCacheService){
        this.workflowCommonWorkspaceService = workflowCommonWorkspaceService;
        this.flatEntityMapsCacheService = flatEntityMapsCacheService;
        this.logger = new _common.Logger(WorkflowSchemaWorkspaceService.name);
    }
};
WorkflowSchemaWorkspaceService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workflowcommonworkspaceservice.WorkflowCommonWorkspaceService === "undefined" ? Object : _workflowcommonworkspaceservice.WorkflowCommonWorkspaceService,
        typeof _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService === "undefined" ? Object : _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService
    ])
], WorkflowSchemaWorkspaceService);

//# sourceMappingURL=workflow-schema.workspace-service.js.map