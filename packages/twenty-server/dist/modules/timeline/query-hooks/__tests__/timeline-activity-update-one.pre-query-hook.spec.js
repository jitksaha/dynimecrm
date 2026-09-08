"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _timelineactivityupdateoneprequeryhook = require("../timeline-activity-update-one.pre-query-hook");
describe('TimelineActivityUpdateOnePreQueryHook', ()=>{
    it('does not let an application change the attributed workspace member', async ()=>{
        const hook = new _timelineactivityupdateoneprequeryhook.TimelineActivityUpdateOnePreQueryHook();
        await expect(hook.execute({
            type: 'application'
        }, 'timelineActivity', {
            data: {
                workspaceMemberId: '00000000-0000-4000-8000-000000000001'
            },
            filter: {
                id: {
                    eq: 'activity-id'
                }
            }
        })).resolves.toMatchObject({
            data: {
                workspaceMemberId: null
            }
        });
    });
});

//# sourceMappingURL=timeline-activity-update-one.pre-query-hook.spec.js.map