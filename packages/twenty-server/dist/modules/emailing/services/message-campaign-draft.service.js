"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MessageCampaignDraftService", {
    enumerable: true,
    get: function() {
        return MessageCampaignDraftService;
    }
});
const _common = require("@nestjs/common");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _uuid = require("uuid");
const _emailingdomainexception = require("../../../engine/core-modules/emailing-domain/exceptions/emailing-domain.exception");
const _userroleservice = require("../../../engine/metadata-modules/user-role/user-role.service");
const _workspaceormmanager = require("../../../engine/twenty-orm/workspace-orm.manager");
const _campaignvariableservice = require("./campaign-variable.service");
const _messagecampaignworkspaceentity = require("../standard-objects/message-campaign.workspace-entity");
const _collectcampaignvariablenamesutil = require("../utils/collect-campaign-variable-names.util");
const _collectcampaignvariablenamesfromstringutil = require("../utils/collect-campaign-variable-names-from-string.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const DEFAULT_CAMPAIGN_NAME = 'Untitled campaign';
let MessageCampaignDraftService = class MessageCampaignDraftService {
    getRoleScopedRepository(entity, roleId) {
        return this.workspaceOrmManager.getRepository(entity, {
            unionOf: [
                roleId
            ]
        });
    }
    async saveDraft({ workspaceId, userWorkspaceId, campaignId, name, subject, body }) {
        const stampedDocument = (0, _utils.isDefined)(body) ? this.parseAndStampDocument(body) : undefined;
        const variablesUsed = [
            ...new Set([
                ...(0, _utils.isDefined)(stampedDocument) ? (0, _collectcampaignvariablenamesutil.collectCampaignVariableNames)(stampedDocument) : [],
                ...(0, _utils.isDefined)(subject) ? (0, _collectcampaignvariablenamesfromstringutil.collectCampaignVariableNamesFromString)(subject) : []
            ])
        ].sort();
        if (variablesUsed.length > 0) {
            await this.campaignVariableService.assertKnownVariables(workspaceId, variablesUsed);
        }
        const roleId = await this.userRoleService.getRoleIdForUserWorkspace({
            workspaceId,
            userWorkspaceId
        });
        return this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const campaignRepository = await this.getRoleScopedRepository(_messagecampaignworkspaceentity.MessageCampaignWorkspaceEntity, roleId);
            if (!(0, _utils.isDefined)(campaignId)) {
                const createdCampaignId = (0, _uuid.v4)();
                const campaignName = name ?? DEFAULT_CAMPAIGN_NAME;
                await campaignRepository.insert({
                    id: createdCampaignId,
                    name: campaignName,
                    status: _types.MessageCampaignStatus.DRAFT,
                    ...(0, _utils.isDefined)(subject) && {
                        subject
                    },
                    ...(0, _utils.isDefined)(stampedDocument) && {
                        bodyTemplate: JSON.stringify(stampedDocument)
                    }
                });
                return {
                    campaignId: createdCampaignId,
                    campaignName,
                    created: true,
                    blockCount: stampedDocument?.content?.length,
                    variablesUsed
                };
            }
            if (!(0, _utils.isDefined)(name) && !(0, _utils.isDefined)(subject) && !(0, _utils.isDefined)(body)) {
                throw new _emailingdomainexception.EmailingDomainException('Nothing to update: provide a name, subject or body', _emailingdomainexception.EmailingDomainExceptionCode.MESSAGE_CAMPAIGN_NOT_SENDABLE);
            }
            const campaign = await campaignRepository.findOne({
                where: {
                    id: campaignId
                }
            });
            if (!(0, _utils.isDefined)(campaign)) {
                throw new _emailingdomainexception.EmailingDomainException(`Campaign ${campaignId} not found`, _emailingdomainexception.EmailingDomainExceptionCode.MESSAGE_CAMPAIGN_NOT_FOUND);
            }
            if (campaign.status !== _types.MessageCampaignStatus.DRAFT) {
                throw new _emailingdomainexception.EmailingDomainException(`Campaign ${campaignId} is ${campaign.status}; only draft campaigns can be edited`, _emailingdomainexception.EmailingDomainExceptionCode.MESSAGE_CAMPAIGN_NOT_SENDABLE);
            }
            const { affected } = await campaignRepository.update({
                id: campaignId,
                status: _types.MessageCampaignStatus.DRAFT
            }, {
                ...(0, _utils.isDefined)(name) && {
                    name
                },
                ...(0, _utils.isDefined)(subject) && {
                    subject
                },
                ...(0, _utils.isDefined)(stampedDocument) && {
                    bodyTemplate: JSON.stringify(stampedDocument)
                }
            });
            if (affected !== 1) {
                throw new _emailingdomainexception.EmailingDomainException(`Campaign ${campaignId} is no longer an editable draft`, _emailingdomainexception.EmailingDomainExceptionCode.MESSAGE_CAMPAIGN_NOT_SENDABLE);
            }
            return {
                campaignId,
                campaignName: name ?? campaign.name,
                created: false,
                blockCount: stampedDocument?.content?.length,
                variablesUsed
            };
        });
    }
    parseAndStampDocument(body) {
        const parseResult = (0, _utils.parseEmailDocument)(body);
        if (!parseResult.success) {
            throw new _emailingdomainexception.EmailingDomainException(`Invalid email document: ${parseResult.error}`, _emailingdomainexception.EmailingDomainExceptionCode.MESSAGE_CAMPAIGN_NOT_SENDABLE);
        }
        return this.stampDocumentDefaults(parseResult.document);
    }
    stampDocumentDefaults(document) {
        return {
            ...document,
            attrs: {
                ...document.attrs,
                schemaVersion: document.attrs?.schemaVersion ?? _utils.EMAIL_DOCUMENT_SCHEMA_VERSION,
                canvasTheme: (0, _utils.isDefined)(document.attrs?.canvasTheme) ? document.attrs.canvasTheme : _utils.CANVAS_THEME_DEFAULTS
            }
        };
    }
    constructor(userRoleService, workspaceOrmManager, campaignVariableService){
        this.userRoleService = userRoleService;
        this.workspaceOrmManager = workspaceOrmManager;
        this.campaignVariableService = campaignVariableService;
    }
};
MessageCampaignDraftService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _userroleservice.UserRoleService === "undefined" ? Object : _userroleservice.UserRoleService,
        typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager,
        typeof _campaignvariableservice.CampaignVariableService === "undefined" ? Object : _campaignvariableservice.CampaignVariableService
    ])
], MessageCampaignDraftService);

//# sourceMappingURL=message-campaign-draft.service.js.map