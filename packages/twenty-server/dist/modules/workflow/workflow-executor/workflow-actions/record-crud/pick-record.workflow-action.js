"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PickRecordWorkflowAction", {
    enumerable: true,
    get: function() {
        return PickRecordWorkflowAction;
    }
});
const _common = require("@nestjs/common");
const _guards = require("@sniptt/guards");
const _utils = require("twenty-shared/utils");
const _cachestoragedecorator = require("../../../../../engine/core-modules/cache-storage/decorators/cache-storage.decorator");
const _cachestorageservice = require("../../../../../engine/core-modules/cache-storage/services/cache-storage.service");
const _cachestoragenamespaceenum = require("../../../../../engine/core-modules/cache-storage/types/cache-storage-namespace.enum");
const _findrecordsservice = require("../../../../../engine/core-modules/record-crud/services/find-records.service");
const _groupbyrecordsservice = require("../../../../../engine/core-modules/record-crud/services/group-by-records.service");
const _workflowstepexecutorexception = require("../../exceptions/workflow-step-executor.exception");
const _workflowexecutioncontextservice = require("../../services/workflow-execution-context.service");
const _findsteporthrowutil = require("../../utils/find-step-or-throw.util");
const _isworkflowpickrecordactionguard = require("./guards/is-workflow-pick-record-action.guard");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
const ROUND_ROBIN_CURSOR_TTL_MS = 1000 * 60 * 60 * 24 * 90;
let PickRecordWorkflowAction = class PickRecordWorkflowAction {
    async execute({ currentStepId, steps, context, runInfo }) {
        const step = (0, _findsteporthrowutil.findStepOrThrow)({
            steps,
            stepId: currentStepId
        });
        if (!(0, _isworkflowpickrecordactionguard.isWorkflowPickRecordAction)(step)) {
            throw new _workflowstepexecutorexception.WorkflowStepExecutorException('Step is not a pick record action', _workflowstepexecutorexception.WorkflowStepExecutorExceptionCode.INVALID_STEP_TYPE);
        }
        const { objectName, strategy, recordIds, loadBalance } = (0, _utils.resolveInput)(step.settings.input, context);
        if (!(0, _guards.isNonEmptyString)(objectName) || !Array.isArray(recordIds)) {
            return {
                error: 'Pick record action received invalid input'
            };
        }
        if (recordIds.length === 0) {
            return {
                error: 'Pick record action has no candidate records'
            };
        }
        const executionContext = await this.workflowExecutionContextService.getExecutionContext(runInfo);
        const findRecordsOutput = await this.findRecordsService.execute({
            objectName,
            filter: {
                id: {
                    in: recordIds
                }
            },
            authContext: executionContext.authContext,
            rolePermissionConfig: executionContext.rolePermissionConfig,
            shouldBuildEffectiveSelectFields: false
        });
        if (!findRecordsOutput.success) {
            return {
                error: findRecordsOutput.error || findRecordsOutput.message
            };
        }
        const candidateRecords = findRecordsOutput.result?.records ?? [];
        if (candidateRecords.length === 0) {
            return {
                error: 'Pick record action could not find any of the candidate records'
            };
        }
        const orderedRecords = [
            ...candidateRecords
        ].sort((recordA, recordB)=>String(recordA.id).localeCompare(String(recordB.id)));
        if (strategy === 'LOAD_BALANCED') {
            if (!(0, _utils.isDefined)(loadBalance)) {
                return {
                    error: 'Pick record action is missing its load balancing configuration'
                };
            }
            const leastLoadedResult = await this.getLeastLoadedIndex({
                orderedRecords,
                loadBalance,
                executionContext
            });
            if ('error' in leastLoadedResult) {
                return {
                    error: leastLoadedResult.error
                };
            }
            return {
                result: orderedRecords[leastLoadedResult.index]
            };
        }
        const pickedIndex = await this.getPickedIndex({
            strategy,
            candidateCount: orderedRecords.length,
            workspaceId: runInfo.workspaceId,
            stepId: currentStepId
        });
        return {
            result: orderedRecords[pickedIndex]
        };
    }
    async getLeastLoadedIndex({ orderedRecords, loadBalance, executionContext }) {
        const candidateIds = orderedRecords.map((record)=>String(record.id));
        const groupByOutput = await this.groupByRecordsService.execute({
            objectName: loadBalance.objectNameSingular,
            groupBy: [
                {
                    [loadBalance.fieldName]: {
                        id: true
                    }
                }
            ],
            filter: {
                [loadBalance.fieldName]: {
                    id: {
                        in: candidateIds
                    }
                }
            },
            authContext: executionContext.authContext,
            rolePermissionConfig: executionContext.rolePermissionConfig
        });
        if (!groupByOutput.success) {
            return {
                error: groupByOutput.error || groupByOutput.message || 'Pick record action failed to count related records'
            };
        }
        const countByCandidateId = new Map();
        for (const group of groupByOutput.result?.groups ?? []){
            const candidateId = group.dimensions[0];
            if ((0, _utils.isDefined)(candidateId)) {
                countByCandidateId.set(String(candidateId), Number(group.value ?? 0));
            }
        }
        let leastLoadedIndex = 0;
        let leastLoadedCount = countByCandidateId.get(candidateIds[0]) ?? 0;
        for(let index = 1; index < candidateIds.length; index++){
            const candidateCount = countByCandidateId.get(candidateIds[index]) ?? 0;
            if (candidateCount < leastLoadedCount) {
                leastLoadedIndex = index;
                leastLoadedCount = candidateCount;
            }
        }
        return {
            index: leastLoadedIndex
        };
    }
    async getPickedIndex({ strategy, candidateCount, workspaceId, stepId }) {
        if (strategy === 'ROUND_ROBIN') {
            const cursorKey = `pick-record:round-robin:${workspaceId}:${stepId}`;
            const nextCursor = await this.cacheStorageService.incrBy(cursorKey, 1);
            await this.cacheStorageService.expire(cursorKey, ROUND_ROBIN_CURSOR_TTL_MS);
            return (nextCursor - 1) % candidateCount;
        }
        return Math.floor(Math.random() * candidateCount);
    }
    constructor(findRecordsService, groupByRecordsService, workflowExecutionContextService, cacheStorageService){
        this.findRecordsService = findRecordsService;
        this.groupByRecordsService = groupByRecordsService;
        this.workflowExecutionContextService = workflowExecutionContextService;
        this.cacheStorageService = cacheStorageService;
    }
};
PickRecordWorkflowAction = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(3, (0, _cachestoragedecorator.InjectCacheStorage)(_cachestoragenamespaceenum.CacheStorageNamespace.ModuleWorkflow)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _findrecordsservice.FindRecordsService === "undefined" ? Object : _findrecordsservice.FindRecordsService,
        typeof _groupbyrecordsservice.GroupByRecordsService === "undefined" ? Object : _groupbyrecordsservice.GroupByRecordsService,
        typeof _workflowexecutioncontextservice.WorkflowExecutionContextService === "undefined" ? Object : _workflowexecutioncontextservice.WorkflowExecutionContextService,
        typeof _cachestorageservice.CacheStorageService === "undefined" ? Object : _cachestorageservice.CacheStorageService
    ])
], PickRecordWorkflowAction);

//# sourceMappingURL=pick-record.workflow-action.js.map