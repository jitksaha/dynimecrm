"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _normalizeiconnameutil = require("../normalize-icon-name.util");
describe('normalizeIconName', ()=>{
    it('should return a canonical icon name unchanged', ()=>{
        expect((0, _normalizeiconnameutil.normalizeIconName)('IconBuildingSkyscraper')).toBe('IconBuildingSkyscraper');
        expect((0, _normalizeiconnameutil.normalizeIconName)('Icon123')).toBe('Icon123');
    });
    it('should fix a lowercased or separated Icon prefix', ()=>{
        expect((0, _normalizeiconnameutil.normalizeIconName)('iconPaw')).toBe('IconPaw');
        expect((0, _normalizeiconnameutil.normalizeIconName)('icon user')).toBe('IconUser');
    });
    it('should normalize raw tabler slugs without the Icon prefix', ()=>{
        expect((0, _normalizeiconnameutil.normalizeIconName)('building-skyscraper')).toBe('IconBuildingSkyscraper');
        expect((0, _normalizeiconnameutil.normalizeIconName)('paw')).toBe('IconPaw');
        expect((0, _normalizeiconnameutil.normalizeIconName)('currency_dollar')).toBe('IconCurrencyDollar');
    });
    it('should normalize uppercase slugs without breaking camelCase words', ()=>{
        expect((0, _normalizeiconnameutil.normalizeIconName)('BUILDING_SKYSCRAPER')).toBe('IconBuildingSkyscraper');
        expect((0, _normalizeiconnameutil.normalizeIconName)('ICONUSER')).toBe('IconUser');
        expect((0, _normalizeiconnameutil.normalizeIconName)('buildingSkyscraper')).toBe('IconBuildingSkyscraper');
    });
    it('should normalize unknown names to a renderable shape for the frontend fallback', ()=>{
        expect((0, _normalizeiconnameutil.normalizeIconName)('IconDoesNotExist')).toBe('IconDoesNotExist');
        expect((0, _normalizeiconnameutil.normalizeIconName)('not a real icon')).toBe('IconNotARealIcon');
    });
    it('should return undefined for missing or unusable input', ()=>{
        expect((0, _normalizeiconnameutil.normalizeIconName)(undefined)).toBeUndefined();
        expect((0, _normalizeiconnameutil.normalizeIconName)('')).toBeUndefined();
        expect((0, _normalizeiconnameutil.normalizeIconName)('   ')).toBeUndefined();
        expect((0, _normalizeiconnameutil.normalizeIconName)('!!!')).toBeUndefined();
        expect((0, _normalizeiconnameutil.normalizeIconName)('icon')).toBeUndefined();
    });
});

//# sourceMappingURL=normalize-icon-name.util.spec.js.map