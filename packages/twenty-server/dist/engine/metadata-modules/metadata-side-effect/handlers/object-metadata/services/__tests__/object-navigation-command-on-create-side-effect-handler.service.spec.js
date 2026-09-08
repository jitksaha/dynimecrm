"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _application = require("twenty-shared/application");
const _enginecomponentkeyenum = require("../../../../../command-menu-item/enums/engine-component-key.enum");
const _objectnavigationcommandoncreatesideeffecthandlerservice = require("../object-navigation-command-on-create-side-effect-handler.service");
const APPLICATION_UNIVERSAL_IDENTIFIER = 'a1a2a3a4-a5a6-4000-8000-000000000001';
const OTHER_APPLICATION_UNIVERSAL_IDENTIFIER = 'a1a2a3a4-a5a6-4000-8000-000000000002';
const OBJECT_UNIVERSAL_IDENTIFIER = 'b1b2b3b4-b5b6-4000-8000-000000000001';
const OTHER_OBJECT_UNIVERSAL_IDENTIFIER = 'b1b2b3b4-b5b6-4000-8000-000000000002';
const OBJECT_ID = 'c1c2c3c4-c5c6-4000-8000-000000000001';
const OTHER_OBJECT_ID = 'c1c2c3c4-c5c6-4000-8000-000000000002';
const DERIVED_UNIVERSAL_IDENTIFIER = (0, _application.getSystemNavigationCommandMenuItemUniversalIdentifier)({
    objectMetadataApplicationUniversalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
    objectUniversalIdentifier: OBJECT_UNIVERSAL_IDENTIFIER
});
const buildFlatObjectMetadata = (overrides = {})=>({
        id: OBJECT_ID,
        universalIdentifier: OBJECT_UNIVERSAL_IDENTIFIER,
        applicationUniversalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
        isActive: true,
        nameSingular: 'ticket',
        shortcut: 'T',
        commandMenuItemUniversalIdentifiers: [],
        ...overrides
    });
const buildArgs = ({ flatObjectMetadata = buildFlatObjectMetadata(), otherFlatObjectMetadatasInBatch = [], pendingFlatCommandMenuItems = [], syncedFlatCommandMenuItems = [] } = {})=>({
        flatEntity: flatObjectMetadata,
        allFlatEntityOperationRecordByMetadataName: {
            objectMetadata: {
                flatEntityToCreate: Object.fromEntries([
                    flatObjectMetadata,
                    ...otherFlatObjectMetadatasInBatch
                ].map((batchFlatObjectMetadata)=>[
                        batchFlatObjectMetadata.universalIdentifier,
                        batchFlatObjectMetadata
                    ])),
                flatEntityToUpdate: {},
                flatEntityToDelete: {}
            },
            ...pendingFlatCommandMenuItems.length > 0 && {
                commandMenuItem: {
                    flatEntityToCreate: Object.fromEntries(pendingFlatCommandMenuItems.map((pendingFlatCommandMenuItem)=>[
                            pendingFlatCommandMenuItem.universalIdentifier,
                            pendingFlatCommandMenuItem
                        ])),
                    flatEntityToUpdate: {},
                    flatEntityToDelete: {}
                }
            }
        },
        relatedFlatEntityMaps: {
            flatCommandMenuItemMaps: {
                byUniversalIdentifier: Object.fromEntries(syncedFlatCommandMenuItems.map((syncedFlatCommandMenuItem)=>[
                        syncedFlatCommandMenuItem.universalIdentifier,
                        syncedFlatCommandMenuItem
                    ]))
            }
        },
        context: {}
    });
