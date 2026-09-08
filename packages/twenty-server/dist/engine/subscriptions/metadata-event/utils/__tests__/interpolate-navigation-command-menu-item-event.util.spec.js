"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _translations = require("twenty-shared/translations");
const _enginecomponentkeyenum = require("../../../../metadata-modules/command-menu-item/enums/engine-component-key.enum");
const _buildobjectnavigationuniversalflatcommandmenuitemutil = require("../../../../metadata-modules/flat-command-menu-item/utils/build-object-navigation-universal-flat-command-menu-item.util");
const _interpolatenavigationcommandmenuitemeventutil = require("../interpolate-navigation-command-menu-item-event.util");
const _twentystandardapplications = require("../../../../workspace-manager/twenty-standard-application/constants/twenty-standard-applications");
const mockI18nInstance = {
    _: (messageId)=>messageId
};
const OBJECT_METADATA_ID = 'obj-id-1';
const makeFlatObjectMetadata = (overrides)=>({
        id: OBJECT_METADATA_ID,
        universalIdentifier: 'obj-uid-1',
        workspaceId: 'ws-1',
        applicationId: 'app-1',
        applicationUniversalIdentifier: _twentystandardapplications.TWENTY_STANDARD_APPLICATION.universalIdentifier,
        labelPlural: 'People',
        labelSingular: 'Person',
        icon: 'IconUser',
        overrides: null,
        ...overrides
    });
const makeFlatObjectMetadataMaps = (flatObjectMetadata)=>({
        byUniversalIdentifier: {
            [flatObjectMetadata.universalIdentifier]: flatObjectMetadata
        },
        universalIdentifierById: {
            [flatObjectMetadata.id]: flatObjectMetadata.universalIdentifier
        },
        universalIdentifiersByApplicationId: {}
    });
const makeNavigationRecord = (overrides)=>({
        id: 'cmd-id-1',
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.NAVIGATION,
        label: _buildobjectnavigationuniversalflatcommandmenuitemutil.NAVIGATION_INTERPOLATED_LABEL,
        shortLabel: _buildobjectnavigationuniversalflatcommandmenuitemutil.NAVIGATION_INTERPOLATED_SHORT_LABEL,
        icon: _buildobjectnavigationuniversalflatcommandmenuitemutil.NAVIGATION_INTERPOLATED_ICON,
        payload: null,
        navigationTargetObjectMetadataId: OBJECT_METADATA_ID,
        position: 1,
        isPinned: false,
        ...overrides
    });
const buildStandardI18nContext = ()=>({
        locale: _translations.SOURCE_LOCALE,
        i18nInstance: mockI18nInstance,
        isStandardApp: true,
        applicationCatalog: undefined
    });
