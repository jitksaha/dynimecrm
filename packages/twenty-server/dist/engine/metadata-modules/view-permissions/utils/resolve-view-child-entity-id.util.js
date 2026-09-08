"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "resolveViewChildEntityId", {
    enumerable: true,
    get: function() {
        return resolveViewChildEntityId;
    }
});
const _guards = require("@sniptt/guards");
const resolveViewChildEntityId = ({ args, params })=>[
        args?.id,
        args?.input?.id,
        params?.id
    ].find(_guards.isNonEmptyString) ?? null;

//# sourceMappingURL=resolve-view-child-entity-id.util.js.map