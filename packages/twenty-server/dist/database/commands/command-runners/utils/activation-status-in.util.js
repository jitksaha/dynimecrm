"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "activationStatusIn", {
    enumerable: true,
    get: function() {
        return activationStatusIn;
    }
});
const _typeorm = require("typeorm");
const activationStatusIn = (statuses)=>(0, _typeorm.Raw)((alias)=>{
        const quotedAlias = alias.split('.').map((aliasPart)=>`"${aliasPart.replace(/"/g, '')}"`).join('.');
        return `${quotedAlias}::text IN (:...activationStatusValues)`;
    }, {
        activationStatusValues: statuses
    });

//# sourceMappingURL=activation-status-in.util.js.map