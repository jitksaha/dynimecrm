"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _application = require("twenty-shared/application");
const _types = require("twenty-shared/types");
const _computesystemviewtocreateutil = require("../compute-system-view-to-create.util");
const applicationUniversalIdentifier = 'a1a2a3a4-a5a6-4000-8000-000000000001';
const objectUniversalIdentifier = 'b1b2b3b4-b5b6-4000-8000-000000000001';
const objectMetadata = {
    universalIdentifier: objectUniversalIdentifier,
    labelSingular: 'Ticket'
};
describe('computeSystemViewToCreate', ()=>{
    it.each([
        _types.ViewKey.INDEX,
        _application.SYSTEM_VIEW_KEYS.FIELDS_WIDGET
    ])('should derive the %s view universal identifier from the object', (viewKey)=>{
        const result = (0, _computesystemviewtocreateutil.computeSystemViewToCreate)({
            applicationUniversalIdentifier,
            objectMetadata,
            viewKey
        });
        expect(result.universalIdentifier).toBe((0, _application.getSystemViewUniversalIdentifier)({
            objectMetadataApplicationUniversalIdentifier: applicationUniversalIdentifier,
            objectUniversalIdentifier,
            viewKey
        }));
    });
    it('should build a system-owned INDEX table view keyed on ViewKey.INDEX', ()=>{
        const result = (0, _computesystemviewtocreateutil.computeSystemViewToCreate)({
            applicationUniversalIdentifier,
            objectMetadata,
            viewKey: _application.SYSTEM_VIEW_KEYS.INDEX
        });
        expect(result.key).toBe(_types.ViewKey.INDEX);
        expect(result.type).toBe(_types.ViewType.TABLE);
        expect(result.icon).toBe('IconTable');
        expect(result.name).toBe('All {objectLabelPlural}');
        expect(result.isSystemSideEffect).toBe(true);
        expect(result.objectMetadataUniversalIdentifier).toBe(objectUniversalIdentifier);
        expect(result.applicationUniversalIdentifier).toBe(applicationUniversalIdentifier);
    });
    it('should build a system-owned record-page view with a null persisted key', ()=>{
        const result = (0, _computesystemviewtocreateutil.computeSystemViewToCreate)({
            applicationUniversalIdentifier,
            objectMetadata,
            viewKey: _application.SYSTEM_VIEW_KEYS.FIELDS_WIDGET
        });
        // The record-page view key is derivation-only, never persisted.
        expect(result.key).toBeNull();
        expect(result.type).toBe(_types.ViewType.FIELDS_WIDGET);
        expect(result.icon).toBe('IconList');
        expect(result.name).toBe('Ticket Record Page Fields');
        expect(result.isSystemSideEffect).toBe(true);
    });
    it('should be deterministic and independent from the view primary key', ()=>{
        const first = (0, _computesystemviewtocreateutil.computeSystemViewToCreate)({
            applicationUniversalIdentifier,
            objectMetadata,
            viewKey: _application.SYSTEM_VIEW_KEYS.INDEX
        });
        const second = (0, _computesystemviewtocreateutil.computeSystemViewToCreate)({
            applicationUniversalIdentifier,
            objectMetadata,
            viewKey: _application.SYSTEM_VIEW_KEYS.INDEX
        });
        expect(first.universalIdentifier).toBe(second.universalIdentifier);
        expect(first.id).not.toBe(second.id);
    });
});

//# sourceMappingURL=compute-system-view-to-create.util.spec.js.map