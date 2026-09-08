"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "EmailingDomainModule", {
    enumerable: true,
    get: function() {
        return EmailingDomainModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _typeormmodule = require("../../../database/typeorm/typeorm.module");
const _billingmodule = require("../billing/billing.module");
const _dnsmanagermodule = require("../dns-manager/dns-manager.module");
const _checkemailingdomainverificationcroncommand = require("./crons/commands/check-emailing-domain-verification.cron.command");
const _checkemailingdomainverificationcronjob = require("./crons/jobs/check-emailing-domain-verification.cron.job");
const _awssesclientprovider = require("./drivers/aws-ses/providers/aws-ses-client.provider");
const _awssesaccountservice = require("./drivers/aws-ses/services/aws-ses-account.service");
const _awssesobservabilityservice = require("./drivers/aws-ses/services/aws-ses-observability.service");
const _awssesoutboundeventdestinationservice = require("./drivers/aws-ses/services/aws-ses-outbound-event-destination.service");
const _awssesregisterdomainservice = require("./drivers/aws-ses/services/aws-ses-register-domain.service");
const _awsseshandleerrorservice = require("./drivers/aws-ses/services/aws-ses-handle-error.service");
const _awssessendemailservice = require("./drivers/aws-ses/services/aws-ses-send-email.service");
const _emailingdomaindriverfactory = require("./drivers/emailing-domain-driver.factory");
const _logemailingdomaindriverservice = require("./drivers/log/services/log-emailing-domain-driver.service");
const _resendapiclientservice = require("./drivers/resend/services/resend-api-client.service");
const _emailgroupaccessservice = require("./services/email-group-access.service");
const _emailingdomainentity = require("./emailing-domain.entity");
const _emailingdomainresolver = require("./emailing-domain.resolver");
const _emailingdomainworkspacecleanupjob = require("./jobs/emailing-domain-workspace-cleanup.job");
const _emailingdomaintenantstatusservice = require("./services/emailing-domain-tenant-status.service");
const _emailingdomainservice = require("./services/emailing-domain.service");
const _unsubscribecontentservice = require("./services/unsubscribe-content.service");
const _unsubscribehostnameservice = require("./services/unsubscribe-hostname.service");
const _unsubscribetokenservice = require("./services/unsubscribe-token.service");
const _enterprisemodule = require("../enterprise/enterprise.module");
const _featureflagmodule = require("../feature-flag/feature-flag.module");
const _permissionsmodule = require("../../metadata-modules/permissions/permissions.module");
const _secretencryptionmodule = require("../secret-encryption/secret-encryption.module");
const _workspaceentity = require("../workspace/workspace.entity");
const _provideworkspacescopedrepository = require("../../twenty-orm/workspace-scoped-repository/provide-workspace-scoped-repository");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let EmailingDomainModule = class EmailingDomainModule {
};
EmailingDomainModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _typeormmodule.TypeORMModule,
            _typeorm.TypeOrmModule.forFeature([
                _workspaceentity.WorkspaceEntity,
                _emailingdomainentity.EmailingDomainEntity
            ]),
            _featureflagmodule.FeatureFlagModule,
            _permissionsmodule.PermissionsModule,
            _dnsmanagermodule.DnsManagerModule,
            _secretencryptionmodule.SecretEncryptionModule,
            _billingmodule.BillingModule,
            _enterprisemodule.EnterpriseModule
        ],
        exports: [
            _emailingdomainservice.EmailingDomainService,
            _emailingdomaintenantstatusservice.EmailingDomainTenantStatusService,
            _emailingdomaindriverfactory.EmailingDomainDriverFactory,
            _unsubscribetokenservice.UnsubscribeTokenService,
            _emailgroupaccessservice.EmailGroupAccessService,
            _checkemailingdomainverificationcroncommand.CheckEmailingDomainVerificationCronCommand
        ],
        providers: [
            _checkemailingdomainverificationcroncommand.CheckEmailingDomainVerificationCronCommand,
            _checkemailingdomainverificationcronjob.CheckEmailingDomainVerificationCronJob,
            _emailgroupaccessservice.EmailGroupAccessService,
            _emailingdomainservice.EmailingDomainService,
            _emailingdomaintenantstatusservice.EmailingDomainTenantStatusService,
            _unsubscribetokenservice.UnsubscribeTokenService,
            _unsubscribecontentservice.UnsubscribeContentService,
            _unsubscribehostnameservice.UnsubscribeHostnameService,
            _emailingdomainresolver.EmailingDomainResolver,
            _emailingdomaindriverfactory.EmailingDomainDriverFactory,
            _emailingdomainworkspacecleanupjob.EmailingDomainWorkspaceCleanupJob,
            _awssesclientprovider.AwsSesClientProvider,
            _awssesaccountservice.AwsSesAccountService,
            _awsseshandleerrorservice.AwsSesHandleErrorService,
            _awssesobservabilityservice.AwsSesObservabilityService,
            _awssesoutboundeventdestinationservice.AwsSesOutboundEventDestinationService,
            _awssesregisterdomainservice.AwsSesRegisterDomainService,
            _awssessendemailservice.AwsSesSendEmailService,
            _logemailingdomaindriverservice.LogEmailingDomainDriver,
            _resendapiclientservice.ResendApiClientService,
            (0, _provideworkspacescopedrepository.provideWorkspaceScopedRepository)(_emailingdomainentity.EmailingDomainEntity)
        ]
    })
], EmailingDomainModule);

//# sourceMappingURL=emailing-domain.module.js.map