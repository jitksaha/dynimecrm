"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _guards = require("@sniptt/guards");
const _translations = require("twenty-shared/translations");
const _utils = require("twenty-shared/utils");
const _translatestandardlabelutil = require("../../../core-modules/i18n/utils/translate-standard-label.util");
const _resolveeffectiveentitypropertyutil = require("../resolve-effective-entity-property.util");
const _resolveeffectiveentityutil = require("../resolve-effective-entity.util");
const frozenResolveObjectOverride = (objectMetadata, labelKey, locale, i18nInstance, isStandardApp, applicationCatalog)=>{
    const safeLocale = locale ?? _translations.SOURCE_LOCALE;
    if ((0, _utils.isDefined)(objectMetadata.overrides?.translations) && labelKey !== 'icon' && labelKey !== 'color') {
        const translationValue = objectMetadata.overrides.translations[safeLocale]?.[labelKey];
        if ((0, _utils.isDefined)(translationValue)) {
            return translationValue;
        }
    }
    if (!isStandardApp && !(0, _utils.isDefined)(applicationCatalog)) {
        return objectMetadata[labelKey] ?? '';
    }
    if ((labelKey === 'icon' || labelKey === 'color') && (0, _utils.isDefined)(objectMetadata.overrides?.[labelKey])) {
        return objectMetadata.overrides[labelKey];
    }
    if ((0, _guards.isNonEmptyString)(objectMetadata.overrides?.[labelKey])) {
        return objectMetadata.overrides[labelKey] ?? '';
    }
    // S5 keys metadata entries per role; the frozen resolvers carry the same
    // context so the corpus keeps pinning precedence, not the old keying.
    return (0, _translatestandardlabelutil.translateStandardLabel)({
        sourceValue: objectMetadata[labelKey] ?? '',
        context: `objectMetadata.${labelKey}`,
        isStandardApp,
        applicationCatalog,
        i18nInstance
    });
};
const frozenResolveFieldOverride = (fieldMetadata, labelKey, locale, i18nInstance, isStandardApp, applicationCatalog)=>{
    const safeLocale = locale ?? _translations.SOURCE_LOCALE;
    if ((0, _utils.isDefined)(fieldMetadata.overrides?.translations) && labelKey !== 'icon') {
        const translationValue = fieldMetadata.overrides.translations[safeLocale]?.[labelKey];
        if ((0, _utils.isDefined)(translationValue)) {
            return translationValue;
        }
    }
    if (!isStandardApp && !(0, _utils.isDefined)(applicationCatalog)) {
        return fieldMetadata[labelKey] ?? '';
    }
    if (labelKey === 'icon' && (0, _utils.isDefined)(fieldMetadata.overrides?.icon)) {
        return fieldMetadata.overrides.icon;
    }
    if ((0, _guards.isNonEmptyString)(fieldMetadata.overrides?.[labelKey])) {
        return fieldMetadata.overrides[labelKey] ?? '';
    }
    return (0, _translatestandardlabelutil.translateStandardLabel)({
        sourceValue: fieldMetadata[labelKey] ?? '',
        context: `fieldMetadata.${labelKey}`,
        isStandardApp,
        applicationCatalog,
        i18nInstance
    });
};
const frozenResolveFlat = (flatEntity)=>{
    if (!(0, _utils.isDefined)(flatEntity.overrides)) {
        return flatEntity;
    }
    return {
        ...flatEntity,
        ...flatEntity.overrides
    };
};
const mockI18n = {
    _: (id)=>`translated:${id}`
};
const LOCALES = [
    undefined,
    _translations.SOURCE_LOCALE,
    'fr-FR'
];
const BOOLS = [
    true,
    false
];
const OBJECT_KEYS = [
    'labelSingular',
    'labelPlural',
    'description',
    'icon',
    'color'
];
const FIELD_KEYS = [
    'label',
    'description',
    'icon'
];
const buildObjectBase = ()=>({
        labelSingular: 'Company',
        labelPlural: 'Companies',
        description: 'A company',
        icon: 'IconBuilding',
        color: 'blue'
    });
const buildFieldBase = ()=>({
        label: 'Name',
        description: 'The name',
        icon: 'IconAbc'
    });
