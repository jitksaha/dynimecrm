"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildUserContextSection", {
    enumerable: true,
    get: function() {
        return buildUserContextSection;
    }
});
const _guards = require("@sniptt/guards");
const _utils = require("twenty-shared/utils");
const formatCurrentDate = (timezone)=>new Intl.DateTimeFormat('en-US', {
        timeZone: (0, _utils.getValidTimeZoneOrUndefined)(timezone),
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date());
const buildUserContextSection = (userContext)=>{
    const parts = [
        `User: ${userContext.firstName} ${userContext.lastName}`.trim()
    ];
    if ((0, _guards.isNonEmptyString)(userContext.jobTitle)) {
        parts.push(`Job title: ${userContext.jobTitle}`);
    }
    parts.push(`Locale: ${userContext.locale}`);
    const resolvedTimeZone = (0, _utils.getValidTimeZoneOrUndefined)(userContext.timezone);
    if (resolvedTimeZone) {
        parts.push(`Timezone: ${resolvedTimeZone}`);
    }
    parts.push(`Current date: ${formatCurrentDate(userContext.timezone)}`);
    return `
## User Context

${parts.join('\n')}`;
};

//# sourceMappingURL=build-user-context-section.util.js.map