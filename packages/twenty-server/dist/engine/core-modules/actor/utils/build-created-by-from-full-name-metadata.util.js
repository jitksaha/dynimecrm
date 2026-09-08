"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildCreatedByFromFullNameMetadata", {
    enumerable: true,
    get: function() {
        return buildCreatedByFromFullNameMetadata;
    }
});
const _types = require("twenty-shared/types");
const buildCreatedByFromFullNameMetadata = ({ fullNameMetadata, workspaceMemberId, source = _types.FieldActorSource.MANUAL })=>({
        workspaceMemberId,
        source,
        name: `${fullNameMetadata.firstName} ${fullNameMetadata.lastName}`,
        context: {}
    });

//# sourceMappingURL=build-created-by-from-full-name-metadata.util.js.map