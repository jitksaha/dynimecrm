"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AwsSesObservabilityService", {
    enumerable: true,
    get: function() {
        return AwsSesObservabilityService;
    }
});
const _common = require("@nestjs/common");
const _clientsesv2 = require("@aws-sdk/client-sesv2");
const _utils = require("twenty-shared/utils");
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
let AwsSesObservabilityService = class AwsSesObservabilityService {
    async addEventDestination(configurationSetName) {
        const tatamiSnsTopicArn = this.twentyConfigService.get('TATAMI_SNS_TOPIC_ARN');
        if (!(0, _utils.isDefined)(tatamiSnsTopicArn)) {
            return;
        }
        const sesClient = this.awsSesClientProvider.getSESClient();
        await sesClient.send(new _clientsesv2.CreateConfigurationSetEventDestinationCommand({
            ConfigurationSetName: configurationSetName,
            EventDestinationName: 'tatami-sns',
            EventDestination: {
                Enabled: true,
                MatchingEventTypes: [
                    'SEND',
                    'DELIVERY',
                    'BOUNCE',
                    'COMPLAINT',
                    'REJECT',
                    'RENDERING_FAILURE',
                    'DELIVERY_DELAY'
                ],
                SnsDestination: {
                    TopicArn: tatamiSnsTopicArn
                }
            }
        })).catch((error)=>{
            if (!(error instanceof _clientsesv2.AlreadyExistsException)) {
                throw error;
            }
        });
    }
    constructor(awsSesClientProvider, twentyConfigService){
        this.awsSesClientProvider = awsSesClientProvider;
        this.twentyConfigService = twentyConfigService;
    }
};
AwsSesObservabilityService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _awssesclientprovider.AwsSesClientProvider === "undefined" ? Object : _awssesclientprovider.AwsSesClientProvider,
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService
    ])
], AwsSesObservabilityService);

//# sourceMappingURL=aws-ses-observability.service.js.map