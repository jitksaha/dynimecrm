"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DeleteLogicFunctionActionHandlerService", {
    enumerable: true,
    get: function() {
        return DeleteLogicFunctionActionHandlerService;
    }
});
const _common = require("@nestjs/common");
const _types = require("twenty-shared/types");
const _workspacemigrationrunneractionhandlerserviceinterface = require("../../../interfaces/workspace-migration-runner-action-handler-service.interface");
const _filestorageservice = require("../../../../../../core-modules/file-storage/services/file-storage.service");
const _logicfunctiondriverfactorytoken = require("../../../../../../core-modules/logic-function/logic-function-drivers/constants/logic-function-driver-factory.token");
const _findflatentitybyidinflatentitymapsorthrowutil = require("../../../../../../metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps-or-throw.util");
const _logicfunctionentity = require("../../../../../../metadata-modules/logic-function/logic-function.entity");
const _getlogicfunctionsubfolderforfromsource = require("../../../../../../metadata-modules/logic-function/utils/get-logic-function-subfolder-for-from-source");
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
let DeleteLogicFunctionActionHandlerService = class DeleteLogicFunctionActionHandlerService extends (0, _workspacemigrationrunneractionhandlerserviceinterface.WorkspaceMigrationRunnerActionHandler)('delete', 'logicFunction') {
    async transpileUniversalActionToFlatAction(context) {
        return this.transpileUniversalDeleteActionToFlatDeleteAction(context);
    }
    async executeForMetadata(context) {
        const { flatAction, queryRunner, workspaceId } = context;
        const logicFunctionRepository = queryRunner.manager.getRepository(_logicfunctionentity.LogicFunctionEntity);
        await logicFunctionRepository.delete({
            id: flatAction.entityId,
            workspaceId
        });
    }
    getAfterCommitSideEffects(context) {
        const { flatAction, workspaceId, allFlatEntityMaps, flatApplication } = context;
        const flatLogicFunction = (0, _findflatentitybyidinflatentitymapsorthrowutil.findFlatEntityByIdInFlatEntityMapsOrThrow)({
            flatEntityMaps: allFlatEntityMaps.flatLogicFunctionMaps,
            flatEntityId: flatAction.entityId
        });
        const applicationUniversalIdentifier = flatApplication.universalIdentifier;
        return [
            {
                description: `source folder for logic function ${flatLogicFunction.id} (universalIdentifier=${flatLogicFunction.universalIdentifier}, applicationUniversalIdentifier=${applicationUniversalIdentifier})`,
                run: ()=>this.fileStorageService.deleteFolder({
                        workspaceId,
                        applicationUniversalIdentifier,
                        fileFolder: _types.FileFolder.Source,
                        folderPath: (0, _getlogicfunctionsubfolderforfromsource.getLogicFunctionSubfolderForFromSource)(flatLogicFunction.id)
                    })
            },
            {
                description: `built handler for logic function ${flatLogicFunction.id} (universalIdentifier=${flatLogicFunction.universalIdentifier}, applicationUniversalIdentifier=${applicationUniversalIdentifier})`,
                run: ()=>this.fileStorageService.deleteFile({
                        workspaceId,
                        applicationUniversalIdentifier,
                        fileFolder: _types.FileFolder.BuiltLogicFunction,
                        resourcePath: flatLogicFunction.builtHandlerPath
                    })
            },
            {
                description: `runtime resource for logic function ${flatLogicFunction.id} (universalIdentifier=${flatLogicFunction.universalIdentifier}, applicationUniversalIdentifier=${applicationUniversalIdentifier})`,
                run: ()=>this.logicFunctionDriverFactory.getCurrentDriver().delete(flatLogicFunction)
            }
        ];
    }
    async rollbackForMetadata() {}
    constructor(fileStorageService, logicFunctionDriverFactory){
        super(), this.fileStorageService = fileStorageService, this.logicFunctionDriverFactory = logicFunctionDriverFactory;
    }
};
DeleteLogicFunctionActionHandlerService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(1, (0, _common.Inject)(_logicfunctiondriverfactorytoken.LOGIC_FUNCTION_DRIVER_FACTORY_TOKEN)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _filestorageservice.FileStorageService === "undefined" ? Object : _filestorageservice.FileStorageService,
        typeof LogicFunctionDriverFactory === "undefined" ? Object : LogicFunctionDriverFactory
    ])
], DeleteLogicFunctionActionHandlerService);

//# sourceMappingURL=delete-logic-function-action-handler.service.js.map