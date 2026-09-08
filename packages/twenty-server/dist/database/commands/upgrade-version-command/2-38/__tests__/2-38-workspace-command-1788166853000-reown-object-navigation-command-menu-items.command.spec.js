"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _application = require("twenty-shared/application");
const _buildlegacynavigationflatcommandmenuitemutil = require("../../utils/build-legacy-navigation-flat-command-menu-item.util");
const _238workspacecommand1788166853000reownobjectnavigationcommandmenuitemscommand = require("../2-38-workspace-command-1788166853000-reown-object-navigation-command-menu-items.command");
const _enginecomponentkeyenum = require("../../../../../engine/metadata-modules/command-menu-item/enums/engine-component-key.enum");
const WORKSPACE_ID = '20202020-0000-4000-8000-000000000001';
const APPLICATION_UNIVERSAL_IDENTIFIER = '20202020-0000-4000-8000-0000000000ad';
const OBJECT_ID = '20202020-0000-4000-8000-0000000000b1';
const OBJECT_UNIVERSAL_IDENTIFIER = '20202020-0000-4000-8000-0000000000bb';
const DERIVED_UNIVERSAL_IDENTIFIER = (0, _application.getSystemNavigationCommandMenuItemUniversalIdentifier)({
    objectMetadataApplicationUniversalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
    objectUniversalIdentifier: OBJECT_UNIVERSAL_IDENTIFIER
});
const LEGACY_UNIVERSAL_IDENTIFIER = (0, _buildlegacynavigationflatcommandmenuitemutil.getLegacyNavigationCommandUniversalIdentifier)(OBJECT_UNIVERSAL_IDENTIFIER);
const buildFlatCommandMenuItem = (commandMenuItem)=>({
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.NAVIGATION,
        applicationUniversalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
        payload: {
            objectMetadataItemId: OBJECT_ID
        },
        navigationTargetObjectMetadataUniversalIdentifier: OBJECT_UNIVERSAL_IDENTIFIER,
        isSystemSideEffect: true,
        ...commandMenuItem
    });
const buildByUniversalIdentifierMap = (flatEntities)=>({
        byUniversalIdentifier: Object.fromEntries(flatEntities.map((flatEntity)=>[
                flatEntity.universalIdentifier,
                flatEntity
            ]))
    });
