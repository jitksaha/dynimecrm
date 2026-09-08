"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "IndexEdgeDTO", {
    enumerable: true,
    get: function() {
        return IndexEdgeDTO;
    }
});
const _indexmetadatadto = require("./index-metadata.dto");
const _cursorconnectiontypefactory = require("../../pagination/dtos/cursor-connection-type.factory");
const IndexEdgeDTO = (0, _cursorconnectiontypefactory.createCursorEdgeType)(_indexmetadatadto.IndexMetadataDTO, 'Index', 'IndexEdge');

//# sourceMappingURL=index-metadata-edge.dto.js.map