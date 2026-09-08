"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromNavigationMenuItemEntityToFlatNavigationMenuItem", {
    enumerable: true,
    get: function() {
        return fromNavigationMenuItemEntityToFlatNavigationMenuItem;
    }
});
const _fromentitytoscalarentityutil = require("../../flat-entity/utils/from-entity-to-scalar-entity.util");
const _resolvemanytoonerelationidstouniversalidentifiersutil = require("../../../workspace-manager/workspace-migration/universal-flat-entity/utils/resolve-many-to-one-relation-ids-to-universal-identifiers.util");
const fromNavigationMenuItemEntityToFlatNavigationMenuItem = (args)=>{
    const { entity: navigationMenuItemEntity } = args;
    const navigationMenuItemScalarEntity = (0, _fromentitytoscalarentityutil.fromEntityToScalarEntity)({
        metadataName: 'navigationMenuItem',
        entity: navigationMenuItemEntity
    });
    const relationUniversalIdentifiers = (0, _resolvemanytoonerelationidstouniversalidentifiersutil.resolveManyToOneRelationIdsToUniversalIdentifiers)({
        metadataName: 'navigationMenuItem',
        ...args
    });
    return {
        ...navigationMenuItemScalarEntity,
        ...relationUniversalIdentifiers
    };
};

//# sourceMappingURL=from-navigation-menu-item-entity-to-flat-navigation-menu-item.util.js.map