const OBJECT_OVERRIDES_CORPUS = [
    undefined,
    null,
    {},
    {
        labelSingular: 'Org'
    },
    {
        labelSingular: ''
    },
    {
        labelPlural: 'Orgs',
        description: 'custom'
    },
    {
        icon: 'IconStar'
    },
    {
        color: 'red'
    },
    {
        icon: 'IconStar',
        color: 'red',
        labelSingular: 'Org'
    },
    {
        translations: {
            'fr-FR': {
                labelSingular: 'Société'
            }
        }
    },
    {
        translations: {
            en: {
                labelPlural: 'Companies EN'
            }
        }
    },
    {
        labelSingular: 'Org',
        translations: {
            'fr-FR': {
                labelSingular: 'Société',
                description: 'desc fr'
            }
        }
    },
    {
        translations: {}
    },
    {
        translations: {
            'fr-FR': {}
        }
    }
];
const FIELD_OVERRIDES_CORPUS = [
    undefined,
    null,
    {},
    {
        label: 'Full name'
    },
    {
        label: ''
    },
    {
        description: 'custom desc'
    },
    {
        icon: 'IconStar'
    },
    {
        icon: 'IconStar',
        label: 'Full name'
    },
    {
        translations: {
            'fr-FR': {
                label: 'Nom'
            }
        }
    },
    {
        label: 'Full name',
        translations: {
            'fr-FR': {
                label: 'Nom',
                description: 'desc fr'
            }
        }
    },
    {
        translations: {}
    }
];
const CATALOGS = [
    undefined,
    {
        'some.id': 'From catalog'
    }
];
describe('resolveEffectiveEntityProperty (parity with legacy resolvers)', ()=>{
    it('matches the frozen object resolver across the corpus', ()=>{
        for (const overrides of OBJECT_OVERRIDES_CORPUS){
            for (const key of OBJECT_KEYS){
                for (const locale of LOCALES){
                    for (const isStandardApp of BOOLS){
                        for (const applicationCatalog of CATALOGS){
                            const entity = {
                                ...buildObjectBase(),
                                overrides
                            };
                            const expected = frozenResolveObjectOverride(entity, key, locale, mockI18n, isStandardApp, applicationCatalog);
                            const actual = (0, _resolveeffectiveentitypropertyutil.resolveEffectiveEntityProperty)({
                                metadataName: 'objectMetadata',
                                baseValue: entity[key],
                                overrides: entity.overrides,
                                property: key,
                                i18nContext: {
                                    locale,
                                    i18nInstance: mockI18n,
                                    isStandardApp,
                                    applicationCatalog
                                }
                            });
                            expect(actual).toBe(expected);
                        }
                    }
                }
            }
        }
    });
    it('matches the frozen field resolver across the corpus', ()=>{
        for (const overrides of FIELD_OVERRIDES_CORPUS){
            for (const key of FIELD_KEYS){
                for (const locale of LOCALES){
                    for (const isStandardApp of BOOLS){
                        for (const applicationCatalog of CATALOGS){
                            const entity = {
                                ...buildFieldBase(),
                                overrides
                            };
                            const expected = frozenResolveFieldOverride(entity, key, locale, mockI18n, isStandardApp, applicationCatalog);
                            const actual = (0, _resolveeffectiveentitypropertyutil.resolveEffectiveEntityProperty)({
                                metadataName: 'fieldMetadata',
                                baseValue: entity[key],
                                overrides: entity.overrides,
                                property: key,
                                i18nContext: {
                                    locale,
                                    i18nInstance: mockI18n,
                                    isStandardApp,
                                    applicationCatalog
                                }
                            });
                            expect(actual).toBe(expected);
                        }
                    }
                }
            }
        }
    });
});
describe('resolveEffectiveEntity (parity with legacy flat spread)', ()=>{
    it('matches the frozen flat spread across the corpus', ()=>{
        const flatCorpus = [
            {
                name: 'View',
                position: 1,
                overrides: undefined
            },
            {
                name: 'View',
                position: 1,
                overrides: null
            },
            {
                name: 'View',
                position: 1,
                overrides: {}
            },
            {
                name: 'View',
                position: 1,
                overrides: {
                    name: 'Overridden'
                }
            },
            {
                name: 'View',
                position: 1,
                icon: 'IconList',
                overrides: {
                    name: 'Overridden',
                    position: 2
                }
            }
        ];
        for (const flatEntity of flatCorpus){
            expect((0, _resolveeffectiveentityutil.resolveEffectiveEntity)(flatEntity)).toEqual(frozenResolveFlat(flatEntity));
        }
    });
});
// Frozen reference implementation of the three per-entity resolvers that
// existed before this unification (resolve-view-field-group-name,
// resolve-page-layout-tab-title, resolve-page-layout-widget-title). All three
// were the same nine lines with a different property name.
const frozenResolveBespokeProperty = (baseValue, overrides, property, metadataLabelContext, isStandardApp, i18nInstance, applicationCatalog)=>{
    if ((0, _utils.isDefined)(overrides?.[property])) {
        return baseValue;
    }
    return (0, _translatestandardlabelutil.translateStandardLabel)({
        sourceValue: baseValue,
        context: metadataLabelContext,
        isStandardApp,
        applicationCatalog,
        i18nInstance
    });
};
// The DTO mappers spread overrides onto the base value before a resolver sees
// it, so an overridden entity arrives with base === overrides[property]. The
// corpus mirrors that rather than inventing states production cannot produce.
const BESPOKE_CORPUS = [
    {
        base: 'Details',
        overrides: undefined
    },
    {
        base: 'Details',
        overrides: null
    },
    {
        base: 'Details',
        overrides: {}
    },
    {
        base: 'Renamed',
        overrides: {
            name: 'Renamed',
            title: 'Renamed'
        }
    },
    {
        base: '',
        overrides: {
            name: '',
            title: ''
        }
    },
    {
        base: 'Details',
        overrides: {
            position: 2
        }
    }
];
// Each per-entity resolver ran the frozen shape above against its own
// property. The generic is instantiated per entity rather than over a union,
// because a union of metadata names collapses the allowed property names to
// their intersection.
const expectParityFor = (resolve, property, metadataLabelContext)=>{
    for (const { base, overrides } of BESPOKE_CORPUS){
        for (const locale of LOCALES){
            for (const isStandardApp of BOOLS){
                for (const applicationCatalog of CATALOGS){
                    const expected = frozenResolveBespokeProperty(base, overrides, property, metadataLabelContext, isStandardApp, mockI18n, applicationCatalog);
                    const actual = resolve(base, overrides, {
                        locale,
                        i18nInstance: mockI18n,
                        isStandardApp,
                        applicationCatalog
                    });
                    expect(actual).toBe(expected);
                }
            }
        }
    }
};
describe('resolveEffectiveEntityProperty (parity with the per-entity resolvers)', ()=>{
    it('matches the frozen viewFieldGroup resolver across the corpus', ()=>{
        expectParityFor((baseValue, overrides, i18nContext)=>(0, _resolveeffectiveentitypropertyutil.resolveEffectiveEntityProperty)({
                metadataName: 'viewFieldGroup',
                baseValue,
                overrides,
                property: 'name',
                i18nContext
            }), 'name', 'viewFieldGroup.name');
    });
    it('matches the frozen pageLayoutTab resolver across the corpus', ()=>{
        expectParityFor((baseValue, overrides, i18nContext)=>(0, _resolveeffectiveentitypropertyutil.resolveEffectiveEntityProperty)({
                metadataName: 'pageLayoutTab',
                baseValue,
                overrides,
                property: 'title',
                i18nContext
            }), 'title', 'pageLayoutTab.title');
    });
    it('matches the frozen pageLayoutWidget resolver across the corpus', ()=>{
        expectParityFor((baseValue, overrides, i18nContext)=>(0, _resolveeffectiveentitypropertyutil.resolveEffectiveEntityProperty)({
                metadataName: 'pageLayoutWidget',
                baseValue,
                overrides,
                property: 'title',
                i18nContext
            }), 'title', 'pageLayoutWidget.title');
    });
});

//# sourceMappingURL=resolve-effective-entity.util.spec.js.map