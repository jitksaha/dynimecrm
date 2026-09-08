"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SubdomainManagerService", {
    enumerable: true,
    get: function() {
        return SubdomainManagerService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _generaterandomsubdomainutil = require("../utils/generate-random-subdomain.util");
const _getsubdomainfromemailutil = require("../utils/get-subdomain-from-email.util");
const _issubdomainvalidutil = require("../utils/is-subdomain-valid.util");
const _twentyconfigservice = require("../../../twenty-config/twenty-config.service");
const _workspaceentity = require("../../../workspace/workspace.entity");
const _workspaceexception = require("../../../workspace/workspace.exception");
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
const SUBDOMAIN_MAX_LENGTH = 30;
const MAX_NUMBERED_SUFFIX_ATTEMPTS = 50;
const MAX_RANDOM_FALLBACK_ATTEMPTS = 10;
const SUBDOMAIN_SUGGESTIONS_COUNT = 3;
let SubdomainManagerService = class SubdomainManagerService {
    async generateSubdomain({ userEmail, workspaceDisplayName }) {
        const extractedSubdomain = (0, _getsubdomainfromemailutil.getSubdomainFromEmail)(userEmail) || (0, _utils.getSubdomainSlugFromDisplayName)(workspaceDisplayName);
        return this.findAvailableSubdomain(extractedSubdomain ?? '');
    }
    async getWorkspaceCreationDefaults(email) {
        const subdomainBase = (0, _getsubdomainfromemailutil.getSubdomainFromEmail)(email);
        if (!(0, _utils.isDefined)(subdomainBase)) {
            return {
                displayName: '',
                subdomain: ''
            };
        }
        return {
            displayName: (0, _utils.capitalize)(subdomainBase),
            subdomain: await this.findAvailableSubdomain(subdomainBase)
        };
    }
    async findAvailableSubdomain(desired) {
        const [availableSubdomain] = await this.findAvailableSubdomains(desired, 1);
        return availableSubdomain;
    }
    async findAvailableSubdomains(desired, count) {
        const derivedBase = (0, _issubdomainvalidutil.isSubdomainValid)(desired) ? desired : (0, _utils.getSubdomainSlugFromDisplayName)(desired);
        const base = (0, _utils.isDefined)(derivedBase) && (0, _issubdomainvalidutil.isSubdomainValid)(derivedBase) ? derivedBase : (0, _generaterandomsubdomainutil.generateRandomSubdomain)();
        const candidates = this.buildSubdomainCandidates(base);
        const availableSubdomains = await this.filterFreeToUseSubdomains(candidates);
        if (availableSubdomains.length === 0) {
            return [
                (0, _generaterandomsubdomainutil.generateRandomSubdomain)()
            ];
        }
        return availableSubdomains.slice(0, count);
    }
    buildSubdomainCandidates(base) {
        const numberedCandidates = Array.from({
            length: MAX_NUMBERED_SUFFIX_ATTEMPTS - 1
        }, (_, index)=>this.appendNumberedSuffix(base, index + 2));
        const randomCandidates = Array.from({
            length: MAX_RANDOM_FALLBACK_ATTEMPTS
        }, ()=>(0, _generaterandomsubdomainutil.generateRandomSubdomain)());
        return [
            ...new Set([
                base,
                ...numberedCandidates,
                ...randomCandidates
            ])
        ];
    }
    async filterFreeToUseSubdomains(candidates) {
        const defaultSubdomain = this.twentyConfigService.get('DEFAULT_SUBDOMAIN');
        const validCandidates = candidates.filter((candidate)=>(0, _issubdomainvalidutil.isSubdomainValid)(candidate) && candidate !== defaultSubdomain);
        if (validCandidates.length === 0) {
            return [];
        }
        const existingWorkspaces = await this.workspaceRepository.find({
            where: {
                subdomain: (0, _typeorm1.In)(validCandidates)
            },
            withDeleted: true,
            select: {
                subdomain: true
            }
        });
        const takenSubdomains = new Set(existingWorkspaces.map((workspace)=>workspace.subdomain));
        return validCandidates.filter((candidate)=>!takenSubdomains.has(candidate));
    }
    async getSubdomainAvailability(subdomain) {
        const isValid = (0, _issubdomainvalidutil.isSubdomainValid)(subdomain);
        const available = isValid && await this.isSubdomainFreeToUse(subdomain);
        // Autofill adopts the first suggestion directly, so never echo an invalid
        // input back.
        const suggestedSubdomains = available ? [
            subdomain
        ] : await this.findAvailableSubdomains(subdomain, SUBDOMAIN_SUGGESTIONS_COUNT);
        return {
            isValid,
            available,
            suggestedSubdomain: suggestedSubdomains[0],
            suggestedSubdomains
        };
    }
    async isSubdomainAvailable(subdomain) {
        const existingWorkspace = await this.workspaceRepository.findOne({
            where: {
                subdomain: subdomain
            },
            withDeleted: true
        });
        return !existingWorkspace;
    }
    async validateSubdomainOrThrow(subdomain) {
        const isValid = (0, _issubdomainvalidutil.isSubdomainValid)(subdomain);
        if (!isValid) {
            throw new _workspaceexception.WorkspaceException('Subdomain is not valid', _workspaceexception.WorkspaceExceptionCode.SUBDOMAIN_NOT_VALID);
        }
        const isAvailable = await this.isSubdomainAvailable(subdomain);
        if (!isAvailable || this.twentyConfigService.get('DEFAULT_SUBDOMAIN') === subdomain) {
            throw new _workspaceexception.WorkspaceException('Subdomain already taken', _workspaceexception.WorkspaceExceptionCode.SUBDOMAIN_ALREADY_TAKEN);
        }
    }
    async isSubdomainFreeToUse(subdomain) {
        return (0, _issubdomainvalidutil.isSubdomainValid)(subdomain) && this.twentyConfigService.get('DEFAULT_SUBDOMAIN') !== subdomain && await this.isSubdomainAvailable(subdomain);
    }
    appendNumberedSuffix(base, suffix) {
        const suffixPart = `-${suffix}`;
        const maxBaseLength = SUBDOMAIN_MAX_LENGTH - suffixPart.length;
        const trimmedBase = base.length > maxBaseLength ? base.slice(0, maxBaseLength).replace(/-+$/g, '') : base;
        return `${trimmedBase}${suffixPart}`;
    }
    constructor(workspaceRepository, twentyConfigService){
        this.workspaceRepository = workspaceRepository;
        this.twentyConfigService = twentyConfigService;
    }
};
SubdomainManagerService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_workspaceentity.WorkspaceEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService
    ])
], SubdomainManagerService);

//# sourceMappingURL=subdomain-manager.service.js.map