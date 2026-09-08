"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TimelineActivityTypeResolver", {
    enumerable: true,
    get: function() {
        return TimelineActivityTypeResolver;
    }
});
const _common = require("@nestjs/common");
const _graphql = require("@nestjs/graphql");
const _guards = require("@sniptt/guards");
const _scalars = require("../../api/graphql/workspace-schema-builder/graphql-types/scalars");
const _metadataresolverdecorator = require("../../api/graphql/graphql-config/decorators/metadata-resolver.decorator");
const _workspaceentity = require("../../core-modules/workspace/workspace.entity");
const _authworkspacedecorator = require("../../decorators/auth/auth-workspace.decorator");
const _constants = require("twenty-shared/constants");
const _nopermissionguard = require("../../guards/no-permission.guard");
const _settingspermissionguard = require("../../guards/settings-permission.guard");
const _workspaceauthguard = require("../../guards/workspace-auth.guard");
const _applicationtranslationcatalogservice = require("../application-translation-catalog/services/application-translation-catalog.service");
const _timelineactivitytypedto = require("./dtos/timeline-activity-type.dto");
const _updatetimelineactivitytypeinput = require("./dtos/update-timeline-activity-type.input");
const _timelineactivitytypegraphqlapiexceptioninterceptor = require("./interceptors/timeline-activity-type-graphql-api-exception.interceptor");
const _timelineactivitytypeservice = require("./timeline-activity-type.service");
const _resolveeffectiveentitypropertyutil = require("../utils/resolve-effective-entity-property.util");
const _workspacemigrationgraphqlapiexceptioninterceptor = require("../../workspace-manager/workspace-migration/interceptors/workspace-migration-graphql-api-exception.interceptor");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let TimelineActivityTypeResolver = class TimelineActivityTypeResolver {
    async label(timelineActivityType, context, workspace) {
        if (!(0, _guards.isNonEmptyString)(timelineActivityType.label)) {
            return timelineActivityType.label;
        }
        return (0, _resolveeffectiveentitypropertyutil.resolveEffectiveEntityProperty)({
            metadataName: 'timelineActivityType',
            baseValue: timelineActivityType.label,
            overrides: timelineActivityType.overrides,
            property: 'label',
            i18nContext: await this.applicationTranslationCatalogService.buildEffectiveEntityI18nContext({
                applicationId: timelineActivityType.applicationId,
                loaders: context.loaders,
                locale: context.req.locale,
                workspaceId: workspace.id
            })
        });
    }
    async timelineActivityTypes(workspace) {
        return await this.timelineActivityTypeService.findAll({
            workspaceId: workspace.id
        });
    }
    async updateTimelineActivityType(input, workspace) {
        return this.timelineActivityTypeService.update({
            input,
            workspaceId: workspace.id
        });
    }
    async resetTimelineActivityType(id, workspace) {
        return this.timelineActivityTypeService.reset({
            id,
            workspaceId: workspace.id
        });
    }
    constructor(timelineActivityTypeService, applicationTranslationCatalogService){
        this.timelineActivityTypeService = timelineActivityTypeService;
        this.applicationTranslationCatalogService = applicationTranslationCatalogService;
    }
};
_ts_decorate([
    (0, _graphql.ResolveField)(()=>String),
    _ts_param(0, (0, _graphql.Parent)()),
    _ts_param(1, (0, _graphql.Context)()),
    _ts_param(2, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _timelineactivitytypedto.TimelineActivityTypeDTO === "undefined" ? Object : _timelineactivitytypedto.TimelineActivityTypeDTO,
        Object,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], TimelineActivityTypeResolver.prototype, "label", null);
_ts_decorate([
    (0, _graphql.Query)(()=>[
            _timelineactivitytypedto.TimelineActivityTypeDTO
        ]),
    (0, _common.UseGuards)(_nopermissionguard.NoPermissionGuard),
    _ts_param(0, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], TimelineActivityTypeResolver.prototype, "timelineActivityTypes", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>_timelineactivitytypedto.TimelineActivityTypeDTO),
    (0, _common.UseGuards)((0, _settingspermissionguard.SettingsPermissionGuard)(_constants.PermissionFlagType.APPLICATIONS)),
    _ts_param(0, (0, _graphql.Args)('input')),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _updatetimelineactivitytypeinput.UpdateTimelineActivityTypeInput === "undefined" ? Object : _updatetimelineactivitytypeinput.UpdateTimelineActivityTypeInput,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], TimelineActivityTypeResolver.prototype, "updateTimelineActivityType", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>_timelineactivitytypedto.TimelineActivityTypeDTO),
    (0, _common.UseGuards)((0, _settingspermissionguard.SettingsPermissionGuard)(_constants.PermissionFlagType.APPLICATIONS)),
    _ts_param(0, (0, _graphql.Args)('id', {
        type: ()=>_scalars.UUIDScalarType
    })),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], TimelineActivityTypeResolver.prototype, "resetTimelineActivityType", null);
TimelineActivityTypeResolver = _ts_decorate([
    (0, _common.UseGuards)(_workspaceauthguard.WorkspaceAuthGuard),
    (0, _common.UseInterceptors)(_workspacemigrationgraphqlapiexceptioninterceptor.WorkspaceMigrationGraphqlApiExceptionInterceptor, _timelineactivitytypegraphqlapiexceptioninterceptor.TimelineActivityTypeGraphqlApiExceptionInterceptor),
    (0, _metadataresolverdecorator.MetadataResolver)(()=>_timelineactivitytypedto.TimelineActivityTypeDTO),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _timelineactivitytypeservice.TimelineActivityTypeService === "undefined" ? Object : _timelineactivitytypeservice.TimelineActivityTypeService,
        typeof _applicationtranslationcatalogservice.ApplicationTranslationCatalogService === "undefined" ? Object : _applicationtranslationcatalogservice.ApplicationTranslationCatalogService
    ])
], TimelineActivityTypeResolver);

//# sourceMappingURL=timeline-activity-type.resolver.js.map