"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromViewFieldGroupEntityToFlatViewFieldGroup", {
    enumerable: true,
    get: function() {
        return fromViewFieldGroupEntityToFlatViewFieldGroup;
    }
});
const _fromentitytoscalarentityutil = require("../../flat-entity/utils/from-entity-to-scalar-entity.util");
const _resolvemanytoonerelationidstouniversalidentifiersutil = require("../../../workspace-manager/workspace-migration/universal-flat-entity/utils/resolve-many-to-one-relation-ids-to-universal-identifiers.util");
const fromViewFieldGroupEntityToFlatViewFieldGroup = (args)=>{
    const { entity: viewFieldGroupEntity } = args;
    const viewFieldGroupScalarEntity = (0, _fromentitytoscalarentityutil.fromEntityToScalarEntity)({
        metadataName: 'viewFieldGroup',
        entity: viewFieldGroupEntity
    });
    const relationUniversalIdentifiers = (0, _resolvemanytoonerelationidstouniversalidentifiersutil.resolveManyToOneRelationIdsToUniversalIdentifiers)({
        metadataName: 'viewFieldGroup',
        ...args
    });
    return {
        ...viewFieldGroupScalarEntity,
        ...relationUniversalIdentifiers,
        viewFieldIds: viewFieldGroupEntity.viewFields?.map((viewField)=>viewField.id) ?? [],
        viewFieldUniversalIdentifiers: viewFieldGroupEntity.viewFields?.map((viewField)=>viewField.universalIdentifier) ?? []
    };
};

//# sourceMappingURL=from-view-field-group-entity-to-flat-view-field-group.util.js.map