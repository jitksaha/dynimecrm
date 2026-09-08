"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _createemptyflatentitymapsconstant = require("../../../../flat-entity/constant/create-empty-flat-entity-maps.constant");
const _validatenavigationmenuitempagelayoutreferencecrossentityutil = require("../validate-navigation-menu-item-page-layout-reference-cross-entity.util");
const _navigationmenuitemexception = require("../../../../navigation-menu-item/navigation-menu-item.exception");
const NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER = '00000000-0000-0000-0000-000000000001';
const PAGE_LAYOUT_UNIVERSAL_IDENTIFIER = '00000000-0000-0000-0000-0000000000aa';
const MISSING_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER = '00000000-0000-0000-0000-0000000000bb';
const mapsFrom = (entities)=>{
    const maps = (0, _createemptyflatentitymapsconstant.createEmptyFlatEntityMaps)();
    for (const entity of entities){
        maps.byUniversalIdentifier[entity.universalIdentifier] = entity;
    }
    return maps;
};
const pageLayout = (type, universalIdentifier = PAGE_LAYOUT_UNIVERSAL_IDENTIFIER)=>({
        universalIdentifier,
        type
    });
const navigationMenuItem = (pageLayoutUniversalIdentifier, universalIdentifier = NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER)=>({
        universalIdentifier,
        type: _types.NavigationMenuItemType.PAGE_LAYOUT,
        pageLayoutUniversalIdentifier
    });
const emptyActions = ()=>({
        create: [],
        update: [],
        delete: []
    });
const reportFrom = ({ createdNavigationMenuItemUniversalIdentifiers = [], updatedNavigationMenuItemUniversalIdentifiers = [], createdPageLayoutUniversalIdentifiers = [], updatedPageLayoutUniversalIdentifiers = [] })=>({
        navigationMenuItem: {
            ...emptyActions(),
            create: createdNavigationMenuItemUniversalIdentifiers.map((universalIdentifier)=>({
                    flatEntity: {
                        universalIdentifier
                    }
                })),
            update: updatedNavigationMenuItemUniversalIdentifiers.map((universalIdentifier)=>({
                    universalIdentifier
                }))
        },
        pageLayout: {
            ...emptyActions(),
            create: createdPageLayoutUniversalIdentifiers.map((universalIdentifier)=>({
                    flatEntity: {
                        universalIdentifier
                    }
                })),
            update: updatedPageLayoutUniversalIdentifiers.map((universalIdentifier)=>({
                    universalIdentifier
                }))
        }
    });
const run = ({ navigationMenuItems, pageLayouts, report })=>(0, _validatenavigationmenuitempagelayoutreferencecrossentityutil.validateNavigationMenuItemPageLayoutReferenceCrossEntity)({
        optimisticUniversalFlatMaps: {
            flatNavigationMenuItemMaps: mapsFrom(navigationMenuItems),
            flatPageLayoutMaps: mapsFrom(pageLayouts)
        },
        orchestratorActionsReport: report
    });
