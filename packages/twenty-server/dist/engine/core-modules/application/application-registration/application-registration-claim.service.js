"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ApplicationRegistrationClaimService", {
    enumerable: true,
    get: function() {
        return ApplicationRegistrationClaimService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _guards = require("@sniptt/guards");
const _axios = /*#__PURE__*/ _interop_require_default(require("axios"));
const _utils = require("twenty-shared/utils");
const _zod = require("zod");
const _applicationregistrationexception = require("./application-registration.exception");
const _applicationregistrationservice = require("./application-registration.service");
const _applicationregistrationsourcetypeenum = require("./enums/application-registration-source-type.enum");
const _jwttokentypeenum = require("../../auth/types/jwt-token-type.enum");
const _jwtwrapperservice = require("../../jwt/services/jwt-wrapper.service");
const _twentyconfigservice = require("../../twenty-config/twenty-config.service");
const _workspaceentity = require("../../workspace/workspace.entity");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
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
const GITHUB_CLAIM_STATE_EXPIRES_IN = '15m';
const attestationsResponseSchema = _zod.z.object({
    attestations: _zod.z.array(_zod.z.object({
        predicateType: _zod.z.string(),
        bundle: _zod.z.object({
            dsseEnvelope: _zod.z.object({
                payload: _zod.z.string()
            })
        })
    }))
});
const provenancePayloadSchema = _zod.z.object({
    predicate: _zod.z.object({
        buildDefinition: _zod.z.object({
            externalParameters: _zod.z.object({
                workflow: _zod.z.object({
                    repository: _zod.z.string()
                }).partial()
            }).partial().optional()
        }).partial().optional(),
        invocation: _zod.z.object({
            configSource: _zod.z.object({
                uri: _zod.z.string()
            }).partial().optional()
        }).partial().optional()
    }).partial()
});
let ApplicationRegistrationClaimService = class ApplicationRegistrationClaimService {
    async buildGithubAuthorizationUrl(params) {
        const registration = await this.applicationRegistrationService.findOneByIdGlobal(params.applicationRegistrationId);
        this.assertClaimable(registration);
        const clientId = this.twentyConfigService.get('APP_CLAIM_GITHUB_CLIENT_ID');
        if (!(0, _guards.isNonEmptyString)(clientId)) {
            throw new _applicationregistrationexception.ApplicationRegistrationException('GitHub OAuth app is not configured (APP_CLAIM_GITHUB_CLIENT_ID)', _applicationregistrationexception.ApplicationRegistrationExceptionCode.CLAIM_NOT_CONFIGURED);
        }
        const statePayload = {
            sub: registration.id,
            type: _jwttokentypeenum.JwtTokenTypeEnum.APPLICATION_REGISTRATION_GITHUB_CLAIM_STATE,
            applicationRegistrationId: registration.id,
            workspaceId: params.workspaceId,
            userId: params.userId
        };
        const state = await this.jwtWrapperService.signAsyncOrThrow(statePayload, {
            expiresIn: GITHUB_CLAIM_STATE_EXPIRES_IN
        });
        const authorizationUrl = new URL('https://github.com/login/oauth/authorize');
        authorizationUrl.searchParams.set('client_id', clientId);
        authorizationUrl.searchParams.set('scope', 'read:org');
        authorizationUrl.searchParams.set('redirect_uri', this.buildCallbackUrl());
        authorizationUrl.searchParams.set('state', state);
        // Always show the account picker: without it GitHub silently reuses the
        // previous authorization, leaving no way to retry with another account.
        authorizationUrl.searchParams.set('prompt', 'select_account');
        return authorizationUrl.toString();
    }
    async verifyClaimState(state) {
        await this.jwtWrapperService.verifyJwtToken(state);
        const payload = this.jwtWrapperService.decode(state);
        if (payload.type !== _jwttokentypeenum.JwtTokenTypeEnum.APPLICATION_REGISTRATION_GITHUB_CLAIM_STATE) {
            throw new _applicationregistrationexception.ApplicationRegistrationException('Invalid claim state token', _applicationregistrationexception.ApplicationRegistrationExceptionCode.GITHUB_AUTH_FAILED);
        }
        return payload;
    }
    async completeGithubClaim(params) {
        const registration = await this.applicationRegistrationService.findOneByIdGlobal(params.statePayload.applicationRegistrationId);
        const sourcePackage = this.assertClaimable(registration);
        const publisherLogin = await this.fetchProvenancePublisherLogin({
            packageName: sourcePackage,
            version: registration.latestAvailableVersion
        });
        const accessToken = await this.exchangeGithubCode(params.code);
        await this.assertGithubOwnership({
            accessToken,
            publisherLogin
        });
        return this.applicationRegistrationService.claimOwnership({
            applicationRegistrationId: registration.id,
            claimingWorkspaceId: params.statePayload.workspaceId
        });
    }
    async findWorkspaceById(workspaceId) {
        return this.workspaceRepository.findOne({
            where: {
                id: workspaceId
            }
        });
    }
    async findClaimsForRegistration(applicationRegistrationId) {
        const registration = await this.applicationRegistrationService.findOneByIdGlobal(applicationRegistrationId);
        if (!(0, _utils.isDefined)(registration.ownerWorkspaceId)) {
            return [];
        }
        const ownerWorkspace = await this.workspaceRepository.findOne({
            where: {
                id: registration.ownerWorkspaceId
            }
        });
        return [
            {
                workspaceId: registration.ownerWorkspaceId,
                workspaceDisplayName: ownerWorkspace?.displayName ?? null
            }
        ];
    }
    assertClaimable(registration) {
        if ((0, _utils.isDefined)(registration.ownerWorkspaceId)) {
            throw new _applicationregistrationexception.ApplicationRegistrationException('Application registration is already owned by a workspace', _applicationregistrationexception.ApplicationRegistrationExceptionCode.APPLICATION_REGISTRATION_ALREADY_OWNED);
        }
        if (registration.sourceType !== _applicationregistrationsourcetypeenum.ApplicationRegistrationSourceType.NPM || !(0, _utils.isDefined)(registration.sourcePackage)) {
            throw new _applicationregistrationexception.ApplicationRegistrationException('Only npm-sourced applications can be claimed', _applicationregistrationexception.ApplicationRegistrationExceptionCode.CLAIM_NOT_SUPPORTED);
        }
        return registration.sourcePackage;
    }
    buildCallbackUrl() {
        const serverUrl = this.twentyConfigService.get('SERVER_URL');
        return `${serverUrl}/application-registration-claim/github/callback`;
    }
    async fetchProvenancePublisherLogin(params) {
        const registryUrl = this.twentyConfigService.get('APP_REGISTRY_URL');
        const version = params.version ?? await this.fetchLatestVersion(registryUrl, params.packageName);
        // Scoped packages need their slash percent-encoded for the registry path.
        const encodedName = params.packageName.replace(/\//g, '%2F');
        let data;
        try {
            const response = await _axios.default.get(`${registryUrl}/-/npm/v1/attestations/${encodedName}@${version}`, {
                headers: {
                    'User-Agent': 'Twenty-Marketplace'
                },
                timeout: 10_000
            });
            data = response.data;
        } catch (error) {
            if (_axios.default.isAxiosError(error) && (0, _utils.isDefined)(error.response) && error.response.status === 404) {
                throw new _applicationregistrationexception.ApplicationRegistrationException(`No provenance attestation found for ${params.packageName}@${version}`, _applicationregistrationexception.ApplicationRegistrationExceptionCode.PROVENANCE_NOT_FOUND);
            }
            this.logger.warn(`Failed to fetch attestations for ${params.packageName}@${version}: ${error instanceof Error ? error.message : String(error)}`);
            throw new _applicationregistrationexception.ApplicationRegistrationException(`Could not reach the package registry to verify provenance for ${params.packageName}`, _applicationregistrationexception.ApplicationRegistrationExceptionCode.PROVENANCE_CHECK_UNAVAILABLE);
        }
        const repositoryUrl = this.extractProvenanceRepositoryUrl(data);
        const match = repositoryUrl?.match(/(?:^|\/\/|@)github\.com[/:]([^/]+)\/[^/@]+/i);
        if (!(0, _utils.isDefined)(match)) {
            throw new _applicationregistrationexception.ApplicationRegistrationException(`No GitHub source repository found in the provenance of ${params.packageName}@${version}`, _applicationregistrationexception.ApplicationRegistrationExceptionCode.PROVENANCE_NOT_FOUND);
        }
        return match[1];
    }
    extractProvenanceRepositoryUrl(data) {
        const parsed = attestationsResponseSchema.safeParse(data);
        if (!parsed.success) {
            return null;
        }
        for (const attestation of parsed.data.attestations){
            if (!attestation.predicateType.includes('slsa.dev/provenance')) {
                continue;
            }
            try {
                const payload = provenancePayloadSchema.parse(JSON.parse(Buffer.from(attestation.bundle.dsseEnvelope.payload, 'base64').toString('utf-8')));
                const repository = payload.predicate.buildDefinition?.externalParameters?.workflow?.repository ?? payload.predicate.invocation?.configSource?.uri;
                if ((0, _guards.isNonEmptyString)(repository)) {
                    return repository;
                }
            } catch  {
                continue;
            }
        }
        return null;
    }
    async fetchLatestVersion(registryUrl, packageName) {
        const encodedName = packageName.replace(/\//g, '%2F');
        try {
            const { data } = await _axios.default.get(`${registryUrl}/${encodedName}/latest`, {
                headers: {
                    'User-Agent': 'Twenty-Marketplace'
                },
                timeout: 10_000
            });
            const version = _zod.z.object({
                version: _zod.z.string()
            }).parse(data).version;
            return version;
        } catch  {
            throw new _applicationregistrationexception.ApplicationRegistrationException(`Could not resolve the latest published version of ${packageName}`, _applicationregistrationexception.ApplicationRegistrationExceptionCode.PROVENANCE_CHECK_UNAVAILABLE);
        }
    }
    async exchangeGithubCode(code) {
        const clientId = this.twentyConfigService.get('APP_CLAIM_GITHUB_CLIENT_ID');
        const clientSecret = this.twentyConfigService.get('APP_CLAIM_GITHUB_CLIENT_SECRET');
        if (!(0, _guards.isNonEmptyString)(clientId) || !(0, _guards.isNonEmptyString)(clientSecret)) {
            throw new _applicationregistrationexception.ApplicationRegistrationException('GitHub OAuth app is not configured', _applicationregistrationexception.ApplicationRegistrationExceptionCode.CLAIM_NOT_CONFIGURED);
        }
        try {
            const { data } = await _axios.default.post('https://github.com/login/oauth/access_token', {
                client_id: clientId,
                client_secret: clientSecret,
                code
            }, {
                headers: {
                    Accept: 'application/json'
                },
                timeout: 10_000
            });
            const accessToken = _zod.z.object({
                access_token: _zod.z.string()
            }).parse(data).access_token;
            return accessToken;
        } catch (error) {
            this.logger.warn(`GitHub code exchange failed: ${error instanceof Error ? error.message : String(error)}`);
            throw new _applicationregistrationexception.ApplicationRegistrationException('GitHub authentication failed', _applicationregistrationexception.ApplicationRegistrationExceptionCode.GITHUB_AUTH_FAILED);
        }
    }
    async assertGithubOwnership(params) {
        const headers = {
            Authorization: `Bearer ${params.accessToken}`,
            Accept: 'application/vnd.github+json',
            'User-Agent': 'Twenty-Marketplace'
        };
        let viewerLogin;
        try {
            const { data } = await _axios.default.get('https://api.github.com/user', {
                headers,
                timeout: 10_000
            });
            viewerLogin = _zod.z.object({
                login: _zod.z.string()
            }).parse(data).login;
        } catch (error) {
            this.logger.warn(`GitHub user lookup failed: ${error instanceof Error ? error.message : String(error)}`);
            throw new _applicationregistrationexception.ApplicationRegistrationException('GitHub authentication failed', _applicationregistrationexception.ApplicationRegistrationExceptionCode.GITHUB_AUTH_FAILED);
        }
        if (viewerLogin.toLowerCase() === params.publisherLogin.toLowerCase()) {
            return;
        }
        try {
            const { data } = await _axios.default.get(`https://api.github.com/user/memberships/orgs/${params.publisherLogin}`, {
                headers,
                timeout: 10_000
            });
            const membership = _zod.z.object({
                state: _zod.z.string(),
                role: _zod.z.string()
            }).parse(data);
            if (membership.state === 'active' && membership.role === 'admin') {
                return;
            }
        } catch  {
        // 404 means the user is not a member of the organization; fall through
        // to the ownership error below.
        }
        throw new _applicationregistrationexception.ApplicationRegistrationException(`The connected GitHub account is not an owner of ${params.publisherLogin}`, _applicationregistrationexception.ApplicationRegistrationExceptionCode.GITHUB_ORG_OWNERSHIP_REQUIRED);
    }
    constructor(workspaceRepository, applicationRegistrationService, jwtWrapperService, twentyConfigService){
        this.workspaceRepository = workspaceRepository;
        this.applicationRegistrationService = applicationRegistrationService;
        this.jwtWrapperService = jwtWrapperService;
        this.twentyConfigService = twentyConfigService;
        this.logger = new _common.Logger(ApplicationRegistrationClaimService.name);
    }
};
ApplicationRegistrationClaimService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_workspaceentity.WorkspaceEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof Repository === "undefined" ? Object : Repository,
        typeof _applicationregistrationservice.ApplicationRegistrationService === "undefined" ? Object : _applicationregistrationservice.ApplicationRegistrationService,
        typeof _jwtwrapperservice.JwtWrapperService === "undefined" ? Object : _jwtwrapperservice.JwtWrapperService,
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService
    ])
], ApplicationRegistrationClaimService);

//# sourceMappingURL=application-registration-claim.service.js.map