"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromFrontComponentEntityToFlatFrontComponent", {
    enumerable: true,
    get: function() {
        return fromFrontComponentEntityToFlatFrontComponent;
    }
});
const _fromentitytoscalarentityutil = require("../../flat-entity/utils/from-entity-to-scalar-entity.util");
const _resolvemanytoonerelationidstouniversalidentifiersutil = require("../../../workspace-manager/workspace-migration/universal-flat-entity/utils/resolve-many-to-one-relation-ids-to-universal-identifiers.util");
const fromFrontComponentEntityToFlatFrontComponent = (args)=>{
    const { entity: frontComponentEntity } = args;
    const frontComponentScalarEntity = (0, _fromentitytoscalarentityutil.fromEntityToScalarEntity)({
        metadataName: 'frontComponent',
        entity: frontComponentEntity
    });
    const relationUniversalIdentifiers = (0, _resolvemanytoonerelationidstouniversalidentifiersutil.resolveManyToOneRelationIdsToUniversalIdentifiers)({
        metadataName: 'frontComponent',
        ...args
    });
    return {
        ...frontComponentScalarEntity,
        ...relationUniversalIdentifiers
    };
};

//# sourceMappingURL=from-front-component-entity-to-flat-front-component.util.js.map