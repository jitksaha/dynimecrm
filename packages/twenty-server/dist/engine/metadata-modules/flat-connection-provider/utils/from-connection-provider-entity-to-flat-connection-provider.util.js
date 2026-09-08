"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromConnectionProviderEntityToFlatConnectionProvider", {
    enumerable: true,
    get: function() {
        return fromConnectionProviderEntityToFlatConnectionProvider;
    }
});
const _fromentitytoscalarentityutil = require("../../flat-entity/utils/from-entity-to-scalar-entity.util");
const _resolvemanytoonerelationidstouniversalidentifiersutil = require("../../../workspace-manager/workspace-migration/universal-flat-entity/utils/resolve-many-to-one-relation-ids-to-universal-identifiers.util");
const fromConnectionProviderEntityToFlatConnectionProvider = (args)=>{
    const { entity: connectionProviderEntity } = args;
    const connectionProviderScalarEntity = (0, _fromentitytoscalarentityutil.fromEntityToScalarEntity)({
        metadataName: 'connectionProvider',
        entity: connectionProviderEntity
    });
    const relationUniversalIdentifiers = (0, _resolvemanytoonerelationidstouniversalidentifiersutil.resolveManyToOneRelationIdsToUniversalIdentifiers)({
        metadataName: 'connectionProvider',
        ...args
    });
    return {
        ...connectionProviderScalarEntity,
        ...relationUniversalIdentifiers
    };
};

//# sourceMappingURL=from-connection-provider-entity-to-flat-connection-provider.util.js.map