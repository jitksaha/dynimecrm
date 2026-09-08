"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _i18n = require("twenty-shared/i18n");
const _resolveviewnameutil = require("../resolve-view-name.util");
const mockI18n = {
    _: (id)=>id === 'known-id' ? 'Toutes les entreprises' : id
};
const buildContext = ({ isStandardApp = true, applicationCatalog } = {})=>({
        locale: 'fr-FR',
        i18nInstance: mockI18n,
        isStandardApp,
        applicationCatalog
    });
describe('resolveViewName', ()=>{
    it('substitutes the object label into a templated name', ()=>{
        expect((0, _resolveviewnameutil.resolveViewName)({
            view: {
                name: 'All {objectLabelPlural}'
            },
            objectLabelPlaceholderValues: (0, _i18n.buildObjectMetadataLabelPlaceholderValues)({
                labelPlural: 'Entreprises'
            }),
            i18nContext: buildContext()
        })).toBe('All Entreprises');
    });
    it('capitalizes the object label it substitutes', ()=>{
        expect((0, _resolveviewnameutil.resolveViewName)({
            view: {
                name: 'All {objectLabelPlural}'
            },
            objectLabelPlaceholderValues: (0, _i18n.buildObjectMetadataLabelPlaceholderValues)({
                labelPlural: 'widgets'
            }),
            i18nContext: buildContext()
        })).toBe('All Widgets');
    });
    it('substitutes the singular object label too', ()=>{
        expect((0, _resolveviewnameutil.resolveViewName)({
            view: {
                name: '{objectLabelSingular} Record Page'
            },
            objectLabelPlaceholderValues: (0, _i18n.buildObjectMetadataLabelPlaceholderValues)({
                labelSingular: 'widget'
            }),
            i18nContext: buildContext()
        })).toBe('Widget Record Page');
    });
    it('leaves the placeholder alone when no object label is available', ()=>{
        expect((0, _resolveviewnameutil.resolveViewName)({
            view: {
                name: 'All {objectLabelPlural}'
            },
            i18nContext: buildContext()
        })).toBe('All {objectLabelPlural}');
    });
    // A view owned by the workspace-custom application is user copy: it must come
    // back verbatim rather than being matched against the standard catalog.
    it('returns a workspace-custom view name untranslated', ()=>{
        expect((0, _resolveviewnameutil.resolveViewName)({
            view: {
                name: 'My pipeline'
            },
            i18nContext: buildContext({
                isStandardApp: false
            })
        })).toBe('My pipeline');
    });
    it('prefers a workspace override over the catalog', ()=>{
        expect((0, _resolveviewnameutil.resolveViewName)({
            view: {
                name: 'Renamed',
                overrides: {
                    name: 'Renamed'
                }
            },
            i18nContext: buildContext()
        })).toBe('Renamed');
    });
    it('resolves an installed application view name from that application catalog', ()=>{
        // generateMessageId('All rockets', 'view.name') — catalogs are keyed with
        // the metadataName.property context since S5.
        const catalog = {
            '1FxLDo': 'Toutes les fusees'
        };
        expect((0, _resolveviewnameutil.resolveViewName)({
            view: {
                name: 'All rockets'
            },
            i18nContext: buildContext({
                isStandardApp: false,
                applicationCatalog: catalog
            })
        })).toBe('Toutes les fusees');
    });
});

//# sourceMappingURL=resolve-view-name.util.spec.js.map