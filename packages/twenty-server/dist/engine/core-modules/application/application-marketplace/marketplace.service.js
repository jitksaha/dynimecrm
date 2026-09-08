"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MarketplaceService", {
    enumerable: true,
    get: function() {
        return MarketplaceService;
    }
});
const _common = require("@nestjs/common");
const _axios = /*#__PURE__*/ _interop_require_default(require("axios"));
const _utils = require("twenty-shared/utils");
const _zod = require("zod");
const _buildregistrycdnurlutil = require("./utils/build-registry-cdn-url.util");
const _twentyconfigservice = require("../../twenty-config/twenty-config.service");
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
const MAX_REGISTRY_ASSET_SIZE_BYTES = 10 * 1024 * 1024; // 10Mb
const REGISTRY_SEARCH_PAGE_SIZE = 250;
const REGISTRY_SEARCH_MAX_RESULTS = 10_000;
const REGISTRY_SEARCH_MAX_PAGES = Math.ceil(REGISTRY_SEARCH_MAX_RESULTS / REGISTRY_SEARCH_PAGE_SIZE);
const registrySearchResultSchema = _zod.z.object({
    objects: _zod.z.array(_zod.z.object({
        package: _zod.z.object({
            name: _zod.z.string(),
            version: _zod.z.string(),
            description: _zod.z.string().optional(),
            keywords: _zod.z.array(_zod.z.string()).optional(),
            author: _zod.z.object({
                name: _zod.z.string().optional()
            }).optional(),
            links: _zod.z.object({
                homepage: _zod.z.string().optional(),
                npm: _zod.z.string().optional()
            }).optional()
        })
    })),
    total: _zod.z.number().optional()
});
let MarketplaceService = class MarketplaceService {
    async fetchManifestFromRegistryCdn(packageName, version) {
        const cdnBaseUrl = this.twentyConfigService.get('APP_REGISTRY_CDN_URL');
        const url = (0, _buildregistrycdnurlutil.buildRegistryCdnUrl)({
            cdnBaseUrl,
            packageName,
            version,
            filePath: 'manifest.json'
        });
        try {
            const { data } = await _axios.default.get(url, {
                headers: {
                    'User-Agent': 'Twenty-Marketplace'
                },
                timeout: 5_000
            });
            if (!data?.application) {
                return null;
            }
            return data;
        } catch  {
            this.logger.debug(`Could not fetch manifest from CDN for ${packageName}@${version}`);
            return null;
        }
    }
    async fetchAssetFromRegistryCdn(packageName, version, filePath) {
        const cdnBaseUrl = this.twentyConfigService.get('APP_REGISTRY_CDN_URL');
        const url = (0, _buildregistrycdnurlutil.buildRegistryCdnUrl)({
            cdnBaseUrl,
            packageName,
            version,
            filePath
        });
        try {
            const { data } = await _axios.default.get(url, {
                headers: {
                    'User-Agent': 'Twenty-Marketplace'
                },
                timeout: 10_000,
                responseType: 'arraybuffer',
                maxContentLength: MAX_REGISTRY_ASSET_SIZE_BYTES
            });
            return Buffer.from(data);
        } catch  {
            this.logger.debug(`Could not fetch asset "${filePath}" from CDN for ${packageName}@${version}`);
            return null;
        }
    }
    async fetchAppsFromRegistry() {
        const registryUrl = this.twentyConfigService.get('APP_REGISTRY_URL');
        const packageInfoByName = new Map();
        for(let pageIndex = 0; pageIndex < REGISTRY_SEARCH_MAX_PAGES; pageIndex++){
            const from = pageIndex * REGISTRY_SEARCH_PAGE_SIZE;
            const searchResult = await this.fetchRegistrySearchPage(registryUrl, from);
            if (!(0, _utils.isDefined)(searchResult)) {
                break;
            }
            const { objects, total } = searchResult;
            for (const result of objects){
                const { name, version, description, author, links } = result.package;
                if (!packageInfoByName.has(name)) {
                    packageInfoByName.set(name, {
                        name,
                        version,
                        description: description ?? '',
                        author: author?.name ?? 'Unknown',
                        websiteUrl: links?.homepage ?? links?.npm
                    });
                }
            }
            const fetchedCount = from + objects.length;
            if (objects.length < REGISTRY_SEARCH_PAGE_SIZE || (0, _utils.isDefined)(total) && fetchedCount >= total) {
                break;
            }
            if (pageIndex === REGISTRY_SEARCH_MAX_PAGES - 1) {
                this.logger.warn(`Registry search truncated at ${REGISTRY_SEARCH_MAX_RESULTS} results`);
            }
        }
        return Array.from(packageInfoByName.values());
    }
    async fetchRegistrySearchPage(registryUrl, from) {
        try {
            const { data } = await _axios.default.get(`${registryUrl}/-/v1/search?text=keywords:twenty-app&size=${REGISTRY_SEARCH_PAGE_SIZE}&from=${from}`, {
                headers: {
                    'User-Agent': 'Twenty-Marketplace'
                },
                timeout: 10_000
            });
            const parsed = registrySearchResultSchema.safeParse(data);
            if (!parsed.success) {
                this.logger.warn(`Unexpected registry search response shape: ${parsed.error.message}`);
                return null;
            }
            return parsed.data;
        } catch (error) {
            this.logger.warn(`Failed to fetch apps from registry ${registryUrl}: ${error instanceof Error ? error.message : String(error)}`);
            return null;
        }
    }
    constructor(twentyConfigService){
        this.twentyConfigService = twentyConfigService;
        this.logger = new _common.Logger(MarketplaceService.name);
    }
};
MarketplaceService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService
    ])
], MarketplaceService);

//# sourceMappingURL=marketplace.service.js.map