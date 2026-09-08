"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "normalizeSesOutboundEvent", {
    enumerable: true,
    get: function() {
        return normalizeSesOutboundEvent;
    }
});
const _utils = require("twenty-shared/utils");
const _emailingdomaintenantstatustype = require("../../../../../engine/core-modules/emailing-domain/drivers/types/emailing-domain-tenant-status.type");
const _resolvesesoutbounddeliveryoutcomeutil = require("./resolve-ses-outbound-delivery-outcome.util");
const _resolveworkspaceidfromawssesresourcesutil = require("./resolve-workspace-id-from-aws-ses-resources.util");
const _resolveworkspaceidfromsesoutboundpayloadutil = require("./resolve-workspace-id-from-ses-outbound-payload.util");
const resolveSendingStatus = (eventName)=>{
    switch(eventName){
        case 'Sending Status Enabled':
            return _emailingdomaintenantstatustype.EmailingDomainTenantStatus.ACTIVE;
        case 'Sending Status Disabled':
            return _emailingdomaintenantstatustype.EmailingDomainTenantStatus.PAUSED;
        default:
            return null;
    }
};
const classifyOutboundEvent = ({ eventName, payload, workspaceId })=>{
    const deliveryOutcome = (0, _resolvesesoutbounddeliveryoutcomeutil.resolveSesOutboundDeliveryOutcome)({
        eventName,
        payload
    });
    if ((0, _utils.isDefined)(deliveryOutcome)) {
        if (!(0, _utils.isDefined)(workspaceId)) {
            return {
                status: 'UNPROCESSABLE',
                eventName,
                reason: 'UNRESOLVED_WORKSPACE'
            };
        }
        return {
            status: 'DELIVERY',
            delivery: {
                workspaceId,
                outcome: deliveryOutcome.outcome,
                suppression: deliveryOutcome.suppression,
                providerMessageId: payload.mail?.messageId ?? null,
                providerEventId: deliveryOutcome.providerEventId
            }
        };
    }
    const sendingStatus = resolveSendingStatus(eventName);
    if (!(0, _utils.isDefined)(sendingStatus)) {
        return {
            status: 'UNPROCESSABLE',
            eventName,
            reason: 'UNSUPPORTED_EVENT_NAME'
        };
    }
    if (!(0, _utils.isDefined)(workspaceId)) {
        return {
            status: 'UNPROCESSABLE',
            eventName,
            reason: 'UNRESOLVED_WORKSPACE'
        };
    }
    return {
        status: 'SENDING_STATE',
        sendingState: {
            workspaceId,
            status: sendingStatus
        }
    };
};
const normalizeSesOutboundEvent = (notification)=>{
    if ('detail-type' in notification) {
        const payload = notification.detail ?? {};
        return classifyOutboundEvent({
            eventName: notification['detail-type'],
            payload,
            workspaceId: (0, _resolveworkspaceidfromawssesresourcesutil.resolveWorkspaceIdFromAwsSesResources)(notification.resources) ?? (0, _resolveworkspaceidfromsesoutboundpayloadutil.resolveWorkspaceIdFromSesOutboundPayload)(payload)
        });
    }
    return classifyOutboundEvent({
        eventName: notification.eventType,
        payload: notification,
        workspaceId: (0, _resolveworkspaceidfromsesoutboundpayloadutil.resolveWorkspaceIdFromSesOutboundPayload)(notification)
    });
};

//# sourceMappingURL=normalize-ses-outbound-event.util.js.map