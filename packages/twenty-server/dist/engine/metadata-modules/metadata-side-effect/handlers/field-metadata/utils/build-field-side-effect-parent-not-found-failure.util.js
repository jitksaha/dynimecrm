"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildFieldSideEffectParentNotFoundFailure", {
    enumerable: true,
    get: function() {
        return buildFieldSideEffectParentNotFoundFailure;
    }
});
const _core = require("@lingui/core");
const _metadatasideeffectexceptioncode = require("../../../exceptions/metadata-side-effect-exception-code");
const buildFieldSideEffectParentNotFoundFailure = ({ flatFieldMetadata, operation })=>({
        status: 'fail',
        type: operation,
        metadataName: 'fieldMetadata',
        flatEntityMinimalInformation: {
            universalIdentifier: flatFieldMetadata.universalIdentifier,
            name: flatFieldMetadata.name
        },
        errors: [
            {
                code: _metadatasideeffectexceptioncode.MetadataSideEffectExceptionCode.SIDE_EFFECT_PARENT_METADATA_NOT_FOUND,
                message: _core.i18n._(/*i18n*/ {
                    id: "g5pJGG",
                    message: 'Could not resolve parent object metadata "{0}" for field unique index side effect',
                    values: {
                        0: flatFieldMetadata.objectMetadataUniversalIdentifier
                    }
                }),
                userFriendlyMessage: /*i18n*/ {
                    id: "o/rMB1",
                    message: "This field references an object that could not be found"
                }
            }
        ]
    });

//# sourceMappingURL=build-field-side-effect-parent-not-found-failure.util.js.map