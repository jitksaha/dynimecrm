"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _compactmetadataoutpututil = require("../compact-metadata-output.util");
describe('compactMetadataOutput', ()=>{
    it('should strip keys with null values when listed in stripWhenNullish', ()=>{
        const record = {
            id: '123',
            name: 'test',
            description: null,
            icon: null,
            label: 'Test'
        };
        const result = (0, _compactmetadataoutpututil.compactMetadataOutput)(record, {
            stripWhenNullish: [
                'description',
                'icon'
            ]
        });
        expect(result).toEqual({
            id: '123',
            name: 'test',
            label: 'Test'
        });
    });
    it('should strip keys with undefined values when listed in stripWhenNullish', ()=>{
        const record = {
            id: '123',
            options: undefined,
            settings: undefined,
            label: 'Test'
        };
        const result = (0, _compactmetadataoutpututil.compactMetadataOutput)(record, {
            stripWhenNullish: [
                'options',
                'settings'
            ]
        });
        expect(result).toEqual({
            id: '123',
            label: 'Test'
        });
    });
    it('should not strip keys with truthy values', ()=>{
        const record = {
            id: '123',
            description: 'A description',
            options: [
                {
                    label: 'A',
                    value: 'A'
                }
            ]
        };
        const result = (0, _compactmetadataoutpututil.compactMetadataOutput)(record, {
            stripWhenNullish: [
                'description',
                'options'
            ]
        });
        expect(result).toEqual({
            id: '123',
            description: 'A description',
            options: [
                {
                    label: 'A',
                    value: 'A'
                }
            ]
        });
    });
    it('should strip keys with false values when listed in stripWhenFalse', ()=>{
        const record = {
            id: '123',
            isLabelSyncedWithName: false,
            isSystem: false,
            isActive: true
        };
        const result = (0, _compactmetadataoutpututil.compactMetadataOutput)(record, {
            stripWhenFalse: [
                'isLabelSyncedWithName',
                'isSystem'
            ]
        });
        expect(result).toEqual({
            id: '123',
            isActive: true
        });
    });
    it('should not strip keys with true values when listed in stripWhenFalse', ()=>{
        const record = {
            id: '123',
            isLabelSyncedWithName: true,
            isSystem: true
        };
        const result = (0, _compactmetadataoutpututil.compactMetadataOutput)(record, {
            stripWhenFalse: [
                'isLabelSyncedWithName',
                'isSystem'
            ]
        });
        expect(result).toEqual({
            id: '123',
            isLabelSyncedWithName: true,
            isSystem: true
        });
    });
    it('should strip keys with true values when listed in stripWhenTrue', ()=>{
        const record = {
            id: '123',
            isUIEditable: true,
            isActive: true
        };
        const result = (0, _compactmetadataoutpututil.compactMetadataOutput)(record, {
            stripWhenTrue: [
                'isUIEditable'
            ]
        });
        expect(result).toEqual({
            id: '123',
            isActive: true
        });
    });
    it('should not strip keys with false values when listed in stripWhenTrue', ()=>{
        const record = {
            id: '123',
            isUIEditable: false
        };
        const result = (0, _compactmetadataoutpututil.compactMetadataOutput)(record, {
            stripWhenTrue: [
                'isUIEditable'
            ]
        });
        expect(result).toEqual({
            id: '123',
            isUIEditable: false
        });
    });
    it('should apply stripWhenNullish, stripWhenFalse and stripWhenTrue together', ()=>{
        const record = {
            id: '123',
            name: 'test',
            description: null,
            icon: 'IconStar',
            isLabelSyncedWithName: false,
            isUIEditable: false,
            options: null
        };
        const result = (0, _compactmetadataoutpututil.compactMetadataOutput)(record, {
            stripWhenNullish: [
                'description',
                'options'
            ],
            stripWhenFalse: [
                'isLabelSyncedWithName'
            ],
            stripWhenTrue: [
                'isUIEditable'
            ]
        });
        expect(result).toEqual({
            id: '123',
            name: 'test',
            icon: 'IconStar',
            isUIEditable: false
        });
    });
    it('should return a copy without modifying the original', ()=>{
        const record = {
            id: '123',
            description: null
        };
        const result = (0, _compactmetadataoutpututil.compactMetadataOutput)(record, {
            stripWhenNullish: [
                'description'
            ]
        });
        expect(record).toEqual({
            id: '123',
            description: null
        });
        expect(result).toEqual({
            id: '123'
        });
    });
    it('should handle empty config gracefully', ()=>{
        const record = {
            id: '123',
            name: 'test'
        };
        const result = (0, _compactmetadataoutpututil.compactMetadataOutput)(record, {});
        expect(result).toEqual({
            id: '123',
            name: 'test'
        });
    });
});

//# sourceMappingURL=compact-metadata-output.util.spec.js.map