describe('ReownObjectNavigationCommandMenuItemsCommand', ()=>{
    let command;
    let getOrRecomputeMock;
    let invalidateCacheMock;
    let commandMenuItemUpdateMock;
    beforeEach(()=>{
        jest.clearAllMocks();
        getOrRecomputeMock = jest.fn();
        invalidateCacheMock = jest.fn().mockResolvedValue(undefined);
        commandMenuItemUpdateMock = jest.fn().mockResolvedValue(undefined);
        const entityManagerMock = {
            getRepository: ()=>({
                    update: commandMenuItemUpdateMock
                })
        };
        const commandMenuItemRepositoryMock = {
            manager: {
                transaction: jest.fn(async (callback)=>callback(entityManagerMock))
            }
        };
        command = new _238workspacecommand1788166853000reownobjectnavigationcommandmenuitemscommand.ReownObjectNavigationCommandMenuItemsCommand({}, {
            getOrRecompute: getOrRecomputeMock
        }, {
            invalidateCache: invalidateCacheMock
        }, commandMenuItemRepositoryMock);
    });
    const mockWorkspaceCache = (commandMenuItems)=>{
        getOrRecomputeMock.mockResolvedValue({
            flatCommandMenuItemMaps: buildByUniversalIdentifierMap(commandMenuItems),
            flatObjectMetadataMaps: {
                ...buildByUniversalIdentifierMap([
                    {
                        universalIdentifier: OBJECT_UNIVERSAL_IDENTIFIER,
                        applicationUniversalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER
                    }
                ]),
                universalIdentifierById: {
                    [OBJECT_ID]: OBJECT_UNIVERSAL_IDENTIFIER
                }
            }
        });
    };
    const runOnWorkspace = (dryRun = false)=>command.runOnWorkspace({
            workspaceId: WORKSPACE_ID,
            options: {
                dryRun
            },
            index: 0,
            total: 1
        });
    it('re-owns a legacy-identifier navigation command onto the derived identifier', async ()=>{
        mockWorkspaceCache([
            buildFlatCommandMenuItem({
                id: 'command-id',
                universalIdentifier: LEGACY_UNIVERSAL_IDENTIFIER
            })
        ]);
        await runOnWorkspace();
        expect(commandMenuItemUpdateMock).toHaveBeenCalledTimes(1);
        expect(commandMenuItemUpdateMock).toHaveBeenCalledWith({
            id: 'command-id',
            workspaceId: WORKSPACE_ID
        }, {
            universalIdentifier: DERIVED_UNIVERSAL_IDENTIFIER
        });
        expect(invalidateCacheMock).toHaveBeenCalledTimes(1);
    });
    it('also reconciles the flag when a legacy row carries isSystemSideEffect false', async ()=>{
        mockWorkspaceCache([
            buildFlatCommandMenuItem({
                id: 'command-id',
                universalIdentifier: LEGACY_UNIVERSAL_IDENTIFIER,
                isSystemSideEffect: false
            })
        ]);
        await runOnWorkspace();
        expect(commandMenuItemUpdateMock).toHaveBeenCalledWith({
            id: 'command-id',
            workspaceId: WORKSPACE_ID
        }, {
            universalIdentifier: DERIVED_UNIVERSAL_IDENTIFIER,
            isSystemSideEffect: true
        });
    });
    it('is a noop for rows already holding their derived identifier', async ()=>{
        mockWorkspaceCache([
            buildFlatCommandMenuItem({
                id: 'command-id',
                universalIdentifier: DERIVED_UNIVERSAL_IDENTIFIER
            })
        ]);
        await runOnWorkspace();
        expect(commandMenuItemUpdateMock).not.toHaveBeenCalled();
        expect(invalidateCacheMock).not.toHaveBeenCalled();
    });
    it('skips path-based NAVIGATION commands and rows whose object is missing', async ()=>{
        mockWorkspaceCache([
            buildFlatCommandMenuItem({
                id: 'path-command-id',
                universalIdentifier: 'path-identifier',
                payload: {
                    path: '/settings/profile'
                },
                navigationTargetObjectMetadataUniversalIdentifier: null
            }),
            buildFlatCommandMenuItem({
                id: 'orphan-command-id',
                universalIdentifier: 'orphan-identifier',
                payload: {
                    objectMetadataItemId: 'missing-object-id'
                },
                navigationTargetObjectMetadataUniversalIdentifier: 'missing-object-universal-identifier'
            })
        ]);
        await runOnWorkspace();
        expect(commandMenuItemUpdateMock).not.toHaveBeenCalled();
    });
    it('skips the re-own when the derived identifier is already held by another row', async ()=>{
        mockWorkspaceCache([
            buildFlatCommandMenuItem({
                id: 'legacy-command-id',
                universalIdentifier: LEGACY_UNIVERSAL_IDENTIFIER
            }),
            buildFlatCommandMenuItem({
                id: 'holder-command-id',
                universalIdentifier: DERIVED_UNIVERSAL_IDENTIFIER,
                payload: {
                    path: '/unrelated'
                },
                navigationTargetObjectMetadataUniversalIdentifier: null
            })
        ]);
        await runOnWorkspace();
        expect(commandMenuItemUpdateMock).not.toHaveBeenCalled();
    });
    it('still reconciles ownership when the derived identifier is already held by another row', async ()=>{
        mockWorkspaceCache([
            buildFlatCommandMenuItem({
                id: 'legacy-command-id',
                universalIdentifier: LEGACY_UNIVERSAL_IDENTIFIER,
                isSystemSideEffect: false
            }),
            buildFlatCommandMenuItem({
                id: 'holder-command-id',
                universalIdentifier: DERIVED_UNIVERSAL_IDENTIFIER,
                payload: {
                    path: '/unrelated'
                },
                navigationTargetObjectMetadataUniversalIdentifier: null
            })
        ]);
        await runOnWorkspace();
        expect(commandMenuItemUpdateMock).toHaveBeenCalledTimes(1);
        expect(commandMenuItemUpdateMock).toHaveBeenCalledWith({
            id: 'legacy-command-id',
            workspaceId: WORKSPACE_ID
        }, {
            isSystemSideEffect: true
        });
    });
    it('does not write anything in dry-run mode', async ()=>{
        mockWorkspaceCache([
            buildFlatCommandMenuItem({
                id: 'command-id',
                universalIdentifier: LEGACY_UNIVERSAL_IDENTIFIER
            })
        ]);
        await runOnWorkspace(true);
        expect(commandMenuItemUpdateMock).not.toHaveBeenCalled();
        expect(invalidateCacheMock).not.toHaveBeenCalled();
    });
});

//# sourceMappingURL=2-38-workspace-command-1788166853000-reown-object-navigation-command-menu-items.command.spec.js.map