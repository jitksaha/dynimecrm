"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FieldSearchFieldMetadataOnDeleteSideEffectHandlerService", {
    enumerable: true,
    get: function() {
        return FieldSearchFieldMetadataOnDeleteSideEffectHandlerService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _basemetadatasideeffecthandlerservice = require("../../../interfaces/base-metadata-side-effect-handler.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let FieldSearchFieldMetadataOnDeleteSideEffectHandlerService = class FieldSearchFieldMetadataOnDeleteSideEffectHandlerService extends (0, _basemetadatasideeffecthandlerservice.MetadataSideEffectHandler)({
    operation: 'delete',
    metadataName: 'fieldMetadata',
    name: 'fieldSearchFieldMetadataOnDelete',
    description: 'When a field is deleted, cascade-delete every searchFieldMetadata row that indexes it. searchFieldMetadata is excluded from manifest deletion inference, so the cascade must be explicit here to cover both the API and manifest paths (the object-scoped cascade only fires on object deletion).'
}) {
    buildSideEffects({ flatEntity: flatFieldMetadata, relatedFlatEntityMaps }) {
        const searchFieldMetadataToDelete = {};
        for (const searchFieldMetadataUniversalIdentifier of flatFieldMetadata.searchFieldMetadataUniversalIdentifiers){
            const flatSearchFieldMetadata = relatedFlatEntityMaps.flatSearchFieldMetadataMaps.byUniversalIdentifier[searchFieldMetadataUniversalIdentifier];
            if (!(0, _utils.isDefined)(flatSearchFieldMetadata)) {
                continue;
            }
            searchFieldMetadataToDelete[flatSearchFieldMetadata.universalIdentifier] = flatSearchFieldMetadata;
        }
        if (Object.keys(searchFieldMetadataToDelete).length === 0) {
            return {
                status: 'noop'
            };
        }
        return {
            status: 'success',
            operations: {
                searchFieldMetadata: {
                    flatEntityToDelete: searchFieldMetadataToDelete
                }
            }
        };
    }
};
FieldSearchFieldMetadataOnDeleteSideEffectHandlerService = _ts_decorate([
    (0, _common.Injectable)()
], FieldSearchFieldMetadataOnDeleteSideEffectHandlerService);

//# sourceMappingURL=field-search-field-metadata-on-delete-side-effect-handler.service.js.map