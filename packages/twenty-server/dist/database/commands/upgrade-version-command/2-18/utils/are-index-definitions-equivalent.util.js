"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "areIndexDefinitionsEquivalent", {
    enumerable: true,
    get: function() {
        return areIndexDefinitionsEquivalent;
    }
});
const _utils = require("twenty-shared/utils");
const areIndexDefinitionsEquivalent = ({ indexDefinitionA, indexDefinitionB })=>{
    const toComparable = (indexDefinition)=>{
        const onClauseStart = indexDefinition.indexOf(' ON ');
        if (onClauseStart === -1) {
            return null;
        }
        const isUnique = indexDefinition.startsWith('CREATE UNIQUE INDEX');
        return `${isUnique ? 'UNIQUE' : 'NON_UNIQUE'}${indexDefinition.slice(onClauseStart)}`;
    };
    const comparableA = toComparable(indexDefinitionA);
    const comparableB = toComparable(indexDefinitionB);
    return (0, _utils.isDefined)(comparableA) && comparableA === comparableB;
};

//# sourceMappingURL=are-index-definitions-equivalent.util.js.map