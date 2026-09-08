"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ToolExecutorService", {
    enumerable: true,
    get: function() {
        return ToolExecutorService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _logicfunctionexecutorservice = require("../../logic-function/logic-function-executor/logic-function-executor.service");
const _createmanyrecordsservice = require("../../record-crud/services/create-many-records.service");
const _createrecordservice = require("../../record-crud/services/create-record.service");
const _deletemanyrecordsservice = require("../../record-crud/services/delete-many-records.service");
const _deleterecordservice = require("../../record-crud/services/delete-record.service");
const _findrecordsservice = require("../../record-crud/services/find-records.service");
const _groupbyrecordsservice = require("../../record-crud/services/group-by-records.service");
const _updatemanyrecordsservice = require("../../record-crud/services/update-many-records.service");
const _updaterecordservice = require("../../record-crud/services/update-record.service");
const _upsertmanyrecordsservice = require("../../record-crud/services/upsert-many-records.service");
const _toolproviderstoken = require("../constants/tool-providers.token");
const _recordfilesresolverservice = require("./record-files-resolver.service");
const _buildrequiredtoolauthcontextutil = require("../utils/build-required-tool-auth-context.util");
const _withresolvedtoolauthcontextutil = require("../utils/with-resolved-tool-auth-context.util");
const _userworkspaceentity = require("../../user-workspace/user-workspace.entity");
const _userentity = require("../../user/user.entity");
const _workspacecacheservice = require("../../../workspace-cache/services/workspace-cache.service");
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
let ToolExecutorService = class ToolExecutorService {
    async dispatch(descriptor, args, context) {
        const safeArgs = args ?? {};
        return (0, _withresolvedtoolauthcontextutil.withResolvedToolAuthContext)({
            context,
            userRepository: this.userRepository,
            userWorkspaceRepository: this.userWorkspaceRepository,
            workspaceCacheService: this.workspaceCacheService
        }, (contextWithAuth)=>this.dispatchByExecutionRef(descriptor, safeArgs, contextWithAuth));
    }
    async dispatchByExecutionRef(descriptor, args, context) {
        switch(descriptor.executionRef.kind){
            case 'database_crud':
                return this.dispatchDatabaseCrud(descriptor.executionRef, args, context);
            case 'static':
                return this.dispatchStaticTool(descriptor, args, context);
            case 'logic_function':
                return this.dispatchLogicFunction(descriptor.executionRef, args, context);
        }
    }
    async dispatchDatabaseCrud(ref, args, context) {
        const authContext = context.authContext ?? await (0, _buildrequiredtoolauthcontextutil.buildRequiredToolAuthContext)({
            context,
            userRepository: this.userRepository,
            userWorkspaceRepository: this.userWorkspaceRepository,
            workspaceCacheService: this.workspaceCacheService
        });
        switch(ref.operation){
            case 'find_many':
                {
                    const { limit, offset, orderBy, select, ...filter } = args;
                    return this.findRecordsService.execute({
                        objectName: ref.objectNameSingular,
                        filter,
                        orderBy: orderBy,
                        limit: limit,
                        offset: offset,
                        select: select,
                        shouldBuildEffectiveSelectFields: true,
                        authContext,
                        rolePermissionConfig: context.rolePermissionConfig
                    });
                }
            case 'find_one':
                {
                    const { select, id } = args;
                    return this.findRecordsService.execute({
                        objectName: ref.objectNameSingular,
                        filter: {
                            id: {
                                eq: id
                            }
                        },
                        limit: 1,
                        select: select,
                        shouldBuildEffectiveSelectFields: (0, _utils.isDefined)(select),
                        authContext,
                        rolePermissionConfig: context.rolePermissionConfig
                    });
                }
            case 'create_one':
                {
                    const { records, notes } = await this.recordFilesResolverService.resolveRecordsInput({
                        objectNameSingular: ref.objectNameSingular,
                        records: [
                            args
                        ],
                        workspaceId: context.workspaceId
                    });
                    const output = await this.createRecordService.execute({
                        objectName: ref.objectNameSingular,
                        objectRecord: records[0],
                        authContext,
                        rolePermissionConfig: context.rolePermissionConfig,
                        createdBy: context.actorContext,
                        slimResponse: true
                    });
                    return this.appendFileResolutionNotes(output, notes);
                }
            case 'create_many':
                {
                    const { records, notes } = await this.recordFilesResolverService.resolveRecordsInput({
                        objectNameSingular: ref.objectNameSingular,
                        records: args.records,
                        workspaceId: context.workspaceId
                    });
                    const output = await this.createManyRecordsService.execute({
                        objectName: ref.objectNameSingular,
                        objectRecords: records,
                        authContext,
                        rolePermissionConfig: context.rolePermissionConfig,
                        createdBy: context.actorContext,
                        slimResponse: true
                    });
                    return this.appendFileResolutionNotes(output, notes);
                }
            case 'update_one':
                {
                    const { id, ...fields } = args;
                    const objectRecord = Object.fromEntries(Object.entries(fields).filter(([, value])=>value !== undefined));
                    const { records, notes } = await this.recordFilesResolverService.resolveRecordsInput({
                        objectNameSingular: ref.objectNameSingular,
                        records: [
                            objectRecord
                        ],
                        workspaceId: context.workspaceId
                    });
                    const output = await this.updateRecordService.execute({
                        objectName: ref.objectNameSingular,
                        objectRecordId: id,
                        objectRecord: records[0],
                        authContext,
                        rolePermissionConfig: context.rolePermissionConfig,
                        slimResponse: true
                    });
                    return this.appendFileResolutionNotes(output, notes);
                }
            case 'update_many':
                return this.updateManyRecordsService.execute({
                    objectName: ref.objectNameSingular,
                    filter: args.filter,
                    data: args.data,
                    authContext,
                    rolePermissionConfig: context.rolePermissionConfig,
                    slimResponse: true
                });
            case 'upsert_many':
                {
                    const { records, notes } = await this.recordFilesResolverService.resolveRecordsInput({
                        objectNameSingular: ref.objectNameSingular,
                        records: args.records,
                        workspaceId: context.workspaceId
                    });
                    const output = await this.upsertManyRecordsService.execute({
                        objectName: ref.objectNameSingular,
                        objectRecords: records,
                        authContext,
                        rolePermissionConfig: context.rolePermissionConfig,
                        createdBy: context.actorContext,
                        slimResponse: true
                    });
                    return this.appendFileResolutionNotes(output, notes);
                }
            case 'delete_one':
                return this.deleteRecordService.execute({
                    objectName: ref.objectNameSingular,
                    objectRecordId: args.id,
                    authContext,
                    rolePermissionConfig: context.rolePermissionConfig,
                    soft: true
                });
            case 'delete_many':
                return this.deleteManyRecordsService.execute({
                    objectName: ref.objectNameSingular,
                    filter: args.filter,
                    authContext,
                    rolePermissionConfig: context.rolePermissionConfig
                });
            case 'group_by':
                {
                    const { groupBy, aggregateOperation, aggregateFieldName, limit: groupByLimit, orderBy: groupByOrderBy, ...groupByFilter } = args;
                    return this.groupByRecordsService.execute({
                        objectName: ref.objectNameSingular,
                        groupBy: groupBy,
                        aggregateOperation: aggregateOperation,
                        aggregateFieldName: aggregateFieldName,
                        limit: groupByLimit,
                        orderBy: groupByOrderBy,
                        filter: groupByFilter,
                        authContext,
                        rolePermissionConfig: context.rolePermissionConfig
                    });
                }
        }
    }
    appendFileResolutionNotes(output, notes) {
        if (notes.length === 0) {
            return output;
        }
        return {
            ...output,
            message: `${output.message} ${notes.join(' ')}`
        };
    }
    async dispatchStaticTool(descriptor, args, context) {
        if (descriptor.executionRef.kind !== 'static') {
            throw new Error('Expected static executionRef');
        }
        const provider = this.providers.find((candidate)=>candidate.category === descriptor.category);
        if (!provider) {
            throw new Error(`No provider registered for category "${descriptor.category}" (tool: ${descriptor.executionRef.toolId})`);
        }
        // Defense-in-depth: catalog and by-name lookups already filter by
        // `isAvailable`, but re-verify at dispatch so the gate is enforced in
        // one place regardless of how the descriptor reached us.
        if (!await provider.isAvailable(context)) {
            return {
                success: false,
                message: `Tool "${descriptor.name}" is not available`,
                error: `Tool "${descriptor.name}" is not available in this context. Use get_tool_catalog to see available tools.`
            };
        }
        return provider.executeStaticTool(descriptor.executionRef.toolId, args, context);
    }
    async dispatchLogicFunction(ref, args, context) {
        const result = await this.logicFunctionExecutorService.execute({
            logicFunctionId: ref.logicFunctionId,
            workspaceId: context.workspaceId,
            payload: args,
            userId: context.userId,
            userWorkspaceId: context.userWorkspaceId
        });
        if (result.error) {
            return {
                success: false,
                message: 'Logic function execution failed',
                error: result.error.errorMessage
            };
        }
        return {
            success: true,
            message: 'Logic function executed successfully',
            result: result.data ?? undefined
        };
    }
    constructor(providers, findRecordsService, groupByRecordsService, createRecordService, createManyRecordsService, updateRecordService, updateManyRecordsService, upsertManyRecordsService, deleteRecordService, deleteManyRecordsService, logicFunctionExecutorService, recordFilesResolverService, workspaceCacheService, userRepository, userWorkspaceRepository){
        this.providers = providers;
        this.findRecordsService = findRecordsService;
        this.groupByRecordsService = groupByRecordsService;
        this.createRecordService = createRecordService;
        this.createManyRecordsService = createManyRecordsService;
        this.updateRecordService = updateRecordService;
        this.updateManyRecordsService = updateManyRecordsService;
        this.upsertManyRecordsService = upsertManyRecordsService;
        this.deleteRecordService = deleteRecordService;
        this.deleteManyRecordsService = deleteManyRecordsService;
        this.logicFunctionExecutorService = logicFunctionExecutorService;
        this.recordFilesResolverService = recordFilesResolverService;
        this.workspaceCacheService = workspaceCacheService;
        this.userRepository = userRepository;
        this.userWorkspaceRepository = userWorkspaceRepository;
        this.logger = new _common.Logger(ToolExecutorService.name);
    }
};
ToolExecutorService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _common.Inject)(_toolproviderstoken.TOOL_PROVIDERS)),
    _ts_param(13, (0, _typeorm.InjectRepository)(_userentity.UserEntity)),
    _ts_param(14, (0, _typeorm.InjectRepository)(_userworkspaceentity.UserWorkspaceEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Array,
        typeof _findrecordsservice.FindRecordsService === "undefined" ? Object : _findrecordsservice.FindRecordsService,
        typeof _groupbyrecordsservice.GroupByRecordsService === "undefined" ? Object : _groupbyrecordsservice.GroupByRecordsService,
        typeof _createrecordservice.CreateRecordService === "undefined" ? Object : _createrecordservice.CreateRecordService,
        typeof _createmanyrecordsservice.CreateManyRecordsService === "undefined" ? Object : _createmanyrecordsservice.CreateManyRecordsService,
        typeof _updaterecordservice.UpdateRecordService === "undefined" ? Object : _updaterecordservice.UpdateRecordService,
        typeof _updatemanyrecordsservice.UpdateManyRecordsService === "undefined" ? Object : _updatemanyrecordsservice.UpdateManyRecordsService,
        typeof _upsertmanyrecordsservice.UpsertManyRecordsService === "undefined" ? Object : _upsertmanyrecordsservice.UpsertManyRecordsService,
        typeof _deleterecordservice.DeleteRecordService === "undefined" ? Object : _deleterecordservice.DeleteRecordService,
        typeof _deletemanyrecordsservice.DeleteManyRecordsService === "undefined" ? Object : _deletemanyrecordsservice.DeleteManyRecordsService,
        typeof _logicfunctionexecutorservice.LogicFunctionExecutorService === "undefined" ? Object : _logicfunctionexecutorservice.LogicFunctionExecutorService,
        typeof _recordfilesresolverservice.RecordFilesResolverService === "undefined" ? Object : _recordfilesresolverservice.RecordFilesResolverService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], ToolExecutorService);

//# sourceMappingURL=tool-executor.service.js.map