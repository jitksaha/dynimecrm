"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UpdateUnsubscribeTopicInput", {
    enumerable: true,
    get: function() {
        return UpdateUnsubscribeTopicInput;
    }
});
const _graphql = require("@nestjs/graphql");
const _classvalidator = require("class-validator");
const _unsubscribetopicvisibilitytype = require("../types/unsubscribe-topic-visibility.type");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let UpdateUnsubscribeTopicInput = class UpdateUnsubscribeTopicInput {
};
_ts_decorate([
    (0, _graphql.Field)(()=>String),
    (0, _classvalidator.IsUUID)('4'),
    _ts_metadata("design:type", String)
], UpdateUnsubscribeTopicInput.prototype, "id", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>String, {
        nullable: true
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.MaxLength)(256),
    _ts_metadata("design:type", String)
], UpdateUnsubscribeTopicInput.prototype, "name", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>String, {
        nullable: true
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.MaxLength)(1024),
    _ts_metadata("design:type", String)
], UpdateUnsubscribeTopicInput.prototype, "description", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_unsubscribetopicvisibilitytype.UnsubscribeTopicVisibility, {
        nullable: true
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsEnum)(_unsubscribetopicvisibilitytype.UnsubscribeTopicVisibility),
    _ts_metadata("design:type", typeof _unsubscribetopicvisibilitytype.UnsubscribeTopicVisibility === "undefined" ? Object : _unsubscribetopicvisibilitytype.UnsubscribeTopicVisibility)
], UpdateUnsubscribeTopicInput.prototype, "visibility", void 0);
UpdateUnsubscribeTopicInput = _ts_decorate([
    (0, _graphql.InputType)()
], UpdateUnsubscribeTopicInput);

//# sourceMappingURL=update-unsubscribe-topic.input.js.map