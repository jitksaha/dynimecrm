"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CodeStepBuildService", {
    enumerable: true,
    get: function() {
        return CodeStepBuildService;
    }
});
const _common = require("@nestjs/common");
const _logicfunction = require("twenty-shared/logic-function");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _featureflagservice = require("../../../../../../engine/core-modules/feature-flag/services/feature-flag.service");
const _workspacemanyorallflatentitymapscacheservice = require("../../../../../../engine/metadata-modules/flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.service");
const _findflatentitybyidinflatentitymapsutil = require("../../../../../../engine/metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util");
const _logicfunctionentity = require("../../../../../../engine/metadata-modules/logic-function/logic-function.entity");
const _logicfunctionfromsourcehelperservice = require("../../../../../../engine/metadata-modules/logic-function/services/logic-function-from-source-helper.service");
const _logicfunctionfromsourceservice = require("../../../../../../engine/metadata-modules/logic-function/services/logic-function-from-source.service");
const _extractcodesteplogicfunctionidsfromworkflowstepsutil = require("../utils/extract-code-step-logic-function-ids-from-workflow-steps.util");
const _workflowtriggerexception = require("../../../../workflow-trigger/exceptions/workflow-trigger.exception");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let CodeStepBuildService = class CodeStepBuildService {
    async createCodeStepLogicFunction({ logicFunctionId, workspaceId }) {
        return await this.logicFunctionFromSourceService.createOneFromSource({
            input: {
                id: logicFunctionId,
                name: 'A Code Step',
                description: '',
                workflowActionTriggerSettings: _logicfunction.SEED_WORKFLOW_ACTION_TRIGGER_SETTINGS
            },
            workspaceId
        });
    }
    async duplicateCodeStepLogicFunction({ existingLogicFunctionId, workspaceId }) {
        return this.logicFunctionFromSourceService.duplicateOneWithSource({
            existingLogicFunctionId,
            workspaceId
        });
    }
    async buildCodeStepsFromSourceForSteps({ workspaceId, steps }) {
        const logicFunctionIds = (0, _extractcodesteplogicfunctionidsfromworkflowstepsutil.extractCodeStepLogicFunctionIdsFromWorkflowSteps)(steps);
        if (logicFunctionIds.length === 0) {
            return;
        }
        const { flatLogicFunctionMaps, flatApplicationMaps } = await this.workspaceManyOrAllFlatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
            workspaceId,
            flatMapsKeys: [
                'flatLogicFunctionMaps',
                'flatApplicationMaps'
            ]
        });
        for (const logicFunctionId of logicFunctionIds){
            const flatLogicFunction = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
                flatEntityId: logicFunctionId,
                flatEntityMaps: flatLogicFunctionMaps
            });
            if (!(0, _utils.isDefined)(flatLogicFunction) || flatLogicFunction.deletedAt || flatLogicFunction.isBuildUpToDate) {
                continue;
            }
            const applicationUniversalIdentifier = (0, _utils.isDefined)(flatLogicFunction.applicationId) ? flatApplicationMaps.byId[flatLogicFunction.applicationId]?.universalIdentifier : undefined;
            if (!(0, _utils.isDefined)(applicationUniversalIdentifier)) {
                this.logger.warn(`Skipping build for logic function '${logicFunctionId}' (workspace=${workspaceId}): ` + `applicationId=${flatLogicFunction.applicationId ?? 'null'} did not resolve to an application. ` + `The function will not be rebuilt and may stay out of date.`);
                continue;
            }
            await this.logicFunctionFromSourceService.buildOneFromSource({
                workspaceId,
                id: logicFunctionId
            });
        }
    }
    async switchCodeStepLogicFunctionsToPrebuilt({ workspaceId, steps }) {
        const isPrebuiltModeEnabled = await this.featureFlagService.isFeatureEnabled(_types.FeatureFlagKey.IS_LOGIC_FUNCTION_PREBUILT_MODE_ENABLED, workspaceId);
        if (!isPrebuiltModeEnabled) {
            return;
        }
        const logicFunctionIds = (0, _extractcodesteplogicfunctionidsfromworkflowstepsutil.extractCodeStepLogicFunctionIdsFromWorkflowSteps)(steps);
        if (logicFunctionIds.length === 0) {
            return;
        }
        const { flatLogicFunctionMaps, flatApplicationMaps } = await this.workspaceManyOrAllFlatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
            workspaceId,
            flatMapsKeys: [
                'flatLogicFunctionMaps',
                'flatApplicationMaps'
            ]
        });
        for (const logicFunctionId of logicFunctionIds){
            const flatLogicFunction = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
                flatEntityId: logicFunctionId,
                flatEntityMaps: flatLogicFunctionMaps
            });
            if (!(0, _utils.isDefined)(flatLogicFunction) || (0, _utils.isDefined)(flatLogicFunction.deletedAt)) {
                throw new _workflowtriggerexception.WorkflowTriggerException(`CODE step references logic function '${logicFunctionId}' that is missing or deleted`, _workflowtriggerexception.WorkflowTriggerExceptionCode.INVALID_WORKFLOW_VERSION);
            }
            if (!flatLogicFunction.isBuildUpToDate || !(0, _utils.isDefined)(flatLogicFunction.checksum)) {
                throw new _workflowtriggerexception.WorkflowTriggerException(`Logic function '${logicFunctionId}' has no fresh build or checksum after the build step`, _workflowtriggerexception.WorkflowTriggerExceptionCode.INTERNAL_ERROR);
            }
            if (flatLogicFunction.executionMode === _logicfunctionentity.LogicFunctionExecutionMode.PREBUILT) {
                continue;
            }
            const applicationUniversalIdentifier = (0, _utils.isDefined)(flatLogicFunction.applicationId) ? flatApplicationMaps.byId[flatLogicFunction.applicationId]?.universalIdentifier : undefined;
            if (!(0, _utils.isDefined)(applicationUniversalIdentifier)) {
                throw new _workflowtriggerexception.WorkflowTriggerException(`Logic function '${logicFunctionId}' references applicationId='${flatLogicFunction.applicationId ?? 'null'}' that did not resolve to an application`, _workflowtriggerexception.WorkflowTriggerExceptionCode.INTERNAL_ERROR);
            }
            await this.logicFunctionFromSourceHelperService.updateOneFromMetadata({
                flatLogicFunctionToUpdate: {
                    ...flatLogicFunction,
                    executionMode: _logicfunctionentity.LogicFunctionExecutionMode.PREBUILT,
                    updatedAt: new Date().toISOString()
                },
                workspaceId,
                applicationUniversalIdentifier
            });
        }
    }
    constructor(workspaceManyOrAllFlatEntityMapsCacheService, logicFunctionFromSourceService, logicFunctionFromSourceHelperService, featureFlagService){
        this.workspaceManyOrAllFlatEntityMapsCacheService = workspaceManyOrAllFlatEntityMapsCacheService;
        this.logicFunctionFromSourceService = logicFunctionFromSourceService;
        this.logicFunctionFromSourceHelperService = logicFunctionFromSourceHelperService;
        this.featureFlagService = featureFlagService;
        this.logger = new _common.Logger(CodeStepBuildService.name);
    }
};
CodeStepBuildService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService === "undefined" ? Object : _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService,
        typeof _logicfunctionfromsourceservice.LogicFunctionFromSourceService === "undefined" ? Object : _logicfunctionfromsourceservice.LogicFunctionFromSourceService,
        typeof _logicfunctionfromsourcehelperservice.LogicFunctionFromSourceHelperService === "undefined" ? Object : _logicfunctionfromsourcehelperservice.LogicFunctionFromSourceHelperService,
        typeof _featureflagservice.FeatureFlagService === "undefined" ? Object : _featureflagservice.FeatureFlagService
    ])
], CodeStepBuildService);

//# sourceMappingURL=code-step-build.service.js.map