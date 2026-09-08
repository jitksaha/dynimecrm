"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildColumnResultAlias", {
    enumerable: true,
    get: function() {
        return buildColumnResultAlias;
    }
});
const _crypto = require("crypto");
// Postgres truncates identifiers at 63 bytes, so two long "<alias>_<column>" result
// aliases sharing a prefix would collapse onto the same key in the returned row.
// Hashing past the limit mirrors what TypeORM does through DriverUtils.buildAlias.
const POSTGRES_MAX_ALIAS_LENGTH = 63;
const buildColumnResultAlias = (alias, columnName)=>{
    const resultAlias = `${alias}_${columnName}`;
    if (resultAlias.length <= POSTGRES_MAX_ALIAS_LENGTH) {
        return resultAlias;
    }
    return (0, _crypto.createHash)('sha1').update(resultAlias, 'utf8').digest('hex').slice(0, POSTGRES_MAX_ALIAS_LENGTH);
};

//# sourceMappingURL=build-column-result-alias.util.js.map