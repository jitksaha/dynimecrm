"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MessageCampaignAudienceService", {
    enumerable: true,
    get: function() {
        return MessageCampaignAudienceService;
    }
});
const _common = require("@nestjs/common");
const _guards = require("@sniptt/guards");
const _utils = require("twenty-shared/utils");
const _typeorm = require("typeorm");
const _resolvecampaignaudienceutil = require("../../../engine/core-modules/emailing-domain/utils/resolve-campaign-audience.util");
const _hardsuppressionreasonsconstant = require("../../../engine/core-modules/emailing-domain/constants/hard-suppression-reasons.constant");
const _campaignconstant = require("../../../engine/core-modules/emailing-domain/constants/campaign.constant");
const _userroleservice = require("../../../engine/metadata-modules/user-role/user-role.service");
const _workspaceormmanager = require("../../../engine/twenty-orm/workspace-orm.manager");
const _messagesuppressionservice = require("./message-suppression.service");
const _messagelistmemberworkspaceentity = require("../standard-objects/message-list-member.workspace-entity");
const _personworkspaceentity = require("../../person/standard-objects/person.workspace-entity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let MessageCampaignAudienceService = class MessageCampaignAudienceService {
    async resolveNormalizedAudience({ workspaceId, listId, roleId, unsubscribeTopicId }) {
        return this.workspaceOrmManager.executeInWorkspaceContext(()=>this.resolveAudience({
                workspaceId,
                listId,
                roleId,
                unsubscribeTopicId
            }));
    }
    async resolveAudience({ workspaceId, listId, roleId, unsubscribeTopicId }) {
        const { rawRecipients, totalMemberCount } = await this.resolveRecipientsFromList({
            listId,
            roleId
        });
        const emailAddresses = rawRecipients.map((rawRecipient)=>rawRecipient.email).filter(_guards.isNonEmptyString);
        const suppressions = await this.messageSuppressionService.findApplicableSuppressions({
            workspaceId,
            emailAddresses,
            unsubscribeTopicId
        });
        const hardSuppressedEmails = new Set();
        const globallySuppressedEmails = new Set();
        const topicSuppressedEmails = new Set();
        for (const suppression of suppressions){
            if ((0, _utils.isDefined)(suppression.unsubscribeTopicId)) {
                topicSuppressedEmails.add(suppression.emailAddress);
                continue;
            }
            if (_hardsuppressionreasonsconstant.HARD_SUPPRESSION_REASONS.includes(suppression.reason)) {
                hardSuppressedEmails.add(suppression.emailAddress);
                continue;
            }
            globallySuppressedEmails.add(suppression.emailAddress);
        }
        return (0, _resolvecampaignaudienceutil.resolveCampaignAudience)({
            rawRecipients,
            totalMemberCount,
            maxRecipients: _campaignconstant.MAX_CAMPAIGN_RECIPIENTS,
            hardSuppressedEmails,
            globallySuppressedEmails,
            topicSuppressedEmails
        });
    }
    async previewAudience({ workspaceId, userWorkspaceId, listId, unsubscribeTopicId }) {
        const roleId = await this.userRoleService.getRoleIdForUserWorkspace({
            workspaceId,
            userWorkspaceId
        });
        const { audience } = await this.workspaceOrmManager.executeInWorkspaceContext(()=>this.resolveAudience({
                workspaceId,
                listId,
                roleId,
                unsubscribeTopicId
            }));
        return audience;
    }
    async resolveRecipientsFromList({ listId, roleId }) {
        const listMemberRepository = this.workspaceOrmManager.getRepository(_messagelistmemberworkspaceentity.MessageListMemberWorkspaceEntity, {
            unionOf: [
                roleId
            ]
        });
        const members = await listMemberRepository.find({
            where: {
                listId
            }
        });
        const personIds = members.map((member)=>member.personId);
        if (personIds.length === 0) {
            return {
                rawRecipients: [],
                totalMemberCount: members.length
            };
        }
        const personRepository = this.workspaceOrmManager.getRepository(_personworkspaceentity.PersonWorkspaceEntity, {
            unionOf: [
                roleId
            ]
        });
        const people = await personRepository.find({
            where: {
                id: (0, _typeorm.In)(personIds)
            }
        });
        return {
            rawRecipients: people.map((person)=>({
                    personId: person.id,
                    email: person.emails?.primaryEmail ?? null
                })),
            totalMemberCount: members.length
        };
    }
    constructor(workspaceOrmManager, messageSuppressionService, userRoleService){
        this.workspaceOrmManager = workspaceOrmManager;
        this.messageSuppressionService = messageSuppressionService;
        this.userRoleService = userRoleService;
    }
};
MessageCampaignAudienceService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager,
        typeof _messagesuppressionservice.MessageSuppressionService === "undefined" ? Object : _messagesuppressionservice.MessageSuppressionService,
        typeof _userroleservice.UserRoleService === "undefined" ? Object : _userroleservice.UserRoleService
    ])
], MessageCampaignAudienceService);

//# sourceMappingURL=message-campaign-audience.service.js.map