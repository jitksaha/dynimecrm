"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "generateDeterministicIndexName", {
    enumerable: true,
    get: function() {
        return generateDeterministicIndexName;
    }
});
const _crypto = require("crypto");
const _belongstotwentystandardapputil = require("../../utils/belongs-to-twenty-standard-app.util");
const _computetablenameutil = require("../../../utils/compute-table-name.util");
const generateDeterministicIndexName = ({ orderedIndexColumnNames, flatObjectMetadata, isUnique = false, indexWhereClause })=>{
    const hash = (0, _crypto.createHash)('sha256');
    const tableName = (0, _computetablenameutil.computeTableName)(flatObjectMetadata.nameSingular, !(0, _belongstotwentystandardapputil.belongsToTwentyStandardApp)(flatObjectMetadata));
    [
        tableName,
        ...orderedIndexColumnNames
    ].forEach((column)=>{
        hash.update(column);
    });
    if (indexWhereClause) {
        hash.update(indexWhereClause);
    }
    return `IDX_${isUnique ? 'UNIQUE_' : ''}${hash.digest('hex').slice(0, 27)}`;
};

//# sourceMappingURL=generate-deterministic-index-name.js.map