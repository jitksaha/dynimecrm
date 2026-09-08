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
    get MarketplaceAppRoleDTO () {
        return MarketplaceAppRoleDTO;
    },
    get MarketplaceAppRoleFieldPermissionDTO () {
        return MarketplaceAppRoleFieldPermissionDTO;
    },
    get MarketplaceAppRoleObjectPermissionDTO () {
        return MarketplaceAppRoleObjectPermissionDTO;
    }
});
const _graphql = require("@nestjs/graphql");
const _classvalidator = require("class-validator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let MarketplaceAppRoleObjectPermissionDTO = class MarketplaceAppRoleObjectPermissionDTO {
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    (0, _graphql.Field)(),
    _ts_metadata("design:type", String)
], MarketplaceAppRoleObjectPermissionDTO.prototype, "universalIdentifier", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    (0, _graphql.Field)(),
    _ts_metadata("design:type", String)
], MarketplaceAppRoleObjectPermissionDTO.prototype, "objectUniversalIdentifier", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsBoolean)(),
    (0, _graphql.Field)(()=>Boolean, {
        nullable: true
    }),
    _ts_metadata("design:type", Boolean)
], MarketplaceAppRoleObjectPermissionDTO.prototype, "canReadObjectRecords", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsBoolean)(),
    (0, _graphql.Field)(()=>Boolean, {
        nullable: true
    }),
    _ts_metadata("design:type", Boolean)
], MarketplaceAppRoleObjectPermissionDTO.prototype, "canUpdateObjectRecords", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsBoolean)(),
    (0, _graphql.Field)(()=>Boolean, {
        nullable: true
    }),
    _ts_metadata("design:type", Boolean)
], MarketplaceAppRoleObjectPermissionDTO.prototype, "canSoftDeleteObjectRecords", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsBoolean)(),
    (0, _graphql.Field)(()=>Boolean, {
        nullable: true
    }),
    _ts_metadata("design:type", Boolean)
], MarketplaceAppRoleObjectPermissionDTO.prototype, "canDestroyObjectRecords", void 0);
MarketplaceAppRoleObjectPermissionDTO = _ts_decorate([
    (0, _graphql.ObjectType)('MarketplaceAppRoleObjectPermission')
], MarketplaceAppRoleObjectPermissionDTO);
let MarketplaceAppRoleFieldPermissionDTO = class MarketplaceAppRoleFieldPermissionDTO {
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    (0, _graphql.Field)(),
    _ts_metadata("design:type", String)
], MarketplaceAppRoleFieldPermissionDTO.prototype, "universalIdentifier", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    (0, _graphql.Field)(),
    _ts_metadata("design:type", String)
], MarketplaceAppRoleFieldPermissionDTO.prototype, "objectUniversalIdentifier", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    (0, _graphql.Field)(),
    _ts_metadata("design:type", String)
], MarketplaceAppRoleFieldPermissionDTO.prototype, "fieldUniversalIdentifier", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsBoolean)(),
    (0, _graphql.Field)(()=>Boolean, {
        nullable: true
    }),
    _ts_metadata("design:type", Boolean)
], MarketplaceAppRoleFieldPermissionDTO.prototype, "canReadFieldValue", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsBoolean)(),
    (0, _graphql.Field)(()=>Boolean, {
        nullable: true
    }),
    _ts_metadata("design:type", Boolean)
], MarketplaceAppRoleFieldPermissionDTO.prototype, "canUpdateFieldValue", void 0);
MarketplaceAppRoleFieldPermissionDTO = _ts_decorate([
    (0, _graphql.ObjectType)('MarketplaceAppRoleFieldPermission')
], MarketplaceAppRoleFieldPermissionDTO);
let MarketplaceAppRoleDTO = class MarketplaceAppRoleDTO {
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    (0, _graphql.Field)(),
    _ts_metadata("design:type", String)
], MarketplaceAppRoleDTO.prototype, "universalIdentifier", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    (0, _graphql.Field)(),
    _ts_metadata("design:type", String)
], MarketplaceAppRoleDTO.prototype, "label", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    (0, _graphql.Field)({
        nullable: true
    }),
    _ts_metadata("design:type", String)
], MarketplaceAppRoleDTO.prototype, "description", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    (0, _graphql.Field)({
        nullable: true
    }),
    _ts_metadata("design:type", String)
], MarketplaceAppRoleDTO.prototype, "icon", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsBoolean)(),
    (0, _graphql.Field)(()=>Boolean, {
        nullable: true
    }),
    _ts_metadata("design:type", Boolean)
], MarketplaceAppRoleDTO.prototype, "canUpdateAllSettings", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsBoolean)(),
    (0, _graphql.Field)(()=>Boolean, {
        nullable: true
    }),
    _ts_metadata("design:type", Boolean)
], MarketplaceAppRoleDTO.prototype, "canAccessAllTools", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsBoolean)(),
    (0, _graphql.Field)(()=>Boolean, {
        nullable: true
    }),
    _ts_metadata("design:type", Boolean)
], MarketplaceAppRoleDTO.prototype, "canReadAllObjectRecords", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsBoolean)(),
    (0, _graphql.Field)(()=>Boolean, {
        nullable: true
    }),
    _ts_metadata("design:type", Boolean)
], MarketplaceAppRoleDTO.prototype, "canUpdateAllObjectRecords", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsBoolean)(),
    (0, _graphql.Field)(()=>Boolean, {
        nullable: true
    }),
    _ts_metadata("design:type", Boolean)
], MarketplaceAppRoleDTO.prototype, "canSoftDeleteAllObjectRecords", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsBoolean)(),
    (0, _graphql.Field)(()=>Boolean, {
        nullable: true
    }),
    _ts_metadata("design:type", Boolean)
], MarketplaceAppRoleDTO.prototype, "canDestroyAllObjectRecords", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _graphql.Field)(()=>[
            String
        ], {
        nullable: true
    }),
    _ts_metadata("design:type", Array)
], MarketplaceAppRoleDTO.prototype, "permissionFlagUniversalIdentifiers", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _graphql.Field)(()=>[
            MarketplaceAppRoleObjectPermissionDTO
        ], {
        nullable: true
    }),
    _ts_metadata("design:type", Array)
], MarketplaceAppRoleDTO.prototype, "objectPermissions", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _graphql.Field)(()=>[
            MarketplaceAppRoleFieldPermissionDTO
        ], {
        nullable: true
    }),
    _ts_metadata("design:type", Array)
], MarketplaceAppRoleDTO.prototype, "fieldPermissions", void 0);
MarketplaceAppRoleDTO = _ts_decorate([
    (0, _graphql.ObjectType)('MarketplaceAppRole')
], MarketplaceAppRoleDTO);

//# sourceMappingURL=marketplace-app-role.dto.js.map