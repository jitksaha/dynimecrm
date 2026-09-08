"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "EmailingDomainDriverFactory", {
    enumerable: true,
    get: function() {
        return EmailingDomainDriverFactory;
    }
});
const _common = require("@nestjs/common");
const _guards = require("@sniptt/guards");
const _awssesclientprovider = require("./aws-ses/providers/aws-ses-client.provider");
const _awssesaccountservice = require("./aws-ses/services/aws-ses-account.service");
const _awssesregisterdomainservice = require("./aws-ses/services/aws-ses-register-domain.service");
const _awssesdriverservice = require("./aws-ses/services/aws-ses-driver.service");
const _awsseshandleerrorservice = require("./aws-ses/services/aws-ses-handle-error.service");
const _awssessendemailservice = require("./aws-ses/services/aws-ses-send-email.service");
const _logemailingdomaindriverservice = require("./log/services/log-emailing-domain-driver.service");
const _resendapiclientservice = require("./resend/services/resend-api-client.service");
const _resenddriverservice = require("./resend/services/resend-driver.service");
const _emailingdomaindrivertype = require("./types/emailing-domain-driver.type");
const _emailgroupaccessservice = require("../services/email-group-access.service");
const _unsubscribecontentservice = require("../services/unsubscribe-content.service");
const _dynamicfactorybase = require("../../twenty-config/dynamic-factory.base");
const _configvariablesgroupenum = require("../../twenty-config/enums/config-variables-group.enum");
const _configgrouphashservice = require("../../twenty-config/services/config-group-hash.service");
const _twentyconfigservice = require("../../twenty-config/twenty-config.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let EmailingDomainDriverFactory = class EmailingDomainDriverFactory extends _dynamicfactorybase.DriverFactoryBase {
    getCurrentDriver() {
        this.emailGroupAccessService.validateEmailGroupAccessOrThrow();
        return super.getCurrentDriver();
    }
    buildConfigKey() {
        const driver = this.twentyConfigService.get('EMAILING_DOMAIN_DRIVER');
        switch(driver){
            case _emailingdomaindrivertype.EmailingDomainDriver.AWS_SES:
                {
                    const awsConfigHash = this.configGroupHashService.computeHash(_configvariablesgroupenum.ConfigVariablesGroup.AWS_SES_SETTINGS);
                    return `aws-ses|${awsConfigHash}`;
                }
            case _emailingdomaindrivertype.EmailingDomainDriver.RESEND:
                {
                    const resendConfigHash = this.configGroupHashService.computeHash(_configvariablesgroupenum.ConfigVariablesGroup.RESEND_SETTINGS);
                    return `resend|${resendConfigHash}`;
                }
            case _emailingdomaindrivertype.EmailingDomainDriver.LOG:
                return 'log';
            default:
                throw new Error(`Unsupported emailing domain driver: ${driver}`);
        }
    }
    createDriver() {
        const driver = this.twentyConfigService.get('EMAILING_DOMAIN_DRIVER');
        switch(driver){
            case _emailingdomaindrivertype.EmailingDomainDriver.AWS_SES:
                {
                    const region = this.twentyConfigService.get('AWS_SES_REGION');
                    const accountId = this.twentyConfigService.get('AWS_SES_ACCOUNT_ID');
                    const accessKeyId = this.twentyConfigService.get('AWS_SES_ACCESS_KEY_ID');
                    const secretAccessKey = this.twentyConfigService.get('AWS_SES_SECRET_ACCESS_KEY');
                    const sessionToken = this.twentyConfigService.get('AWS_SES_SESSION_TOKEN');
                    const awsConfig = {
                        driver: _emailingdomaindrivertype.EmailingDomainDriver.AWS_SES,
                        region,
                        accountId,
                        accessKeyId,
                        secretAccessKey,
                        sessionToken
                    };
                    return new _awssesdriverservice.AwsSesDriver(awsConfig, this.awsSesClientProvider, this.awsSesAccountService, this.awsSesHandleErrorService, this.awsSesRegisterDomainService, this.awsSesSendEmailService, this.unsubscribeContentService);
                }
            case _emailingdomaindrivertype.EmailingDomainDriver.RESEND:
                {
                    const domainRegion = this.twentyConfigService.get('RESEND_DOMAIN_REGION');
                    const resendConfig = {
                        driver: _emailingdomaindrivertype.EmailingDomainDriver.RESEND,
                        ...(0, _guards.isNonEmptyString)(domainRegion) ? {
                            domainRegion
                        } : {}
                    };
                    return new _resenddriverservice.ResendDriver(resendConfig, this.resendApiClientService, this.unsubscribeContentService);
                }
            case _emailingdomaindrivertype.EmailingDomainDriver.LOG:
                return this.logEmailingDomainDriver;
            default:
                throw new Error(`Invalid emailing domain driver: ${driver}`);
        }
    }
    constructor(twentyConfigService, configGroupHashService, awsSesClientProvider, awsSesAccountService, awsSesHandleErrorService, awsSesRegisterDomainService, awsSesSendEmailService, logEmailingDomainDriver, resendApiClientService, unsubscribeContentService, emailGroupAccessService){
        super(twentyConfigService, configGroupHashService), this.awsSesClientProvider = awsSesClientProvider, this.awsSesAccountService = awsSesAccountService, this.awsSesHandleErrorService = awsSesHandleErrorService, this.awsSesRegisterDomainService = awsSesRegisterDomainService, this.awsSesSendEmailService = awsSesSendEmailService, this.logEmailingDomainDriver = logEmailingDomainDriver, this.resendApiClientService = resendApiClientService, this.unsubscribeContentService = unsubscribeContentService, this.emailGroupAccessService = emailGroupAccessService;
    }
};
EmailingDomainDriverFactory = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService,
        typeof _configgrouphashservice.ConfigGroupHashService === "undefined" ? Object : _configgrouphashservice.ConfigGroupHashService,
        typeof _awssesclientprovider.AwsSesClientProvider === "undefined" ? Object : _awssesclientprovider.AwsSesClientProvider,
        typeof _awssesaccountservice.AwsSesAccountService === "undefined" ? Object : _awssesaccountservice.AwsSesAccountService,
        typeof _awsseshandleerrorservice.AwsSesHandleErrorService === "undefined" ? Object : _awsseshandleerrorservice.AwsSesHandleErrorService,
        typeof _awssesregisterdomainservice.AwsSesRegisterDomainService === "undefined" ? Object : _awssesregisterdomainservice.AwsSesRegisterDomainService,
        typeof _awssessendemailservice.AwsSesSendEmailService === "undefined" ? Object : _awssessendemailservice.AwsSesSendEmailService,
        typeof _logemailingdomaindriverservice.LogEmailingDomainDriver === "undefined" ? Object : _logemailingdomaindriverservice.LogEmailingDomainDriver,
        typeof _resendapiclientservice.ResendApiClientService === "undefined" ? Object : _resendapiclientservice.ResendApiClientService,
        typeof _unsubscribecontentservice.UnsubscribeContentService === "undefined" ? Object : _unsubscribecontentservice.UnsubscribeContentService,
        typeof _emailgroupaccessservice.EmailGroupAccessService === "undefined" ? Object : _emailgroupaccessservice.EmailGroupAccessService
    ])
], EmailingDomainDriverFactory);

//# sourceMappingURL=emailing-domain-driver.factory.js.map