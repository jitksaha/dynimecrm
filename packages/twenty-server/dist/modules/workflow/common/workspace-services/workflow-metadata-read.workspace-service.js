"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkflowMetadataReadService", {
    enumerable: true,
    get: function() {
        return WorkflowMetadataReadService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _workspacemanyorallflatentitymapscacheservice = require("../../../../engine/metadata-modules/flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.service");
const _findflatentitybyidinflatentitymapsutil = require("../../../../engine/metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util");
const _buildobjectidbynamemapsutil = require("../../../../engine/metadata-modules/flat-object-metadata/utils/build-object-id-by-name-maps.util");
const _workflowcommonexception = require("../exceptions/workflow-common.exception");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let WorkflowMetadataReadService = class WorkflowMetadataReadService {
    async getFlatEntityMaps(workspaceId) {
        const { flatObjectMetadataMaps, flatFieldMetadataMaps } = await this.workspaceManyOrAllFlatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
            workspaceId,
            flatMapsKeys: [
                'flatObjectMetadataMaps',
                'flatFieldMetadataMaps'
            ]
        });
        const { idByNameSingular } = (0, _buildobjectidbynamemapsutil.buildObjectIdByNameMaps)(flatObjectMetadataMaps);
        return {
            flatObjectMetadataMaps,
            flatFieldMetadataMaps,
            objectIdByNameSingular: idByNameSingular
        };
    }
    async getLogicFunctionById({ logicFunctionId, workspaceId }) {
        const { flatLogicFunctionMaps } = await this.workspaceManyOrAllFlatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
            workspaceId,
            flatMapsKeys: [
                'flatLogicFunctionMaps'
            ]
        });
        return (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
            flatEntityId: logicFunctionId,
            flatEntityMaps: flatLogicFunctionMaps
        });
    }
    async getObjectMetadataInfo(objectNameSingular, workspaceId) {
        const { flatObjectMetadataMaps, flatFieldMetadataMaps, objectIdByNameSingular } = await this.getFlatEntityMaps(workspaceId);
        const objectId = objectIdByNameSingular[objectNameSingular];
        if (!(0, _utils.isDefined)(objectId)) {
            throw new _workflowcommonexception.WorkflowCommonException(`Failed to read: Object ${objectNameSingular} not found`, _workflowcommonexception.WorkflowCommonExceptionCode.OBJECT_METADATA_NOT_FOUND);
        }
        const flatObjectMetadata = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
            flatEntityId: objectId,
            flatEntityMaps: flatObjectMetadataMaps
        });
        if (!(0, _utils.isDefined)(flatObjectMetadata)) {
            throw new _workflowcommonexception.WorkflowCommonException(`Failed to read: Object ${objectNameSingular} not found`, _workflowcommonexception.WorkflowCommonExceptionCode.OBJECT_METADATA_NOT_FOUND);
        }
        return {
            flatObjectMetadata,
            flatObjectMetadataMaps,
            flatFieldMetadataMaps
        };
    }
    constructor(workspaceManyOrAllFlatEntityMapsCacheService){
        this.workspaceManyOrAllFlatEntityMapsCacheService = workspaceManyOrAllFlatEntityMapsCacheService;
    }
};
WorkflowMetadataReadService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService === "undefined" ? Object : _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService
    ])
], WorkflowMetadataReadService);

//# sourceMappingURL=workflow-metadata-read.workspace-service.js.map