const errorCodes = (result)=>result.navigationMenuItem.flatMap((failed)=>failed.errors.map((error)=>error.code));
describe('validateNavigationMenuItemPageLayoutReferenceCrossEntity', ()=>{
    it('accepts a created PAGE_LAYOUT item referencing a same-migration STANDALONE_PAGE layout', ()=>{
        const result = run({
            navigationMenuItems: [
                navigationMenuItem(PAGE_LAYOUT_UNIVERSAL_IDENTIFIER)
            ],
            pageLayouts: [
                pageLayout(_types.PageLayoutType.STANDALONE_PAGE)
            ],
            report: reportFrom({
                createdNavigationMenuItemUniversalIdentifiers: [
                    NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER
                ],
                createdPageLayoutUniversalIdentifiers: [
                    PAGE_LAYOUT_UNIVERSAL_IDENTIFIER
                ]
            })
        });
        expect(errorCodes(result)).not.toContain(_navigationmenuitemexception.NavigationMenuItemExceptionCode.INVALID_NAVIGATION_MENU_ITEM_INPUT);
    });
    it('rejects a created PAGE_LAYOUT item referencing a same-migration DASHBOARD layout', ()=>{
        const result = run({
            navigationMenuItems: [
                navigationMenuItem(PAGE_LAYOUT_UNIVERSAL_IDENTIFIER)
            ],
            pageLayouts: [
                pageLayout(_types.PageLayoutType.DASHBOARD)
            ],
            report: reportFrom({
                createdNavigationMenuItemUniversalIdentifiers: [
                    NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER
                ],
                createdPageLayoutUniversalIdentifiers: [
                    PAGE_LAYOUT_UNIVERSAL_IDENTIFIER
                ]
            })
        });
        expect(errorCodes(result)).toContain(_navigationmenuitemexception.NavigationMenuItemExceptionCode.INVALID_NAVIGATION_MENU_ITEM_INPUT);
    });
    it('rejects a created PAGE_LAYOUT item referencing a same-migration RECORD_PAGE layout', ()=>{
        const result = run({
            navigationMenuItems: [
                navigationMenuItem(PAGE_LAYOUT_UNIVERSAL_IDENTIFIER)
            ],
            pageLayouts: [
                pageLayout(_types.PageLayoutType.RECORD_PAGE)
            ],
            report: reportFrom({
                createdNavigationMenuItemUniversalIdentifiers: [
                    NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER
                ],
                createdPageLayoutUniversalIdentifiers: [
                    PAGE_LAYOUT_UNIVERSAL_IDENTIFIER
                ]
            })
        });
        expect(errorCodes(result)).toContain(_navigationmenuitemexception.NavigationMenuItemExceptionCode.INVALID_NAVIGATION_MENU_ITEM_INPUT);
    });
    it('does not raise a type error when the referenced layout cannot be resolved', ()=>{
        const result = run({
            navigationMenuItems: [
                navigationMenuItem(MISSING_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER)
            ],
            pageLayouts: [
                pageLayout(_types.PageLayoutType.STANDALONE_PAGE)
            ],
            report: reportFrom({
                createdNavigationMenuItemUniversalIdentifiers: [
                    NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER
                ]
            })
        });
        expect(errorCodes(result)).not.toContain(_navigationmenuitemexception.NavigationMenuItemExceptionCode.INVALID_NAVIGATION_MENU_ITEM_INPUT);
    });
    it('rejects an untouched item when its layout type is updated to a non-standalone type in the same migration', ()=>{
        const result = run({
            navigationMenuItems: [
                navigationMenuItem(PAGE_LAYOUT_UNIVERSAL_IDENTIFIER)
            ],
            pageLayouts: [
                pageLayout(_types.PageLayoutType.RECORD_PAGE)
            ],
            report: reportFrom({
                updatedPageLayoutUniversalIdentifiers: [
                    PAGE_LAYOUT_UNIVERSAL_IDENTIFIER
                ]
            })
        });
        expect(errorCodes(result)).toContain(_navigationmenuitemexception.NavigationMenuItemExceptionCode.INVALID_NAVIGATION_MENU_ITEM_INPUT);
    });
    it('accepts an updated item whose layout is concurrently updated to STANDALONE_PAGE (no false positive)', ()=>{
        const result = run({
            navigationMenuItems: [
                navigationMenuItem(PAGE_LAYOUT_UNIVERSAL_IDENTIFIER)
            ],
            pageLayouts: [
                pageLayout(_types.PageLayoutType.STANDALONE_PAGE)
            ],
            report: reportFrom({
                updatedNavigationMenuItemUniversalIdentifiers: [
                    NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER
                ],
                updatedPageLayoutUniversalIdentifiers: [
                    PAGE_LAYOUT_UNIVERSAL_IDENTIFIER
                ]
            })
        });
        expect(errorCodes(result)).not.toContain(_navigationmenuitemexception.NavigationMenuItemExceptionCode.INVALID_NAVIGATION_MENU_ITEM_INPUT);
    });
    it('ignores items that are neither touched nor pointing to a touched layout', ()=>{
        const result = run({
            navigationMenuItems: [
                navigationMenuItem(PAGE_LAYOUT_UNIVERSAL_IDENTIFIER)
            ],
            pageLayouts: [
                pageLayout(_types.PageLayoutType.DASHBOARD)
            ],
            report: reportFrom({})
        });
        expect(errorCodes(result)).toHaveLength(0);
    });
});

//# sourceMappingURL=validate-navigation-menu-item-page-layout-reference-cross-entity.util.spec.js.map