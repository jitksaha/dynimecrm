"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FieldSystemViewFieldsOnDeleteSideEffectHandlerService", {
    enumerable: true,
    get: function() {
        return FieldSystemViewFieldsOnDeleteSideEffectHandlerService;
    }
});
const _common = require("@nestjs/common");
const _basemetadatasideeffecthandlerservice = require("../../../interfaces/base-metadata-side-effect-handler.service");
const _filtersystemsideeffectflatviewfieldstodeleteutil = require("../../utils/filter-system-side-effect-flat-view-fields-to-delete.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let FieldSystemViewFieldsOnDeleteSideEffectHandlerService = class FieldSystemViewFieldsOnDeleteSideEffectHandlerService extends (0, _basemetadatasideeffecthandlerservice.MetadataSideEffectHandler)({
    operation: 'delete',
    metadataName: 'fieldMetadata',
    name: 'fieldSystemViewFieldsOnDelete',
    description: 'When a field is deleted, cascade-delete every engine-owned view field displaying it, wherever it lives: the INDEX view fields emitted by fieldIndexViewFieldOnCreate, and the record-page ones emitted by fieldRecordPageViewFieldOnCreate. Counterpart of both: the engine authored those view fields, so it owns their deletion. Manifest deletion inference excludes isSystemSideEffect entities, so without this cascade they would only ever disappear through the viewField -> fieldMetadata foreign key, behind the engine back. Caller-authored view fields are NOT touched: they are deleted through normal deletion inference / the field delete transpiler.'
}) {
    buildSideEffects({ flatEntity: flatFieldMetadata, relatedFlatEntityMaps }) {
        const viewFieldToDelete = (0, _filtersystemsideeffectflatviewfieldstodeleteutil.filterSystemSideEffectFlatViewFieldsToDelete)({
            viewFieldUniversalIdentifiers: flatFieldMetadata.viewFieldUniversalIdentifiers,
            flatViewFieldMaps: relatedFlatEntityMaps.flatViewFieldMaps
        });
        if (Object.keys(viewFieldToDelete).length === 0) {
            return {
                status: 'noop'
            };
        }
        return {
            status: 'success',
            operations: {
                viewField: {
                    flatEntityToDelete: viewFieldToDelete
                }
            }
        };
    }
};
FieldSystemViewFieldsOnDeleteSideEffectHandlerService = _ts_decorate([
    (0, _common.Injectable)()
], FieldSystemViewFieldsOnDeleteSideEffectHandlerService);

//# sourceMappingURL=field-system-view-fields-on-delete-side-effect-handler.service.js.map