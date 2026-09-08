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
    get BaseMetadataSideEffectHandlerService () {
        return BaseMetadataSideEffectHandlerService;
    },
    get MetadataSideEffectHandler () {
        return MetadataSideEffectHandler;
    }
});
const _common = require("@nestjs/common");
const _metadatasideeffecthandlermetadatakeyconstant = require("../constants/metadata-side-effect-handler-metadata-key.constant");
let BaseMetadataSideEffectHandlerService = class BaseMetadataSideEffectHandlerService {
};
function MetadataSideEffectHandler({ operation, metadataName, name, description }) {
    let SideEffectHandlerService = class SideEffectHandlerService extends BaseMetadataSideEffectHandlerService {
        constructor(...args){
            super(...args), this.operation = operation, this.metadataName = metadataName, this.sideEffectName = name, this.sideEffectDescription = description;
        }
    };
    (0, _common.SetMetadata)(_metadatasideeffecthandlermetadatakeyconstant.METADATA_SIDE_EFFECT_HANDLER_METADATA_KEY, {
        operation,
        metadataName,
        name,
        description
    })(SideEffectHandlerService);
    return SideEffectHandlerService;
}

//# sourceMappingURL=base-metadata-side-effect-handler.service.js.map