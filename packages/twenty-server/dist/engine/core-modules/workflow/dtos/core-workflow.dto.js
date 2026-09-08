"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CoreWorkflowDTO", {
    enumerable: true,
    get: function() {
        return CoreWorkflowDTO;
    }
});
const _graphql = require("@nestjs/graphql");
const _scalars = require("../../../api/graphql/workspace-schema-builder/graphql-types/scalars");
const _workflowworkspaceentity = require("../../../../modules/workflow/common/standard-objects/workflow.workspace-entity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
(0, _graphql.registerEnumType)(_workflowworkspaceentity.WorkflowStatus, {
    name: 'CoreWorkflowStatus'
});
let CoreWorkflowDTO = class CoreWorkflowDTO {
};
_ts_decorate([
    (0, _graphql.Field)(()=>_scalars.UUIDScalarType),
    _ts_metadata("design:type", String)
], CoreWorkflowDTO.prototype, "id", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>String, {
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], CoreWorkflowDTO.prototype, "name", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>[
            _workflowworkspaceentity.WorkflowStatus
        ]),
    _ts_metadata("design:type", Array)
], CoreWorkflowDTO.prototype, "statuses", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_scalars.UUIDScalarType, {
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], CoreWorkflowDTO.prototype, "applicationId", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_scalars.UUIDScalarType, {
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], CoreWorkflowDTO.prototype, "workspaceWorkflowId", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>String),
    _ts_metadata("design:type", String)
], CoreWorkflowDTO.prototype, "updatedAt", void 0);
CoreWorkflowDTO = _ts_decorate([
    (0, _graphql.ObjectType)('CoreWorkflowDTO')
], CoreWorkflowDTO);

//# sourceMappingURL=core-workflow.dto.js.map