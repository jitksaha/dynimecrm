"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get METADATA_SIDE_EFFECT_OPERATIONS () {
        return METADATA_SIDE_EFFECT_OPERATIONS;
    },
    get buildMetadataSideEffectHandlerKey () {
        return buildMetadataSideEffectHandlerKey;
    }
});
const METADATA_SIDE_EFFECT_OPERATIONS = [
    'create',
    'update',
    'delete'
];
const buildMetadataSideEffectHandlerKey = (operation, metadataName)=>`${operation}:${metadataName}`;

//# sourceMappingURL=metadata-side-effect-operation.type.js.map