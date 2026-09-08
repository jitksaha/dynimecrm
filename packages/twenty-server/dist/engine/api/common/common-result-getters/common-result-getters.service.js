"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CommonResultGettersService", {
    enumerable: true,
    get: function() {
        return CommonResultGettersService;
    }
});
const _common = require("@nestjs/common");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _filesfieldqueryresultgetterhandler = require("./handlers/field-handlers/files-field-query-result-getter.handler");
const _richtextfieldqueryresultgetterhandler = require("./handlers/field-handlers/rich-text-field-query-result-getter.handler");
const _workspacememberqueryresultgetterhandler = require("../../graphql/workspace-query-runner/factories/query-result-getters/handlers/workspace-member-query-result-getter.handler");
const _getflatfieldsforflatobjectmetadatautil = require("../../graphql/workspace-schema-builder/utils/get-flat-fields-for-flat-object-metadata.util");
const _fileurlservice = require("../../../core-modules/file/file-url/file-url.service");
const _findflatentitybyidinflatentitymapsorthrowutil = require("../../../metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps-or-throw.util");
const _isflatfieldmetadataoftypeutil = require("../../../metadata-modules/flat-field-metadata/utils/is-flat-field-metadata-of-type.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let CommonResultGettersService = class CommonResultGettersService {
    initializeObjectHandlers() {
        this.objectHandlers = new Map([
            [
                'workspaceMember',
                new _workspacememberqueryresultgetterhandler.WorkspaceMemberQueryResultGetterHandler(this.fileUrlService)
            ]
        ]);
    }
    initializeFieldHandlers() {
        this.fieldHandlers = new Map([
            [
                _types.FieldMetadataType.FILES,
                new _filesfieldqueryresultgetterhandler.FilesFieldQueryResultGetterHandler(this.fileUrlService)
            ],
            [
                _types.FieldMetadataType.RICH_TEXT,
                new _richtextfieldqueryresultgetterhandler.RichTextFieldQueryResultGetterHandler(this.fileUrlService)
            ]
        ]);
    }
    processRecordArray(recordArray, flatObjectMetadata, flatObjectMetadataMaps, flatFieldMetadataMaps, workspaceId) {
        return this.processRecordArrayWithContext(recordArray, flatObjectMetadata, {
            flatObjectMetadataMaps,
            flatFieldMetadataMaps,
            workspaceId,
            fieldMetadataByNameByObjectMetadataId: new Map()
        });
    }
    processRecord(record, flatObjectMetadata, flatObjectMetadataMaps, flatFieldMetadataMaps, workspaceId) {
        return this.processRecordWithContext(record, flatObjectMetadata, {
            flatObjectMetadataMaps,
            flatFieldMetadataMaps,
            workspaceId,
            fieldMetadataByNameByObjectMetadataId: new Map()
        });
    }
    processRecordArrayWithContext(recordArray, flatObjectMetadata, context) {
        return Promise.all(recordArray.map((record)=>this.processRecordWithContext(record, flatObjectMetadata, context)));
    }
    async processRecordWithContext(record, flatObjectMetadata, context) {
        const fieldMetadataByName = this.getOrBuildFieldMetadataByName(flatObjectMetadata, context);
        const recordFieldMetadataList = Object.keys(record).map((recordFieldName)=>fieldMetadataByName.get(recordFieldName)).filter(_utils.isDefined);
        const fieldHandlers = new Set(recordFieldMetadataList.map((recordFieldMetadata)=>this.fieldHandlers.get(recordFieldMetadata.type)).filter(_utils.isDefined));
        const handlers = [
            this.getObjectHandler(flatObjectMetadata.nameSingular),
            ...fieldHandlers
        ];
        const relationFields = recordFieldMetadataList.filter((recordFieldMetadata)=>(0, _isflatfieldmetadataoftypeutil.isFlatFieldMetadataOfType)(recordFieldMetadata, _types.FieldMetadataType.RELATION));
        const relationFieldsProcessedMap = {};
        for (const relationField of relationFields){
            if (!(0, _utils.isDefined)(relationField.relationTargetObjectMetadataId)) {
                throw new Error('Relation target object metadata id is not defined');
            }
            const recordFieldValue = record[relationField.name];
            if (!(0, _utils.isDefined)(recordFieldValue)) {
                continue;
            }
            const targetFlatObjectMetadata = (0, _findflatentitybyidinflatentitymapsorthrowutil.findFlatEntityByIdInFlatEntityMapsOrThrow)({
                flatEntityId: relationField.relationTargetObjectMetadataId,
                flatEntityMaps: context.flatObjectMetadataMaps
            });
            relationFieldsProcessedMap[relationField.name] = relationField.settings?.relationType === _types.RelationType.ONE_TO_MANY ? await this.processRecordArrayWithContext(record[relationField.name], targetFlatObjectMetadata, context) : await this.processRecordWithContext(record[relationField.name], targetFlatObjectMetadata, context);
        }
        const objectRecordProcessedWithoutRelationFields = await this.processObjectRecordWithoutRelationFields(record, context.workspaceId, handlers, recordFieldMetadataList);
        return {
            ...objectRecordProcessedWithoutRelationFields,
            ...relationFieldsProcessedMap
        };
    }
    getOrBuildFieldMetadataByName(flatObjectMetadata, context) {
        const cachedFieldMetadataByName = context.fieldMetadataByNameByObjectMetadataId.get(flatObjectMetadata.id);
        if ((0, _utils.isDefined)(cachedFieldMetadataByName)) {
            return cachedFieldMetadataByName;
        }
        const fieldMetadataByName = new Map((0, _getflatfieldsforflatobjectmetadatautil.getFlatFieldsFromFlatObjectMetadata)(flatObjectMetadata, context.flatFieldMetadataMaps).map((fieldMetadata)=>[
                fieldMetadata.name,
                fieldMetadata
            ]));
        context.fieldMetadataByNameByObjectMetadataId.set(flatObjectMetadata.id, fieldMetadataByName);
        return fieldMetadataByName;
    }
    async processObjectRecordWithoutRelationFields(record, workspaceId, handlers, fieldMetadata) {
        let processedRecord = record;
        for (const handler of handlers){
            processedRecord = await handler.handle(processedRecord, workspaceId, fieldMetadata);
        }
        return processedRecord;
    }
    getObjectHandler(objectType) {
        return this.objectHandlers.get(objectType) ?? {
            handle: (result)=>Promise.resolve(result)
        };
    }
    constructor(fileUrlService){
        this.fileUrlService = fileUrlService;
        this.initializeObjectHandlers();
        this.initializeFieldHandlers();
    }
};
CommonResultGettersService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _fileurlservice.FileUrlService === "undefined" ? Object : _fileurlservice.FileUrlService
    ])
], CommonResultGettersService);

//# sourceMappingURL=common-result-getters.service.js.map