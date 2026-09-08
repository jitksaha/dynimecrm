"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _i18n = require("twenty-shared/i18n");
const _translatestandardlabelutil = require("../translate-standard-label.util");
jest.mock('twenty-shared/i18n');
const mockGenerateMessageId = _i18n.generateMessageId;
describe('translateStandardLabel', ()=>{
    let mockI18n;
    beforeEach(()=>{
        jest.clearAllMocks();
        mockI18n = {
            _: jest.fn()
        };
    });
    it('should return the source value when it is empty', ()=>{
        const result = (0, _translatestandardlabelutil.translateStandardLabel)({
            sourceValue: '',
            isStandardApp: true,
            applicationCatalog: undefined,
            i18nInstance: mockI18n
        });
        expect(result).toBe('');
        expect(mockGenerateMessageId).not.toHaveBeenCalled();
    });
    it('should resolve from the application catalog when provided', ()=>{
        mockGenerateMessageId.mockReturnValue('company-id');
        const result = (0, _translatestandardlabelutil.translateStandardLabel)({
            sourceValue: 'Company',
            isStandardApp: false,
            applicationCatalog: {
                'company-id': 'Entreprise'
            },
            i18nInstance: mockI18n
        });
        expect(result).toBe('Entreprise');
        expect(mockI18n._).not.toHaveBeenCalled();
    });
    it('should fall back to the source value when the catalog has no matching entry', ()=>{
        mockGenerateMessageId.mockReturnValue('missing-id');
        const result = (0, _translatestandardlabelutil.translateStandardLabel)({
            sourceValue: 'Company',
            isStandardApp: false,
            applicationCatalog: {},
            i18nInstance: mockI18n
        });
        expect(result).toBe('Company');
    });
    it('should prefer the catalog over the standard bundle for an application', ()=>{
        mockGenerateMessageId.mockReturnValue('company-id');
        mockI18n._.mockReturnValue('Bundle Translation');
        const result = (0, _translatestandardlabelutil.translateStandardLabel)({
            sourceValue: 'Company',
            isStandardApp: true,
            applicationCatalog: {
                'company-id': 'Entreprise'
            },
            i18nInstance: mockI18n
        });
        expect(result).toBe('Entreprise');
        expect(mockI18n._).not.toHaveBeenCalled();
    });
    it('should resolve from the standard bundle when no catalog is provided', ()=>{
        mockGenerateMessageId.mockReturnValue('company-id');
        mockI18n._.mockReturnValue('Entreprise');
        const result = (0, _translatestandardlabelutil.translateStandardLabel)({
            sourceValue: 'Company',
            isStandardApp: true,
            applicationCatalog: undefined,
            i18nInstance: mockI18n
        });
        expect(result).toBe('Entreprise');
        expect(mockI18n._).toHaveBeenCalledWith('company-id', {
            objectLabel: '{objectLabel}',
            objectLabelSingular: '{objectLabelSingular}',
            objectLabelPlural: '{objectLabelPlural}',
            objectIcon: '{objectIcon}'
        });
    });
    it('should return the source value when the standard bundle has no translation', ()=>{
        mockGenerateMessageId.mockReturnValue('company-id');
        mockI18n._.mockReturnValue('company-id');
        const result = (0, _translatestandardlabelutil.translateStandardLabel)({
            sourceValue: 'Company',
            isStandardApp: true,
            applicationCatalog: undefined,
            i18nInstance: mockI18n
        });
        expect(result).toBe('Company');
    });
    it('should return the source value for a non-standard app without a catalog', ()=>{
        const result = (0, _translatestandardlabelutil.translateStandardLabel)({
            sourceValue: 'Company',
            isStandardApp: false,
            applicationCatalog: undefined,
            i18nInstance: mockI18n
        });
        expect(result).toBe('Company');
        expect(mockGenerateMessageId).not.toHaveBeenCalled();
    });
});

//# sourceMappingURL=translate-standard-label.util.spec.js.map