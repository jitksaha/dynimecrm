"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "connectionParametersSchema", {
    enumerable: true,
    get: function() {
        return connectionParametersSchema;
    }
});
const _emailconnectionsecurityenum = require("../enums/email-connection-security.enum");
const _plaintextstringtype = require("../../secret-encryption/branded-strings/plaintext-string.type");
const _zod = require("zod");
const connectionParametersSchema = _zod.z.object({
    host: _zod.z.string().min(1, 'Host is required'),
    port: _zod.z.int().positive('Port must be a positive number'),
    username: _zod.z.string().optional(),
    password: _plaintextstringtype.plaintextStringSchema.min(1, 'Password is required'),
    connectionSecurity: _zod.z.nativeEnum(_emailconnectionsecurityenum.EmailConnectionSecurity).default(_emailconnectionsecurityenum.EmailConnectionSecurity.SSL_TLS)
});

//# sourceMappingURL=connection-parameters.schema.js.map