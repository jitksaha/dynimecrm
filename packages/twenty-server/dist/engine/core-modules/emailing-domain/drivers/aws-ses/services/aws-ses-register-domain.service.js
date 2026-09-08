"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AwsSesRegisterDomainService", {
    enumerable: true,
    get: function() {
        return AwsSesRegisterDomainService;
    }
});
const _common = require("@nestjs/common");
const _clientsesv2 = require("@aws-sdk/client-sesv2");
const _awsseseventbusnameconstant = require("../constants/aws-ses-event-bus-name.constant");
const _awssesmailfromsubdomainconstant = require("../constants/aws-ses-mail-from-subdomain.constant");
const _awssesclientprovider = require("../providers/aws-ses-client.provider");
const _awssesobservabilityservice = require("./aws-ses-observability.service");
const _awssesoutboundeventdestinationservice = require("./aws-ses-outbound-event-destination.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let AwsSesRegisterDomainService = class AwsSesRegisterDomainService {
    async provisionWorkspaceResources(input, config) {
        const sesClient = this.awsSesClientProvider.getSESClient();
        const eventBusArn = `arn:aws:events:${config.region}:${config.accountId}:event-bus/${_awsseseventbusnameconstant.AWS_SES_EVENT_BUS_NAME}`;
        const configurationSetArn = `arn:aws:ses:${config.region}:${config.accountId}:configuration-set/${input.configurationSetName}`;
        await sesClient.send(new _clientsesv2.CreateConfigurationSetCommand({
            ConfigurationSetName: input.configurationSetName,
            ReputationOptions: {
                ReputationMetricsEnabled: true
            },
            SendingOptions: {
                SendingEnabled: true
            },
            SuppressionOptions: {
                SuppressedReasons: []
            },
            Tags: [
                {
                    Key: 'managed-by',
                    Value: 'twenty'
                }
            ]
        })).catch((error)=>{
            if (!(error instanceof _clientsesv2.AlreadyExistsException)) {
                throw error;
            }
        });
        await sesClient.send(new _clientsesv2.CreateConfigurationSetEventDestinationCommand({
            ConfigurationSetName: input.configurationSetName,
            EventDestinationName: 'twenty-eventbridge',
            EventDestination: {
                Enabled: true,
                MatchingEventTypes: [
                    'SEND',
                    'DELIVERY',
                    'BOUNCE',
                    'COMPLAINT',
                    'REJECT',
                    'RENDERING_FAILURE',
                    'DELIVERY_DELAY',
                    'SUBSCRIPTION'
                ],
                EventBridgeDestination: {
                    EventBusArn: eventBusArn
                }
            }
        })).catch((error)=>{
            if (!(error instanceof _clientsesv2.AlreadyExistsException)) {
                throw error;
            }
        });
        await sesClient.send(new _clientsesv2.CreateTenantResourceAssociationCommand({
            TenantName: input.tenantName,
            ResourceArn: configurationSetArn
        })).catch((error)=>{
            if (!(error instanceof _clientsesv2.AlreadyExistsException)) {
                throw error;
            }
        });
        await this.awsSesOutboundEventDestinationService.upsertEventDestinationOrThrow(input.configurationSetName);
        await this.awsSesObservabilityService.addEventDestination(input.configurationSetName);
        this.logger.log(`Provisioned workspace resources for tenant ${input.tenantName}`);
    }
    async registerDomain(domain) {
        const sesClient = this.awsSesClientProvider.getSESClient();
        await sesClient.send(new _clientsesv2.PutEmailIdentityMailFromAttributesCommand({
            EmailIdentity: domain,
            MailFromDomain: `${_awssesmailfromsubdomainconstant.AWS_SES_MAIL_FROM_SUBDOMAIN}.${domain}`,
            BehaviorOnMxFailure: 'USE_DEFAULT_VALUE'
        }));
        this.logger.log(`Registered MAIL FROM for domain ${domain}`);
    }
    constructor(awsSesClientProvider, awsSesObservabilityService, awsSesOutboundEventDestinationService){
        this.awsSesClientProvider = awsSesClientProvider;
        this.awsSesObservabilityService = awsSesObservabilityService;
        this.awsSesOutboundEventDestinationService = awsSesOutboundEventDestinationService;
        this.logger = new _common.Logger(AwsSesRegisterDomainService.name);
    }
};
AwsSesRegisterDomainService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _awssesclientprovider.AwsSesClientProvider === "undefined" ? Object : _awssesclientprovider.AwsSesClientProvider,
        typeof _awssesobservabilityservice.AwsSesObservabilityService === "undefined" ? Object : _awssesobservabilityservice.AwsSesObservabilityService,
        typeof _awssesoutboundeventdestinationservice.AwsSesOutboundEventDestinationService === "undefined" ? Object : _awssesoutboundeventdestinationservice.AwsSesOutboundEventDestinationService
    ])
], AwsSesRegisterDomainService);

//# sourceMappingURL=aws-ses-register-domain.service.js.map