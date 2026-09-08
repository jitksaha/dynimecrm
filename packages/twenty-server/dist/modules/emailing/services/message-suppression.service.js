"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MessageSuppressionService", {
    enumerable: true,
    get: function() {
        return MessageSuppressionService;
    }
});
const _common = require("@nestjs/common");
const _guards = require("@sniptt/guards");
const _utils = require("twenty-shared/utils");
const _typeorm = require("typeorm");
const _postgreserrorcodesconstants = require("../../../engine/api/graphql/workspace-query-runner/constants/postgres-error-codes.constants");
const _hardsuppressionreasonsconstant = require("../../../engine/core-modules/emailing-domain/constants/hard-suppression-reasons.constant");
const _emailingdomainexception = require("../../../engine/core-modules/emailing-domain/exceptions/emailing-domain.exception");
const _messagesuppressionentity = require("../../../engine/core-modules/emailing-domain/message-suppression.entity");
const _messagesuppressionreasontype = require("../../../engine/core-modules/emailing-domain/types/message-suppression-reason.type");
const _messagesuppressionsourcetype = require("../../../engine/core-modules/emailing-domain/types/message-suppression-source.type");
const _injectworkspacescopedrepositorydecorator = require("../../../engine/twenty-orm/workspace-scoped-repository/inject-workspace-scoped-repository.decorator");
const _workspacescopedrepository = require("../../../engine/twenty-orm/workspace-scoped-repository/workspace-scoped-repository");
const _unsubscribetopicservice = require("./unsubscribe-topic.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let MessageSuppressionService = class MessageSuppressionService {
    async findSuppressions({ workspaceId, reason, searchTerm, unsubscribeTopicId, limit, offset }) {
        const [records, totalCount] = await this.suppressionRepository.findAndCount(workspaceId, {
            where: {
                ...(0, _utils.isDefined)(reason) ? {
                    reason
                } : {},
                ...(0, _guards.isNonEmptyString)(unsubscribeTopicId) ? {
                    unsubscribeTopicId
                } : {},
                ...(0, _guards.isNonEmptyString)(searchTerm) ? {
                    emailAddress: (0, _typeorm.ILike)(`%${(0, _utils.escapeForIlike)(searchTerm)}%`)
                } : {}
            },
            order: {
                createdAt: 'DESC'
            },
            take: limit,
            skip: offset
        });
        return {
            records,
            totalCount
        };
    }
    async findApplicableSuppressions({ workspaceId, emailAddresses, unsubscribeTopicId }) {
        const normalizedAddresses = this.normalizeAddresses(emailAddresses);
        if (!(0, _utils.isNonEmptyArray)(normalizedAddresses)) {
            return [];
        }
        return this.suppressionRepository.find(workspaceId, {
            where: [
                {
                    emailAddress: (0, _typeorm.In)(normalizedAddresses),
                    unsubscribeTopicId: (0, _typeorm.IsNull)()
                },
                ...(0, _guards.isNonEmptyString)(unsubscribeTopicId) ? [
                    {
                        emailAddress: (0, _typeorm.In)(normalizedAddresses),
                        unsubscribeTopicId
                    }
                ] : []
            ]
        });
    }
    async suppress({ workspaceId, emailAddress, reason, source, providerEventId = null, unsubscribeTopicId = null }) {
        const normalizedEmailAddress = this.normalizeEmailAddress(emailAddress);
        if (!(0, _guards.isNonEmptyString)(normalizedEmailAddress)) {
            return;
        }
        const effectiveTopicId = _hardsuppressionreasonsconstant.HARD_SUPPRESSION_REASONS.includes(reason) ? null : unsubscribeTopicId;
        const whereKey = {
            emailAddress: normalizedEmailAddress,
            unsubscribeTopicId: (0, _utils.isDefined)(effectiveTopicId) ? effectiveTopicId : (0, _typeorm.IsNull)()
        };
        const escalateExisting = async ()=>{
            const existing = await this.suppressionRepository.findOneBy(workspaceId, whereKey);
            if (!(0, _utils.isDefined)(existing)) {
                return false;
            }
            if (this.shouldEscalate(existing.reason, reason)) {
                await this.suppressionRepository.update(workspaceId, {
                    id: existing.id
                }, {
                    reason,
                    source,
                    providerEventId
                });
            }
            return true;
        };
        if (await escalateExisting()) {
            return;
        }
        try {
            await this.suppressionRepository.insert(workspaceId, {
                emailAddress: normalizedEmailAddress,
                reason,
                source,
                providerEventId,
                unsubscribeTopicId: effectiveTopicId
            });
        } catch (error) {
            const isUniqueViolation = error instanceof _typeorm.QueryFailedError && error.code === _postgreserrorcodesconstants.POSTGRESQL_ERROR_CODES.UNIQUE_VIOLATION;
            if (!isUniqueViolation || !await escalateExisting()) {
                throw error;
            }
        }
    }
    async suppressManually({ workspaceId, emailAddress, unsubscribeTopicId }) {
        await this.recordUnsubscribe({
            workspaceId,
            emailAddress,
            unsubscribeTopicId
        });
        const suppression = await this.suppressionRepository.findOneBy(workspaceId, {
            emailAddress: this.normalizeEmailAddress(emailAddress),
            unsubscribeTopicId: (0, _guards.isNonEmptyString)(unsubscribeTopicId) ? unsubscribeTopicId : (0, _typeorm.IsNull)()
        });
        if (!(0, _utils.isDefined)(suppression)) {
            throw new _emailingdomainexception.EmailingDomainException(`Suppression for ${emailAddress} was not persisted`, _emailingdomainexception.EmailingDomainExceptionCode.MESSAGE_SUPPRESSION_NOT_FOUND);
        }
        return suppression;
    }
    async removeSuppression({ workspaceId, suppressionId }) {
        const suppression = await this.suppressionRepository.findOneBy(workspaceId, {
            id: suppressionId
        });
        if (!(0, _utils.isDefined)(suppression)) {
            throw new _emailingdomainexception.EmailingDomainException(`Suppression ${suppressionId} not found`, _emailingdomainexception.EmailingDomainExceptionCode.MESSAGE_SUPPRESSION_NOT_FOUND);
        }
        const { affected } = await this.suppressionRepository.delete(workspaceId, {
            id: suppressionId,
            reason: (0, _typeorm.Not)((0, _typeorm.In)(_hardsuppressionreasonsconstant.HARD_SUPPRESSION_REASONS))
        });
        if (affected === 0) {
            throw new _emailingdomainexception.EmailingDomainException(`Suppression ${suppressionId} records a ${suppression.reason} and cannot be removed`, _emailingdomainexception.EmailingDomainExceptionCode.MESSAGE_SUPPRESSION_NOT_REMOVABLE);
        }
    }
    async getTopicOptOutState({ workspaceId, emailAddress }) {
        const normalizedEmailAddress = this.normalizeEmailAddress(emailAddress);
        if (!(0, _guards.isNonEmptyString)(normalizedEmailAddress)) {
            return [];
        }
        const visibleTopics = await this.unsubscribeTopicService.findPublicTopics(workspaceId);
        if (!(0, _utils.isNonEmptyArray)(visibleTopics)) {
            return [];
        }
        const optOuts = await this.suppressionRepository.find(workspaceId, {
            where: [
                {
                    emailAddress: normalizedEmailAddress,
                    reason: _messagesuppressionreasontype.MessageSuppressionReason.UNSUBSCRIBE,
                    unsubscribeTopicId: (0, _typeorm.In)(visibleTopics.map((topic)=>topic.id))
                },
                {
                    emailAddress: normalizedEmailAddress,
                    reason: _messagesuppressionreasontype.MessageSuppressionReason.UNSUBSCRIBE,
                    unsubscribeTopicId: (0, _typeorm.IsNull)()
                }
            ]
        });
        const optedOutTopicIds = new Set(optOuts.filter((suppression)=>(0, _utils.isDefined)(suppression.unsubscribeTopicId)).map((suppression)=>suppression.unsubscribeTopicId));
        const globalOptOut = optOuts.find((suppression)=>!(0, _utils.isDefined)(suppression.unsubscribeTopicId));
        return visibleTopics.map((topic)=>({
                unsubscribeTopicId: topic.id,
                topicName: topic.name,
                optedOut: (0, _utils.isDefined)(globalOptOut) || optedOutTopicIds.has(topic.id)
            }));
    }
    async setTopicOptOuts({ workspaceId, emailAddress, keptTopicIds, canResubscribe }) {
        const visibleTopics = await this.unsubscribeTopicService.findPublicTopics(workspaceId);
        if (!(0, _utils.isNonEmptyArray)(visibleTopics)) {
            return;
        }
        const visibleTopicIds = new Set(visibleTopics.map((topic)=>topic.id));
        const keptTopicIdSet = new Set(keptTopicIds.filter((topicId)=>visibleTopicIds.has(topicId)));
        if (keptTopicIdSet.size === 0) {
            await this.unsubscribeFromEverything({
                workspaceId,
                emailAddress
            });
            return;
        }
        await this.suppressTopicsNotKept({
            workspaceId,
            emailAddress,
            visibleTopics,
            keptTopicIdSet
        });
        if (!canResubscribe) {
            return;
        }
        await this.liftOptOut(workspaceId, emailAddress, null);
        for (const topicId of keptTopicIdSet){
            await this.liftOptOut(workspaceId, emailAddress, topicId);
        }
    }
    async unsubscribeFromEverything({ workspaceId, emailAddress }) {
        await this.recordUnsubscribe({
            workspaceId,
            emailAddress,
            unsubscribeTopicId: null
        });
    }
    async recordUnsubscribe({ workspaceId, emailAddress, unsubscribeTopicId }) {
        await this.suppress({
            workspaceId,
            emailAddress,
            reason: _messagesuppressionreasontype.MessageSuppressionReason.UNSUBSCRIBE,
            source: _messagesuppressionsourcetype.MessageSuppressionSource.SYSTEM,
            unsubscribeTopicId
        });
    }
    async suppressTopicsNotKept({ workspaceId, emailAddress, visibleTopics, keptTopicIdSet }) {
        for (const topic of visibleTopics){
            if (keptTopicIdSet.has(topic.id)) {
                continue;
            }
            await this.recordUnsubscribe({
                workspaceId,
                emailAddress,
                unsubscribeTopicId: topic.id
            });
        }
    }
    async liftOptOut(workspaceId, emailAddress, unsubscribeTopicId) {
        const normalizedEmailAddress = this.normalizeEmailAddress(emailAddress);
        await this.suppressionRepository.delete(workspaceId, {
            emailAddress: normalizedEmailAddress,
            unsubscribeTopicId: (0, _guards.isNonEmptyString)(unsubscribeTopicId) ? unsubscribeTopicId : (0, _typeorm.IsNull)(),
            reason: _messagesuppressionreasontype.MessageSuppressionReason.UNSUBSCRIBE
        });
    }
    normalizeEmailAddress(emailAddress) {
        return emailAddress.trim().toLowerCase();
    }
    normalizeAddresses(emailAddresses) {
        return [
            ...new Set(emailAddresses.map((emailAddress)=>this.normalizeEmailAddress(emailAddress)))
        ];
    }
    shouldEscalate(existingReason, incomingReason) {
        return !_hardsuppressionreasonsconstant.HARD_SUPPRESSION_REASONS.includes(existingReason) && _hardsuppressionreasonsconstant.HARD_SUPPRESSION_REASONS.includes(incomingReason);
    }
    constructor(suppressionRepository, unsubscribeTopicService){
        this.suppressionRepository = suppressionRepository;
        this.unsubscribeTopicService = unsubscribeTopicService;
    }
};
MessageSuppressionService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _injectworkspacescopedrepositorydecorator.InjectWorkspaceScopedRepository)(_messagesuppressionentity.MessageSuppressionEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspacescopedrepository.WorkspaceScopedRepository === "undefined" ? Object : _workspacescopedrepository.WorkspaceScopedRepository,
        typeof _unsubscribetopicservice.UnsubscribeTopicService === "undefined" ? Object : _unsubscribetopicservice.UnsubscribeTopicService
    ])
], MessageSuppressionService);

//# sourceMappingURL=message-suppression.service.js.map