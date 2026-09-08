"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ParticipantTargetReconciliationService", {
    enumerable: true,
    get: function() {
        return ParticipantTargetReconciliationService;
    }
});
const _common = require("@nestjs/common");
const _lodashchunk = /*#__PURE__*/ _interop_require_default(require("lodash.chunk"));
const _constants = require("twenty-shared/constants");
const _utils = require("twenty-shared/utils");
const _typeorm = require("typeorm");
const _ormworkspacecontextstorage = require("../../engine/twenty-orm/storage/orm-workspace-context.storage");
const _getworkspacerepositorywithoptionaltransactionutil = require("../../engine/twenty-orm/utils/get-workspace-repository-with-optional-transaction.util");
const _workspaceormmanager = require("../../engine/twenty-orm/workspace-orm.manager");
const _computetargetreconciliationoperationsutil = require("./utils/compute-target-reconciliation-operations.util");
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
let ParticipantTargetReconciliationService = class ParticipantTargetReconciliationService {
    async reconcileParticipantTargets({ sourceRecordIds, objectMetadataName, transactionScope }) {
        if (objectMetadataName === 'messageParticipant') {
            await this.reconcileMessageThreadTargetsFromMessageIds({
                messageIds: sourceRecordIds,
                transactionScope
            });
            return;
        }
        await this.reconcileCalendarEventTargets({
            calendarEventIds: sourceRecordIds,
            transactionScope
        });
    }
    async reconcileCalendarEventTargets({ calendarEventIds, transactionScope }) {
        for (const calendarEventIdChunk of (0, _lodashchunk.default)([
            ...new Set(calendarEventIds)
        ], _constants.QUERY_MAX_RECORDS)){
            const participantRepository = await this.getRepository('calendarEventParticipant', transactionScope);
            const participants = await participantRepository.find({
                where: {
                    calendarEventId: (0, _typeorm.In)(calendarEventIdChunk)
                },
                select: {
                    calendarEventId: true,
                    personId: true
                }
            });
            await this.reconcileTargets({
                parentIds: calendarEventIdChunk,
                parentFieldName: 'calendarEventId',
                participantPersonIdsByParentId: this.groupParticipantPersonIds({
                    participants,
                    getParentId: (participant)=>participant.calendarEventId
                }),
                targetObjectName: 'calendarEventTarget',
                transactionScope
            });
        }
    }
    async reconcileMessageThreadTargetsFromMessageIds({ messageIds, transactionScope }) {
        if (messageIds.length === 0) {
            return;
        }
        const messageRepository = await this.getRepository('message', transactionScope);
        const changedMessages = [];
        for (const messageIdChunk of (0, _lodashchunk.default)([
            ...new Set(messageIds)
        ], _constants.QUERY_MAX_RECORDS)){
            changedMessages.push(...await messageRepository.find({
                where: {
                    id: (0, _typeorm.In)(messageIdChunk)
                },
                select: {
                    id: true,
                    messageThreadId: true
                }
            }));
        }
        const messageThreadIds = [
            ...new Set(changedMessages.map(({ messageThreadId })=>messageThreadId).filter(_utils.isDefined))
        ];
        await this.reconcileMessageThreadTargets({
            messageThreadIds,
            transactionScope
        });
    }
    async reconcileMessageThreadTargets({ messageThreadIds, transactionScope }) {
        const messageRepository = await this.getRepository('message', transactionScope);
        for (const messageThreadIdChunk of (0, _lodashchunk.default)([
            ...new Set(messageThreadIds)
        ], _constants.QUERY_MAX_RECORDS)){
            const threadMessages = await messageRepository.find({
                where: {
                    messageThreadId: (0, _typeorm.In)(messageThreadIdChunk)
                },
                select: {
                    id: true,
                    messageThreadId: true
                }
            });
            const messageThreadIdByMessageId = new Map();
            for (const { id, messageThreadId } of threadMessages){
                if ((0, _utils.isDefined)(messageThreadId)) {
                    messageThreadIdByMessageId.set(id, messageThreadId);
                }
            }
            const participantRepository = await this.getRepository('messageParticipant', transactionScope);
            const messageIds = [
                ...messageThreadIdByMessageId.keys()
            ];
            const participants = [];
            for (const messageIdChunk of (0, _lodashchunk.default)(messageIds, _constants.QUERY_MAX_RECORDS)){
                participants.push(...await participantRepository.find({
                    where: {
                        messageId: (0, _typeorm.In)(messageIdChunk)
                    },
                    select: {
                        messageId: true,
                        personId: true
                    }
                }));
            }
            await this.reconcileTargets({
                parentIds: messageThreadIdChunk,
                parentFieldName: 'messageThreadId',
                participantPersonIdsByParentId: this.groupParticipantPersonIds({
                    participants,
                    getParentId: (participant)=>messageThreadIdByMessageId.get(participant.messageId)
                }),
                targetObjectName: 'messageThreadTarget',
                transactionScope
            });
        }
    }
    async reconcileTargets({ parentIds, parentFieldName, participantPersonIdsByParentId, targetObjectName, transactionScope }) {
        if (parentIds.length === 0) {
            return;
        }
        // Existing workspaces only gain the target junction objects once the
        // upgrade metadata sync has run; until then reconciliation must no-op so
        // message and calendar imports keep succeeding. The backfill that follows
        // the sync covers rows imported during that window.
        if (!(0, _utils.isDefined)((0, _ormworkspacecontextstorage.getWorkspaceContext)().objectIdByNameSingular[targetObjectName])) {
            return;
        }
        const desiredTargets = await this.buildDesiredTargets({
            parentIds,
            participantPersonIdsByParentId,
            transactionScope
        });
        const targetRepository = await this.getRepository(targetObjectName, transactionScope);
        const existingTargetRows = await targetRepository.find({
            where: {
                [parentFieldName]: (0, _typeorm.In)(parentIds)
            },
            withDeleted: true
        });
        const existingTargets = existingTargetRows.map((target)=>{
            const parentId = target[parentFieldName];
            if (!(0, _utils.isDefined)(parentId)) {
                return null;
            }
            return {
                ...target,
                parentId
            };
        }).filter(_utils.isDefined);
        const operations = (0, _computetargetreconciliationoperationsutil.computeTargetReconciliationOperations)({
            desiredTargets,
            existingTargets
        });
        // Targets per parent are unbounded, so write batches are re-chunked to
        // stay under the ORM's per-call record cap.
        for (const targetsToCreateChunk of (0, _lodashchunk.default)(operations.targetsToCreate, _constants.QUERY_MAX_RECORDS)){
            await targetRepository.insert(targetsToCreateChunk.map(({ parentId, ...target })=>({
                    ...target,
                    [parentFieldName]: parentId,
                    isAutomaticallyAssigned: true,
                    isManuallyAssigned: false
                })), {
                onConflictDoNothing: true
            });
        }
        for (const targetIdsToMarkAutomaticChunk of (0, _lodashchunk.default)(operations.targetsToMarkAutomatic, _constants.QUERY_MAX_RECORDS)){
            await targetRepository.updateMany(targetIdsToMarkAutomaticChunk.map((id)=>({
                    criteria: id,
                    partialEntity: {
                        isAutomaticallyAssigned: true
                    }
                })));
        }
        for (const targetIdsToMarkNotAutomaticChunk of (0, _lodashchunk.default)(operations.targetsToMarkNotAutomatic, _constants.QUERY_MAX_RECORDS)){
            await targetRepository.updateMany(targetIdsToMarkNotAutomaticChunk.map((id)=>({
                    criteria: id,
                    partialEntity: {
                        isAutomaticallyAssigned: false
                    }
                })));
        }
        for (const targetIdsToDeleteChunk of (0, _lodashchunk.default)(operations.targetIdsToDelete, _constants.QUERY_MAX_RECORDS)){
            await targetRepository.delete({
                id: (0, _typeorm.In)(targetIdsToDeleteChunk)
            });
        }
    }
    async buildDesiredTargets({ parentIds, participantPersonIdsByParentId, transactionScope }) {
        const personIds = [
            ...new Set([
                ...participantPersonIdsByParentId.values()
            ].flatMap((ids)=>[
                    ...ids
                ]))
        ];
        if (personIds.length === 0) {
            return [];
        }
        const personRepository = await this.getRepository('person', transactionScope);
        const people = await personRepository.find({
            where: {
                id: (0, _typeorm.In)(personIds)
            },
            select: {
                id: true,
                companyId: true
            }
        });
        // find() excludes soft-deleted people, so this set keeps desired targets
        // aligned with the backfill, which only joins live people.
        const livePersonIds = new Set(people.map(({ id })=>id));
        const companyIdByPersonId = new Map(people.map(({ id, companyId })=>[
                id,
                companyId
            ]));
        const opportunityRepository = await this.getRepository('opportunity', transactionScope);
        const opportunities = await opportunityRepository.find({
            where: {
                pointOfContactId: (0, _typeorm.In)(personIds)
            },
            select: {
                id: true,
                pointOfContactId: true
            }
        });
        const opportunityIdsByPersonId = new Map();
        for (const opportunity of opportunities){
            if (!(0, _utils.isDefined)(opportunity.pointOfContactId)) {
                continue;
            }
            const opportunityIds = opportunityIdsByPersonId.get(opportunity.pointOfContactId) ?? [];
            opportunityIds.push(opportunity.id);
            opportunityIdsByPersonId.set(opportunity.pointOfContactId, opportunityIds);
        }
        return parentIds.flatMap((parentId)=>[
                ...participantPersonIdsByParentId.get(parentId) ?? []
            ].flatMap((personId)=>{
                if (!livePersonIds.has(personId)) {
                    return [];
                }
                const companyId = companyIdByPersonId.get(personId);
                const opportunityIds = opportunityIdsByPersonId.get(personId) ?? [];
                return [
                    {
                        parentId,
                        targetPersonId: personId,
                        targetCompanyId: null,
                        targetOpportunityId: null
                    },
                    ...(0, _utils.isDefined)(companyId) ? [
                        {
                            parentId,
                            targetPersonId: null,
                            targetCompanyId: companyId,
                            targetOpportunityId: null
                        }
                    ] : [],
                    ...opportunityIds.map((opportunityId)=>({
                            parentId,
                            targetPersonId: null,
                            targetCompanyId: null,
                            targetOpportunityId: opportunityId
                        }))
                ];
            }));
    }
    groupParticipantPersonIds({ participants, getParentId }) {
        const personIdsByParentId = new Map();
        for (const participant of participants){
            const parentId = getParentId(participant);
            const personId = participant.personId;
            if (!(0, _utils.isDefined)(parentId) || !(0, _utils.isDefined)(personId)) {
                continue;
            }
            const personIds = personIdsByParentId.get(parentId) ?? new Set();
            personIds.add(personId);
            personIdsByParentId.set(parentId, personIds);
        }
        return personIdsByParentId;
    }
    async getRepository(objectMetadataName, transactionScope) {
        return (0, _getworkspacerepositorywithoptionaltransactionutil.getWorkspaceRepositoryWithOptionalTransaction)({
            objectMetadataName,
            transactionScope,
            workspaceOrmManager: this.workspaceOrmManager,
            rolePermissionConfig: {
                shouldBypassPermissionChecks: true
            }
        });
    }
    constructor(workspaceOrmManager){
        this.workspaceOrmManager = workspaceOrmManager;
    }
};
ParticipantTargetReconciliationService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager
    ])
], ParticipantTargetReconciliationService);

//# sourceMappingURL=participant-target-reconciliation.service.js.map