describe('interpolateNavigationCommandMenuItemEvent', ()=>{
    it('should resolve label, shortLabel, and icon templates for NAVIGATION items', ()=>{
        const flatObjectMetadata = makeFlatObjectMetadata();
        const flatObjectMetadataMaps = makeFlatObjectMetadataMaps(flatObjectMetadata);
        const record = makeNavigationRecord();
        const result = (0, _interpolatenavigationcommandmenuitemeventutil.interpolateNavigationCommandMenuItemEvent)({
            record,
            flatObjectMetadataMaps,
            buildI18nContext: buildStandardI18nContext
        });
        expect(result.label).toBe('Go to People');
        expect(result.shortLabel).toBe('People');
        expect(result.icon).toBe('IconUser');
    });
    it('should not interpolate a non-NAVIGATION item', ()=>{
        const flatObjectMetadata = makeFlatObjectMetadata();
        const flatObjectMetadataMaps = makeFlatObjectMetadataMaps(flatObjectMetadata);
        const record = makeNavigationRecord({
            engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.CREATE_NEW_RECORD,
            label: 'Create New Record',
            shortLabel: undefined,
            icon: 'IconPlus',
            payload: undefined,
            navigationTargetObjectMetadataId: undefined
        });
        const result = (0, _interpolatenavigationcommandmenuitemeventutil.interpolateNavigationCommandMenuItemEvent)({
            record,
            flatObjectMetadataMaps,
            buildI18nContext: buildStandardI18nContext
        });
        expect(result).toEqual(record);
    });
    it('should not interpolate when the record has no navigation target', ()=>{
        const flatObjectMetadata = makeFlatObjectMetadata();
        const flatObjectMetadataMaps = makeFlatObjectMetadataMaps(flatObjectMetadata);
        const record = makeNavigationRecord({
            payload: {
                path: '/settings'
            },
            navigationTargetObjectMetadataId: null
        });
        const result = (0, _interpolatenavigationcommandmenuitemeventutil.interpolateNavigationCommandMenuItemEvent)({
            record,
            flatObjectMetadataMaps,
            buildI18nContext: buildStandardI18nContext
        });
        expect(result).toEqual(record);
    });
    it('should not interpolate when object metadata is not found in maps', ()=>{
        const emptyMaps = {
            byUniversalIdentifier: {},
            universalIdentifierById: {},
            universalIdentifiersByApplicationId: {}
        };
        const record = makeNavigationRecord();
        const result = (0, _interpolatenavigationcommandmenuitemeventutil.interpolateNavigationCommandMenuItemEvent)({
            record,
            flatObjectMetadataMaps: emptyMaps,
            buildI18nContext: buildStandardI18nContext
        });
        expect(result).toEqual(record);
    });
    it('should apply standard overrides when resolving templates', ()=>{
        const flatObjectMetadata = makeFlatObjectMetadata({
            labelPlural: 'People',
            icon: 'IconUser',
            overrides: {
                labelPlural: 'Contacts',
                icon: 'IconContacts'
            }
        });
        const flatObjectMetadataMaps = makeFlatObjectMetadataMaps(flatObjectMetadata);
        const record = makeNavigationRecord();
        const result = (0, _interpolatenavigationcommandmenuitemeventutil.interpolateNavigationCommandMenuItemEvent)({
            record,
            flatObjectMetadataMaps,
            buildI18nContext: buildStandardI18nContext
        });
        expect(result.label).toBe('Go to Contacts');
        expect(result.shortLabel).toBe('Contacts');
        expect(result.icon).toBe('IconContacts');
    });
    it('should use base values when standard overrides are null', ()=>{
        const flatObjectMetadata = makeFlatObjectMetadata({
            labelPlural: 'Companies',
            icon: 'IconBuilding',
            overrides: null
        });
        const flatObjectMetadataMaps = makeFlatObjectMetadataMaps(flatObjectMetadata);
        const record = makeNavigationRecord();
        const result = (0, _interpolatenavigationcommandmenuitemeventutil.interpolateNavigationCommandMenuItemEvent)({
            record,
            flatObjectMetadataMaps,
            buildI18nContext: buildStandardI18nContext
        });
        expect(result.label).toBe('Go to Companies');
        expect(result.shortLabel).toBe('Companies');
        expect(result.icon).toBe('IconBuilding');
    });
    it('should not interpolate when the navigation target is null', ()=>{
        const flatObjectMetadata = makeFlatObjectMetadata();
        const flatObjectMetadataMaps = makeFlatObjectMetadataMaps(flatObjectMetadata);
        const record = makeNavigationRecord({
            navigationTargetObjectMetadataId: null
        });
        const result = (0, _interpolatenavigationcommandmenuitemeventutil.interpolateNavigationCommandMenuItemEvent)({
            record,
            flatObjectMetadataMaps,
            buildI18nContext: buildStandardI18nContext
        });
        expect(result).toEqual(record);
    });
    it('should pass through already-resolved literal labels', ()=>{
        const flatObjectMetadata = makeFlatObjectMetadata();
        const flatObjectMetadataMaps = makeFlatObjectMetadataMaps(flatObjectMetadata);
        const record = makeNavigationRecord({
            label: 'Go to People',
            shortLabel: 'People',
            icon: 'IconUser'
        });
        const result = (0, _interpolatenavigationcommandmenuitemeventutil.interpolateNavigationCommandMenuItemEvent)({
            record,
            flatObjectMetadataMaps,
            buildI18nContext: buildStandardI18nContext
        });
        expect(result.label).toBe('Go to People');
        expect(result.shortLabel).toBe('People');
        expect(result.icon).toBe('IconUser');
    });
    it('should return a non-NAVIGATION item untouched', ()=>{
        const flatObjectMetadata = makeFlatObjectMetadata();
        const flatObjectMetadataMaps = makeFlatObjectMetadataMaps(flatObjectMetadata);
        const record = makeNavigationRecord({
            engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.CREATE_NEW_RECORD,
            label: 'Export View',
            shortLabel: undefined,
            icon: 'IconPlus',
            payload: undefined,
            navigationTargetObjectMetadataId: undefined
        });
        const result = (0, _interpolatenavigationcommandmenuitemeventutil.interpolateNavigationCommandMenuItemEvent)({
            record,
            flatObjectMetadataMaps,
            buildI18nContext: buildStandardI18nContext
        });
        expect(result).toEqual(record);
    });
});

//# sourceMappingURL=interpolate-navigation-command-menu-item-event.util.spec.js.map