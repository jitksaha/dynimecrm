"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getConnectedAccountSendableHandleOrThrow", {
    enumerable: true,
    get: function() {
        return getConnectedAccountSendableHandleOrThrow;
    }
});
const _utils = require("twenty-shared/utils");
const _messagechannelexception = require("../../../../engine/metadata-modules/message-channel/message-channel.exception");
const getConnectedAccountSendableHandleOrThrow = ({ connectedAccount, requestedFromHandle })=>{
    const normalizedRequestedFromHandle = requestedFromHandle.trim().toLowerCase();
    const matchedFromHandle = (0, _utils.getSendableEmailHandles)(connectedAccount).find((sendableHandle)=>sendableHandle.trim().toLowerCase() === normalizedRequestedFromHandle);
    if (!(0, _utils.isDefined)(matchedFromHandle)) {
        throw new _messagechannelexception.MessageChannelException(`Sender ${requestedFromHandle} is not the connected account handle nor one of its verified aliases`, _messagechannelexception.MessageChannelExceptionCode.INVALID_MESSAGE_CHANNEL_INPUT, {
            userFriendlyMessage: /*i18n*/ {
                id: "y2sD5W",
                message: "You cannot send from this address."
            }
        });
    }
    return matchedFromHandle;
};

//# sourceMappingURL=get-connected-account-sendable-handle-or-throw.util.js.map