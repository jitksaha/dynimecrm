"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromPageLayoutWidgetEntityToFlatPageLayoutWidget", {
    enumerable: true,
    get: function() {
        return fromPageLayoutWidgetEntityToFlatPageLayoutWidget;
    }
});
const _utils = require("twenty-shared/utils");
const _fromentitytoscalarentityutil = require("../../flat-entity/utils/from-entity-to-scalar-entity.util");
const _frompagelayoutwidgetconfigurationtouniversalconfigurationutil = require("./from-page-layout-widget-configuration-to-universal-configuration.util");
const _frompagelayoutwidgetoverridestouniversaloverridesutil = require("./from-page-layout-widget-overrides-to-universal-overrides.util");
const _resolvemanytoonerelationidstouniversalidentifiersutil = require("../../../workspace-manager/workspace-migration/universal-flat-entity/utils/resolve-many-to-one-relation-ids-to-universal-identifiers.util");
const fromPageLayoutWidgetEntityToFlatPageLayoutWidget = (args)=>{
    const { entity: pageLayoutWidgetEntity, pageLayoutTabIdToUniversalIdentifierMap, fieldMetadataUniversalIdentifierById, frontComponentUniversalIdentifierById, viewFieldGroupUniversalIdentifierById, viewUniversalIdentifierById } = args;
    const pageLayoutWidgetScalarEntity = (0, _fromentitytoscalarentityutil.fromEntityToScalarEntity)({
        metadataName: 'pageLayoutWidget',
        entity: pageLayoutWidgetEntity
    });
    const relationUniversalIdentifiers = (0, _resolvemanytoonerelationidstouniversalidentifiersutil.resolveManyToOneRelationIdsToUniversalIdentifiers)({
        metadataName: 'pageLayoutWidget',
        ...args
    });
    const configurationWithUniversalIdentifiers = (0, _frompagelayoutwidgetconfigurationtouniversalconfigurationutil.fromPageLayoutWidgetConfigurationToUniversalConfiguration)({
        configuration: pageLayoutWidgetScalarEntity.configuration,
        fieldMetadataUniversalIdentifierById,
        frontComponentUniversalIdentifierById,
        viewFieldGroupUniversalIdentifierById,
        viewUniversalIdentifierById
    });
    const pageLayoutTabUniversalIdentifierById = Object.fromEntries(pageLayoutTabIdToUniversalIdentifierMap.entries());
    const universalOverrides = (0, _utils.isDefined)(pageLayoutWidgetEntity.overrides) ? (0, _frompagelayoutwidgetoverridestouniversaloverridesutil.fromPageLayoutWidgetOverridesToUniversalOverrides)({
        overrides: pageLayoutWidgetEntity.overrides,
        pageLayoutTabUniversalIdentifierById,
        shouldThrowOnMissingIdentifier: false
    }) : null;
    return {
        ...pageLayoutWidgetScalarEntity,
        ...relationUniversalIdentifiers,
        universalConfiguration: configurationWithUniversalIdentifiers,
        universalOverrides
    };
};

//# sourceMappingURL=from-page-layout-widget-entity-to-flat-page-layout-widget.util.js.map