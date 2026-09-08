"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ApplicationJobResolver", {
    enumerable: true,
    get: function() {
        return ApplicationJobResolver;
    }
});
const _common = require("@nestjs/common");
const _graphql = require("@nestjs/graphql");
const _metadataresolverdecorator = require("../../../api/graphql/graphql-config/decorators/metadata-resolver.decorator");
const _applicationexceptionfilter = require("../application-exception-filter");
const _enqueuejobresultdto = require("./dtos/enqueue-job-result.dto");
const _enqueuejobinput = require("./dtos/enqueue-job.input");
const _enqueuejobsresultdto = require("./dtos/enqueue-jobs-result.dto");
const _enqueuejobsinput = require("./dtos/enqueue-jobs.input");
const _applicationjobservice = require("./services/application-job.service");
const _resolvervalidationpipe = require("../../graphql/pipes/resolver-validation.pipe");
const _authapplicationdecorator = require("../../../decorators/auth/auth-application.decorator");
const _authuserworkspaceiddecorator = require("../../../decorators/auth/auth-user-workspace-id.decorator");
const _authuserdecorator = require("../../../decorators/auth/auth-user.decorator");
const _authworkspacedecorator = require("../../../decorators/auth/auth-workspace.decorator");
const _nopermissionguard = require("../../../guards/no-permission.guard");
const _workspaceauthguard = require("../../../guards/workspace-auth.guard");
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
let ApplicationJobResolver = class ApplicationJobResolver {
    async enqueueJob(application, workspace, user, userWorkspaceId, input) {
        return this.applicationJobService.enqueueJob({
            applicationId: application.id,
            workspaceId: workspace.id,
            userId: user?.id ?? null,
            userWorkspaceId: userWorkspaceId ?? null,
            input
        });
    }
    async enqueueJobs(application, workspace, user, userWorkspaceId, input) {
        return this.applicationJobService.enqueueJobs({
            applicationId: application.id,
            workspaceId: workspace.id,
            userId: user?.id ?? null,
            userWorkspaceId: userWorkspaceId ?? null,
            input
        });
    }
    constructor(applicationJobService){
        this.applicationJobService = applicationJobService;
    }
};
_ts_decorate([
    (0, _graphql.Mutation)(()=>_enqueuejobresultdto.EnqueueJobResultDTO, {
        deprecationReason: 'Use enqueueJobs instead.'
    }),
    _ts_param(0, (0, _authapplicationdecorator.AuthApplication)()),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_param(2, (0, _authuserdecorator.AuthUser)({
        allowUndefined: true
    })),
    _ts_param(3, (0, _authuserworkspaceiddecorator.AuthUserWorkspaceId)({
        allowUndefined: true
    })),
    _ts_param(4, (0, _graphql.Args)('input')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof FlatApplication === "undefined" ? Object : FlatApplication,
        typeof FlatWorkspace === "undefined" ? Object : FlatWorkspace,
        Object,
        Object,
        typeof _enqueuejobinput.EnqueueJobInputDTO === "undefined" ? Object : _enqueuejobinput.EnqueueJobInputDTO
    ]),
    _ts_metadata("design:returntype", Promise)
], ApplicationJobResolver.prototype, "enqueueJob", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>_enqueuejobsresultdto.EnqueueJobsResultDTO),
    _ts_param(0, (0, _authapplicationdecorator.AuthApplication)()),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_param(2, (0, _authuserdecorator.AuthUser)({
        allowUndefined: true
    })),
    _ts_param(3, (0, _authuserworkspaceiddecorator.AuthUserWorkspaceId)({
        allowUndefined: true
    })),
    _ts_param(4, (0, _graphql.Args)('input')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof FlatApplication === "undefined" ? Object : FlatApplication,
        typeof FlatWorkspace === "undefined" ? Object : FlatWorkspace,
        Object,
        Object,
        typeof _enqueuejobsinput.EnqueueJobsInputDTO === "undefined" ? Object : _enqueuejobsinput.EnqueueJobsInputDTO
    ]),
    _ts_metadata("design:returntype", Promise)
], ApplicationJobResolver.prototype, "enqueueJobs", null);
ApplicationJobResolver = _ts_decorate([
    (0, _common.UseGuards)(_workspaceauthguard.WorkspaceAuthGuard, _nopermissionguard.NoPermissionGuard),
    (0, _common.UseFilters)(_applicationexceptionfilter.ApplicationExceptionFilter),
    (0, _common.UsePipes)(_resolvervalidationpipe.ResolverValidationPipe),
    (0, _metadataresolverdecorator.MetadataResolver)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _applicationjobservice.ApplicationJobService === "undefined" ? Object : _applicationjobservice.ApplicationJobService
    ])
], ApplicationJobResolver);

//# sourceMappingURL=application-job.resolver.js.map