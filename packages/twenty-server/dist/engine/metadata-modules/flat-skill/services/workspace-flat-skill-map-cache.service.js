"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceFlatSkillMapCacheService", {
    enumerable: true,
    get: function() {
        return WorkspaceFlatSkillMapCacheService;
    }
});
const _common = require("@nestjs/common");
const _metadataflatentitymapscacheproviderservice = require("../../../workspace-cache/interfaces/metadata-flat-entity-maps-cache-provider.service");
const _createemptyflatentitymapsconstant = require("../../flat-entity/constant/create-empty-flat-entity-maps.constant");
const _fromskillentitytoflatskillutil = require("../utils/from-skill-entity-to-flat-skill.util");
const _workspacecachedecorator = require("../../../workspace-cache/decorators/workspace-cache.decorator");
const _createidtouniversalidentifiermaputil = require("../../../workspace-cache/utils/create-id-to-universal-identifier-map.util");
const _addflatentitytoflatentitymapsthroughmutationorthrowutil = require("../../../workspace-manager/workspace-migration/utils/add-flat-entity-to-flat-entity-maps-through-mutation-or-throw.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
const FLAT_SKILL_ROWS_REQUIREMENT = {
    skill: true,
    application: [
        'id',
        'universalIdentifier'
    ]
};
let WorkspaceFlatSkillMapCacheService = class WorkspaceFlatSkillMapCacheService extends _metadataflatentitymapscacheproviderservice.MetadataFlatEntityMapsCacheProvider {
    computeForCache({ rows }) {
        const { skill: skills, application: applications } = rows;
        const applicationIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(applications);
        const flatSkillMaps = (0, _createemptyflatentitymapsconstant.createEmptyFlatEntityMaps)();
        for (const skillEntity of skills){
            const flatSkill = (0, _fromskillentitytoflatskillutil.fromSkillEntityToFlatSkill)({
                entity: skillEntity,
                applicationIdToUniversalIdentifierMap
            });
            (0, _addflatentitytoflatentitymapsthroughmutationorthrowutil.addFlatEntityToFlatEntityMapsThroughMutationOrThrow)({
                flatEntity: flatSkill,
                flatEntityMapsToMutate: flatSkillMaps
            });
        }
        return flatSkillMaps;
    }
    constructor(...args){
        super(...args), this.rowsRequirement = FLAT_SKILL_ROWS_REQUIREMENT;
    }
};
WorkspaceFlatSkillMapCacheService = _ts_decorate([
    (0, _common.Injectable)(),
    (0, _workspacecachedecorator.WorkspaceCache)('flatSkillMaps', {
        packingPonderation: 2
    })
], WorkspaceFlatSkillMapCacheService);

//# sourceMappingURL=workspace-flat-skill-map-cache.service.js.map