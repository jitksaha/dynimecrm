"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _computeappendedpagelayouttabpositionsutil = require("../compute-appended-page-layout-tab-positions.util");
const buildPageLayoutTab = ({ position, deletedAt = null })=>({
        position,
        deletedAt
    });
describe('computeAppendedPageLayoutTabPositions', ()=>{
    it('appends after the last existing tab', ()=>{
        expect((0, _computeappendedpagelayouttabpositionsutil.computeAppendedPageLayoutTabPositions)({
            existingPageLayoutTabs: [
                buildPageLayoutTab({
                    position: 10
                }),
                buildPageLayoutTab({
                    position: 20
                })
            ],
            appendedTabCount: 2
        })).toEqual([
            30,
            40
        ]);
    });
    it('appends after custom tabs that sit beyond the standard positions', ()=>{
        expect((0, _computeappendedpagelayouttabpositionsutil.computeAppendedPageLayoutTabPositions)({
            existingPageLayoutTabs: [
                buildPageLayoutTab({
                    position: 10
                }),
                buildPageLayoutTab({
                    position: 20
                }),
                buildPageLayoutTab({
                    position: 45
                })
            ],
            appendedTabCount: 2
        })).toEqual([
            55,
            65
        ]);
    });
    it('ignores soft-deleted tabs', ()=>{
        expect((0, _computeappendedpagelayouttabpositionsutil.computeAppendedPageLayoutTabPositions)({
            existingPageLayoutTabs: [
                buildPageLayoutTab({
                    position: 10
                }),
                buildPageLayoutTab({
                    position: 90,
                    deletedAt: '2026-01-01T00:00:00.000Z'
                })
            ],
            appendedTabCount: 1
        })).toEqual([
            20
        ]);
    });
    it('starts from the first standard position when no tabs exist', ()=>{
        expect((0, _computeappendedpagelayouttabpositionsutil.computeAppendedPageLayoutTabPositions)({
            existingPageLayoutTabs: [],
            appendedTabCount: 2
        })).toEqual([
            10,
            20
        ]);
    });
    it('returns nothing when there is no tab to append', ()=>{
        expect((0, _computeappendedpagelayouttabpositionsutil.computeAppendedPageLayoutTabPositions)({
            existingPageLayoutTabs: [
                buildPageLayoutTab({
                    position: 10
                })
            ],
            appendedTabCount: 0
        })).toEqual([]);
    });
});

//# sourceMappingURL=compute-appended-page-layout-tab-positions.util.spec.js.map