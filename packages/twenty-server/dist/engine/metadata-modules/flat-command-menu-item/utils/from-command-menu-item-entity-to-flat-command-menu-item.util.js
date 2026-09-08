"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromCommandMenuItemEntityToFlatCommandMenuItem", {
    enumerable: true,
    get: function() {
        return fromCommandMenuItemEntityToFlatCommandMenuItem;
    }
});
const _utils = require("twenty-shared/utils");
const _fromcommandmenuitemoverridestouniversaloverridesutil = require("./from-command-menu-item-overrides-to-universal-overrides.util");
const _fromentitytoscalarentityutil = require("../../flat-entity/utils/from-entity-to-scalar-entity.util");
const _resolvemanytoonerelationidstouniversalidentifiersutil = require("../../../workspace-manager/workspace-migration/universal-flat-entity/utils/resolve-many-to-one-relation-ids-to-universal-identifiers.util");
const fromCommandMenuItemEntityToFlatCommandMenuItem = (args)=>{
    const { entity: commandMenuItemEntity, objectMetadataIdToUniversalIdentifierMap, pageLayoutIdToUniversalIdentifierMap } = args;
    const commandMenuItemScalarEntity = (0, _fromentitytoscalarentityutil.fromEntityToScalarEntity)({
        metadataName: 'commandMenuItem',
        entity: commandMenuItemEntity
    });
    const relationUniversalIdentifiers = (0, _resolvemanytoonerelationidstouniversalidentifiersutil.resolveManyToOneRelationIdsToUniversalIdentifiers)({
        metadataName: 'commandMenuItem',
        ...args
    });
    const universalOverrides = (0, _utils.isDefined)(commandMenuItemEntity.overrides) ? (0, _fromcommandmenuitemoverridestouniversaloverridesutil.fromCommandMenuItemOverridesToUniversalOverrides)({
        overrides: commandMenuItemEntity.overrides,
        objectMetadataUniversalIdentifierById: Object.fromEntries(objectMetadataIdToUniversalIdentifierMap.entries()),
        pageLayoutUniversalIdentifierById: Object.fromEntries(pageLayoutIdToUniversalIdentifierMap.entries()),
        shouldThrowOnMissingIdentifier: false
    }) : null;
    return {
        ...commandMenuItemScalarEntity,
        ...relationUniversalIdentifiers,
        universalOverrides
    };
};

//# sourceMappingURL=from-command-menu-item-entity-to-flat-command-menu-item.util.js.map