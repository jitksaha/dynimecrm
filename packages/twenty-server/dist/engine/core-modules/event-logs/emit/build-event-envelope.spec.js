"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _buildeventenvelope = require("./build-event-envelope");
describe('build-event-envelope', ()=>{
    describe('computeEventContextFields', ()=>{
        it('keeps defined ids and drops null/undefined', ()=>{
            expect((0, _buildeventenvelope.computeEventContextFields)({
                workspaceId: 'w',
                userId: 'u'
            })).toEqual({
                workspaceId: 'w',
                userId: 'u'
            });
            expect((0, _buildeventenvelope.computeEventContextFields)({
                workspaceId: 'w',
                userId: null
            })).toEqual({
                workspaceId: 'w'
            });
            expect((0, _buildeventenvelope.computeEventContextFields)()).toEqual({});
        });
    });
    describe('buildPageviewEnvelope', ()=>{
        it('tags the envelope with the pageview table and merges context', ()=>{
            const envelope = (0, _buildeventenvelope.buildPageviewEnvelope)({
                workspaceId: 'w',
                userId: 'u'
            }, 'home', {});
            expect(envelope.table).toBe('pageview');
            expect(envelope.row).toMatchObject({
                workspaceId: 'w',
                userId: 'u',
                type: 'page',
                name: 'home'
            });
        });
    });
});

//# sourceMappingURL=build-event-envelope.spec.js.map