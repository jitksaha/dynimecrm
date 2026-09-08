"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SesS3InboundEmailMessageSourceService", {
    enumerable: true,
    get: function() {
        return SesS3InboundEmailMessageSourceService;
    }
});
const _common = require("@nestjs/common");
const _filestorageinterface = require("../../../../../../engine/core-modules/file-storage/interfaces/file-storage.interface");
const _twentyconfigservice = require("../../../../../../engine/core-modules/twenty-config/twenty-config.service");
const _inboundemailparserservice = require("../services/inbound-email-parser.service");
const _inboundemailstorageservice = require("../services/inbound-email-storage.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let SesS3InboundEmailMessageSourceService = class SesS3InboundEmailMessageSourceService {
    isConfigured() {
        return this.twentyConfigService.get('STORAGE_TYPE') === _filestorageinterface.StorageDriverType.S_3;
    }
    async fetchMessage(reference) {
        const rawMessage = await this.inboundEmailStorageService.getRawMessage(reference);
        const { message } = await this.inboundEmailParserService.parse(rawMessage, reference);
        return message;
    }
    async cleanup(reference) {
        await this.inboundEmailStorageService.deleteRawMessage(reference);
    }
    constructor(twentyConfigService, inboundEmailStorageService, inboundEmailParserService){
        this.twentyConfigService = twentyConfigService;
        this.inboundEmailStorageService = inboundEmailStorageService;
        this.inboundEmailParserService = inboundEmailParserService;
    }
};
SesS3InboundEmailMessageSourceService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService,
        typeof _inboundemailstorageservice.InboundEmailStorageService === "undefined" ? Object : _inboundemailstorageservice.InboundEmailStorageService,
        typeof _inboundemailparserservice.InboundEmailParserService === "undefined" ? Object : _inboundemailparserservice.InboundEmailParserService
    ])
], SesS3InboundEmailMessageSourceService);

//# sourceMappingURL=ses-s3-inbound-email-message-source.service.js.map