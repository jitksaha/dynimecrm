"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "sendableDraftCampaignSchema", {
    enumerable: true,
    get: function() {
        return sendableDraftCampaignSchema;
    }
});
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _zod = require("zod");
const isSendableBodyTemplate = (bodyTemplate)=>(0, _utils.parseCanonicalEmailDocument)((0, _utils.parseJson)(bodyTemplate)).success;
const sendableDraftCampaignSchema = _zod.z.object({
    status: _zod.z.literal(_types.MessageCampaignStatus.DRAFT),
    subject: _zod.z.string().min(1),
    bodyTemplate: _zod.z.string().min(1).refine(isSendableBodyTemplate, {
        message: 'bodyTemplate is not a valid email document'
    }),
    fromAddress: _zod.z.object({
        primaryEmail: _zod.z.email()
    }),
    listId: _zod.z.string().min(1),
    unsubscribeTopicId: _zod.z.string().nullish()
});

//# sourceMappingURL=sendable-draft-campaign.zod-schema.js.map