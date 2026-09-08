"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromViewFieldEntityToFlatViewField", {
    enumerable: true,
    get: function() {
        return fromViewFieldEntityToFlatViewField;
    }
});
const _utils = require("twenty-shared/utils");
const _fromentitytoscalarentityutil = require("../../flat-entity/utils/from-entity-to-scalar-entity.util");
const _fromviewfieldoverridestouniversaloverridesutil = require("./from-view-field-overrides-to-universal-overrides.util");
const _resolvemanytoonerelationidstouniversalidentifiersutil = require("../../../workspace-manager/workspace-migration/universal-flat-entity/utils/resolve-many-to-one-relation-ids-to-universal-identifiers.util");
const fromViewFieldEntityToFlatViewField = (args)=>{
    const { entity: viewFieldEntity, viewFieldGroupIdToUniversalIdentifierMap } = args;
    const viewFieldScalarEntity = (0, _fromentitytoscalarentityutil.fromEntityToScalarEntity)({
        metadataName: 'viewField',
        entity: viewFieldEntity
    });
    const relationUniversalIdentifiers = (0, _resolvemanytoonerelationidstouniversalidentifiersutil.resolveManyToOneRelationIdsToUniversalIdentifiers)({
        metadataName: 'viewField',
        ...args
    });
    const viewFieldGroupUniversalIdentifierById = Object.fromEntries(viewFieldGroupIdToUniversalIdentifierMap.entries());
    const universalOverrides = (0, _utils.isDefined)(viewFieldEntity.overrides) ? (0, _fromviewfieldoverridestouniversaloverridesutil.fromViewFieldOverridesToUniversalOverrides)({
        overrides: viewFieldEntity.overrides,
        viewFieldGroupUniversalIdentifierById,
        shouldThrowOnMissingIdentifier: false
    }) : null;
    return {
        ...viewFieldScalarEntity,
        ...relationUniversalIdentifiers,
        universalOverrides
    };
};

//# sourceMappingURL=from-view-field-entity-to-flat-view-field.util.js.map