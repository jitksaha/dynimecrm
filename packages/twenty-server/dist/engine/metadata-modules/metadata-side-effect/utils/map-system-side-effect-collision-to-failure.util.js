"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "mapSystemSideEffectCollisionToFailure", {
    enumerable: true,
    get: function() {
        return mapSystemSideEffectCollisionToFailure;
    }
});
const _core = require("@lingui/core");
const _metadatasideeffectexceptioncode = require("../exceptions/metadata-side-effect-exception-code");
const mapSystemSideEffectCollisionToFailure = (collision)=>({
        status: 'fail',
        type: collision.operation,
        metadataName: collision.metadataName,
        flatEntityMinimalInformation: {
            universalIdentifier: collision.universalIdentifier,
            ...collision.name !== undefined ? {
                name: collision.name
            } : {}
        },
        errors: [
            {
                code: _metadatasideeffectexceptioncode.MetadataSideEffectExceptionCode.RESERVED_SYSTEM_UNIVERSAL_IDENTIFIER,
                message: _core.i18n._(/*i18n*/ {
                    id: "lIud+S",
                    message: "Universal identifier is reserved for system-managed metadata"
                }),
                userFriendlyMessage: /*i18n*/ {
                    id: "cvWDSJ",
                    message: "This identifier is reserved by the system"
                }
            }
        ]
    });

//# sourceMappingURL=map-system-side-effect-collision-to-failure.util.js.map