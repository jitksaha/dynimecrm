"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromWebhookEntityToFlatWebhook", {
    enumerable: true,
    get: function() {
        return fromWebhookEntityToFlatWebhook;
    }
});
const _fromentitytoscalarentityutil = require("../../flat-entity/utils/from-entity-to-scalar-entity.util");
const _resolvemanytoonerelationidstouniversalidentifiersutil = require("../../../workspace-manager/workspace-migration/universal-flat-entity/utils/resolve-many-to-one-relation-ids-to-universal-identifiers.util");
const fromWebhookEntityToFlatWebhook = (args)=>{
    const { entity: webhookEntity } = args;
    const webhookScalarEntity = (0, _fromentitytoscalarentityutil.fromEntityToScalarEntity)({
        metadataName: 'webhook',
        entity: webhookEntity
    });
    const relationUniversalIdentifiers = (0, _resolvemanytoonerelationidstouniversalidentifiersutil.resolveManyToOneRelationIdsToUniversalIdentifiers)({
        metadataName: 'webhook',
        ...args
    });
    return {
        ...webhookScalarEntity,
        ...relationUniversalIdentifiers
    };
};

//# sourceMappingURL=from-webhook-entity-to-flat-webhook.util.js.map