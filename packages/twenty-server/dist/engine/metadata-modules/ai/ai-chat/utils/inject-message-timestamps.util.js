"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "injectMessageTimestamps", {
    enumerable: true,
    get: function() {
        return injectMessageTimestamps;
    }
});
const _utils = require("twenty-shared/utils");
const formatMessageTimestamp = (date, timezone)=>new Intl.DateTimeFormat('en-US', {
        timeZone: (0, _utils.getValidTimeZoneOrUndefined)(timezone),
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        timeZoneName: 'short'
    }).format(date);
const extractCreatedAt = (message)=>{
    const rawCreatedAt = message.metadata?.createdAt;
    if (!(0, _utils.isDefined)(rawCreatedAt)) {
        return undefined;
    }
    const parsedCreatedAt = new Date(rawCreatedAt);
    return isNaN(parsedCreatedAt.getTime()) ? undefined : parsedCreatedAt;
};
const injectMessageTimestamps = (messages, timezone)=>messages.map((message)=>{
        if (message.role !== 'user') {
            return message;
        }
        const createdAt = extractCreatedAt(message);
        if (!(0, _utils.isDefined)(createdAt)) {
            return message;
        }
        const timestampPart = {
            type: 'text',
            text: `<message_timestamp>Sent: ${formatMessageTimestamp(createdAt, timezone)}</message_timestamp>`
        };
        return {
            ...message,
            parts: [
                timestampPart,
                ...message.parts
            ]
        };
    });

//# sourceMappingURL=inject-message-timestamps.util.js.map