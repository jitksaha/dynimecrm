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
    get CoreWorkflowConnectionDTO () {
        return CoreWorkflowConnectionDTO;
    },
    get CoreWorkflowEdgeDTO () {
        return CoreWorkflowEdgeDTO;
    },
    get CoreWorkflowPageInfoDTO () {
        return CoreWorkflowPageInfoDTO;
    }
});
const _graphql = require("@nestjs/graphql");
const _coreworkflowdto = require("./core-workflow.dto");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let CoreWorkflowEdgeDTO = class CoreWorkflowEdgeDTO {
};
_ts_decorate([
    (0, _graphql.Field)(()=>_coreworkflowdto.CoreWorkflowDTO),
    _ts_metadata("design:type", typeof _coreworkflowdto.CoreWorkflowDTO === "undefined" ? Object : _coreworkflowdto.CoreWorkflowDTO)
], CoreWorkflowEdgeDTO.prototype, "node", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>String),
    _ts_metadata("design:type", String)
], CoreWorkflowEdgeDTO.prototype, "cursor", void 0);
CoreWorkflowEdgeDTO = _ts_decorate([
    (0, _graphql.ObjectType)('CoreWorkflowEdge')
], CoreWorkflowEdgeDTO);
let CoreWorkflowPageInfoDTO = class CoreWorkflowPageInfoDTO {
};
_ts_decorate([
    (0, _graphql.Field)(()=>String, {
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], CoreWorkflowPageInfoDTO.prototype, "endCursor", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>Boolean),
    _ts_metadata("design:type", Boolean)
], CoreWorkflowPageInfoDTO.prototype, "hasNextPage", void 0);
CoreWorkflowPageInfoDTO = _ts_decorate([
    (0, _graphql.ObjectType)('CoreWorkflowPageInfo')
], CoreWorkflowPageInfoDTO);
let CoreWorkflowConnectionDTO = class CoreWorkflowConnectionDTO {
};
_ts_decorate([
    (0, _graphql.Field)(()=>[
            CoreWorkflowEdgeDTO
        ]),
    _ts_metadata("design:type", Array)
], CoreWorkflowConnectionDTO.prototype, "edges", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>CoreWorkflowPageInfoDTO),
    _ts_metadata("design:type", typeof CoreWorkflowPageInfoDTO === "undefined" ? Object : CoreWorkflowPageInfoDTO)
], CoreWorkflowConnectionDTO.prototype, "pageInfo", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_graphql.Int),
    _ts_metadata("design:type", Number)
], CoreWorkflowConnectionDTO.prototype, "totalCount", void 0);
CoreWorkflowConnectionDTO = _ts_decorate([
    (0, _graphql.ObjectType)('CoreWorkflowConnection')
], CoreWorkflowConnectionDTO);

//# sourceMappingURL=core-workflow-connection.dto.js.map