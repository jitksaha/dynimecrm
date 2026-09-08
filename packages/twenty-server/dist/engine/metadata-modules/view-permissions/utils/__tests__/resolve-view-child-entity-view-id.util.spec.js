"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _resolveviewchildentityviewidutil = require("../resolve-view-child-entity-view-id.util");
describe('resolveViewChildEntityViewId', ()=>{
    it('reads the view named by the input', ()=>{
        expect((0, _resolveviewchildentityviewidutil.resolveViewChildEntityViewId)({
            args: {
                input: {
                    viewId: 'view-id'
                }
            },
            body: undefined
        })).toBe('view-id');
    });
    it('reads the view named by the first of a bulk create', ()=>{
        expect((0, _resolveviewchildentityviewidutil.resolveViewChildEntityViewId)({
            args: {
                inputs: [
                    {
                        viewId: 'view-id'
                    }
                ]
            },
            body: undefined
        })).toBe('view-id');
    });
    it('falls back to the REST body', ()=>{
        expect((0, _resolveviewchildentityviewidutil.resolveViewChildEntityViewId)({
            args: {},
            body: {
                viewId: 'view-id'
            }
        })).toBe('view-id');
    });
    it('returns null when no view is named', ()=>{
        expect((0, _resolveviewchildentityviewidutil.resolveViewChildEntityViewId)({
            args: {},
            body: undefined
        })).toBeNull();
    });
    it('does not accept an empty string as a named view', ()=>{
        expect((0, _resolveviewchildentityviewidutil.resolveViewChildEntityViewId)({
            args: {
                input: {
                    viewId: ''
                }
            },
            body: undefined
        })).toBeNull();
    });
});

//# sourceMappingURL=resolve-view-child-entity-view-id.util.spec.js.map