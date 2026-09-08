"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ApplicationTranslationEntity", {
    enumerable: true,
    get: function() {
        return ApplicationTranslationEntity;
    }
});
const _typeorm = require("typeorm");
const _applicationregistrationentity = require("../application-registration/application-registration.entity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let ApplicationTranslationEntity = class ApplicationTranslationEntity {
};
_ts_decorate([
    (0, _typeorm.PrimaryGeneratedColumn)('uuid'),
    _ts_metadata("design:type", String)
], ApplicationTranslationEntity.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: true,
        type: 'uuid'
    }),
    _ts_metadata("design:type", Object)
], ApplicationTranslationEntity.prototype, "applicationRegistrationId", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_applicationregistrationentity.ApplicationRegistrationEntity, {
        onDelete: 'CASCADE',
        nullable: true
    }),
    (0, _typeorm.JoinColumn)({
        name: 'applicationRegistrationId'
    }),
    _ts_metadata("design:type", Object)
], ApplicationTranslationEntity.prototype, "applicationRegistration", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'text'
    }),
    _ts_metadata("design:type", Object)
], ApplicationTranslationEntity.prototype, "locale", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'jsonb',
        default: {}
    }),
    _ts_metadata("design:type", typeof Record === "undefined" ? Object : Record)
], ApplicationTranslationEntity.prototype, "messages", void 0);
_ts_decorate([
    (0, _typeorm.CreateDateColumn)({
        type: 'timestamptz'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], ApplicationTranslationEntity.prototype, "createdAt", void 0);
_ts_decorate([
    (0, _typeorm.UpdateDateColumn)({
        type: 'timestamptz'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], ApplicationTranslationEntity.prototype, "updatedAt", void 0);
_ts_decorate([
    (0, _typeorm.DeleteDateColumn)({
        type: 'timestamptz'
    }),
    _ts_metadata("design:type", Object)
], ApplicationTranslationEntity.prototype, "deletedAt", void 0);
ApplicationTranslationEntity = _ts_decorate([
    (0, _typeorm.Entity)({
        name: 'applicationTranslation',
        schema: 'core'
    }),
    (0, _typeorm.Index)('IDX_APPLICATION_TRANSLATION_REGISTRATION_LOCALE_UNIQUE', [
        'applicationRegistrationId',
        'locale'
    ], {
        unique: true,
        where: '"deletedAt" IS NULL'
    }),
    (0, _typeorm.Index)('IDX_APPLICATION_TRANSLATION_STANDARD_LOCALE_UNIQUE', [
        'locale'
    ], {
        unique: true,
        where: '"deletedAt" IS NULL AND "applicationRegistrationId" IS NULL'
    })
], ApplicationTranslationEntity);

//# sourceMappingURL=application-translation.entity.js.map