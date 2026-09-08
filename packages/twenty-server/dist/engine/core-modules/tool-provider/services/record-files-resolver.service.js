"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RecordFilesResolverService", {
    enumerable: true,
    get: function() {
        return RecordFilesResolverService;
    }
});
const _common = require("@nestjs/common");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _typeorm = require("typeorm");
const _getflatfieldsforflatobjectmetadatautil = require("../../../api/graphql/workspace-schema-builder/utils/get-flat-fields-for-flat-object-metadata.util");
const _fileentity = require("../../file/entities/file.entity");
const _filesfieldservice = require("../../file/files-field/services/files-field.service");
const _filesfieldvaluefileidsutil = require("../utils/files-field-value-file-ids.util");
const _iscopyablefilesfieldsourcepathutil = require("../utils/is-copyable-files-field-source-path.util");
const _workspacemanyorallflatentitymapscacheservice = require("../../../metadata-modules/flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.service");
const _injectworkspacescopedrepositorydecorator = require("../../../twenty-orm/workspace-scoped-repository/inject-workspace-scoped-repository.decorator");
const _workspacescopedrepository = require("../../../twenty-orm/workspace-scoped-repository/workspace-scoped-repository");
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
let RecordFilesResolverService = class RecordFilesResolverService {
    async resolveRecordsInput({ objectNameSingular, records, workspaceId }) {
        const { flatObjectMetadataMaps, flatFieldMetadataMaps } = await this.workspaceManyOrAllFlatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
            workspaceId,
            flatMapsKeys: [
                'flatObjectMetadataMaps',
                'flatFieldMetadataMaps'
            ]
        });
        const flatObjectMetadata = Object.values(flatObjectMetadataMaps.byUniversalIdentifier).find((metadata)=>(0, _utils.isDefined)(metadata) && metadata.nameSingular === objectNameSingular && metadata.isActive);
        if (!(0, _utils.isDefined)(flatObjectMetadata)) {
            return {
                records,
                notes: []
            };
        }
        const filesFields = (0, _getflatfieldsforflatobjectmetadatautil.getFlatFieldsFromFlatObjectMetadata)(flatObjectMetadata, flatFieldMetadataMaps).filter((field)=>field.type === _types.FieldMetadataType.FILES);
        if (filesFields.length === 0) {
            return {
                records,
                notes: []
            };
        }
        const notes = [];
        const resolvedRecords = [];
        for (const record of records){
            let resolvedRecord = record;
            for (const filesField of filesFields){
                const fileIds = (0, _filesfieldvaluefileidsutil.collectFileIdsFromFilesFieldValue)(resolvedRecord[filesField.name]);
                const copyableFileIds = await this.findCopyableFileIds(fileIds, workspaceId);
                if (copyableFileIds.length === 0) {
                    continue;
                }
                const fileIdSubstitutions = new Map();
                for (const fileId of copyableFileIds){
                    const copiedFile = await this.filesFieldService.copyFileIntoFilesField({
                        fileId,
                        workspaceId,
                        fieldMetadataId: filesField.id
                    });
                    fileIdSubstitutions.set(fileId, copiedFile.id);
                    notes.push(`Uploaded file ${fileId} was stored on ${filesField.name} as file ${copiedFile.id}.`);
                }
                resolvedRecord = {
                    ...resolvedRecord,
                    [filesField.name]: (0, _filesfieldvaluefileidsutil.substituteFileIdsInFilesFieldValue)(resolvedRecord[filesField.name], fileIdSubstitutions)
                };
            }
            resolvedRecords.push(resolvedRecord);
        }
        return {
            records: resolvedRecords,
            notes
        };
    }
    async findCopyableFileIds(fileIds, workspaceId) {
        if (fileIds.length === 0) {
            return [];
        }
        const files = await this.fileRepository.find(workspaceId, {
            where: {
                id: (0, _typeorm.In)([
                    ...new Set(fileIds)
                ])
            }
        });
        return files.filter((file)=>(0, _iscopyablefilesfieldsourcepathutil.isCopyableFilesFieldSourcePath)(file.path)).map((file)=>file.id);
    }
    constructor(workspaceManyOrAllFlatEntityMapsCacheService, filesFieldService, fileRepository){
        this.workspaceManyOrAllFlatEntityMapsCacheService = workspaceManyOrAllFlatEntityMapsCacheService;
        this.filesFieldService = filesFieldService;
        this.fileRepository = fileRepository;
    }
};
RecordFilesResolverService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(2, (0, _injectworkspacescopedrepositorydecorator.InjectWorkspaceScopedRepository)(_fileentity.FileEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService === "undefined" ? Object : _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService,
        typeof _filesfieldservice.FilesFieldService === "undefined" ? Object : _filesfieldservice.FilesFieldService,
        typeof _workspacescopedrepository.WorkspaceScopedRepository === "undefined" ? Object : _workspacescopedrepository.WorkspaceScopedRepository
    ])
], RecordFilesResolverService);

//# sourceMappingURL=record-files-resolver.service.js.map