"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MatchParticipantService", {
    enumerable: true,
    get: function() {
        return MatchParticipantService;
    }
});
const _common = require("@nestjs/common");
const _lodashchunk = /*#__PURE__*/ _interop_require_default(require("lodash.chunk"));
const _utils = require("twenty-shared/utils");
const _typeorm = require("typeorm");
const _workspaceormmanager = require("../../engine/twenty-orm/workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../engine/twenty-orm/utils/build-system-auth-context.util");
const _getworkspacerepositorywithoptionaltransactionutil = require("../../engine/twenty-orm/utils/get-workspace-repository-with-optional-transaction.util");
const _participanttargetreconciliationservice = require("./participant-target-reconciliation.service");
const _addpersonemailfilterstoquerybuilder = require("./utils/add-person-email-filters-to-query-builder");
const _findpersonbyprimaryoradditionalemail = require("./utils/find-person-by-primary-or-additional-email");
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
let MatchParticipantService = class MatchParticipantService {
    getParticipantRepository({ objectMetadataName, transactionScope }) {
        return (0, _getworkspacerepositorywithoptionaltransactionutil.getWorkspaceRepositoryWithOptionalTransaction)({
            objectMetadataName,
            transactionScope,
            workspaceOrmManager: this.workspaceOrmManager
        });
    }
    async matchParticipants({ participants, sourceRecordIds, objectMetadataName, matchWith = 'workspaceMemberAndPerson', transactionScope }) {
        // Desired targets derive from personId only, so a workspaceMemberOnly
        // rematch can never change them; skip the recompute in that case.
        const shouldReconcileTargets = matchWith !== 'workspaceMemberOnly';
        if (participants.length === 0) {
            if (shouldReconcileTargets) {
                await this.participantTargetReconciliationService.reconcileParticipantTargets({
                    sourceRecordIds,
                    objectMetadataName,
                    transactionScope
                });
            }
            return;
        }
        const personRepository = (0, _getworkspacerepositorywithoptionaltransactionutil.getWorkspaceRepositoryWithOptionalTransaction)({
            objectMetadataName: 'person',
            transactionScope,
            workspaceOrmManager: this.workspaceOrmManager,
            rolePermissionConfig: {
                shouldBypassPermissionChecks: true
            }
        });
        const participantRepository = this.getParticipantRepository({
            objectMetadataName,
            transactionScope
        });
        const workspaceMemberRepository = (0, _getworkspacerepositorywithoptionaltransactionutil.getWorkspaceRepositoryWithOptionalTransaction)({
            objectMetadataName: 'workspaceMember',
            transactionScope,
            workspaceOrmManager: this.workspaceOrmManager,
            rolePermissionConfig: {
                shouldBypassPermissionChecks: true
            }
        });
        const chunkSize = 200;
        const chunkedParticipants = (0, _lodashchunk.default)(participants, chunkSize);
        for (const participants of chunkedParticipants){
            const uniqueParticipantsHandles = [
                ...new Set(participants.map((participant)=>participant.handle))
            ].filter(_utils.isDefined);
            const queryBuilder = (0, _addpersonemailfilterstoquerybuilder.addPersonEmailFiltersToQueryBuilder)({
                queryBuilder: personRepository.createQueryBuilder('person'),
                emails: uniqueParticipantsHandles
            });
            const people = await queryBuilder.orderBy('person.createdAt', 'ASC').getMany();
            const workspaceMembers = await workspaceMemberRepository.find({
                where: {
                    userEmail: (0, _typeorm.Any)(uniqueParticipantsHandles)
                }
            });
            const partipantsToBeUpdated = participants.map((participant)=>({
                    ...participant,
                    handle: participant.handle ?? ''
                })).map((participant)=>{
                const person = (0, _findpersonbyprimaryoradditionalemail.findPersonByPrimaryOrAdditionalEmail)({
                    people,
                    email: participant.handle
                });
                const workspaceMember = workspaceMembers.find((workspaceMember)=>workspaceMember.userEmail === participant.handle);
                const shouldMatchWithPerson = matchWith === 'workspaceMemberAndPerson' || matchWith === 'personOnly';
                const shouldMatchWithWorkspaceMember = matchWith === 'workspaceMemberAndPerson' || matchWith === 'workspaceMemberOnly';
                const newParticipant = {
                    ...participant,
                    ...shouldMatchWithPerson && {
                        personId: (0, _utils.isDefined)(person) ? person.id : null
                    },
                    ...shouldMatchWithWorkspaceMember && {
                        workspaceMemberId: (0, _utils.isDefined)(workspaceMember) ? workspaceMember.id : null
                    }
                };
                if (newParticipant.personId === participant.personId && newParticipant.workspaceMemberId === participant.workspaceMemberId) {
                    return null;
                }
                return newParticipant;
            }).filter(_utils.isDefined);
            await participantRepository.updateMany(partipantsToBeUpdated.map((participant)=>({
                    criteria: participant.id,
                    partialEntity: {
                        personId: participant.personId,
                        workspaceMemberId: participant.workspaceMemberId
                    }
                })));
        }
        if (shouldReconcileTargets) {
            await this.participantTargetReconciliationService.reconcileParticipantTargets({
                sourceRecordIds,
                objectMetadataName,
                transactionScope
            });
        }
    }
    async matchParticipantsForWorkspaceMembers({ participantMatching, objectMetadataName, workspaceId }) {
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        await this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            await this.workspaceOrmManager.runInWorkspaceTransaction(async (transactionScope)=>{
                const participantRepository = this.getParticipantRepository({
                    objectMetadataName,
                    transactionScope
                });
                const participants = await participantRepository.find({
                    where: {
                        workspaceMemberId: (0, _typeorm.In)(participantMatching.workspaceMemberIds)
                    }
                });
                const rematchedParticipants = participants.map((participant)=>({
                        ...participant,
                        workspaceMemberId: null
                    }));
                await this.matchParticipants({
                    matchWith: 'workspaceMemberOnly',
                    participants: rematchedParticipants,
                    sourceRecordIds: this.getSourceRecordIds(rematchedParticipants),
                    objectMetadataName,
                    transactionScope
                });
            });
        }, authContext);
    }
    async matchParticipantsForPeople({ participantMatching, objectMetadataName, workspaceId }) {
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        await this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            await this.workspaceOrmManager.runInWorkspaceTransaction(async (transactionScope)=>{
                const participantRepository = this.getParticipantRepository({
                    objectMetadataName,
                    transactionScope
                });
                let participantsMatchingPersonEmails = [];
                let participantsMatchingPersonId = [];
                if (participantMatching.personIds.length > 0) {
                    participantsMatchingPersonId = await participantRepository.find({
                        where: {
                            personId: (0, _typeorm.In)(participantMatching.personIds)
                        }
                    });
                }
                if (participantMatching.personEmails.length > 0) {
                    participantsMatchingPersonEmails = await participantRepository.find({
                        where: {
                            handle: (0, _typeorm.In)(participantMatching.personEmails)
                        }
                    });
                }
                const uniqueParticipants = [
                    ...new Set([
                        ...participantsMatchingPersonId,
                        ...participantsMatchingPersonEmails
                    ])
                ];
                const tobeRematchedParticipants = uniqueParticipants.map((participant)=>{
                    return {
                        ...participant,
                        personId: null
                    };
                });
                await this.matchParticipants({
                    matchWith: 'personOnly',
                    participants: tobeRematchedParticipants,
                    sourceRecordIds: this.getSourceRecordIds(tobeRematchedParticipants),
                    objectMetadataName,
                    transactionScope
                });
            });
        }, authContext);
    }
    getSourceRecordIds(participants) {
        return participants.map((participant)=>'messageId' in participant ? participant.messageId : participant.calendarEventId);
    }
    constructor(workspaceOrmManager, participantTargetReconciliationService){
        this.workspaceOrmManager = workspaceOrmManager;
        this.participantTargetReconciliationService = participantTargetReconciliationService;
    }
};
MatchParticipantService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager,
        typeof _participanttargetreconciliationservice.ParticipantTargetReconciliationService === "undefined" ? Object : _participanttargetreconciliationservice.ParticipantTargetReconciliationService
    ])
], MatchParticipantService);

//# sourceMappingURL=match-participant.service.js.map