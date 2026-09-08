"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _buildtimelineactivitymergekeyutil = require("../build-timeline-activity-merge-key.util");
const buildSnapshot = (overrides = {})=>({
        id: '20202020-0000-4000-8000-000000000001',
        universalIdentifier: '20202020-0000-4000-8000-000000000002',
        name: 'recordUpdated',
        label: 'was updated by',
        action: 'updated',
        icon: 'IconPencil',
        objectUniversalIdentifier: null,
        frontComponentUniversalIdentifier: null,
        ...overrides
    });
const buildKey = ({ workspaceMemberId = '20202020-0000-4000-8000-000000000003', snapshot = buildSnapshot() } = {})=>(0, _buildtimelineactivitymergekeyutil.buildTimelineActivityMergeKey)({
        recordId: '20202020-0000-4000-8000-000000000004',
        workspaceMemberId,
        timelineActivityTypeId: '20202020-0000-4000-8000-000000000001',
        timelineActivityTypeSnapshot: snapshot
    });
describe('buildTimelineActivityMergeKey', ()=>{
    it('ignores live presentation values while preserving frozen semantics', ()=>{
        expect(buildKey({
            snapshot: buildSnapshot({
                name: 'renamed',
                label: 'has changed',
                icon: 'IconRefresh',
                frontComponentUniversalIdentifier: '20202020-0000-4000-8000-000000000005'
            })
        })).toBe(buildKey());
    });
    it.each([
        {
            action: 'created'
        },
        {
            universalIdentifier: '20202020-0000-4000-8000-000000000006'
        },
        {
            objectUniversalIdentifier: '20202020-0000-4000-8000-000000000007'
        }
    ])('keeps semantic snapshot fields in the frozen merge identity', (snapshotOverride)=>{
        expect(buildKey({
            snapshot: buildSnapshot(snapshotOverride)
        })).not.toBe(buildKey());
    });
    it('normalizes an absent author', ()=>{
        expect(buildKey({
            workspaceMemberId: null
        })).toBe((0, _buildtimelineactivitymergekeyutil.buildTimelineActivityMergeKey)({
            recordId: '20202020-0000-4000-8000-000000000004',
            workspaceMemberId: undefined,
            timelineActivityTypeId: '20202020-0000-4000-8000-000000000001',
            timelineActivityTypeSnapshot: buildSnapshot()
        }));
    });
    it('falls back to the pre-snapshot identity during rolling upgrades', ()=>{
        const args = {
            recordId: '20202020-0000-4000-8000-000000000004',
            workspaceMemberId: '20202020-0000-4000-8000-000000000003',
            timelineActivityTypeId: '20202020-0000-4000-8000-000000000001',
            timelineActivityTypeSnapshot: buildSnapshot()
        };
        expect((0, _buildtimelineactivitymergekeyutil.buildTimelineActivityMergeKeyCandidates)(args)).toEqual([
            (0, _buildtimelineactivitymergekeyutil.buildTimelineActivityMergeKey)(args),
            (0, _buildtimelineactivitymergekeyutil.buildTimelineActivityMergeKey)({
                ...args,
                timelineActivityTypeSnapshot: null
            })
        ]);
    });
});

//# sourceMappingURL=build-timeline-activity-merge-key.util.spec.js.map