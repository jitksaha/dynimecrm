"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CommonSelectFieldsHelper", {
    enumerable: true,
    get: function() {
        return CommonSelectFieldsHelper;
    }
});
const _common = require("@nestjs/common");
const _getallselectablefieldsutil = require("./utils/get-all-selectable-fields.util");
const _getrelationsselectfieldsutil = require("./utils/get-relations-select-fields.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let CommonSelectFieldsHelper = class CommonSelectFieldsHelper {
    constructor(){
        this.computeFromDepth = ({ objectsPermissions, flatObjectMetadataMaps, flatFieldMetadataMaps, flatObjectMetadata, depth, onlyUseLabelIdentifierFieldsInRelations = false, recurseIntoJunctionTableRelations = false })=>{
            const restrictedFields = objectsPermissions[flatObjectMetadata.id].restrictedFields;
            const relationsSelectFields = (0, _getrelationsselectfieldsutil.getRelationsSelectFields)({
                flatObjectMetadataMaps,
                flatFieldMetadataMaps,
                flatObjectMetadata,
                objectsPermissions,
                depth,
                onlyUseLabelIdentifierFieldsInRelations,
                recurseIntoJunctionTableRelations
            });
            const selectableFields = (0, _getallselectablefieldsutil.getAllSelectableFields)({
                restrictedFields,
                flatObjectMetadata,
                flatFieldMetadataMaps
            });
            return {
                ...selectableFields,
                ...relationsSelectFields
            };
        };
    }
};
CommonSelectFieldsHelper = _ts_decorate([
    (0, _common.Injectable)()
], CommonSelectFieldsHelper);

//# sourceMappingURL=common-select-fields-helper.js.map