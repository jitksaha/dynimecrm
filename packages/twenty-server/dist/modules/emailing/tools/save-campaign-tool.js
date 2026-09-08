"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SaveCampaignTool", {
    enumerable: true,
    get: function() {
        return SaveCampaignTool;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _emailingdomainexception = require("../../../engine/core-modules/emailing-domain/exceptions/emailing-domain.exception");
const _messagecampaigndraftservice = require("../services/message-campaign-draft.service");
const _savecampaigntoolschema = require("./save-campaign-tool.schema");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let SaveCampaignTool = class SaveCampaignTool {
    async execute(parameters, context) {
        if (!(0, _utils.isDefined)(context.userWorkspaceId)) {
            return {
                success: false,
                message: 'Failed to save campaign',
                error: 'This tool can only run on behalf of a workspace member'
            };
        }
        try {
            const result = await this.messageCampaignDraftService.saveDraft({
                workspaceId: context.workspaceId,
                userWorkspaceId: context.userWorkspaceId,
                campaignId: parameters.campaignId,
                name: parameters.name,
                subject: parameters.subject,
                body: parameters.body
            });
            return {
                success: true,
                message: result.created ? `Draft campaign "${result.campaignName}" created` : `Campaign "${result.campaignName}" updated`,
                result,
                recordReferences: [
                    {
                        objectNameSingular: 'messageCampaign',
                        recordId: result.campaignId,
                        displayName: result.campaignName
                    }
                ]
            };
        } catch (error) {
            if (error instanceof _emailingdomainexception.EmailingDomainException) {
                return {
                    success: false,
                    message: 'Failed to save campaign',
                    error: error.message
                };
            }
            this.logger.error(`Failed to save campaign: ${error}`);
            return {
                success: false,
                message: 'Failed to save campaign',
                error: error instanceof Error ? error.message : 'Failed to save campaign'
            };
        }
    }
    constructor(messageCampaignDraftService){
        this.messageCampaignDraftService = messageCampaignDraftService;
        this.logger = new _common.Logger(SaveCampaignTool.name);
        this.description = 'Create a draft email campaign (messageCampaign record) or edit an existing one: name, subject and body. ' + 'The body is a structured email document validated against the campaign email schema before anything is written. ' + 'Only draft campaigns can be edited, and this tool never sends anything. ' + 'Requires create/update permission on campaigns.';
        this.inputSchema = _savecampaigntoolschema.SaveCampaignToolInputZodSchema;
    }
};
SaveCampaignTool = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _messagecampaigndraftservice.MessageCampaignDraftService === "undefined" ? Object : _messagecampaigndraftservice.MessageCampaignDraftService
    ])
], SaveCampaignTool);

//# sourceMappingURL=save-campaign-tool.js.map