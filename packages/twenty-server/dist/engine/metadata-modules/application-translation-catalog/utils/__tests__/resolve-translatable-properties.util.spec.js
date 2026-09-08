"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _translations = require("twenty-shared/translations");
const _resolvetranslatablepropertiesutil = require("../resolve-translatable-properties.util");
const i18nContext = {
    locale: 'fr-FR',
    i18nInstance: {
        _: (messageId)=>messageId
    },
    isStandardApp: false,
    applicationCatalog: undefined
};
describe('resolveTranslatableProperties', ()=>{
    it('resolves every translatable property the entity carries', ()=>{
        expect((0, _resolvetranslatablepropertiesutil.resolveTranslatableProperties)({
            metadataName: 'objectMetadata',
            entity: {
                labelSingular: 'Company',
                labelPlural: 'Companies',
                description: 'A company'
            },
            i18nContext
        })).toEqual({
            labelSingular: 'Company',
            labelPlural: 'Companies',
            description: 'A company'
        });
    });
    it('omits properties the entity does not carry', ()=>{
        expect((0, _resolvetranslatablepropertiesutil.resolveTranslatableProperties)({
            metadataName: 'objectMetadata',
            entity: {
                labelSingular: 'Company'
            },
            i18nContext
        })).toEqual({
            labelSingular: 'Company'
        });
    });
    it('prefers a workspace translation for the resolved locale', ()=>{
        expect((0, _resolvetranslatablepropertiesutil.resolveTranslatableProperties)({
            metadataName: 'objectMetadata',
            entity: {
                labelSingular: 'Company',
                overrides: {
                    translations: {
                        'fr-FR': {
                            labelSingular: 'Entreprise'
                        }
                    }
                }
            },
            i18nContext: {
                ...i18nContext,
                isStandardApp: true
            }
        })).toEqual({
            labelSingular: 'Entreprise'
        });
    });
    it('falls back to the canonical override when the locale has no translation', ()=>{
        expect((0, _resolvetranslatablepropertiesutil.resolveTranslatableProperties)({
            metadataName: 'objectMetadata',
            entity: {
                labelSingular: 'Company',
                overrides: {
                    labelSingular: 'Client'
                }
            },
            i18nContext: {
                ...i18nContext,
                locale: _translations.SOURCE_LOCALE,
                isStandardApp: true
            }
        })).toEqual({
            labelSingular: 'Client'
        });
    });
    it('returns nothing for a metadata name with no translatable properties', ()=>{
        expect((0, _resolvetranslatablepropertiesutil.resolveTranslatableProperties)({
            metadataName: 'objectMetadata',
            entity: {},
            i18nContext
        })).toEqual({});
    });
});

//# sourceMappingURL=resolve-translatable-properties.util.spec.js.map