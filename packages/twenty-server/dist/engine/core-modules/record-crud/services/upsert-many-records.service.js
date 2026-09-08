"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UpsertManyRecordsService", {
    enumerable: true,
    get: function() {
        return UpsertManyRecordsService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _commoncreatemanyqueryrunnerservice = require("../../../api/common/common-query-runners/common-create-many-query-runner/common-create-many-query-runner.service");
const _recordcrudexception = require("../exceptions/record-crud.exception");
const _commonapicontextbuilderservice = require("./common-api-context-builder.service");
const _getrecorddisplaynameutil = require("../utils/get-record-display-name.util");
const _isfreshlycreatedrecordutil = require("../utils/is-freshly-created-record.util");
const _removeundefinedfromrecordutil = require("../utils/remove-undefined-from-record.util");
const _workflow = require("twenty-shared/workflow");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let UpsertManyRecordsService = class UpsertManyRecordsService {
    async execute(params) {
        const { objectName, objectRecords, authContext, rolePermissionConfig } = params;
        try {
            const { queryRunnerContext, selectedFields, flatObjectMetadata, flatFieldMetadataMaps } = await this.commonApiContextBuilder.build({
                authContext,
                objectName,
                rolePermissionConfig
            });
            if (!(0, _workflow.canObjectBeManagedByAutomation)({
                nameSingular: flatObjectMetadata.nameSingular
            })) {
                throw new _recordcrudexception.RecordCrudException('Failed to upsert: Object cannot be upserted by workflow', _recordcrudexception.RecordCrudExceptionCode.INVALID_REQUEST);
            }
            const cleanedRecords = objectRecords.map((record)=>({
                    ...(0, _removeundefinedfromrecordutil.removeUndefinedFromRecord)(record),
                    ...(0, _utils.isDefined)(params.createdBy) && {
                        createdBy: params.createdBy
                    }
                }));
            const { results: upsertedRecords } = await this.commonCreateManyRunner.execute({
                data: cleanedRecords,
                selectedFields,
                upsert: true
            }, queryRunnerContext);
            const createdCount = upsertedRecords.filter(_isfreshlycreatedrecordutil.isFreshlyCreatedRecord).length;
            const updatedCount = upsertedRecords.length - createdCount;
            this.logger.log(`Upserted ${upsertedRecords.length} records in ${objectName} (created: ${createdCount}, updated: ${updatedCount})`);
            return {
                success: true,
                message: `Upserted ${upsertedRecords.length} records in ${objectName} (created: ${createdCount}, updated: ${updatedCount})`,
                result: {
                    records: params.slimResponse ? upsertedRecords.map((record)=>({
                            id: record.id
                        })) : upsertedRecords,
                    created: createdCount,
                    updated: updatedCount,
                    total: upsertedRecords.length
                },
                recordReferences: upsertedRecords.map((record)=>({
                        objectNameSingular: objectName,
                        recordId: record.id,
                        displayName: (0, _getrecorddisplaynameutil.getRecordDisplayName)(record, flatObjectMetadata, flatFieldMetadataMaps)
                    }))
            };
        } catch (error) {
            if (error instanceof _recordcrudexception.RecordCrudException) {
                return {
                    success: false,
                    message: `Failed to upsert records in ${objectName}`,
                    error: error.message
                };
            }
            this.logger.error(`Failed to upsert records: ${error}`);
            return {
                success: false,
                message: `Failed to upsert records in ${objectName}`,
                error: error instanceof Error ? error.message : 'Failed to upsert records'
            };
        }
    }
    constructor(commonCreateManyRunner, commonApiContextBuilder){
        this.commonCreateManyRunner = commonCreateManyRunner;
        this.commonApiContextBuilder = commonApiContextBuilder;
        this.logger = new _common.Logger(UpsertManyRecordsService.name);
    }
};
UpsertManyRecordsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _commoncreatemanyqueryrunnerservice.CommonCreateManyQueryRunnerService === "undefined" ? Object : _commoncreatemanyqueryrunnerservice.CommonCreateManyQueryRunnerService,
        typeof _commonapicontextbuilderservice.CommonApiContextBuilderService === "undefined" ? Object : _commonapicontextbuilderservice.CommonApiContextBuilderService
    ])
], UpsertManyRecordsService);

//# sourceMappingURL=upsert-many-records.service.js.map