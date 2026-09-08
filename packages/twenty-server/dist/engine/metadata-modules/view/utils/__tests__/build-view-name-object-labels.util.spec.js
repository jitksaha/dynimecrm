"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _buildviewnameobjectlabelsutil = require("../build-view-name-object-labels.util");
const objectMetadata = {
    labelSingular: 'widget',
    labelPlural: 'widgets'
};
const i18nContext = {
    locale: 'fr-FR',
    i18nInstance: {
        _: (id)=>id
    },
    isStandardApp: true
};
describe('buildViewNameObjectLabels', ()=>{
    // Capitalization rides along: the value carries the casing because a
    // placeholder can start a label.
    it('resolves only the placeholder the name carries', ()=>{
        expect((0, _buildviewnameobjectlabelsutil.buildViewNameObjectLabels)({
            viewName: 'All {objectLabelPlural}',
            objectMetadata,
            i18nContext
        })).toEqual({
            objectLabelPlural: 'Widgets'
        });
        expect((0, _buildviewnameobjectlabelsutil.buildViewNameObjectLabels)({
            viewName: '{objectLabelSingular} Record Page',
            objectMetadata,
            i18nContext
        })).toEqual({
            objectLabelSingular: 'Widget'
        });
    });
    it('resolves both when the name carries both', ()=>{
        expect((0, _buildviewnameobjectlabelsutil.buildViewNameObjectLabels)({
            viewName: '{objectLabelSingular} of {objectLabelPlural}',
            objectMetadata,
            i18nContext
        })).toEqual({
            objectLabelSingular: 'Widget',
            objectLabelPlural: 'Widgets'
        });
    });
    it('resolves nothing for a name without placeholders', ()=>{
        expect((0, _buildviewnameobjectlabelsutil.buildViewNameObjectLabels)({
            viewName: 'My pipeline',
            objectMetadata,
            i18nContext
        })).toEqual({});
    });
});

//# sourceMappingURL=build-view-name-object-labels.util.spec.js.map