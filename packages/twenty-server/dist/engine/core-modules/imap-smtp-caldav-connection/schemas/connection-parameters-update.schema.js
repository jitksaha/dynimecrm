"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "connectionParametersUpdateSchema", {
    enumerable: true,
    get: function() {
        return connectionParametersUpdateSchema;
    }
});
const _connectionparametersschema = require("./connection-parameters.schema");
const _plaintextstringtype = require("../../secret-encryption/branded-strings/plaintext-string.type");
const connectionParametersUpdateSchema = _connectionparametersschema.connectionParametersSchema.extend({
    password: _plaintextstringtype.plaintextStringSchema.min(1, 'Password is required').optional()
});

//# sourceMappingURL=connection-parameters-update.schema.js.map