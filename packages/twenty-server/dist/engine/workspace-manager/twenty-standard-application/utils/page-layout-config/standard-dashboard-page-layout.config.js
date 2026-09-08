"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "STANDARD_DASHBOARD_PAGE_LAYOUT_CONFIG", {
    enumerable: true,
    get: function() {
        return STANDARD_DASHBOARD_PAGE_LAYOUT_CONFIG;
    }
});
const _metadata = require("twenty-shared/metadata");
const _types = require("twenty-shared/types");
const DASHBOARD_PAGE_TABS = {
    tab1: {
        universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.myFirstDashboard.tabs.tab1.universalIdentifier,
        title: 'Tab 1',
        position: 0,
        icon: null,
        layoutMode: _types.PageLayoutTabLayoutMode.GRID,
        widgets: {
            welcomeRichText: {
                universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.myFirstDashboard.tabs.tab1.widgets.welcomeRichText.universalIdentifier
            },
            dealsByCompany: {
                universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.myFirstDashboard.tabs.tab1.widgets.dealsByCompany.universalIdentifier
            },
            pipelineValueByStage: {
                universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.myFirstDashboard.tabs.tab1.widgets.pipelineValueByStage.universalIdentifier
            },
            revenueTimeline: {
                universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.myFirstDashboard.tabs.tab1.widgets.revenueTimeline.universalIdentifier
            },
            opportunitiesByOwner: {
                universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.myFirstDashboard.tabs.tab1.widgets.opportunitiesByOwner.universalIdentifier
            },
            stockMarketIframe: {
                universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.myFirstDashboard.tabs.tab1.widgets.stockMarketIframe.universalIdentifier
            },
            dealsCreatedThisMonth: {
                universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.myFirstDashboard.tabs.tab1.widgets.dealsCreatedThisMonth.universalIdentifier
            },
            dealValueCreatedThisMonth: {
                universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.myFirstDashboard.tabs.tab1.widgets.dealValueCreatedThisMonth.universalIdentifier
            }
        }
    }
};
const STANDARD_DASHBOARD_PAGE_LAYOUT_CONFIG = {
    name: 'My First Dashboard',
    type: _types.PageLayoutType.DASHBOARD,
    objectUniversalIdentifier: null,
    universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.myFirstDashboard.universalIdentifier,
    defaultTabUniversalIdentifier: null,
    tabs: DASHBOARD_PAGE_TABS
};

//# sourceMappingURL=standard-dashboard-page-layout.config.js.map