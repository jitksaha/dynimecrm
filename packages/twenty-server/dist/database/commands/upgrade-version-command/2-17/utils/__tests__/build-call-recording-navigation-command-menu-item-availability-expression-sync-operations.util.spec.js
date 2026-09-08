"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _application = require("twenty-shared/application");
const _metadata = require("twenty-shared/metadata");
const _buildcallrecordingnavigationcommandmenuitemavailabilityexpressionsyncoperationsutil = require("../build-call-recording-navigation-command-menu-item-availability-expression-sync-operations.util");
const _buildlegacynavigationflatcommandmenuitemutil = require("../../../utils/build-legacy-navigation-flat-command-menu-item.util");
const _getflatobjectmetadatamock = require("../../../../../../engine/metadata-modules/flat-object-metadata/__mocks__/get-flat-object-metadata.mock");
const APPLICATION_ID = 'application-id';
const WORKSPACE_ID = 'workspace-id';
const CREATED_AT = '2026-06-01T00:00:00.000Z';
const NOW = '2026-06-25T00:00:00.000Z';
const buildFlatCommandMenuItemMaps = (flatCommandMenuItems)=>({
        byUniversalIdentifier: Object.fromEntries(flatCommandMenuItems.map((flatCommandMenuItem)=>[
                flatCommandMenuItem.universalIdentifier,
                flatCommandMenuItem
            ])),
        universalIdentifierById: Object.fromEntries(flatCommandMenuItems.map((flatCommandMenuItem)=>[
                flatCommandMenuItem.id,
                flatCommandMenuItem.universalIdentifier
            ])),
        universalIdentifiersByApplicationId: {
            [APPLICATION_ID]: flatCommandMenuItems.map((flatCommandMenuItem)=>flatCommandMenuItem.universalIdentifier)
        }
    });
const buildFlatObjectMetadataMaps = (flatObjectMetadatas)=>({
        byUniversalIdentifier: Object.fromEntries(flatObjectMetadatas.map((flatObjectMetadata)=>[
                flatObjectMetadata.universalIdentifier,
                flatObjectMetadata
            ])),
        universalIdentifierById: Object.fromEntries(flatObjectMetadatas.map((flatObjectMetadata)=>[
                flatObjectMetadata.id,
                flatObjectMetadata.universalIdentifier
            ])),
        universalIdentifiersByApplicationId: {
            [APPLICATION_ID]: flatObjectMetadatas.map((flatObjectMetadata)=>flatObjectMetadata.universalIdentifier)
        }
    });
const buildCallRecordingObjectMetadataMaps = ()=>buildFlatObjectMetadataMaps([
        (0, _getflatobjectmetadatamock.getFlatObjectMetadataMock)({
            id: 'call-recording-object-metadata-id',
            universalIdentifier: _metadata.STANDARD_OBJECTS.callRecording.universalIdentifier,
            nameSingular: 'callRecording',
            namePlural: 'callRecordings',
            applicationId: APPLICATION_ID,
            applicationUniversalIdentifier: _application.TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
            workspaceId: WORKSPACE_ID
        })
    ]);
const buildCallRecordingNavigationCommandMenuItem = ({ conditionalAvailabilityExpression })=>({
        ...(0, _buildlegacynavigationflatcommandmenuitemutil.buildLegacyNavigationFlatCommandMenuItem)({
            objectMetadata: {
                id: 'call-recording-object-metadata-id',
                universalIdentifier: _metadata.STANDARD_OBJECTS.callRecording.universalIdentifier,
                nameSingular: 'callRecording',
                shortcut: null
            },
            commandMenuItemId: 'call-recording-navigation-command-menu-item-id',
            applicationId: APPLICATION_ID,
            applicationUniversalIdentifier: _application.TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
            workspaceId: WORKSPACE_ID,
            position: 0,
            now: CREATED_AT
        }),
        conditionalAvailabilityExpression
    });
