"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceApplicationVariableMapCacheService", {
    enumerable: true,
    get: function() {
        return WorkspaceApplicationVariableMapCacheService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _workspacecacheproviderservice = require("../../../workspace-cache/interfaces/workspace-cache-provider.service");
const _fromapplicationvariableentitytoflatapplicationvariableutil = require("../../../metadata-modules/flat-application-variable/utils/from-application-variable-entity-to-flat-application-variable.util");
const _workspacecachedecorator = require("../../../workspace-cache/decorators/workspace-cache.decorator");
const _createidtouniversalidentifiermaputil = require("../../../workspace-cache/utils/create-id-to-universal-identifier-map.util");
const _createemptyflatentitymapsconstant = require("../../../metadata-modules/flat-entity/constant/create-empty-flat-entity-maps.constant");
const _addflatentitytoflatentitymapsthroughmutationorthrowutil = require("../../../workspace-manager/workspace-migration/utils/add-flat-entity-to-flat-entity-maps-through-mutation-or-throw.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
const APPLICATION_VARIABLE_ROWS_REQUIREMENT = {
    applicationVariable: true,
    application: [
        'id',
        'universalIdentifier',
        'deletedAt'
    ]
};
let WorkspaceApplicationVariableMapCacheService = class WorkspaceApplicationVariableMapCacheService extends _workspacecacheproviderservice.WorkspaceCacheProvider {
    computeForCache({ rows }) {
        const { applicationVariable: applicationVariableEntities, application: applications } = rows;
        const applicationIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(applications.filter((application)=>!(0, _utils.isDefined)(application.deletedAt)));
        const applicationVariableMaps = (0, _createemptyflatentitymapsconstant.createEmptyFlatEntityMaps)();
        for (const entity of applicationVariableEntities){
            const flatApplicationVariable = (0, _fromapplicationvariableentitytoflatapplicationvariableutil.fromApplicationVariableEntityToFlatApplicationVariable)({
                entity,
                applicationIdToUniversalIdentifierMap
            });
            (0, _addflatentitytoflatentitymapsthroughmutationorthrowutil.addFlatEntityToFlatEntityMapsThroughMutationOrThrow)({
                flatEntity: flatApplicationVariable,
                flatEntityMapsToMutate: applicationVariableMaps
            });
        }
        return applicationVariableMaps;
    }
    constructor(...args){
        super(...args), this.rowsRequirement = APPLICATION_VARIABLE_ROWS_REQUIREMENT;
    }
};
WorkspaceApplicationVariableMapCacheService = _ts_decorate([
    (0, _common.Injectable)(),
    (0, _workspacecachedecorator.WorkspaceCache)('applicationVariableMaps', {
        packingPonderation: 1
    })
], WorkspaceApplicationVariableMapCacheService);

//# sourceMappingURL=workspace-application-variable-map-cache.service.js.map