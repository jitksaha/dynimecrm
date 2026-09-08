"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _application = require("twenty-shared/application");
const _buildnavigationcommandmenuitemoperationsorthrowutil = require("../build-navigation-command-menu-item-operations-or-throw.util");
const _buildlegacynavigationflatcommandmenuitemutil = require("../../../utils/build-legacy-navigation-flat-command-menu-item.util");
const _getflatobjectmetadatamock = require("../../../../../../engine/metadata-modules/flat-object-metadata/__mocks__/get-flat-object-metadata.mock");
const APPLICATION_ID = 'application-id';
const WORKSPACE_ID = 'workspace-id';
const NOW = '2026-06-04T00:00:00.000Z';
const buildFlatCommandMenuItemMaps = (flatCommandMenuItems)=>({
        byUniversalIdentifier: Object.fromEntries(flatCommandMenuItems.map((flatCommandMenuItem)=>[
                flatCommandMenuItem.universalIdentifier,
                flatCommandMenuItem
            ])),
        universalIdentifierById: Object.fromEntries(flatCommandMenuItems.map((flatCommandMenuItem)=>[
                flatCommandMenuItem.id,
                flatCommandMenuItem.universalIdentifier
            ])),
        universalIdentifiersByApplicationId: {}
    });
const buildExistingNavigationItem = ({ objectId, objectUniversalIdentifier, nameSingular, position })=>(0, _buildlegacynavigationflatcommandmenuitemutil.buildLegacyNavigationFlatCommandMenuItem)({
        objectMetadata: {
            id: objectId,
            universalIdentifier: objectUniversalIdentifier,
            nameSingular,
            shortcut: null
        },
        commandMenuItemId: `command-menu-item-${objectUniversalIdentifier}`,
        applicationId: APPLICATION_ID,
        applicationUniversalIdentifier: _application.TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        workspaceId: WORKSPACE_ID,
        position,
        now: NOW
    });
