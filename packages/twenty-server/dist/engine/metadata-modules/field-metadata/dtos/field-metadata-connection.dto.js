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
    get FieldConnectionDTO () {
        return FieldConnectionDTO;
    },
    get FieldEdgeDTO () {
        return FieldEdgeDTO;
    }
});
const _fieldmetadatadto = require("./field-metadata.dto");
const _cursorconnectiontypefactory = require("../../pagination/dtos/cursor-connection-type.factory");
const FieldEdgeDTO = (0, _cursorconnectiontypefactory.createCursorEdgeType)(_fieldmetadatadto.FieldMetadataDTO, 'Field', 'FieldEdge');
const FieldConnectionDTO = (0, _cursorconnectiontypefactory.createCursorConnectionType)(FieldEdgeDTO, 'FieldConnection');

//# sourceMappingURL=field-metadata-connection.dto.js.map