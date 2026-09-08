"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DeleteManyRecordsService", {
    enumerable: true,
    get: function() {
        return DeleteManyRecordsService;
    }
});
const _common = require("@nestjs/common");
const _commondeletemanyqueryrunnerservice = require("../../../api/common/common-query-runners/common-delete-many-query-runner.service");
const _recordcrudexception = require("../exceptions/record-crud.exception");
const _commonapicontextbuilderservice = require("./common-api-context-builder.service");
const _utils = require("twenty-shared/utils");
const _workflow = require("twenty-shared/workflow");
const _isrecordfilteremptyutil = require("../../../api/common/common-query-runners/utils/is-record-filter-empty.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let DeleteManyRecordsService = class DeleteManyRecordsService {
    async execute(params) {
        const { objectName, filter, authContext, rolePermissionConfig } = params;
        if (!(0, _utils.isDefined)(filter) || (0, _isrecordfilteremptyutil.isRecordFilterEmpty)(filter)) {
            return {
                success: false,
                message: `Failed to delete records from ${objectName}`,
                error: 'Filter must not be empty — deleting without a filter is not allowed'
            };
        }
        try {
            const { queryRunnerContext, selectedFields, flatObjectMetadata } = await this.commonApiContextBuilder.build({
                authContext,
                objectName,
                rolePermissionConfig
            });
            if (!(0, _workflow.canObjectBeManagedByAutomation)({
                nameSingular: flatObjectMetadata.nameSingular
            })) {
                throw new _recordcrudexception.RecordCrudException('Failed to delete: Object cannot be deleted by workflow', _recordcrudexception.RecordCrudExceptionCode.INVALID_REQUEST);
            }
            const { results: deletedRecords } = await this.commonDeleteManyRunner.execute({
                filter,
                selectedFields
            }, queryRunnerContext);
            this.logger.log(`Soft deleted ${deletedRecords.length} records from ${objectName}`);
            return {
                success: true,
                message: `Soft deleted ${deletedRecords.length} records from ${objectName}`,
                result: deletedRecords.map((record)=>({
                        id: record.id
                    }))
            };
        } catch (error) {
            if (error instanceof _recordcrudexception.RecordCrudException) {
                return {
                    success: false,
                    message: `Failed to delete records from ${objectName}`,
                    error: error.message
                };
            }
            this.logger.error(`Failed to delete records: ${error}`);
            return {
                success: false,
                message: `Failed to delete records from ${objectName}`,
                error: error instanceof Error ? error.message : 'Failed to delete records'
            };
        }
    }
    constructor(commonDeleteManyRunner, commonApiContextBuilder){
        this.commonDeleteManyRunner = commonDeleteManyRunner;
        this.commonApiContextBuilder = commonApiContextBuilder;
        this.logger = new _common.Logger(DeleteManyRecordsService.name);
    }
};
DeleteManyRecordsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _commondeletemanyqueryrunnerservice.CommonDeleteManyQueryRunnerService === "undefined" ? Object : _commondeletemanyqueryrunnerservice.CommonDeleteManyQueryRunnerService,
        typeof _commonapicontextbuilderservice.CommonApiContextBuilderService === "undefined" ? Object : _commonapicontextbuilderservice.CommonApiContextBuilderService
    ])
], DeleteManyRecordsService);

//# sourceMappingURL=delete-many-records.service.js.map