describe('buildNavigationCommandMenuItemOperationsOrThrow', ()=>{
    it('creates a navigation item for an active object that has no existing navigation', ()=>{
        const objectMetadata = (0, _getflatobjectmetadatamock.getFlatObjectMetadataMock)({
            universalIdentifier: 'call-recording',
            nameSingular: 'callRecording',
            namePlural: 'callRecordings'
        });
        const result = (0, _buildnavigationcommandmenuitemoperationsorthrowutil.buildNavigationCommandMenuItemOperationsOrThrow)({
            existingFlatCommandMenuItemMaps: buildFlatCommandMenuItemMaps([]),
            objectMetadatasForNavigation: [
                objectMetadata
            ],
            applicationId: APPLICATION_ID,
            workspaceId: WORKSPACE_ID,
            now: NOW,
            renamedCollisionObjectMetadatas: []
        });
        expect(result.flatEntityToCreate).toHaveLength(1);
        expect(result.flatEntityToCreate[0].universalIdentifier).toBe((0, _buildlegacynavigationflatcommandmenuitemutil.getLegacyNavigationCommandUniversalIdentifier)('call-recording'));
        expect(result.flatEntityToCreate[0].position).toBe(0);
        expect(result.flatEntityToCreate[0].payload).toEqual({
            objectMetadataItemId: objectMetadata.id
        });
        expect(result.flatEntityToUpdate).toHaveLength(0);
        expect(result.flatEntityToDelete).toHaveLength(0);
    });
    it('uses the provided object id in the navigation payload', ()=>{
        const objectMetadata = (0, _getflatobjectmetadatamock.getFlatObjectMetadataMock)({
            id: 'existing-call-recording-object-id',
            universalIdentifier: 'call-recording',
            nameSingular: 'callRecording',
            namePlural: 'callRecordings'
        });
        const result = (0, _buildnavigationcommandmenuitemoperationsorthrowutil.buildNavigationCommandMenuItemOperationsOrThrow)({
            existingFlatCommandMenuItemMaps: buildFlatCommandMenuItemMaps([]),
            objectMetadatasForNavigation: [
                objectMetadata
            ],
            applicationId: APPLICATION_ID,
            workspaceId: WORKSPACE_ID,
            now: NOW,
            renamedCollisionObjectMetadatas: []
        });
        expect(result.flatEntityToCreate[0].payload).toEqual({
            objectMetadataItemId: 'existing-call-recording-object-id'
        });
    });
    it('does not create a navigation item for an inactive object', ()=>{
        const objectMetadata = (0, _getflatobjectmetadatamock.getFlatObjectMetadataMock)({
            universalIdentifier: 'call-recording',
            nameSingular: 'callRecording',
            namePlural: 'callRecordings',
            isActive: false
        });
        const result = (0, _buildnavigationcommandmenuitemoperationsorthrowutil.buildNavigationCommandMenuItemOperationsOrThrow)({
            existingFlatCommandMenuItemMaps: buildFlatCommandMenuItemMaps([]),
            objectMetadatasForNavigation: [
                objectMetadata
            ],
            applicationId: APPLICATION_ID,
            workspaceId: WORKSPACE_ID,
            now: NOW,
            renamedCollisionObjectMetadatas: []
        });
        expect(result.flatEntityToCreate).toHaveLength(0);
    });
    it('does not recreate a navigation item that already exists (idempotent)', ()=>{
        const objectMetadata = (0, _getflatobjectmetadatamock.getFlatObjectMetadataMock)({
            universalIdentifier: 'call-recording',
            nameSingular: 'callRecording',
            namePlural: 'callRecordings'
        });
        const existingNavigationItem = buildExistingNavigationItem({
            objectId: objectMetadata.id,
            objectUniversalIdentifier: 'call-recording',
            nameSingular: 'callRecording',
            position: 0
        });
        const result = (0, _buildnavigationcommandmenuitemoperationsorthrowutil.buildNavigationCommandMenuItemOperationsOrThrow)({
            existingFlatCommandMenuItemMaps: buildFlatCommandMenuItemMaps([
                existingNavigationItem
            ]),
            objectMetadatasForNavigation: [
                objectMetadata
            ],
            applicationId: APPLICATION_ID,
            workspaceId: WORKSPACE_ID,
            now: NOW,
            renamedCollisionObjectMetadatas: []
        });
        expect(result.flatEntityToCreate).toHaveLength(0);
    });
    it('positions the new navigation item after the highest existing position', ()=>{
        const objectMetadata = (0, _getflatobjectmetadatamock.getFlatObjectMetadataMock)({
            universalIdentifier: 'call-recording',
            nameSingular: 'callRecording',
            namePlural: 'callRecordings'
        });
        const existingNavigationItems = [
            buildExistingNavigationItem({
                objectId: 'other-object-1-id',
                objectUniversalIdentifier: 'other-object-1',
                nameSingular: 'otherObjectOne',
                position: 0
            }),
            buildExistingNavigationItem({
                objectId: 'other-object-2-id',
                objectUniversalIdentifier: 'other-object-2',
                nameSingular: 'otherObjectTwo',
                position: 5
            })
        ];
        const result = (0, _buildnavigationcommandmenuitemoperationsorthrowutil.buildNavigationCommandMenuItemOperationsOrThrow)({
            existingFlatCommandMenuItemMaps: buildFlatCommandMenuItemMaps(existingNavigationItems),
            objectMetadatasForNavigation: [
                objectMetadata
            ],
            applicationId: APPLICATION_ID,
            workspaceId: WORKSPACE_ID,
            now: NOW,
            renamedCollisionObjectMetadatas: []
        });
        expect(result.flatEntityToCreate[0].position).toBe(6);
    });
    it('rewrites the stale availability expression of a renamed object navigation item', ()=>{
        const existingNavigationItem = buildExistingNavigationItem({
            objectId: 'colliding-object-id',
            objectUniversalIdentifier: 'colliding-object',
            nameSingular: 'callRecording',
            position: 0
        });
        const result = (0, _buildnavigationcommandmenuitemoperationsorthrowutil.buildNavigationCommandMenuItemOperationsOrThrow)({
            existingFlatCommandMenuItemMaps: buildFlatCommandMenuItemMaps([
                existingNavigationItem
            ]),
            objectMetadatasForNavigation: [],
            applicationId: APPLICATION_ID,
            workspaceId: WORKSPACE_ID,
            now: NOW,
            renamedCollisionObjectMetadatas: [
                {
                    universalIdentifier: 'colliding-object',
                    nameSingular: 'callRecordingOld'
                }
            ]
        });
        expect(result.flatEntityToUpdate).toHaveLength(1);
        expect(result.flatEntityToUpdate[0].conditionalAvailabilityExpression).toBe('targetObjectReadPermissions.callRecordingOld');
        expect(result.flatEntityToUpdate[0].updatedAt).toBe(NOW);
        expect(result.flatEntityToCreate).toHaveLength(0);
    });
    it('does not produce an update when a renamed object has no existing navigation item', ()=>{
        const result = (0, _buildnavigationcommandmenuitemoperationsorthrowutil.buildNavigationCommandMenuItemOperationsOrThrow)({
            existingFlatCommandMenuItemMaps: buildFlatCommandMenuItemMaps([]),
            objectMetadatasForNavigation: [],
            applicationId: APPLICATION_ID,
            workspaceId: WORKSPACE_ID,
            now: NOW,
            renamedCollisionObjectMetadatas: [
                {
                    universalIdentifier: 'colliding-object',
                    nameSingular: 'callRecordingOld'
                }
            ]
        });
        expect(result.flatEntityToUpdate).toHaveLength(0);
    });
});

//# sourceMappingURL=build-navigation-command-menu-item-operations-or-throw.util.spec.js.map