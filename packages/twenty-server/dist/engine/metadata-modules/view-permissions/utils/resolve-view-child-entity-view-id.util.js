"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "resolveViewChildEntityViewId", {
    enumerable: true,
    get: function() {
        return resolveViewChildEntityViewId;
    }
});
const _guards = require("@sniptt/guards");
const resolveViewChildEntityViewId = ({ args, body })=>[
        args?.input?.viewId,
        args?.inputs?.[0]?.viewId,
        body?.viewId
    ].find(_guards.isNonEmptyString) ?? null;

//# sourceMappingURL=resolve-view-child-entity-view-id.util.js.map