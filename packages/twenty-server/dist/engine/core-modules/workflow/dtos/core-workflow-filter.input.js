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
    get CoreWorkflowFilterFieldKey () {
        return CoreWorkflowFilterFieldKey;
    },
    get CoreWorkflowFilterInput () {
        return CoreWorkflowFilterInput;
    },
    get CoreWorkflowFilterLogicalOperator () {
        return CoreWorkflowFilterLogicalOperator;
    },
    get CoreWorkflowFilterOperand () {
        return CoreWorkflowFilterOperand;
    },
    get CoreWorkflowFilterRuleInput () {
        return CoreWorkflowFilterRuleInput;
    },
    get MAX_CORE_WORKFLOW_FILTER_VALUE_LENGTH () {
        return MAX_CORE_WORKFLOW_FILTER_VALUE_LENGTH;
    }
});
const _graphql = require("@nestjs/graphql");
const _classtransformer = require("class-transformer");
const _classvalidator = require("class-validator");
const _constants = require("twenty-shared/constants");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const MAX_CORE_WORKFLOW_FILTER_VALUE_LENGTH = 2000;
var CoreWorkflowFilterFieldKey = /*#__PURE__*/ function(CoreWorkflowFilterFieldKey) {
    CoreWorkflowFilterFieldKey["NAME"] = "NAME";
    CoreWorkflowFilterFieldKey["STATUSES"] = "STATUSES";
    CoreWorkflowFilterFieldKey["UPDATED_AT"] = "UPDATED_AT";
    return CoreWorkflowFilterFieldKey;
}({});
var CoreWorkflowFilterOperand = /*#__PURE__*/ function(CoreWorkflowFilterOperand) {
    CoreWorkflowFilterOperand["CONTAINS"] = "CONTAINS";
    CoreWorkflowFilterOperand["DOES_NOT_CONTAIN"] = "DOES_NOT_CONTAIN";
    CoreWorkflowFilterOperand["IS"] = "IS";
    CoreWorkflowFilterOperand["IS_NOT"] = "IS_NOT";
    CoreWorkflowFilterOperand["IS_EMPTY"] = "IS_EMPTY";
    CoreWorkflowFilterOperand["IS_NOT_EMPTY"] = "IS_NOT_EMPTY";
    CoreWorkflowFilterOperand["IS_BEFORE"] = "IS_BEFORE";
    CoreWorkflowFilterOperand["IS_AFTER"] = "IS_AFTER";
    CoreWorkflowFilterOperand["IS_IN_PAST"] = "IS_IN_PAST";
    CoreWorkflowFilterOperand["IS_IN_FUTURE"] = "IS_IN_FUTURE";
    CoreWorkflowFilterOperand["IS_TODAY"] = "IS_TODAY";
    CoreWorkflowFilterOperand["IS_RELATIVE"] = "IS_RELATIVE";
    return CoreWorkflowFilterOperand;
}({});
var CoreWorkflowFilterLogicalOperator = /*#__PURE__*/ function(CoreWorkflowFilterLogicalOperator) {
    CoreWorkflowFilterLogicalOperator["AND"] = "AND";
    CoreWorkflowFilterLogicalOperator["OR"] = "OR";
    return CoreWorkflowFilterLogicalOperator;
}({});
(0, _graphql.registerEnumType)(CoreWorkflowFilterFieldKey, {
    name: 'CoreWorkflowFilterFieldKey'
});
(0, _graphql.registerEnumType)(CoreWorkflowFilterOperand, {
    name: 'CoreWorkflowFilterOperand'
});
(0, _graphql.registerEnumType)(CoreWorkflowFilterLogicalOperator, {
    name: 'CoreWorkflowFilterLogicalOperator'
});
let CoreWorkflowFilterRuleInput = class CoreWorkflowFilterRuleInput {
};
_ts_decorate([
    (0, _graphql.Field)(()=>CoreWorkflowFilterFieldKey),
    (0, _classvalidator.IsEnum)(CoreWorkflowFilterFieldKey),
    _ts_metadata("design:type", String)
], CoreWorkflowFilterRuleInput.prototype, "fieldKey", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>CoreWorkflowFilterOperand),
    (0, _classvalidator.IsEnum)(CoreWorkflowFilterOperand),
    _ts_metadata("design:type", String)
], CoreWorkflowFilterRuleInput.prototype, "operand", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>String, {
        nullable: true
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.MaxLength)(MAX_CORE_WORKFLOW_FILTER_VALUE_LENGTH),
    _ts_metadata("design:type", Object)
], CoreWorkflowFilterRuleInput.prototype, "value", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>String, {
        nullable: true
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsTimeZone)(),
    _ts_metadata("design:type", Object)
], CoreWorkflowFilterRuleInput.prototype, "timezone", void 0);
CoreWorkflowFilterRuleInput = _ts_decorate([
    (0, _graphql.InputType)()
], CoreWorkflowFilterRuleInput);
let CoreWorkflowFilterInput = class CoreWorkflowFilterInput {
};
_ts_decorate([
    (0, _graphql.Field)(()=>CoreWorkflowFilterLogicalOperator),
    (0, _classvalidator.IsEnum)(CoreWorkflowFilterLogicalOperator),
    _ts_metadata("design:type", String)
], CoreWorkflowFilterInput.prototype, "logicalOperator", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>[
            CoreWorkflowFilterRuleInput
        ]),
    (0, _classvalidator.ArrayMaxSize)(_constants.MAX_CORE_WORKFLOW_FILTER_RULES),
    (0, _classvalidator.ValidateNested)({
        each: true
    }),
    (0, _classtransformer.Type)(()=>CoreWorkflowFilterRuleInput),
    _ts_metadata("design:type", Array)
], CoreWorkflowFilterInput.prototype, "rules", void 0);
CoreWorkflowFilterInput = _ts_decorate([
    (0, _graphql.InputType)()
], CoreWorkflowFilterInput);

//# sourceMappingURL=core-workflow-filter.input.js.map