describe('ObjectNavigationCommandOnCreateSideEffectHandlerService', ()=>{
    const handler = new _objectnavigationcommandoncreatesideeffecthandlerservice.ObjectNavigationCommandOnCreateSideEffectHandlerService();
    const expectSuccess = (result)=>{
        if (result.status !== 'success') {
            throw new Error(`expected success, got ${result.status}`);
        }
        return result;
    };
    it('provisions the navigation command with the derived (application, object) identifier and denormalized fields', ()=>{
        const result = expectSuccess(handler.buildSideEffects(buildArgs()));
        const created = Object.values(result.operations.commandMenuItem?.flatEntityToCreate ?? {});
        expect(created).toHaveLength(1);
        const [navigationCommand] = created;
        expect(navigationCommand.universalIdentifier).toBe(DERIVED_UNIVERSAL_IDENTIFIER);
        expect(navigationCommand.applicationUniversalIdentifier).toBe(APPLICATION_UNIVERSAL_IDENTIFIER);
        expect(navigationCommand.engineComponentKey).toBe(_enginecomponentkeyenum.EngineComponentKey.NAVIGATION);
        expect(navigationCommand.payload).toBeNull();
        expect(navigationCommand.hotKeys).toEqual([
            'G',
            'T'
        ]);
        expect(navigationCommand.conditionalAvailabilityExpression).toBe('targetObjectReadPermissions.ticket');
        expect(navigationCommand.isSystemSideEffect).toBe(true);
        expect(navigationCommand.position).toBe(0);
    });
    it('derives the identifier from the owning application, so an app-owned object gets an app-owned command', ()=>{
        const result = expectSuccess(handler.buildSideEffects(buildArgs({
            flatObjectMetadata: buildFlatObjectMetadata({
                applicationUniversalIdentifier: OTHER_APPLICATION_UNIVERSAL_IDENTIFIER
            })
        })));
        const [navigationCommand] = Object.values(result.operations.commandMenuItem?.flatEntityToCreate ?? {});
        expect(navigationCommand.universalIdentifier).toBe((0, _application.getSystemNavigationCommandMenuItemUniversalIdentifier)({
            objectMetadataApplicationUniversalIdentifier: OTHER_APPLICATION_UNIVERSAL_IDENTIFIER,
            objectUniversalIdentifier: OBJECT_UNIVERSAL_IDENTIFIER
        }));
        expect(navigationCommand.universalIdentifier).not.toBe(DERIVED_UNIVERSAL_IDENTIFIER);
    });
    it('provisions a disabled command when the object is created inactive', ()=>{
        const result = expectSuccess(handler.buildSideEffects(buildArgs({
            flatObjectMetadata: buildFlatObjectMetadata({
                isActive: false
            })
        })));
        const [navigationCommand] = Object.values(result.operations.commandMenuItem?.flatEntityToCreate ?? {});
        expect(navigationCommand.isActive).toBe(false);
    });
    it('noops when the object create carries no workspace id (manifest sync path)', ()=>{
        const result = handler.buildSideEffects(buildArgs({
            flatObjectMetadata: buildFlatObjectMetadata({
                id: undefined
            })
        }));
        expect(result.status).toBe('noop');
    });
    it('appends after the synced maximum position', ()=>{
        const result = expectSuccess(handler.buildSideEffects(buildArgs({
            syncedFlatCommandMenuItems: [
                {
                    universalIdentifier: 'existing-command',
                    position: 41
                }
            ]
        })));
        const [navigationCommand] = Object.values(result.operations.commandMenuItem?.flatEntityToCreate ?? {});
        expect(navigationCommand.position).toBe(42);
    });
    it('derives distinct deterministic positions for objects created in the same batch', ()=>{
        const firstFlatObjectMetadata = buildFlatObjectMetadata();
        const secondFlatObjectMetadata = buildFlatObjectMetadata({
            id: OTHER_OBJECT_ID,
            universalIdentifier: OTHER_OBJECT_UNIVERSAL_IDENTIFIER,
            nameSingular: 'invoice',
            shortcut: null
        });
        const firstResult = expectSuccess(handler.buildSideEffects(buildArgs({
            flatObjectMetadata: firstFlatObjectMetadata,
            otherFlatObjectMetadatasInBatch: [
                secondFlatObjectMetadata
            ]
        })));
        const secondResult = expectSuccess(handler.buildSideEffects({
            ...buildArgs({
                flatObjectMetadata: firstFlatObjectMetadata,
                otherFlatObjectMetadatasInBatch: [
                    secondFlatObjectMetadata
                ]
            }),
            flatEntity: secondFlatObjectMetadata
        }));
        const [firstNavigationCommand] = Object.values(firstResult.operations.commandMenuItem?.flatEntityToCreate ?? {});
        const [secondNavigationCommand] = Object.values(secondResult.operations.commandMenuItem?.flatEntityToCreate ?? {});
        expect(firstNavigationCommand.position).toBe(0);
        expect(secondNavigationCommand.position).toBe(1);
    });
});

//# sourceMappingURL=object-navigation-command-on-create-side-effect-handler.service.spec.js.map