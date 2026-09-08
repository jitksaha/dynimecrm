"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AwsSesAccountService", {
    enumerable: true,
    get: function() {
        return AwsSesAccountService;
    }
});
const _common = require("@nestjs/common");
const _clientsesv2 = require("@aws-sdk/client-sesv2");
const _awssesclientprovider = require("../providers/aws-ses-client.provider");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let AwsSesAccountService = class AwsSesAccountService {
    async getAccountState() {
        const account = await this.awsSesClientProvider.getSESClient().send(new _clientsesv2.GetAccountCommand({}));
        return {
            isProductionAccessEnabled: account.ProductionAccessEnabled === true
        };
    }
    constructor(awsSesClientProvider){
        this.awsSesClientProvider = awsSesClientProvider;
    }
};
AwsSesAccountService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _awssesclientprovider.AwsSesClientProvider === "undefined" ? Object : _awssesclientprovider.AwsSesClientProvider
    ])
], AwsSesAccountService);

//# sourceMappingURL=aws-ses-account.service.js.map