"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UpsertViewWidgetViewSettingsInput", {
    enumerable: true,
    get: function() {
        return UpsertViewWidgetViewSettingsInput;
    }
});
const _graphql = require("@nestjs/graphql");
const _classvalidator = require("class-validator");
const _types = require("twenty-shared/types");
const _scalars = require("../../../../api/graphql/workspace-schema-builder/graphql-types/scalars");
const _kanbancolumnmaxwidthconstant = require("../../constants/kanban-column-max-width.constant");
const _kanbancolumnminwidthconstant = require("../../constants/kanban-column-min-width.constant");
const _viewopenrecordindeprecationconstant = require("../../constants/view-open-record-in-deprecation.constant");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let UpsertViewWidgetViewSettingsInput = class UpsertViewWidgetViewSettingsInput {
};
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsEnum)(_types.ViewType),
    (0, _graphql.Field)(()=>_types.ViewType, {
        nullable: true,
        description: 'The layout type of the widget view. Only widget view types (TABLE_WIDGET, KANBAN_WIDGET, LIST_WIDGET, CALENDAR_WIDGET) are allowed.'
    }),
    _ts_metadata("design:type", typeof _types.ViewType === "undefined" ? Object : _types.ViewType)
], UpsertViewWidgetViewSettingsInput.prototype, "type", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsUUID)(),
    (0, _graphql.Field)(()=>_scalars.UUIDScalarType, {
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], UpsertViewWidgetViewSettingsInput.prototype, "mainGroupByFieldMetadataId", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsBoolean)(),
    (0, _graphql.Field)({
        nullable: true
    }),
    _ts_metadata("design:type", Boolean)
], UpsertViewWidgetViewSettingsInput.prototype, "shouldHideEmptyGroups", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsEnum)(_types.ViewOpenRecordIn),
    (0, _graphql.Field)(()=>_types.ViewOpenRecordIn, {
        nullable: true,
        description: `Deprecated: ${_viewopenrecordindeprecationconstant.VIEW_OPEN_RECORD_IN_DEPRECATION}`
    }),
    _ts_metadata("design:type", typeof _types.ViewOpenRecordIn === "undefined" ? Object : _types.ViewOpenRecordIn)
], UpsertViewWidgetViewSettingsInput.prototype, "openRecordIn", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsEnum)(_types.AggregateOperations),
    (0, _graphql.Field)(()=>_types.AggregateOperations, {
        nullable: true
    }),
    _ts_metadata("design:type", typeof _types.AggregateOperations === "undefined" ? Object : _types.AggregateOperations)
], UpsertViewWidgetViewSettingsInput.prototype, "kanbanAggregateOperation", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsUUID)(),
    (0, _graphql.Field)(()=>_scalars.UUIDScalarType, {
        nullable: true
    }),
    _ts_metadata("design:type", String)
], UpsertViewWidgetViewSettingsInput.prototype, "kanbanAggregateOperationFieldMetadataId", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsInt)(),
    (0, _classvalidator.Min)(_kanbancolumnminwidthconstant.KANBAN_COLUMN_MIN_WIDTH),
    (0, _classvalidator.Max)(_kanbancolumnmaxwidthconstant.KANBAN_COLUMN_MAX_WIDTH),
    (0, _graphql.Field)(()=>_graphql.Int, {
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], UpsertViewWidgetViewSettingsInput.prototype, "kanbanColumnWidth", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsEnum)(_types.ViewCalendarLayout),
    (0, _graphql.Field)(()=>_types.ViewCalendarLayout, {
        nullable: true
    }),
    _ts_metadata("design:type", typeof _types.ViewCalendarLayout === "undefined" ? Object : _types.ViewCalendarLayout)
], UpsertViewWidgetViewSettingsInput.prototype, "calendarLayout", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsUUID)(),
    (0, _graphql.Field)(()=>_scalars.UUIDScalarType, {
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], UpsertViewWidgetViewSettingsInput.prototype, "calendarFieldMetadataId", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsUUID)(),
    (0, _graphql.Field)(()=>_scalars.UUIDScalarType, {
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], UpsertViewWidgetViewSettingsInput.prototype, "calendarEndFieldMetadataId", void 0);
UpsertViewWidgetViewSettingsInput = _ts_decorate([
    (0, _graphql.InputType)()
], UpsertViewWidgetViewSettingsInput);

//# sourceMappingURL=upsert-view-widget-view-settings.input.js.map