"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get DEFAULT_DPA_REGION () {
        return DEFAULT_DPA_REGION;
    },
    get DPA_REGION_CONFIGS () {
        return DPA_REGION_CONFIGS;
    },
    get TWENTY_PRESIGNED_SIGNATORY () {
        return TWENTY_PRESIGNED_SIGNATORY;
    },
    get getDpaRegionConfig () {
        return getDpaRegionConfig;
    }
});
const _dparegionenum = require("../enums/dpa-region.enum");
const DEFAULT_DPA_REGION = _dparegionenum.DpaRegion.EU;
const DPA_COMMON_VALUES = {
    PROCESSOR_ENTITY: 'Twenty.com PBC',
    PROCESSOR_LEGAL_FORM: 'a public benefit corporation under the laws of Delaware, USA',
    // Registered office is the Delaware registered agent; the SF notices
    // address is kept distinct so the two are not conflated under one label.
    PROCESSOR_ADDRESS: 'c/o National Registered Agents, Inc., 1209 Orange Street, Wilmington, Delaware 19801, USA. For notices: 2261 Market Street #5275, San Francisco, California 94114, USA',
    EU_AFFILIATE_ENTITY: 'Twenty.com SAS',
    EU_AFFILIATE_LEGAL_FORM: 'a société par actions simplifiée under the laws of France',
    EU_AFFILIATE_ADDRESS: '9 Rue des Colonnes, 75002 Paris, France',
    GOVERNING_LAW: 'the State of Delaware, USA',
    DPO_NAME_AND_CONTACT: 'Stéphanie Joly, privacy@twenty.com'
};
const DPA_REGION_CONFIGS = {
    [_dparegionenum.DpaRegion.EU]: {
        region: _dparegionenum.DpaRegion.EU,
        sccSectionActive: true,
        values: {
            ...DPA_COMMON_VALUES,
            HOSTING_REGION: 'EU (Frankfurt, Germany)'
        }
    },
    [_dparegionenum.DpaRegion.US]: {
        region: _dparegionenum.DpaRegion.US,
        sccSectionActive: true,
        values: {
            ...DPA_COMMON_VALUES,
            HOSTING_REGION: 'United States'
        }
    }
};
const TWENTY_PRESIGNED_SIGNATORY = {
    name: 'Félix Malfait',
    title: 'Chief Executive Officer'
};
const getDpaRegionConfig = (region)=>DPA_REGION_CONFIGS[region] ?? DPA_REGION_CONFIGS[DEFAULT_DPA_REGION];

//# sourceMappingURL=dpa-region-config.constant.js.map