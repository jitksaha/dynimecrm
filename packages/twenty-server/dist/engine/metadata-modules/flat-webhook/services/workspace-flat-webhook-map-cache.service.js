"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceFlatWebhookMapCacheService", {
    enumerable: true,
    get: function() {
        return WorkspaceFlatWebhookMapCacheService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("typeorm");
const _utils = require("twenty-shared/utils");
const _metadataflatentitymapscacheproviderservice = require("../../../workspace-cache/interfaces/metadata-flat-entity-maps-cache-provider.service");
const _createemptyflatentitymapsconstant = require("../../flat-entity/constant/create-empty-flat-entity-maps.constant");
const _fromwebhookentitytoflatwebhookutil = require("../utils/from-webhook-entity-to-flat-webhook.util");
const _workspacecachedecorator = require("../../../workspace-cache/decorators/workspace-cache.decorator");
const _createidtouniversalidentifiermaputil = require("../../../workspace-cache/utils/create-id-to-universal-identifier-map.util");
const _addflatentitytoflatentitymapsthroughmutationorthrowutil = require("../../../workspace-manager/workspace-migration/utils/add-flat-entity-to-flat-entity-maps-through-mutation-or-throw.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
const FLAT_WEBHOOK_ROWS_REQUIREMENT = {
    webhook: {
        columns: true,
        where: {
            deletedAt: (0, _typeorm.IsNull)()
        }
    },
    application: [
        'id',
        'universalIdentifier',
        'deletedAt'
    ]
};
let WorkspaceFlatWebhookMapCacheService = class WorkspaceFlatWebhookMapCacheService extends _metadataflatentitymapscacheproviderservice.MetadataFlatEntityMapsCacheProvider {
    computeForCache({ rows }) {
        const { webhook: webhooks, application: applications } = rows;
        const applicationIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(applications.filter((application)=>!(0, _utils.isDefined)(application.deletedAt)));
        const flatWebhookMaps = (0, _createemptyflatentitymapsconstant.createEmptyFlatEntityMaps)();
        for (const webhookEntity of webhooks){
            const flatWebhook = (0, _fromwebhookentitytoflatwebhookutil.fromWebhookEntityToFlatWebhook)({
                entity: webhookEntity,
                applicationIdToUniversalIdentifierMap
            });
            (0, _addflatentitytoflatentitymapsthroughmutationorthrowutil.addFlatEntityToFlatEntityMapsThroughMutationOrThrow)({
                flatEntity: flatWebhook,
                flatEntityMapsToMutate: flatWebhookMaps
            });
        }
        return flatWebhookMaps;
    }
    constructor(...args){
        super(...args), this.rowsRequirement = FLAT_WEBHOOK_ROWS_REQUIREMENT;
    }
};
WorkspaceFlatWebhookMapCacheService = _ts_decorate([
    (0, _common.Injectable)(),
    (0, _workspacecachedecorator.WorkspaceCache)('flatWebhookMaps', {
        packingPonderation: 1
    })
], WorkspaceFlatWebhookMapCacheService);

//# sourceMappingURL=workspace-flat-webhook-map-cache.service.js.map