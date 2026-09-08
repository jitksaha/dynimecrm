"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromSkillEntityToFlatSkill", {
    enumerable: true,
    get: function() {
        return fromSkillEntityToFlatSkill;
    }
});
const _fromentitytoscalarentityutil = require("../../flat-entity/utils/from-entity-to-scalar-entity.util");
const _resolvemanytoonerelationidstouniversalidentifiersutil = require("../../../workspace-manager/workspace-migration/universal-flat-entity/utils/resolve-many-to-one-relation-ids-to-universal-identifiers.util");
const fromSkillEntityToFlatSkill = (args)=>{
    const { entity: skillEntity } = args;
    const skillScalarEntity = (0, _fromentitytoscalarentityutil.fromEntityToScalarEntity)({
        metadataName: 'skill',
        entity: skillEntity
    });
    const relationUniversalIdentifiers = (0, _resolvemanytoonerelationidstouniversalidentifiersutil.resolveManyToOneRelationIdsToUniversalIdentifiers)({
        metadataName: 'skill',
        ...args
    });
    return {
        ...skillScalarEntity,
        ...relationUniversalIdentifiers
    };
};

//# sourceMappingURL=from-skill-entity-to-flat-skill.util.js.map