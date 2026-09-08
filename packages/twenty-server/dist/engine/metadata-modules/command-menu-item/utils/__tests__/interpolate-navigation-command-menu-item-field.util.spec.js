"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _enginecomponentkeyenum = require("../../enums/engine-component-key.enum");
const _interpolatenavigationcommandmenuitemfieldutil = require("../interpolate-navigation-command-menu-item-field.util");
const _buildobjectnavigationuniversalflatcommandmenuitemutil = require("../../../flat-command-menu-item/utils/build-object-navigation-universal-flat-command-menu-item.util");
const mockI18nInstance = {
    _: (messageId)=>messageId
};
const buildI18nContext = ()=>({
        locale: undefined,
        i18nInstance: mockI18nInstance,
        isStandardApp: true,
        applicationCatalog: undefined
    });
const mockObjectMetadata = {
    labelPlural: 'People',
    icon: 'IconUser',
    overrides: undefined
};
const baseCommandMenuItem = {
    engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.NAVIGATION,
    label: _buildobjectnavigationuniversalflatcommandmenuitemutil.NAVIGATION_INTERPOLATED_LABEL,
    shortLabel: _buildobjectnavigationuniversalflatcommandmenuitemutil.NAVIGATION_INTERPOLATED_SHORT_LABEL,
    icon: _buildobjectnavigationuniversalflatcommandmenuitemutil.NAVIGATION_INTERPOLATED_ICON,
    position: 1,
    isPinned: false,
    availabilityType: _types.CommandMenuItemAvailabilityType.GLOBAL,
    navigationTargetObjectMetadataId: 'obj-id-1',
    workspaceId: 'ws-id-1',
    isActive: true,
    isSystemSideEffect: false,
    createdAt: new Date(),
    updatedAt: new Date()
};
describe('interpolateNavigationCommandMenuItemField', ()=>{
    it('should resolve label template for NAVIGATION items', ()=>{
        const result = (0, _interpolatenavigationcommandmenuitemfieldutil.interpolateNavigationCommandMenuItemField)({
            commandMenuItem: baseCommandMenuItem,
            resolvedValue: baseCommandMenuItem.label,
            objectMetadata: mockObjectMetadata,
            objectMetadataI18nContext: buildI18nContext()
        });
        expect(result).toBe('Go to People');
    });
    it('should resolve shortLabel template for NAVIGATION items', ()=>{
        const result = (0, _interpolatenavigationcommandmenuitemfieldutil.interpolateNavigationCommandMenuItemField)({
            commandMenuItem: baseCommandMenuItem,
            resolvedValue: baseCommandMenuItem.shortLabel,
            objectMetadata: mockObjectMetadata,
            objectMetadataI18nContext: buildI18nContext()
        });
        expect(result).toBe('People');
    });
    it('should resolve icon template for NAVIGATION items', ()=>{
        const result = (0, _interpolatenavigationcommandmenuitemfieldutil.interpolateNavigationCommandMenuItemField)({
            commandMenuItem: baseCommandMenuItem,
            resolvedValue: baseCommandMenuItem.icon,
            objectMetadata: mockObjectMetadata,
            objectMetadataI18nContext: buildI18nContext()
        });
        expect(result).toBe('IconUser');
    });
    it('should return raw label for non-NAVIGATION items', ()=>{
        const nonNavigationItem = {
            ...baseCommandMenuItem,
            engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.CREATE_NEW_RECORD,
            navigationTargetObjectMetadataId: undefined,
            label: 'Create New Record'
        };
        const result = (0, _interpolatenavigationcommandmenuitemfieldutil.interpolateNavigationCommandMenuItemField)({
            commandMenuItem: nonNavigationItem,
            resolvedValue: nonNavigationItem.label,
            objectMetadata: null,
            objectMetadataI18nContext: buildI18nContext()
        });
        expect(result).toBe('Create New Record');
    });
    it('should return undefined when object metadata is null for a NAVIGATION item', ()=>{
        const result = (0, _interpolatenavigationcommandmenuitemfieldutil.interpolateNavigationCommandMenuItemField)({
            commandMenuItem: baseCommandMenuItem,
            resolvedValue: baseCommandMenuItem.label,
            objectMetadata: null,
            objectMetadataI18nContext: buildI18nContext()
        });
        expect(result).toBeUndefined();
    });
    it('should return undefined for undefined shortLabel', ()=>{
        const itemWithoutShortLabel = {
            ...baseCommandMenuItem,
            shortLabel: undefined
        };
        const result = (0, _interpolatenavigationcommandmenuitemfieldutil.interpolateNavigationCommandMenuItemField)({
            commandMenuItem: itemWithoutShortLabel,
            resolvedValue: itemWithoutShortLabel.shortLabel,
            objectMetadata: mockObjectMetadata,
            objectMetadataI18nContext: buildI18nContext()
        });
        expect(result).toBeUndefined();
    });
    it('should resolve label for custom object metadata', ()=>{
        const customObjectMetadata = {
            ...mockObjectMetadata,
            labelPlural: 'Custom Objects',
            icon: 'IconCustom'
        };
        const result = (0, _interpolatenavigationcommandmenuitemfieldutil.interpolateNavigationCommandMenuItemField)({
            commandMenuItem: baseCommandMenuItem,
            resolvedValue: baseCommandMenuItem.label,
            objectMetadata: customObjectMetadata,
            objectMetadataI18nContext: buildI18nContext()
        });
        expect(result).toBe('Go to Custom Objects');
    });
    it('should resolve icon for custom object metadata', ()=>{
        const customObjectMetadata = {
            ...mockObjectMetadata,
            icon: 'IconCustom'
        };
        const result = (0, _interpolatenavigationcommandmenuitemfieldutil.interpolateNavigationCommandMenuItemField)({
            commandMenuItem: baseCommandMenuItem,
            resolvedValue: baseCommandMenuItem.icon,
            objectMetadata: customObjectMetadata,
            objectMetadataI18nContext: buildI18nContext()
        });
        expect(result).toBe('IconCustom');
    });
    it('should return raw value when the item has no navigation target', ()=>{
        const itemWithPathPayload = {
            ...baseCommandMenuItem,
            navigationTargetObjectMetadataId: undefined
        };
        const result = (0, _interpolatenavigationcommandmenuitemfieldutil.interpolateNavigationCommandMenuItemField)({
            commandMenuItem: itemWithPathPayload,
            resolvedValue: itemWithPathPayload.label,
            objectMetadata: null,
            objectMetadataI18nContext: buildI18nContext()
        });
        expect(result).toBe(_buildobjectnavigationuniversalflatcommandmenuitemutil.NAVIGATION_INTERPOLATED_LABEL);
    });
    it('should return literal label as-is when it has no template variables', ()=>{
        const itemWithLiteralLabel = {
            ...baseCommandMenuItem,
            label: 'Go to People'
        };
        const result = (0, _interpolatenavigationcommandmenuitemfieldutil.interpolateNavigationCommandMenuItemField)({
            commandMenuItem: itemWithLiteralLabel,
            resolvedValue: itemWithLiteralLabel.label,
            objectMetadata: mockObjectMetadata,
            objectMetadataI18nContext: buildI18nContext()
        });
        expect(result).toBe('Go to People');
    });
});

//# sourceMappingURL=interpolate-navigation-command-menu-item-field.util.spec.js.map