"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _preserveapplicationlocalmetadatastateutil = require("../preserve-application-local-metadata-state.util");
describe('preserveApplicationLocalMetadataState', ()=>{
    it('keeps workspace overrides and activation while accepting app updates', ()=>{
        expect((0, _preserveapplicationlocalmetadatastateutil.preserveApplicationLocalMetadataState)({
            existingEntity: {
                label: 'Old app label',
                overrides: {
                    label: 'Workspace label'
                },
                isActive: false
            },
            manifestEntity: {
                label: 'New app label',
                overrides: null,
                isActive: true
            }
        })).toEqual({
            label: 'New app label',
            overrides: {
                label: 'Workspace label'
            },
            isActive: false
        });
    });
    it('does not add local-state properties to metadata that does not support them', ()=>{
        expect((0, _preserveapplicationlocalmetadatastateutil.preserveApplicationLocalMetadataState)({
            existingEntity: {
                label: 'Old app label',
                isActive: false
            },
            manifestEntity: {
                label: 'New app label',
                isActive: true
            }
        })).toEqual({
            label: 'New app label',
            isActive: true
        });
    });
    it('preserves universal overrides used by relation-bearing metadata', ()=>{
        expect((0, _preserveapplicationlocalmetadatastateutil.preserveApplicationLocalMetadataState)({
            existingEntity: {
                universalOverrides: {
                    pageLayoutUniversalIdentifier: 'layout-old'
                },
                isActive: false
            },
            manifestEntity: {
                universalOverrides: null,
                isActive: true
            }
        })).toEqual({
            universalOverrides: {
                pageLayoutUniversalIdentifier: 'layout-old'
            },
            isActive: false
        });
    });
});

//# sourceMappingURL=preserve-application-local-metadata-state.util.spec.js.map