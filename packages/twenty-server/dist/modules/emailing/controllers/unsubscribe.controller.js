"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UnsubscribeController", {
    enumerable: true,
    get: function() {
        return UnsubscribeController;
    }
});
const _isunsubscribetokenexpiredutil = require("../../../engine/core-modules/emailing-domain/utils/is-unsubscribe-token-expired.util");
const _common = require("@nestjs/common");
const _guards = require("@sniptt/guards");
const _types = require("twenty-shared/types");
const _unsubscribetokenservice = require("../../../engine/core-modules/emailing-domain/services/unsubscribe-token.service");
const _buildunsubscribepreferencespageutil = require("../../../engine/core-modules/emailing-domain/utils/build-unsubscribe-preferences-page.util");
const _buildunsubscriberesultpageutil = require("../../../engine/core-modules/emailing-domain/utils/build-unsubscribe-result-page.util");
const _nopermissionguard = require("../../../engine/guards/no-permission.guard");
const _publicendpointguard = require("../../../engine/guards/public-endpoint.guard");
const _throttlerexception = require("../../../engine/core-modules/throttler/throttler.exception");
const _throttlerservice = require("../../../engine/core-modules/throttler/throttler.service");
const _throttlertorestapiexceptionhandlerutil = require("../../../engine/core-modules/throttler/utils/throttler-to-rest-api-exception-handler.util");
const _messagesuppressionservice = require("../services/message-suppression.service");
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
const UNSUBSCRIBE_TOKEN_FORMAT = /^[A-Za-z0-9_-]{1,1024}$/;
const UPDATE_PREFERENCES_PATH = `/${_types.ApiPath.Emailing}/unsubscribe/preferences`;
const UNSUBSCRIBE_ALL_PATH = `/${_types.ApiPath.Emailing}/unsubscribe/all`;
const HTML_CONTENT_TYPE = 'text/html; charset=utf-8';
const PREVIEW_RESULT_PAGE = (0, _buildunsubscriberesultpageutil.buildUnsubscribeResultPage)('Preview', 'This is a preview — no changes were saved.');
const RATE_LIMIT = {
    maxRequests: 120,
    windowMs: 60_000
};
const RESUBSCRIBE_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;
let UnsubscribeController = class UnsubscribeController {
    async throttleOrThrow(bucketKey) {
        try {
            await this.throttlerService.tokenBucketThrottleOrThrow(bucketKey, 1, RATE_LIMIT.maxRequests, RATE_LIMIT.windowMs);
        } catch (error) {
            if (error instanceof _throttlerexception.ThrottlerException) {
                (0, _throttlertorestapiexceptionhandlerutil.throttlerToRestApiExceptionHandler)(error);
            }
            throw error;
        }
    }
    async throttleByRequesterOrThrow(request) {
        await this.throttleOrThrow(`unsubscribe:requester:${request.ip ?? 'unknown-requester'}`);
    }
    async throttleByTokenOrThrow(token) {
        await this.throttleOrThrow(`unsubscribe:token:${token}`);
    }
    async handleOneClickUnsubscribe(token, request) {
        await this.throttleByRequesterOrThrow(request);
        const { payload } = this.verifyTokenOrThrow(token);
        await this.throttleByTokenOrThrow(token);
        if (payload.preview === true) {
            return;
        }
        await this.messageSuppressionService.unsubscribeFromEverything({
            workspaceId: payload.workspaceId,
            emailAddress: payload.emailAddress
        });
    }
    async handlePreferencesPage(token, request) {
        await this.throttleByRequesterOrThrow(request);
        const { payload, isExpired } = this.verifyTokenOrThrow(token);
        const topics = isExpired ? [] : await this.messageSuppressionService.getTopicOptOutState({
            workspaceId: payload.workspaceId,
            emailAddress: payload.emailAddress
        });
        return (0, _buildunsubscribepreferencespageutil.buildUnsubscribePreferencesPage)({
            token,
            topics,
            updatePath: UPDATE_PREFERENCES_PATH,
            unsubscribeAllPath: UNSUBSCRIBE_ALL_PATH
        });
    }
    async handleUpdatePreferences(body, request) {
        await this.throttleByRequesterOrThrow(request);
        const { payload, isExpired } = this.verifyTokenOrThrow(body.t);
        if (isExpired) {
            throw new _common.BadRequestException('Expired unsubscribe token');
        }
        if (payload.preview === true) {
            return PREVIEW_RESULT_PAGE;
        }
        await this.messageSuppressionService.setTopicOptOuts({
            workspaceId: payload.workspaceId,
            emailAddress: payload.emailAddress,
            keptTopicIds: this.normalizeTopicIds(body.unsubscribeTopicId),
            canResubscribe: !(0, _isunsubscribetokenexpiredutil.isUnsubscribeTokenExpired)({
                issuedAt: payload.issuedAt,
                now: Date.now(),
                maxAgeMs: RESUBSCRIBE_MAX_AGE_MS
            })
        });
        return (0, _buildunsubscriberesultpageutil.buildUnsubscribeResultPage)('Preferences updated', 'Your email preferences have been saved.');
    }
    async handleUnsubscribeAll(body, request) {
        await this.throttleByRequesterOrThrow(request);
        const { payload } = this.verifyTokenOrThrow(body.t);
        if (payload.preview === true) {
            return PREVIEW_RESULT_PAGE;
        }
        await this.messageSuppressionService.unsubscribeFromEverything({
            workspaceId: payload.workspaceId,
            emailAddress: payload.emailAddress
        });
        return (0, _buildunsubscriberesultpageutil.buildUnsubscribeResultPage)('You have been unsubscribed', 'You will no longer receive marketing emails from this sender.');
    }
    normalizeTopicIds(unsubscribeTopicId) {
        if (Array.isArray(unsubscribeTopicId)) {
            return unsubscribeTopicId.filter(_guards.isNonEmptyString);
        }
        return (0, _guards.isNonEmptyString)(unsubscribeTopicId) ? [
            unsubscribeTopicId
        ] : [];
    }
    verifyTokenOrThrow(token) {
        if (!(0, _guards.isNonEmptyString)(token) || !UNSUBSCRIBE_TOKEN_FORMAT.test(token)) {
            throw new _common.BadRequestException('Malformed unsubscribe token');
        }
        const verification = this.unsubscribeTokenService.verify(token);
        if (verification === null) {
            throw new _common.BadRequestException('Invalid unsubscribe token');
        }
        return verification;
    }
    constructor(unsubscribeTokenService, messageSuppressionService, throttlerService){
        this.unsubscribeTokenService = unsubscribeTokenService;
        this.messageSuppressionService = messageSuppressionService;
        this.throttlerService = throttlerService;
    }
};
_ts_decorate([
    (0, _common.Post)(),
    (0, _common.HttpCode)(200),
    _ts_param(0, (0, _common.Query)('t')),
    _ts_param(1, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof Request === "undefined" ? Object : Request
    ]),
    _ts_metadata("design:returntype", Promise)
], UnsubscribeController.prototype, "handleOneClickUnsubscribe", null);
_ts_decorate([
    (0, _common.Get)(),
    (0, _common.Header)('Content-Type', HTML_CONTENT_TYPE),
    _ts_param(0, (0, _common.Query)('t')),
    _ts_param(1, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof Request === "undefined" ? Object : Request
    ]),
    _ts_metadata("design:returntype", Promise)
], UnsubscribeController.prototype, "handlePreferencesPage", null);
_ts_decorate([
    (0, _common.Post)('preferences'),
    (0, _common.Header)('Content-Type', HTML_CONTENT_TYPE),
    _ts_param(0, (0, _common.Body)()),
    _ts_param(1, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof UnsubscribeFormBody === "undefined" ? Object : UnsubscribeFormBody,
        typeof Request === "undefined" ? Object : Request
    ]),
    _ts_metadata("design:returntype", Promise)
], UnsubscribeController.prototype, "handleUpdatePreferences", null);
_ts_decorate([
    (0, _common.Post)('all'),
    (0, _common.Header)('Content-Type', HTML_CONTENT_TYPE),
    _ts_param(0, (0, _common.Body)()),
    _ts_param(1, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof UnsubscribeFormBody === "undefined" ? Object : UnsubscribeFormBody,
        typeof Request === "undefined" ? Object : Request
    ]),
    _ts_metadata("design:returntype", Promise)
], UnsubscribeController.prototype, "handleUnsubscribeAll", null);
UnsubscribeController = _ts_decorate([
    (0, _common.Controller)(`${_types.ApiPath.Emailing}/unsubscribe`),
    (0, _common.UseGuards)(_publicendpointguard.PublicEndpointGuard, _nopermissionguard.NoPermissionGuard),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _unsubscribetokenservice.UnsubscribeTokenService === "undefined" ? Object : _unsubscribetokenservice.UnsubscribeTokenService,
        typeof _messagesuppressionservice.MessageSuppressionService === "undefined" ? Object : _messagesuppressionservice.MessageSuppressionService,
        typeof _throttlerservice.ThrottlerService === "undefined" ? Object : _throttlerservice.ThrottlerService
    ])
], UnsubscribeController);

//# sourceMappingURL=unsubscribe.controller.js.map