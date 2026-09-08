"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromApplicationVariableEntityToFlatApplicationVariable", {
    enumerable: true,
    get: function() {
        return fromApplicationVariableEntityToFlatApplicationVariable;
    }
});
const _fromentitytoscalarentityutil = require("../../flat-entity/utils/from-entity-to-scalar-entity.util");
const _resolvemanytoonerelationidstouniversalidentifiersutil = require("../../../workspace-manager/workspace-migration/universal-flat-entity/utils/resolve-many-to-one-relation-ids-to-universal-identifiers.util");
const fromApplicationVariableEntityToFlatApplicationVariable = (args)=>{
    const { entity: applicationVariableEntity } = args;
    const applicationVariableScalarEntity = (0, _fromentitytoscalarentityutil.fromEntityToScalarEntity)({
        metadataName: 'applicationVariable',
        entity: applicationVariableEntity
    });
    const relationUniversalIdentifiers = (0, _resolvemanytoonerelationidstouniversalidentifiersutil.resolveManyToOneRelationIdsToUniversalIdentifiers)({
        metadataName: 'applicationVariable',
        ...args
    });
    return {
        ...applicationVariableScalarEntity,
        ...relationUniversalIdentifiers
    };
};

//# sourceMappingURL=from-application-variable-entity-to-flat-application-variable.util.js.map