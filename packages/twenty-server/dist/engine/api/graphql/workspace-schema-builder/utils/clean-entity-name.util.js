"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "cleanEntityName", {
    enumerable: true,
    get: function() {
        return cleanEntityName;
    }
});
const _camelcase = require("../../../../../utils/camel-case");
const cleanEntityName = (entityName)=>{
    let camelCasedEntityName = entityName.replace(/^[0-9]+/, '');
    camelCasedEntityName = camelCasedEntityName.trim();
    camelCasedEntityName = (0, _camelcase.camelCase)(camelCasedEntityName);
    camelCasedEntityName = camelCasedEntityName.replace(/[^a-zA-Z0-9]/g, '');
    return camelCasedEntityName;
};

//# sourceMappingURL=clean-entity-name.util.js.map