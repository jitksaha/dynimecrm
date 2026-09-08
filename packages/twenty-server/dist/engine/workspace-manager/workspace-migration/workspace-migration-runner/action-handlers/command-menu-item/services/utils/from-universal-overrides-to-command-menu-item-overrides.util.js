"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromUniversalOverridesToCommandMenuItemOverrides", {
    enumerable: true,
    get: function() {
        return fromUniversalOverridesToCommandMenuItemOverrides;
    }
});
const _findflatentitybyuniversalidentifierutil = require("../../../../../../../metadata-modules/flat-entity/utils/find-flat-entity-by-universal-identifier.util");
const fromUniversalOverridesToCommandMenuItemOverrides = ({ universalOverrides, flatObjectMetadataMaps, flatPageLayoutMaps })=>{
    const { availabilityObjectMetadataUniversalIdentifier, pageLayoutUniversalIdentifier, ...scalarOverrides } = universalOverrides;
    const overrides = {
        ...scalarOverrides
    };
    if (availabilityObjectMetadataUniversalIdentifier !== undefined) {
        if (availabilityObjectMetadataUniversalIdentifier === null) {
            overrides.availabilityObjectMetadataId = null;
        } else {
            const flatObjectMetadata = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
                flatEntityMaps: flatObjectMetadataMaps,
                universalIdentifier: availabilityObjectMetadataUniversalIdentifier
            });
            overrides.availabilityObjectMetadataId = flatObjectMetadata?.id ?? null;
        }
    }
    if (pageLayoutUniversalIdentifier !== undefined) {
        if (pageLayoutUniversalIdentifier === null) {
            overrides.pageLayoutId = null;
        } else {
            const flatPageLayout = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
                flatEntityMaps: flatPageLayoutMaps,
                universalIdentifier: pageLayoutUniversalIdentifier
            });
            overrides.pageLayoutId = flatPageLayout?.id ?? null;
        }
    }
    return overrides;
};

//# sourceMappingURL=from-universal-overrides-to-command-menu-item-overrides.util.js.map