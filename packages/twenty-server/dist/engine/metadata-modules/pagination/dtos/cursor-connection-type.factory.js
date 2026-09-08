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
    get createCursorConnectionType () {
        return createCursorConnectionType;
    },
    get createCursorEdgeType () {
        return createCursorEdgeType;
    }
});
const _graphql = require("@nestjs/graphql");
const _scalars = require("../../../api/graphql/workspace-schema-builder/graphql-types/scalars");
const _pageinfodto = require("./page-info.dto");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const createCursorEdgeType = (nodeClassReference, nodeGraphqlTypeName, edgeGraphqlTypeName)=>{
    let EdgeType = class EdgeType {
    };
    _ts_decorate([
        (0, _graphql.Field)(()=>nodeClassReference, {
            description: `The node containing the ${nodeGraphqlTypeName}`
        }),
        _ts_metadata("design:type", typeof TNode === "undefined" ? Object : TNode)
    ], EdgeType.prototype, "node", void 0);
    _ts_decorate([
        (0, _graphql.Field)(()=>_scalars.ConnectionCursorScalarType, {
            description: 'Cursor for this node.'
        }),
        _ts_metadata("design:type", String)
    ], EdgeType.prototype, "cursor", void 0);
    EdgeType = _ts_decorate([
        (0, _graphql.ObjectType)(edgeGraphqlTypeName)
    ], EdgeType);
    return EdgeType;
};
const createCursorConnectionType = (edgeClassReference, connectionGraphqlTypeName)=>{
    let ConnectionType = class ConnectionType {
    };
    _ts_decorate([
        (0, _graphql.Field)(()=>_pageinfodto.PageInfoDTO, {
            description: 'Paging information'
        }),
        _ts_metadata("design:type", typeof _pageinfodto.PageInfoDTO === "undefined" ? Object : _pageinfodto.PageInfoDTO)
    ], ConnectionType.prototype, "pageInfo", void 0);
    _ts_decorate([
        (0, _graphql.Field)(()=>[
                edgeClassReference
            ], {
            description: 'Array of edges.'
        }),
        _ts_metadata("design:type", Array)
    ], ConnectionType.prototype, "edges", void 0);
    ConnectionType = _ts_decorate([
        (0, _graphql.ObjectType)(connectionGraphqlTypeName)
    ], ConnectionType);
    return ConnectionType;
};

//# sourceMappingURL=cursor-connection-type.factory.js.map