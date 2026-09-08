"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AwsSesOutboundEventDestinationService", {
    enumerable: true,
    get: function() {
        return AwsSesOutboundEventDestinationService;
    }
});
const _common = require("@nestjs/common");
const _clientsesv2 = require("@aws-sdk/client-sesv2");
const _guards = require("@sniptt/guards");
const _awssesclientprovider = require("../providers/aws-ses-client.provider");
const _twentyconfigservice = require("../../../../twenty-config/twenty-config.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const EVENT_DESTINATION_NAME = 'twenty-outbound-sns';
let AwsSesOutboundEventDestinationService = class AwsSesOutboundEventDestinationService {
    async upsertEventDestinationOrThrow(configurationSetName) {
        const topicArn = this.twentyConfigService.get('SES_OUTBOUND_SNS_TOPIC_ARN');
        if (!(0, _guards.isNonEmptyString)(topicArn)) {
            this.logger.warn('SES_OUTBOUND_SNS_TOPIC_ARN is not configured, so delivery, reject and rendering-failure events will not reach the outbound webhook. Bounces and complaints still arrive through the EventBridge subscription.');
            return;
        }
        const eventDestination = {
            Enabled: true,
            MatchingEventTypes: [
                'DELIVERY',
                'BOUNCE',
                'COMPLAINT',
                'REJECT',
                'RENDERING_FAILURE'
            ],
            SnsDestination: {
                TopicArn: topicArn
            }
        };
        const sesClient = this.awsSesClientProvider.getSESClient();
        await sesClient.send(new _clientsesv2.CreateConfigurationSetEventDestinationCommand({
            ConfigurationSetName: configurationSetName,
            EventDestinationName: EVENT_DESTINATION_NAME,
            EventDestination: eventDestination
        })).catch(async (error)=>{
            if (!(error instanceof _clientsesv2.AlreadyExistsException)) {
                throw error;
            }
            await sesClient.send(new _clientsesv2.UpdateConfigurationSetEventDestinationCommand({
                ConfigurationSetName: configurationSetName,
                EventDestinationName: EVENT_DESTINATION_NAME,
                EventDestination: eventDestination
            }));
        });
    }
    constructor(awsSesClientProvider, twentyConfigService){
        this.awsSesClientProvider = awsSesClientProvider;
        this.twentyConfigService = twentyConfigService;
        this.logger = new _common.Logger(AwsSesOutboundEventDestinationService.name);
    }
};
AwsSesOutboundEventDestinationService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _awssesclientprovider.AwsSesClientProvider === "undefined" ? Object : _awssesclientprovider.AwsSesClientProvider,
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService
    ])
], AwsSesOutboundEventDestinationService);

//# sourceMappingURL=aws-ses-outbound-event-destination.service.js.map