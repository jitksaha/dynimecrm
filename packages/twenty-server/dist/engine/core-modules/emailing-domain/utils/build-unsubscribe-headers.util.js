"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildUnsubscribeHeaders", {
    enumerable: true,
    get: function() {
        return buildUnsubscribeHeaders;
    }
});
const buildUnsubscribeHeaders = ({ webUrl })=>[
        {
            name: 'List-Unsubscribe',
            value: `<${webUrl}>`
        },
        {
            name: 'List-Unsubscribe-Post',
            value: 'List-Unsubscribe=One-Click'
        }
    ];

//# sourceMappingURL=build-unsubscribe-headers.util.js.map