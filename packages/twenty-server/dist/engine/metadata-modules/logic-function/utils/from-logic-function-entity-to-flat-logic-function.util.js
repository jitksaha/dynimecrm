"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromLogicFunctionEntityToFlatLogicFunction", {
    enumerable: true,
    get: function() {
        return fromLogicFunctionEntityToFlatLogicFunction;
    }
});
const _fromentitytoscalarentityutil = require("../../flat-entity/utils/from-entity-to-scalar-entity.util");
const _resolvemanytoonerelationidstouniversalidentifiersutil = require("../../../workspace-manager/workspace-migration/universal-flat-entity/utils/resolve-many-to-one-relation-ids-to-universal-identifiers.util");
const fromLogicFunctionEntityToFlatLogicFunction = (args)=>{
    const { entity: logicFunctionEntity } = args;
    const logicFunctionScalarEntity = (0, _fromentitytoscalarentityutil.fromEntityToScalarEntity)({
        metadataName: 'logicFunction',
        entity: logicFunctionEntity
    });
    const relationUniversalIdentifiers = (0, _resolvemanytoonerelationidstouniversalidentifiersutil.resolveManyToOneRelationIdsToUniversalIdentifiers)({
        metadataName: 'logicFunction',
        ...args
    });
    return {
        ...logicFunctionScalarEntity,
        ...relationUniversalIdentifiers
    };
};

//# sourceMappingURL=from-logic-function-entity-to-flat-logic-function.util.js.map