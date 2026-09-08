"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _translations = require("twenty-shared/translations");
const _resolvemetadataeventrecordutil = require("../resolve-metadata-event-record.util");
const buildI18nContext = (overrides = {})=>({
        locale: _translations.SOURCE_LOCALE,
        i18nInstance: {
            _: (messageId)=>`translated:${messageId}`
        },
        isStandardApp: true,
        applicationCatalog: undefined,
        ...overrides
    });
describe('resolveMetadataEventRecord', ()=>{
    it('should translate every translatable property of the entity', ()=>{
        const resolved = (0, _resolvemetadataeventrecordutil.resolveMetadataEventRecord)({
            metadataName: 'commandMenuItem',
            record: {
                label: 'Export View',
                shortLabel: 'Export',
                icon: 'IconUpload'
            },
            i18nContext: buildI18nContext()
        });
        expect(resolved.label).toMatch(/^translated:/);
        expect(resolved.shortLabel).toMatch(/^translated:/);
    });
    it('should leave non-translatable properties untouched', ()=>{
        const resolved = (0, _resolvemetadataeventrecordutil.resolveMetadataEventRecord)({
            metadataName: 'commandMenuItem',
            record: {
                label: 'Export View',
                icon: 'IconUpload',
                isPinned: true
            },
            i18nContext: buildI18nContext()
        });
        expect(resolved.icon).toBe('IconUpload');
        expect(resolved.isPinned).toBe(true);
    });
    // The whole point of resolving at delivery: an override is workspace-authored
    // text, so it wins over the catalog rather than being hashed against it.
    it('should prefer an override over the translated base value', ()=>{
        const resolved = (0, _resolvemetadataeventrecordutil.resolveMetadataEventRecord)({
            metadataName: 'pageLayoutTab',
            record: {
                title: 'Home',
                overrides: {
                    title: 'Accueil maison'
                }
            },
            i18nContext: buildI18nContext()
        });
        expect(resolved.title).toBe('Accueil maison');
    });
    it('should strip overrides from the delivered record', ()=>{
        const resolved = (0, _resolvemetadataeventrecordutil.resolveMetadataEventRecord)({
            metadataName: 'pageLayoutTab',
            record: {
                title: 'Home',
                overrides: {
                    title: 'Accueil maison'
                }
            },
            i18nContext: buildI18nContext()
        });
        expect(resolved).not.toHaveProperty('overrides');
    });
    it('should skip absent and empty values rather than emitting a translated empty string', ()=>{
        const resolved = (0, _resolvemetadataeventrecordutil.resolveMetadataEventRecord)({
            metadataName: 'commandMenuItem',
            record: {
                label: 'Export View',
                shortLabel: null
            },
            i18nContext: buildI18nContext()
        });
        expect(resolved.shortLabel).toBeNull();
    });
    it('should return custom-application values untouched when no catalog applies', ()=>{
        const resolved = (0, _resolvemetadataeventrecordutil.resolveMetadataEventRecord)({
            metadataName: 'view',
            record: {
                name: 'My custom view'
            },
            i18nContext: buildI18nContext({
                isStandardApp: false,
                applicationCatalog: undefined
            })
        });
        expect(resolved.name).toBe('My custom view');
    });
    // Regression: delivery strips `overrides`, so anything it does not apply is
    // lost. The publisher used to apply every overridable property, not just the
    // translatable ones.
    it('should apply an override on a non-translatable property', ()=>{
        const resolved = (0, _resolvemetadataeventrecordutil.resolveMetadataEventRecord)({
            metadataName: 'pageLayoutTab',
            record: {
                title: 'Home',
                position: 0,
                icon: 'IconHome',
                overrides: {
                    position: 3,
                    icon: 'IconStar'
                }
            },
            i18nContext: buildI18nContext()
        });
        expect(resolved.position).toBe(3);
        expect(resolved.icon).toBe('IconStar');
        expect(resolved).not.toHaveProperty('overrides');
    });
    it('should apply an override on a translatable property whose base value is empty', ()=>{
        const resolved = (0, _resolvemetadataeventrecordutil.resolveMetadataEventRecord)({
            metadataName: 'commandMenuItem',
            record: {
                label: '',
                overrides: {
                    label: 'Workspace label'
                }
            },
            i18nContext: buildI18nContext()
        });
        expect(resolved.label).toBe('Workspace label');
    });
    it('should not leak the per-locale translations override onto the record', ()=>{
        const resolved = (0, _resolvemetadataeventrecordutil.resolveMetadataEventRecord)({
            metadataName: 'objectMetadata',
            record: {
                labelSingular: 'Company',
                overrides: {
                    translations: {
                        'fr-FR': {
                            labelSingular: 'Société'
                        }
                    }
                }
            },
            i18nContext: buildI18nContext({
                locale: 'fr-FR'
            })
        });
        expect(resolved.labelSingular).toBe('Société');
        expect(resolved).not.toHaveProperty('translations');
        expect(resolved).not.toHaveProperty('overrides');
    });
    // viewField is the one overridable entity with nothing translatable. Its
    // overrides used to be flattened by the publisher instead, which meant two
    // mechanisms resolving the same thing for different entities.
    it('should apply overrides for an entity that has nothing translatable', ()=>{
        const resolved = (0, _resolvemetadataeventrecordutil.resolveMetadataEventRecord)({
            metadataName: 'viewField',
            record: {
                isVisible: true,
                size: 120,
                position: 3,
                overrides: {
                    isVisible: false,
                    size: 240
                }
            },
            i18nContext: buildI18nContext()
        });
        expect(resolved.isVisible).toBe(false);
        expect(resolved.size).toBe(240);
        expect(resolved.position).toBe(3);
        expect(resolved).not.toHaveProperty('overrides');
    });
});

//# sourceMappingURL=resolve-metadata-event-record.util.spec.js.map