"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TimelineActivityRepository", {
    enumerable: true,
    get: function() {
        return TimelineActivityRepository;
    }
});
const _common = require("@nestjs/common");
const _lodashchunk = /*#__PURE__*/ _interop_require_default(require("lodash.chunk"));
const _constants = require("twenty-shared/constants");
const _utils = require("twenty-shared/utils");
const _typeorm = require("typeorm");
const _postgreserrorcodesconstants = require("../../../engine/api/graphql/workspace-query-runner/constants/postgres-error-codes.constants");
const _objectrecorddiffmerge = require("../../../engine/core-modules/event-emitter/utils/object-record-diff-merge");
const _workspaceormmanager = require("../../../engine/twenty-orm/workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../engine/twenty-orm/utils/build-system-auth-context.util");
const _buildtimelineactivitymergekeyutil = require("../utils/build-timeline-activity-merge-key.util");
const _resolvetimelineactivityhappensatutil = require("../utils/resolve-timeline-activity-happens-at.util");
const _timelineactivityrelatedmorphfieldmetadatanamebuilderutil = require("../utils/timeline-activity-related-morph-field-metadata-name-builder.util");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const ACQUIRE_TIMELINE_ACTIVITY_MERGE_LOCK = `SELECT pg_advisory_xact_lock(hashtextextended("lockName", 0))
   FROM unnest($1::text[]) WITH ORDINALITY AS "locks"("lockName", "ordinality")
   ORDER BY "ordinality"`;
