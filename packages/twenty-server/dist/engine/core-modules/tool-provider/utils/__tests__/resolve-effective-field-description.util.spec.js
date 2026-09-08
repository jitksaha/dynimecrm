"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _i18n = require("twenty-shared/i18n");
const _translations = require("twenty-shared/translations");
const _types = require("twenty-shared/types");
const _resolveeffectivefielddescriptionutil = require("../resolve-effective-field-description.util");
const _getflatfieldmetadatamock = require("../../../../metadata-modules/flat-field-metadata/__mocks__/get-flat-field-metadata.mock");
const _twentystandardapplications = require("../../../../workspace-manager/twenty-standard-application/constants/twenty-standard-applications");
const BASE_DESCRIPTION = 'Task due date';
const OVERRIDDEN_DESCRIPTION = 'Stored in UTC; users dictate local time, convert before writing';
const buildTranslator = (catalog = {})=>({
        _: (messageId)=>catalog[messageId] ?? messageId
    });
const untranslated = buildTranslator();
const getStandardFlatFieldMetadata = (overrides)=>(0, _getflatfieldmetadatamock.getFlatFieldMetadataMock)({
        universalIdentifier: 'due-at-field',
        objectMetadataId: 'task-object',
        type: _types.FieldMetadataType.DATE_TIME,
        name: 'dueAt',
        description: BASE_DESCRIPTION,
        applicationUniversalIdentifier: _twentystandardapplications.TWENTY_STANDARD_APPLICATION.universalIdentifier,
        overrides
    });
describe('resolveEffectiveFieldDescription', ()=>{
    it('should return the override when a standard field description was customized', ()=>{
        const result = (0, _resolveeffectivefielddescriptionutil.resolveEffectiveFieldDescription)({
            flatFieldMetadata: getStandardFlatFieldMetadata({
                description: OVERRIDDEN_DESCRIPTION
            }),
            locale: _translations.SOURCE_LOCALE,
            i18nInstance: untranslated
        });
        expect(result).toBe(OVERRIDDEN_DESCRIPTION);
    });
    it('should return the base description when the override was cleared', ()=>{
        const result = (0, _resolveeffectivefielddescriptionutil.resolveEffectiveFieldDescription)({
            flatFieldMetadata: getStandardFlatFieldMetadata({
                description: null
            }),
            locale: _translations.SOURCE_LOCALE,
            i18nInstance: untranslated
        });
        expect(result).toBe(BASE_DESCRIPTION);
    });
    it('should return the base description when the field carries no override', ()=>{
        const result = (0, _resolveeffectivefielddescriptionutil.resolveEffectiveFieldDescription)({
            flatFieldMetadata: getStandardFlatFieldMetadata(),
            locale: _translations.SOURCE_LOCALE,
            i18nInstance: untranslated
        });
        expect(result).toBe(BASE_DESCRIPTION);
    });
    it('should return the locale translation of a standard field description', ()=>{
        const result = (0, _resolveeffectivefielddescriptionutil.resolveEffectiveFieldDescription)({
            flatFieldMetadata: getStandardFlatFieldMetadata(),
            locale: 'fr-FR',
            i18nInstance: buildTranslator({
                [(0, _i18n.generateMessageId)(BASE_DESCRIPTION, 'fieldMetadata.description')]: "Date d'échéance"
            })
        });
        expect(result).toBe("Date d'échéance");
    });
    it('should return the override translation for the requested locale', ()=>{
        const result = (0, _resolveeffectivefielddescriptionutil.resolveEffectiveFieldDescription)({
            flatFieldMetadata: getStandardFlatFieldMetadata({
                description: OVERRIDDEN_DESCRIPTION,
                translations: {
                    'fr-FR': {
                        description: 'Stocké en UTC'
                    }
                }
            }),
            locale: 'fr-FR',
            i18nInstance: untranslated
        });
        expect(result).toBe('Stocké en UTC');
    });
    it('should return the description as written for a custom field', ()=>{
        const result = (0, _resolveeffectivefielddescriptionutil.resolveEffectiveFieldDescription)({
            flatFieldMetadata: (0, _getflatfieldmetadatamock.getFlatFieldMetadataMock)({
                universalIdentifier: 'activity-type-field',
                objectMetadataId: 'task-object',
                type: _types.FieldMetadataType.TEXT,
                name: 'activityType',
                description: 'Our own custom text'
            }),
            locale: _translations.SOURCE_LOCALE,
            i18nInstance: untranslated
        });
        expect(result).toBe('Our own custom text');
    });
});

//# sourceMappingURL=resolve-effective-field-description.util.spec.js.map