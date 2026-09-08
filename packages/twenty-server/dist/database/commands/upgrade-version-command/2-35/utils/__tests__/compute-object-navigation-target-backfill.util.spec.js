"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _computeobjectnavigationtargetbackfillutil = require("../compute-object-navigation-target-backfill.util");
const _enginecomponentkeyenum = require("../../../../../../engine/metadata-modules/command-menu-item/enums/engine-component-key.enum");
const NOW = '2026-08-24T00:00:00.000Z';
const COMPANY_OBJECT_ID = '20202020-0000-0000-0000-00000000c0c0';
const COMPANY_OBJECT_UNIVERSAL_IDENTIFIER = '20202020-1111-1111-1111-11111111c0c0';
const buildFlatCommandMenuItem = (overrides)=>({
        universalIdentifier: overrides.id,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.NAVIGATION,
        payload: {
            objectMetadataItemId: COMPANY_OBJECT_ID
        },
        navigationTargetObjectMetadataId: null,
        navigationTargetObjectMetadataUniversalIdentifier: null,
        updatedAt: '2026-01-01T00:00:00.000Z',
        ...overrides
    });
const buildFlatCommandMenuItemMaps = (flatCommandMenuItems)=>({
        byUniversalIdentifier: Object.fromEntries(flatCommandMenuItems.map((item)=>[
                item.universalIdentifier,
                item
            ])),
        universalIdentifierById: Object.fromEntries(flatCommandMenuItems.map((item)=>[
                item.id,
                item.universalIdentifier
            ])),
        universalIdentifiersByApplicationId: {}
    });
const flatObjectMetadataMaps = {
    byUniversalIdentifier: {
        [COMPANY_OBJECT_UNIVERSAL_IDENTIFIER]: {
            id: COMPANY_OBJECT_ID,
            universalIdentifier: COMPANY_OBJECT_UNIVERSAL_IDENTIFIER
        }
    },
    universalIdentifierById: {
        [COMPANY_OBJECT_ID]: COMPANY_OBJECT_UNIVERSAL_IDENTIFIER
    },
    universalIdentifiersByApplicationId: {}
};
describe('computeObjectNavigationTargetBackfill', ()=>{
    it('derives the target from the object navigation payload', ()=>{
        const backfill = (0, _computeobjectnavigationtargetbackfillutil.computeObjectNavigationTargetBackfill)({
            flatCommandMenuItemMaps: buildFlatCommandMenuItemMaps([
                buildFlatCommandMenuItem({
                    id: 'command-1'
                })
            ]),
            flatObjectMetadataMaps,
            now: NOW
        });
        expect(backfill.flatCommandMenuItemsToUpdate).toHaveLength(1);
        expect(backfill.flatCommandMenuItemsToUpdate[0]).toMatchObject({
            id: 'command-1',
            navigationTargetObjectMetadataId: COMPANY_OBJECT_ID,
            navigationTargetObjectMetadataUniversalIdentifier: COMPANY_OBJECT_UNIVERSAL_IDENTIFIER,
            updatedAt: NOW
        });
    });
    it('is idempotent once the target column is set', ()=>{
        const backfill = (0, _computeobjectnavigationtargetbackfillutil.computeObjectNavigationTargetBackfill)({
            flatCommandMenuItemMaps: buildFlatCommandMenuItemMaps([
                buildFlatCommandMenuItem({
                    id: 'command-1',
                    navigationTargetObjectMetadataId: COMPANY_OBJECT_ID,
                    navigationTargetObjectMetadataUniversalIdentifier: COMPANY_OBJECT_UNIVERSAL_IDENTIFIER
                })
            ]),
            flatObjectMetadataMaps,
            now: NOW
        });
        expect(backfill.flatCommandMenuItemsToUpdate).toEqual([]);
    });
    it('leaves a path-based navigation command untouched', ()=>{
        const backfill = (0, _computeobjectnavigationtargetbackfillutil.computeObjectNavigationTargetBackfill)({
            flatCommandMenuItemMaps: buildFlatCommandMenuItemMaps([
                buildFlatCommandMenuItem({
                    id: 'command-1',
                    payload: {
                        path: '/settings'
                    }
                })
            ]),
            flatObjectMetadataMaps,
            now: NOW
        });
        expect(backfill.flatCommandMenuItemsToUpdate).toEqual([]);
        expect(backfill.flatCommandMenuItemsToDelete).toEqual([]);
    });
    it('leaves a non navigation command untouched', ()=>{
        const backfill = (0, _computeobjectnavigationtargetbackfillutil.computeObjectNavigationTargetBackfill)({
            flatCommandMenuItemMaps: buildFlatCommandMenuItemMaps([
                buildFlatCommandMenuItem({
                    id: 'command-1',
                    engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.FRONT_COMPONENT_RENDERER
                })
            ]),
            flatObjectMetadataMaps,
            now: NOW
        });
        expect(backfill.flatCommandMenuItemsToUpdate).toEqual([]);
    });
    it('deletes a command whose payload points at a missing object', ()=>{
        const backfill = (0, _computeobjectnavigationtargetbackfillutil.computeObjectNavigationTargetBackfill)({
            flatCommandMenuItemMaps: buildFlatCommandMenuItemMaps([
                buildFlatCommandMenuItem({
                    id: 'command-1',
                    payload: {
                        objectMetadataItemId: 'deleted-object'
                    }
                })
            ]),
            flatObjectMetadataMaps,
            now: NOW
        });
        expect(backfill.flatCommandMenuItemsToUpdate).toEqual([]);
        expect(backfill.flatCommandMenuItemsToDelete.map(({ id })=>id)).toEqual([
            'command-1'
        ]);
    });
    it('backfills every command targeting the same object', ()=>{
        const backfill = (0, _computeobjectnavigationtargetbackfillutil.computeObjectNavigationTargetBackfill)({
            flatCommandMenuItemMaps: buildFlatCommandMenuItemMaps([
                buildFlatCommandMenuItem({
                    id: 'command-1'
                }),
                buildFlatCommandMenuItem({
                    id: 'command-2'
                })
            ]),
            flatObjectMetadataMaps,
            now: NOW
        });
        expect(backfill.flatCommandMenuItemsToUpdate.map(({ id })=>id)).toEqual([
            'command-1',
            'command-2'
        ]);
    });
    it('backfills a command pointing at an object another command already targets', ()=>{
        const backfill = (0, _computeobjectnavigationtargetbackfillutil.computeObjectNavigationTargetBackfill)({
            flatCommandMenuItemMaps: buildFlatCommandMenuItemMaps([
                buildFlatCommandMenuItem({
                    id: 'command-1',
                    navigationTargetObjectMetadataId: COMPANY_OBJECT_ID,
                    navigationTargetObjectMetadataUniversalIdentifier: COMPANY_OBJECT_UNIVERSAL_IDENTIFIER
                }),
                buildFlatCommandMenuItem({
                    id: 'command-2'
                })
            ]),
            flatObjectMetadataMaps,
            now: NOW
        });
        expect(backfill.flatCommandMenuItemsToUpdate.map(({ id })=>id)).toEqual([
            'command-2'
        ]);
    });
});

//# sourceMappingURL=compute-object-navigation-target-backfill.util.spec.js.map