describe('buildCallRecordingNavigationCommandMenuItemAvailabilityExpressionSyncOperations', ()=>{
    it('rewrites the legacy call recording feature-flag gate to the read-permission gate', ()=>{
        const legacyCallRecordingNavigationCommandMenuItem = buildCallRecordingNavigationCommandMenuItem({
            conditionalAvailabilityExpression: _buildcallrecordingnavigationcommandmenuitemavailabilityexpressionsyncoperationsutil.LEGACY_CALL_RECORDING_NAVIGATION_AVAILABILITY_EXPRESSION
        });
        const result = (0, _buildcallrecordingnavigationcommandmenuitemavailabilityexpressionsyncoperationsutil.buildCallRecordingNavigationCommandMenuItemAvailabilityExpressionSyncOperations)({
            existingFlatCommandMenuItemMaps: buildFlatCommandMenuItemMaps([
                legacyCallRecordingNavigationCommandMenuItem
            ]),
            existingFlatObjectMetadataMaps: buildCallRecordingObjectMetadataMaps(),
            now: NOW
        });
        expect(result.flatEntityToCreate).toHaveLength(0);
        expect(result.flatEntityToDelete).toHaveLength(0);
        expect(result.flatEntityToUpdate).toHaveLength(1);
        expect(result.flatEntityToUpdate[0]).toMatchObject({
            id: legacyCallRecordingNavigationCommandMenuItem.id,
            conditionalAvailabilityExpression: _buildcallrecordingnavigationcommandmenuitemavailabilityexpressionsyncoperationsutil.CALL_RECORDING_NAVIGATION_AVAILABILITY_EXPRESSION,
            updatedAt: NOW
        });
    });
    it('does not update the command menu item when the expression is already synced', ()=>{
        const syncedCallRecordingNavigationCommandMenuItem = buildCallRecordingNavigationCommandMenuItem({
            conditionalAvailabilityExpression: _buildcallrecordingnavigationcommandmenuitemavailabilityexpressionsyncoperationsutil.CALL_RECORDING_NAVIGATION_AVAILABILITY_EXPRESSION
        });
        const result = (0, _buildcallrecordingnavigationcommandmenuitemavailabilityexpressionsyncoperationsutil.buildCallRecordingNavigationCommandMenuItemAvailabilityExpressionSyncOperations)({
            existingFlatCommandMenuItemMaps: buildFlatCommandMenuItemMaps([
                syncedCallRecordingNavigationCommandMenuItem
            ]),
            existingFlatObjectMetadataMaps: buildCallRecordingObjectMetadataMaps(),
            now: NOW
        });
        expect(result.flatEntityToUpdate).toHaveLength(0);
    });
    it('does not update unrelated command menu item availability expressions', ()=>{
        const customCallRecordingNavigationCommandMenuItem = buildCallRecordingNavigationCommandMenuItem({
            conditionalAvailabilityExpression: 'targetObjectReadPermissions.callRecording and permissionFlags.DATA_MODEL'
        });
        const result = (0, _buildcallrecordingnavigationcommandmenuitemavailabilityexpressionsyncoperationsutil.buildCallRecordingNavigationCommandMenuItemAvailabilityExpressionSyncOperations)({
            existingFlatCommandMenuItemMaps: buildFlatCommandMenuItemMaps([
                customCallRecordingNavigationCommandMenuItem
            ]),
            existingFlatObjectMetadataMaps: buildCallRecordingObjectMetadataMaps(),
            now: NOW
        });
        expect(result.flatEntityToUpdate).toHaveLength(0);
    });
    it('does not update when the call recording object metadata is missing', ()=>{
        const legacyCallRecordingNavigationCommandMenuItem = buildCallRecordingNavigationCommandMenuItem({
            conditionalAvailabilityExpression: _buildcallrecordingnavigationcommandmenuitemavailabilityexpressionsyncoperationsutil.LEGACY_CALL_RECORDING_NAVIGATION_AVAILABILITY_EXPRESSION
        });
        const result = (0, _buildcallrecordingnavigationcommandmenuitemavailabilityexpressionsyncoperationsutil.buildCallRecordingNavigationCommandMenuItemAvailabilityExpressionSyncOperations)({
            existingFlatCommandMenuItemMaps: buildFlatCommandMenuItemMaps([
                legacyCallRecordingNavigationCommandMenuItem
            ]),
            existingFlatObjectMetadataMaps: buildFlatObjectMetadataMaps([]),
            now: NOW
        });
        expect(result.flatEntityToUpdate).toHaveLength(0);
    });
    it('does not update when the call recording navigation command menu item is missing', ()=>{
        const result = (0, _buildcallrecordingnavigationcommandmenuitemavailabilityexpressionsyncoperationsutil.buildCallRecordingNavigationCommandMenuItemAvailabilityExpressionSyncOperations)({
            existingFlatCommandMenuItemMaps: buildFlatCommandMenuItemMaps([]),
            existingFlatObjectMetadataMaps: buildCallRecordingObjectMetadataMaps(),
            now: NOW
        });
        expect(result).toEqual({
            flatEntityToCreate: [],
            flatEntityToDelete: [],
            flatEntityToUpdate: []
        });
    });
});

//# sourceMappingURL=build-call-recording-navigation-command-menu-item-availability-expression-sync-operations.util.spec.js.map