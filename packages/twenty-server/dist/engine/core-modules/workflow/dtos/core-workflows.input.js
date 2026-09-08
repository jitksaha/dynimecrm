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
    get CoreWorkflowOrderByDirection () {
        return CoreWorkflowOrderByDirection;
    },
    get CoreWorkflowOrderByField () {
        return CoreWorkflowOrderByField;
    },
    get CoreWorkflowsArgs () {
        return CoreWorkflowsArgs;
    }
});
const _graphql = require("@nestjs/graphql");
const _classtransformer = require("class-transformer");
const _classvalidator = require("class-validator");
const _coreworkflowfilterinput = require("./core-workflow-filter.input");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
var CoreWorkflowOrderByField = /*#__PURE__*/ function(CoreWorkflowOrderByField) {
    CoreWorkflowOrderByField["NAME"] = "name";
    CoreWorkflowOrderByField["UPDATED_AT"] = "updatedAt";
    return CoreWorkflowOrderByField;
}({});
var CoreWorkflowOrderByDirection = /*#__PURE__*/ function(CoreWorkflowOrderByDirection) {
    CoreWorkflowOrderByDirection["ASC"] = "ASC";
    CoreWorkflowOrderByDirection["DESC"] = "DESC";
    return CoreWorkflowOrderByDirection;
}({});
(0, _graphql.registerEnumType)(CoreWorkflowOrderByField, {
    name: 'CoreWorkflowOrderByField'
});
(0, _graphql.registerEnumType)(CoreWorkflowOrderByDirection, {
    name: 'CoreWorkflowOrderByDirection'
});
let CoreWorkflowsArgs = class CoreWorkflowsArgs {
};
_ts_decorate([
    (0, _graphql.Field)(()=>_graphql.Int, {
        nullable: true,
        defaultValue: 60
    }),
    (0, _classvalidator.IsInt)(),
    (0, _classvalidator.Min)(1),
    (0, _classvalidator.Max)(200),
    _ts_metadata("design:type", Number)
], CoreWorkflowsArgs.prototype, "first", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>String, {
        nullable: true
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CoreWorkflowsArgs.prototype, "after", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>CoreWorkflowOrderByField, {
        nullable: true,
        defaultValue: "updatedAt"
    }),
    (0, _classvalidator.IsEnum)(CoreWorkflowOrderByField),
    _ts_metadata("design:type", String)
], CoreWorkflowsArgs.prototype, "orderBy", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>CoreWorkflowOrderByDirection, {
        nullable: true,
        defaultValue: "DESC"
    }),
    (0, _classvalidator.IsEnum)(CoreWorkflowOrderByDirection),
    _ts_metadata("design:type", String)
], CoreWorkflowsArgs.prototype, "orderByDirection", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_coreworkflowfilterinput.CoreWorkflowFilterInput, {
        nullable: true
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.ValidateNested)(),
    (0, _classtransformer.Type)(()=>_coreworkflowfilterinput.CoreWorkflowFilterInput),
    _ts_metadata("design:type", Object)
], CoreWorkflowsArgs.prototype, "filter", void 0);
CoreWorkflowsArgs = _ts_decorate([
    (0, _graphql.ArgsType)()
], CoreWorkflowsArgs);

//# sourceMappingURL=core-workflows.input.js.map