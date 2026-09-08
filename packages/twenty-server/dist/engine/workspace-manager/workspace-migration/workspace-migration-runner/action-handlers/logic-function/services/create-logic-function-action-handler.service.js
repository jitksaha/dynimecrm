"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CreateLogicFunctionActionHandlerService", {
    enumerable: true,
    get: function() {
        return CreateLogicFunctionActionHandlerService;
    }
});
const _common = require("@nestjs/common");
const _uuid = require("uuid");
const _workspacemigrationrunneractionhandlerserviceinterface = require("../../../interfaces/workspace-migration-runner-action-handler-service.interface");
const _logicfunctiondriverfactorytoken = require("../../../../../../core-modules/logic-function/logic-function-drivers/constants/logic-function-driver-factory.token");
const _islogicfunctionreadyforprebuiltinstallutil = require("../../../../../../metadata-modules/logic-function/utils/is-logic-function-ready-for-prebuilt-install.util");
const _resetuniversalflatentityforeignkeyaggregatorsutil = require("../../../../universal-flat-entity/utils/reset-universal-flat-entity-foreign-key-aggregators.util");
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
let CreateLogicFunctionActionHandlerService = class CreateLogicFunctionActionHandlerService extends (0, _workspacemigrationrunneractionhandlerserviceinterface.WorkspaceMigrationRunnerActionHandler)('create', 'logicFunction') {
    async transpileUniversalActionToFlatAction({ action, flatApplication, workspaceId }) {
        const emptyUniversalForeignKeyAggregators = (0, _resetuniversalflatentityforeignkeyaggregatorsutil.getUniversalFlatEntityEmptyForeignKeyAggregators)({
            metadataName: 'logicFunction'
        });
        return {
            ...action,
            flatEntity: {
                ...action.flatEntity,
                applicationId: flatApplication.id,
                id: action.id ?? (0, _uuid.v4)(),
                workspaceId,
                ...emptyUniversalForeignKeyAggregators
            }
        };
    }
    async executeForMetadata(context) {
        const { flatAction, queryRunner, flatApplication } = context;
        const { flatEntity: logicFunction } = flatAction;
        await this.insertFlatEntitiesInRepository({
            queryRunner,
            flatEntities: [
                logicFunction
            ]
        });
        if ((0, _islogicfunctionreadyforprebuiltinstallutil.isLogicFunctionReadyForPrebuiltInstall)(logicFunction)) {
            const driver = this.logicFunctionDriverFactory.getCurrentDriver();
            const installStart = Date.now();
            try {
                await driver.installPrebuiltBundle({
                    flatLogicFunction: logicFunction,
                    flatApplication,
                    applicationUniversalIdentifier: flatApplication.universalIdentifier
                });
                this.logger.log(`[lambda-timing] event=install_prebuilt fnId=${logicFunction.id} ` + `reason=app_install install_duration_ms=${Date.now() - installStart}`, CreateLogicFunctionActionHandlerService.name);
            } catch (error) {
                this.logger.error(`Failed to install prebuilt bundle on app-install for function ${logicFunction.id} ` + `after ${Date.now() - installStart}ms: ` + `${error instanceof Error ? error.message : String(error)}`, CreateLogicFunctionActionHandlerService.name, error instanceof Error ? error.stack : undefined);
                throw error;
            }
        }
    }
    async rollbackForMetadata(_context) {
        // Nothing to rollback for now
        return;
    }
    constructor(logicFunctionDriverFactory){
        super(), this.logicFunctionDriverFactory = logicFunctionDriverFactory;
    }
};
CreateLogicFunctionActionHandlerService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _common.Inject)(_logicfunctiondriverfactorytoken.LOGIC_FUNCTION_DRIVER_FACTORY_TOKEN)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof LogicFunctionDriverFactory === "undefined" ? Object : LogicFunctionDriverFactory
    ])
], CreateLogicFunctionActionHandlerService);

//# sourceMappingURL=create-logic-function-action-handler.service.js.map