const isForeignKeyViolation = (error)=>error.cause?.code === _postgreserrorcodesconstants.POSTGRESQL_ERROR_CODES.FOREIGN_KEY_VIOLATION;
let TimelineActivityRepository = class TimelineActivityRepository {
    async upsertTimelineActivities(args) {
        try {
            await this.upsertTimelineActivitiesOnce({
                ...args,
                shouldFilterMissingTargets: false
            });
        } catch (error) {
            if (!isForeignKeyViolation(error)) {
                throw error;
            }
            await this.upsertTimelineActivitiesOnce({
                ...args,
                shouldFilterMissingTargets: true
            });
        }
    }
    async updateLinkedTimelineActivitiesHappensAt({ workspaceId, updates }) {
        if (updates.length === 0) {
            return;
        }
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        await this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            for (const update of updates){
                await this.syncLinkedTimelineActivitiesHappensAtFromSourceRecords(update);
            }
        }, authContext);
    }
    async syncLinkedTimelineActivitiesHappensAtFromSourceRecords({ sourceObjectNameSingular, happensAtFieldName, timelineActivityTypeIds, linkedRecordIds }) {
        const sourceRepository = this.workspaceOrmManager.getRepository(sourceObjectNameSingular, {
            shouldBypassPermissionChecks: true
        });
        // Queue retries can replay an older source event after a newer one, so the
        // value is read from the source row at write time instead of trusting the
        // event snapshot: a replay then rewrites the current value, not a stale one.
        const sourceRecords = await sourceRepository.find({
            select: [
                'id',
                happensAtFieldName
            ],
            where: {
                id: (0, _typeorm.In)(linkedRecordIds)
            }
        });
        const happensAtByLinkedRecordId = new Map();
        for (const sourceRecord of sourceRecords){
            const happensAt = (0, _resolvetimelineactivityhappensatutil.parseLinkedTimelineActivityHappensAt)(sourceRecord[happensAtFieldName]);
            // A cleared timestamp keeps the previously written happensAt
            if ((0, _utils.isDefined)(happensAt)) {
                happensAtByLinkedRecordId.set(sourceRecord.id, happensAt);
            }
        }
        if (happensAtByLinkedRecordId.size === 0) {
            return;
        }
        const timelineActivityRepository = this.workspaceOrmManager.getRepository('timelineActivity', {
            shouldBypassPermissionChecks: true
        });
        const timelineActivities = await timelineActivityRepository.find({
            select: [
                'id',
                'linkedRecordId'
            ],
            where: {
                linkedRecordId: (0, _typeorm.In)([
                    ...happensAtByLinkedRecordId.keys()
                ]),
                timelineActivityTypeId: (0, _typeorm.In)(timelineActivityTypeIds)
            }
        });
        const updateInputs = timelineActivities.flatMap((timelineActivity)=>{
            const happensAt = happensAtByLinkedRecordId.get(timelineActivity.linkedRecordId);
            return (0, _utils.isDefined)(happensAt) ? [
                {
                    criteria: timelineActivity.id,
                    partialEntity: {
                        happensAt
                    }
                }
            ] : [];
        });
        for (const updateInputsChunk of (0, _lodashchunk.default)(updateInputs, _constants.QUERY_MAX_RECORDS)){
            await timelineActivityRepository.updateMany(updateInputsChunk);
        }
    }
    async upsertTimelineActivitiesOnce({ objectSingularName, workspaceId, payloads, shouldFilterMissingTargets }) {
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        await this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            await this.workspaceOrmManager.runInWorkspaceTransaction(async (transactionScope)=>{
                await this.acquireMergeLocks({
                    transactionScope,
                    objectSingularName,
                    workspaceId,
                    payloads
                });
                const timelineActivityRepository = transactionScope.getRepository('timelineActivity', {
                    shouldBypassPermissionChecks: true
                });
                const recentTimelineActivities = await this.findRecentTimelineActivities({
                    timelineActivityRepository,
                    objectSingularName,
                    payloads
                });
                const payloadsToInsert = [];
                const mergesToApply = [];
                const timelineActivityPropertyName = this.getTimelineActivityPropertyName(objectSingularName);
                // Bucketed once so matching a payload stays constant time: the recent
                // window is scoped to this batch but is not capped in size.
                const recentTimelineActivitiesByMergeKey = new Map();
                for (const timelineActivity of recentTimelineActivities){
                    const mergeKey = (0, _buildtimelineactivitymergekeyutil.buildTimelineActivityMergeKey)({
                        recordId: timelineActivity[timelineActivityPropertyName],
                        workspaceMemberId: timelineActivity.workspaceMemberId,
                        timelineActivityTypeId: timelineActivity.timelineActivityTypeId,
                        timelineActivityTypeSnapshot: timelineActivity.timelineActivityTypeSnapshot
                    });
                    const bucket = recentTimelineActivitiesByMergeKey.get(mergeKey);
                    if ((0, _utils.isDefined)(bucket)) {
                        bucket.push(timelineActivity);
                    } else {
                        recentTimelineActivitiesByMergeKey.set(mergeKey, [
                            timelineActivity
                        ]);
                    }
                }
                for (const payload of payloads){
                    const recentTimelineActivity = (0, _buildtimelineactivitymergekeyutil.buildTimelineActivityMergeKeyCandidates)({
                        recordId: payload.recordId,
                        workspaceMemberId: payload.workspaceMemberId,
                        timelineActivityTypeId: payload.timelineActivityTypeId,
                        timelineActivityTypeSnapshot: payload.timelineActivityTypeSnapshot
                    }).flatMap((mergeKey)=>recentTimelineActivitiesByMergeKey.get(mergeKey) ?? []).find((timelineActivity)=>!(0, _utils.isDefined)(payload.linkedRecordId) || timelineActivity.linkedRecordId === payload.linkedRecordId);
                    if ((0, _utils.isDefined)(recentTimelineActivity)) {
                        mergesToApply.push({
                            id: recentTimelineActivity.id,
                            properties: (0, _objectrecorddiffmerge.objectRecordDiffMerge)(recentTimelineActivity.properties, payload.properties),
                            workspaceMemberId: payload.workspaceMemberId,
                            ...!(0, _utils.isDefined)(recentTimelineActivity.timelineActivityTypeSnapshot) && {
                                timelineActivityTypeSnapshot: payload.timelineActivityTypeSnapshot
                            }
                        });
                    } else {
                        payloadsToInsert.push(payload);
                    }
                }
                const insertablePayloads = shouldFilterMissingTargets ? await this.filterPayloadsWithExistingTarget({
                    transactionScope,
                    objectSingularName,
                    payloads: payloadsToInsert
                }) : payloadsToInsert;
                await Promise.all([
                    this.updateTimelineActivities({
                        timelineActivityRepository,
                        merges: mergesToApply
                    }),
                    this.insertTimelineActivities({
                        timelineActivityRepository,
                        objectSingularName,
                        payloads: insertablePayloads
                    })
                ]);
            });
        }, authContext);
    }
    async filterPayloadsWithExistingTarget({ transactionScope, objectSingularName, payloads }) {
        if (payloads.length === 0) {
            return payloads;
        }
        const targetRepository = transactionScope.getRepository(objectSingularName, {
            shouldBypassPermissionChecks: true
        });
        const existingRecords = await targetRepository.find({
            select: [
                'id'
            ],
            where: {
                id: (0, _typeorm.In)(payloads.map((payload)=>payload.recordId))
            },
            withDeleted: true
        });
        const existingRecordIds = new Set(existingRecords.map((record)=>record.id));
        return payloads.filter((payload)=>existingRecordIds.has(payload.recordId));
    }
    async acquireMergeLocks({ transactionScope, objectSingularName, workspaceId, payloads }) {
        const lockNames = [
            ...new Set(payloads.map((payload)=>JSON.stringify([
                    'timeline-activity-merge',
                    workspaceId,
                    objectSingularName,
                    payload.recordId,
                    payload.workspaceMemberId ?? null,
                    payload.timelineActivityTypeId
                ])))
        ].sort();
        await transactionScope.executeRawQuery(ACQUIRE_TIMELINE_ACTIVITY_MERGE_LOCK, [
            lockNames
        ]);
    }
    async findRecentTimelineActivities({ timelineActivityRepository, objectSingularName, payloads }) {
        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
        const timelineActivityPropertyName = this.getTimelineActivityPropertyName(objectSingularName);
        const whereConditions = {
            [timelineActivityPropertyName]: (0, _typeorm.In)(payloads.map((payload)=>payload.recordId)),
            workspaceMemberId: (0, _typeorm.In)(payloads.map((payload)=>payload.workspaceMemberId || null)),
            createdAt: (0, _typeorm.MoreThan)(tenMinutesAgo)
        };
        // The where clause is already scoped to this batch payloads and to the merge
        // window, so every candidate is fetched: taking a single row would let only
        // one payload of a multi record batch merge.
        return await timelineActivityRepository.find({
            where: {
                ...whereConditions,
                timelineActivityTypeId: (0, _typeorm.In)(payloads.map((payload)=>payload.timelineActivityTypeId))
            },
            order: {
                createdAt: 'DESC'
            }
        });
    }
    async insertTimelineActivities({ timelineActivityRepository, objectSingularName, payloads }) {
        if (payloads.length === 0) {
            return;
        }
        const timelineActivityPropertyName = this.getTimelineActivityPropertyName(objectSingularName);
        return timelineActivityRepository.insert(payloads.map((payload)=>({
                happensAt: payload.happensAt,
                timelineActivityTypeId: payload.timelineActivityTypeId,
                timelineActivityTypeSnapshot: payload.timelineActivityTypeSnapshot,
                properties: payload.properties,
                workspaceMemberId: payload.workspaceMemberId,
                [timelineActivityPropertyName]: payload.recordId,
                linkedRecordCachedName: payload.linkedRecordCachedName ?? '',
                linkedRecordId: payload.linkedRecordId,
                linkedObjectMetadataId: payload.linkedObjectMetadataId
            })));
    }
    async updateTimelineActivities({ timelineActivityRepository, merges }) {
        if (merges.length === 0) {
            return;
        }
        await Promise.all(merges.map(({ id, properties, workspaceMemberId, timelineActivityTypeSnapshot })=>timelineActivityRepository.update(id, {
                properties,
                workspaceMemberId,
                ...(0, _utils.isDefined)(timelineActivityTypeSnapshot) && {
                    timelineActivityTypeSnapshot
                }
            })));
    }
    getTimelineActivityPropertyName(objectSingularName) {
        return `${(0, _timelineactivityrelatedmorphfieldmetadatanamebuilderutil.buildTimelineActivityRelatedMorphFieldMetadataName)(objectSingularName)}Id`;
    }
    constructor(workspaceOrmManager){
        this.workspaceOrmManager = workspaceOrmManager;
    }
};
TimelineActivityRepository = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager
    ])
], TimelineActivityRepository);

//# sourceMappingURL=timeline-activity.repository.js.map