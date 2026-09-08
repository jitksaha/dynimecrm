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
    get ObjectConnectionDTO () {
        return ObjectConnectionDTO;
    },
    get ObjectEdgeDTO () {
        return ObjectEdgeDTO;
    },
    get ObjectFieldsConnectionDTO () {
        return ObjectFieldsConnectionDTO;
    },
    get ObjectIndexMetadatasConnectionDTO () {
        return ObjectIndexMetadatasConnectionDTO;
    }
});
const _fieldmetadataconnectiondto = require("../../field-metadata/dtos/field-metadata-connection.dto");
const _indexmetadataedgedto = require("../../index-metadata/dtos/index-metadata-edge.dto");
const _objectmetadatadto = require("./object-metadata.dto");
const _cursorconnectiontypefactory = require("../../pagination/dtos/cursor-connection-type.factory");
const ObjectEdgeDTO = (0, _cursorconnectiontypefactory.createCursorEdgeType)(_objectmetadatadto.ObjectMetadataDTO, 'Object', 'ObjectEdge');
const ObjectConnectionDTO = (0, _cursorconnectiontypefactory.createCursorConnectionType)(ObjectEdgeDTO, 'ObjectConnection');
const ObjectFieldsConnectionDTO = (0, _cursorconnectiontypefactory.createCursorConnectionType)(_fieldmetadataconnectiondto.FieldEdgeDTO, 'ObjectFieldsConnection');
const ObjectIndexMetadatasConnectionDTO = (0, _cursorconnectiontypefactory.createCursorConnectionType)(_indexmetadataedgedto.IndexEdgeDTO, 'ObjectIndexMetadatasConnection');

//# sourceMappingURL=object-metadata-connection.dto.js.map