"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromApplicationVariableManifestToUniversalFlatApplicationVariable", {
    enumerable: true,
    get: function() {
        return fromApplicationVariableManifestToUniversalFlatApplicationVariable;
    }
});
const _types = require("twenty-shared/types");
const fromApplicationVariableManifestToUniversalFlatApplicationVariable = ({ key, universalIdentifier, description, label, encryptedValue, isSecret, isDeprecated, type, options, applicationUniversalIdentifier, now })=>{
    return {
        universalIdentifier,
        applicationUniversalIdentifier,
        key,
        value: encryptedValue,
        description: description ?? '',
        label: label ?? '',
        isSecret: isSecret ?? false,
        isDeprecated: isDeprecated ?? false,
        type: type ?? _types.FieldMetadataType.TEXT,
        options: options ?? null,
        createdAt: now,
        updatedAt: now
    };
};

//# sourceMappingURL=from-application-variable-manifest-to-universal-flat-application-variable.util.js.map