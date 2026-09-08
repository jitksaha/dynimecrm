"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RelatedPersonIdsService", {
    enumerable: true,
    get: function() {
        return RelatedPersonIdsService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _typeorm = require("typeorm");
const _relationtypeinterface = require("../../../metadata-modules/field-metadata/interfaces/relation-type.interface");
const _findrelationpathstopersonutil = require("../utils/find-relation-paths-to-person.util");
const _workspaceormmanager = require("../../../twenty-orm/workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../twenty-orm/utils/build-system-auth-context.util");
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
const PERSON_OBJECT_NAME_SINGULAR = 'person';
let RelatedPersonIdsService = class RelatedPersonIdsService {
    async getRelatedPersonIds({ workspaceId, objectNameSingular, recordId }) {
        if (objectNameSingular === PERSON_OBJECT_NAME_SINGULAR) {
            return [
                recordId
            ];
        }
        const { flatObjectMetadataMaps, flatFieldMetadataMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatObjectMetadataMaps',
            'flatFieldMetadataMaps'
        ]);
        const relationPaths = (0, _findrelationpathstopersonutil.findRelationPathsToPerson)({
            rootObjectNameSingular: objectNameSingular,
            flatObjectMetadataMaps,
            flatFieldMetadataMaps
        });
        if (relationPaths.length === 0) {
            return [];
        }
        return this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const personIds = new Set();
            for (const relationPath of relationPaths){
                const personIdsForPath = await this.walkRelationPath({
                    recordId,
                    relationPath
                });
                personIdsForPath.forEach((personId)=>personIds.add(personId));
            }
            return [
                ...personIds
            ];
        }, (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId));
    }
    async walkRelationPath({ recordId, relationPath }) {
        let currentIds = [
            recordId
        ];
        for (const hop of relationPath){
            if (currentIds.length === 0) {
                return [];
            }
            const repository = this.workspaceOrmManager.getRepository(hop.queryObjectNameSingular, {
                shouldBypassPermissionChecks: true
            });
            if (hop.direction === _relationtypeinterface.RelationType.MANY_TO_ONE) {
                const records = await repository.find({
                    where: {
                        id: (0, _typeorm.In)(currentIds)
                    },
                    select: [
                        hop.joinColumnName
                    ]
                });
                currentIds = [
                    ...new Set(records.map((record)=>record[hop.joinColumnName]).filter((value)=>typeof value === 'string' && (0, _utils.isDefined)(value)))
                ];
            } else {
                const records = await repository.find({
                    where: {
                        [hop.joinColumnName]: (0, _typeorm.In)(currentIds)
                    },
                    select: {
                        id: true
                    }
                });
                currentIds = [
                    ...new Set(records.map((record)=>record.id))
                ];
            }
        }
        return currentIds;
    }
    constructor(workspaceOrmManager, workspaceCacheService){
        this.workspaceOrmManager = workspaceOrmManager;
        this.workspaceCacheService = workspaceCacheService;
    }
};
RelatedPersonIdsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService
    ])
], RelatedPersonIdsService);

//# sourceMappingURL=related-person-ids.service.js.map