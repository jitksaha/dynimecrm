"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "EnqueueJobInputDTO", {
    enumerable: true,
    get: function() {
        return EnqueueJobInputDTO;
    }
});
const _graphql = require("@nestjs/graphql");
const _classvalidator = require("class-validator");
const _graphqltypejson = /*#__PURE__*/ _interop_require_default(require("graphql-type-json"));
const _enqueuejobconstant = require("../constants/enqueue-job.constant");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let EnqueueJobInputDTO = class EnqueueJobInputDTO {
};
_ts_decorate([
    (0, _classvalidator.IsUUID)(),
    (0, _classvalidator.IsNotEmpty)(),
    (0, _graphql.Field)(),
    _ts_metadata("design:type", String)
], EnqueueJobInputDTO.prototype, "logicFunctionUniversalIdentifier", void 0);
_ts_decorate([
    (0, _classvalidator.IsObject)(),
    (0, _classvalidator.IsOptional)(),
    (0, _graphql.Field)(()=>_graphqltypejson.default, {
        nullable: true
    }),
    _ts_metadata("design:type", typeof Record === "undefined" ? Object : Record)
], EnqueueJobInputDTO.prototype, "payload", void 0);
_ts_decorate([
    (0, _classvalidator.IsInt)(),
    (0, _classvalidator.Min)(_enqueuejobconstant.ENQUEUE_JOB_MIN_RETRY_LIMIT),
    (0, _classvalidator.Max)(_enqueuejobconstant.ENQUEUE_JOB_MAX_RETRY_LIMIT),
    (0, _classvalidator.IsOptional)(),
    (0, _graphql.Field)(()=>_graphql.Int, {
        nullable: true
    }),
    _ts_metadata("design:type", Number)
], EnqueueJobInputDTO.prototype, "retryLimit", void 0);
_ts_decorate([
    (0, _classvalidator.IsInt)(),
    (0, _classvalidator.Min)(_enqueuejobconstant.ENQUEUE_JOB_MIN_DELAY_MS),
    (0, _classvalidator.Max)(_enqueuejobconstant.ENQUEUE_JOB_MAX_DELAY_MS),
    (0, _classvalidator.IsOptional)(),
    (0, _graphql.Field)(()=>_graphql.Int, {
        nullable: true
    }),
    _ts_metadata("design:type", Number)
], EnqueueJobInputDTO.prototype, "delayMs", void 0);
EnqueueJobInputDTO = _ts_decorate([
    (0, _graphql.InputType)('EnqueueJobInput')
], EnqueueJobInputDTO);

//# sourceMappingURL=enqueue-job.input.js.map