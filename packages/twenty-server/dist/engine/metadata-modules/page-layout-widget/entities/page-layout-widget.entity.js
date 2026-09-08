"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PageLayoutWidgetEntity", {
    enumerable: true,
    get: function() {
        return PageLayoutWidgetEntity;
    }
});
const _graphql = require("@nestjs/graphql");
const _types = require("twenty-shared/types");
const _typeorm = require("typeorm");
const _issystemsideeffectupgradecommandnameconstant = require("../../../../database/commands/upgrade-version-command/2-15/is-system-side-effect-upgrade-command-name.constant");
const _wasintroducedinupgradedecorator = require("../../../core-modules/upgrade/decorators/was-introduced-in-upgrade.decorator");
const _objectmetadataentity = require("../../object-metadata/object-metadata.entity");
const _pagelayouttabentity = require("../../page-layout-tab/entities/page-layout-tab.entity");
const _overridableentity = require("../../../workspace-manager/types/overridable-entity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let PageLayoutWidgetEntity = class PageLayoutWidgetEntity extends _overridableentity.OverridableEntity {
};
_ts_decorate([
    (0, _typeorm.PrimaryGeneratedColumn)('uuid'),
    _ts_metadata("design:type", String)
], PageLayoutWidgetEntity.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: false,
        type: 'uuid'
    }),
    _ts_metadata("design:type", String)
], PageLayoutWidgetEntity.prototype, "pageLayoutTabId", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_pagelayouttabentity.PageLayoutTabEntity, {
        onDelete: 'CASCADE'
    }),
    (0, _typeorm.JoinColumn)({
        name: 'pageLayoutTabId'
    }),
    _ts_metadata("design:type", typeof Relation === "undefined" ? Object : Relation)
], PageLayoutWidgetEntity.prototype, "pageLayoutTab", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: false
    }),
    _ts_metadata("design:type", String)
], PageLayoutWidgetEntity.prototype, "title", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'enum',
        enum: Object.values(_types.WidgetType),
        nullable: false,
        default: _types.WidgetType.VIEW
    }),
    _ts_metadata("design:type", typeof _types.WidgetType === "undefined" ? Object : _types.WidgetType)
], PageLayoutWidgetEntity.prototype, "type", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: true,
        type: 'uuid'
    }),
    _ts_metadata("design:type", Object)
], PageLayoutWidgetEntity.prototype, "objectMetadataId", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_objectmetadataentity.ObjectMetadataEntity, {
        onDelete: 'CASCADE',
        nullable: true
    }),
    (0, _typeorm.JoinColumn)({
        name: 'objectMetadataId'
    }),
    _ts_metadata("design:type", Object)
], PageLayoutWidgetEntity.prototype, "objectMetadata", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'jsonb',
        nullable: true
    }),
    _ts_metadata("design:type", typeof JsonbProperty === "undefined" ? Object : JsonbProperty)
], PageLayoutWidgetEntity.prototype, "conditionalDisplay", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'varchar',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], PageLayoutWidgetEntity.prototype, "conditionalAvailabilityExpression", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'jsonb',
        nullable: false
    }),
    _ts_metadata("design:type", typeof WasRemovedInUpgrade === "undefined" ? Object : WasRemovedInUpgrade)
], PageLayoutWidgetEntity.prototype, "gridPosition", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'jsonb',
        nullable: true
    }),
    _ts_metadata("design:type", typeof JsonbProperty === "undefined" ? Object : JsonbProperty)
], PageLayoutWidgetEntity.prototype, "position", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'jsonb',
        nullable: false
    }),
    _ts_metadata("design:type", typeof JsonbProperty === "undefined" ? Object : JsonbProperty)
], PageLayoutWidgetEntity.prototype, "configuration", void 0);
_ts_decorate([
    (0, _wasintroducedinupgradedecorator.WasIntroducedInUpgrade)({
        upgradeCommandName: _issystemsideeffectupgradecommandnameconstant.ADD_IS_SYSTEM_SIDE_EFFECT_UPGRADE_COMMAND_NAME
    }),
    (0, _typeorm.Column)({
        nullable: false,
        default: false,
        type: 'boolean'
    }),
    _ts_metadata("design:type", Boolean)
], PageLayoutWidgetEntity.prototype, "isSystemSideEffect", void 0);
_ts_decorate([
    (0, _typeorm.CreateDateColumn)({
        type: 'timestamptz'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], PageLayoutWidgetEntity.prototype, "createdAt", void 0);
_ts_decorate([
    (0, _typeorm.UpdateDateColumn)({
        type: 'timestamptz'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], PageLayoutWidgetEntity.prototype, "updatedAt", void 0);
_ts_decorate([
    (0, _typeorm.DeleteDateColumn)({
        type: 'timestamptz'
    }),
    _ts_metadata("design:type", Object)
], PageLayoutWidgetEntity.prototype, "deletedAt", void 0);
PageLayoutWidgetEntity = _ts_decorate([
    (0, _typeorm.Entity)({
        name: 'pageLayoutWidget',
        schema: 'core'
    }),
    (0, _graphql.ObjectType)('PageLayoutWidget'),
    (0, _typeorm.Index)('IDX_PAGE_LAYOUT_WIDGET_WORKSPACE_ID_PAGE_LAYOUT_TAB_ID', [
        'workspaceId',
        'pageLayoutTabId'
    ], {
        where: '"deletedAt" IS NULL'
    }),
    (0, _typeorm.Index)('IDX_PAGE_LAYOUT_WIDGET_OBJECT_METADATA_ID', [
        'objectMetadataId'
    ]),
    (0, _typeorm.Index)('IDX_PAGE_LAYOUT_WIDGET_PAGE_LAYOUT_TAB_ID', [
        'pageLayoutTabId'
    ])
], PageLayoutWidgetEntity);

//# sourceMappingURL=page-layout-widget.entity.js.map