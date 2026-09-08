"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CreateCompanyService", {
    enumerable: true,
    get: function() {
        return CreateCompanyService;
    }
});
const _common = require("@nestjs/common");
const _guards = require("@sniptt/guards");
const _lodashuniqby = /*#__PURE__*/ _interop_require_default(require("lodash.uniqby"));
const _constants = require("twenty-shared/constants");
const _utils = require("twenty-shared/utils");
const _typeorm = require("typeorm");
const _securehttpclientservice = require("../../../engine/core-modules/secure-http-client/secure-http-client.service");
const _workspaceormmanager = require("../../../engine/twenty-orm/workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../engine/twenty-orm/utils/build-system-auth-context.util");
const _companyworkspaceentity = require("../../company/standard-objects/company.workspace-entity");
const _getcompanynamefromdomainnameutil = require("../utils/get-company-name-from-domain-name.util");
const _getdomainnamesfromlinksutil = require("../utils/get-domain-names-from-links.util");
const _computedisplayname = require("../../../utils/compute-display-name");
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
let CreateCompanyService = class CreateCompanyService {
    async createOrRestoreCompanies(companies, workspaceId) {
        if (companies.length === 0) {
            return {};
        }
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        return this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const companyRepository = this.workspaceOrmManager.getRepository(_companyworkspaceentity.CompanyWorkspaceEntity, {
                shouldBypassPermissionChecks: true
            });
            const normalizedCompanies = companies.map((company)=>({
                    ...company,
                    domainName: company.domainName ? (0, _utils.normalizeDomain)(company.domainName) : undefined
                }));
            const uniqueCompanies = (0, _lodashuniqby.default)(normalizedCompanies, 'domainName');
            const domainNames = uniqueCompanies.map((companyToCreate)=>companyToCreate.domainName).filter(_guards.isNonEmptyString);
            if (domainNames.length === 0) {
                return {};
            }
            const companiesMatchedOnPrimaryLink = await companyRepository.find({
                where: {
                    domainName: {
                        primaryLinkUrl: (0, _typeorm.In)(domainNames)
                    }
                },
                withDeleted: true
            });
            const domainNamesWithoutLiveCompany = domainNames.filter((domainName)=>!(0, _utils.isDefined)(this.findExistingCompanyByDomainName({
                    existingCompanies: companiesMatchedOnPrimaryLink.filter((company)=>!(0, _utils.isDefined)(company.deletedAt)),
                    domainName
                })));
            const companiesMatchedOnSecondaryLinks = await this.findCompaniesBySecondaryDomainNames({
                domainNames: domainNamesWithoutLiveCompany
            });
            const companyIdsMatchedOnPrimaryLink = new Set(companiesMatchedOnPrimaryLink.map((company)=>company.id));
            const matchedCompanies = [
                ...companiesMatchedOnPrimaryLink,
                ...companiesMatchedOnSecondaryLinks.filter((company)=>!companyIdsMatchedOnPrimaryLink.has(company.id))
            ];
            const existingCompanies = [
                ...matchedCompanies.filter((company)=>!(0, _utils.isDefined)(company.deletedAt)),
                ...matchedCompanies.filter((company)=>(0, _utils.isDefined)(company.deletedAt))
            ];
            const existingCompanyIdsMap = this.createCompanyMap(existingCompanies);
            const newCompaniesToCreate = uniqueCompanies.filter((company)=>!(0, _utils.isDefined)(this.findExistingCompanyByDomainName({
                    existingCompanies,
                    domainName: company.domainName
                })));
            const companiesToRestore = this.filterCompaniesToRestore(uniqueCompanies, existingCompanies);
            if (newCompaniesToCreate.length === 0 && companiesToRestore.length === 0) {
                return existingCompanyIdsMap;
            }
            let lastCompanyPosition = await this.getLastCompanyPosition(companyRepository);
            const newCompaniesData = await Promise.all(newCompaniesToCreate.map((company)=>this.prepareCompanyData(company, ++lastCompanyPosition)));
            const createdCompanies = await companyRepository.save(newCompaniesData);
            const restoredCompanies = await companyRepository.updateMany(companiesToRestore.map((company)=>{
                return {
                    criteria: company.id,
                    partialEntity: {
                        deletedAt: null
                    }
                };
            }));
            const formattedRestoredCompanies = restoredCompanies.raw.map((row)=>{
                return {
                    id: row.id,
                    domainName: {
                        primaryLinkUrl: row.domainNamePrimaryLinkUrl
                    }
                };
            });
            return {
                ...existingCompanyIdsMap,
                ...createdCompanies.length > 0 ? this.createCompanyMap(createdCompanies) : {},
                ...formattedRestoredCompanies.length > 0 ? this.createCompanyMap(formattedRestoredCompanies) : {}
            };
        }, authContext);
    }
    async findCompaniesBySecondaryDomainNames({ domainNames }) {
        if (domainNames.length === 0) {
            return [];
        }
        const companyRepository = this.workspaceOrmManager.getRepository(_companyworkspaceentity.CompanyWorkspaceEntity, {
            shouldBypassPermissionChecks: true
        });
        const containmentConditions = domainNames.map((_, index)=>`"company"."domainNameSecondaryLinks" @> CAST(:secondaryLink${index} AS jsonb)`).join(' OR ');
        const containmentParameters = Object.fromEntries(domainNames.map((domainName, index)=>[
                `secondaryLink${index}`,
                JSON.stringify([
                    {
                        url: domainName
                    }
                ])
            ]));
        return companyRepository.createQueryBuilder('company').where(containmentConditions, containmentParameters).withDeleted().getMany();
    }
    findExistingCompanyByDomainName({ existingCompanies, domainName }) {
        if (!(0, _guards.isNonEmptyString)(domainName)) {
            return undefined;
        }
        return existingCompanies.find((existingCompany)=>(0, _getdomainnamesfromlinksutil.getDomainNamesFromLinks)(existingCompany.domainName).includes(domainName));
    }
    filterCompaniesToRestore(uniqueCompanies, existingCompanies) {
        return uniqueCompanies.map((company)=>{
            const existingCompany = this.findExistingCompanyByDomainName({
                existingCompanies,
                domainName: company.domainName
            });
            return (0, _utils.isDefined)(existingCompany) ? {
                domainName: company.domainName,
                id: existingCompany.id,
                deletedAt: null
            } : undefined;
        }).filter(_utils.isDefined);
    }
    async prepareCompanyData(company, position) {
        const { name, city } = await this.getCompanyInfoFromDomainName(company.domainName);
        const createdByName = (0, _computedisplayname.computeDisplayName)(company.createdByWorkspaceMember?.name);
        return {
            domainName: {
                primaryLinkUrl: company.domainName ?? ''
            },
            name,
            createdBy: {
                source: company.createdBySource,
                workspaceMemberId: company.createdByWorkspaceMember?.id,
                name: createdByName,
                context: {
                    provider: company.createdByContext.provider
                }
            },
            address: {
                addressCity: city
            },
            position
        };
    }
    createCompanyMap(companies) {
        return companies.reduce((acc, company)=>{
            if (!company.id) {
                return acc;
            }
            for (const domainName of (0, _getdomainnamesfromlinksutil.getDomainNamesFromLinks)(company.domainName)){
                if (!(0, _utils.isDefined)(acc[domainName])) {
                    acc[domainName] = company.id;
                }
            }
            return acc;
        }, {});
    }
    async getLastCompanyPosition(companyRepository) {
        const lastCompanyPosition = await companyRepository.maximum('position', undefined);
        return lastCompanyPosition ?? 0;
    }
    async getCompanyInfoFromDomainName(domainName) {
        try {
            const response = await this.httpService.get(`/${domainName}`);
            const data = response.data;
            return {
                name: data.name ?? (0, _getcompanynamefromdomainnameutil.getCompanyNameFromDomainName)(domainName ?? ''),
                city: data.city
            };
        } catch  {
            return {
                name: (0, _getcompanynamefromdomainnameutil.getCompanyNameFromDomainName)(domainName ?? ''),
                city: ''
            };
        }
    }
    constructor(workspaceOrmManager, secureHttpClientService){
        this.workspaceOrmManager = workspaceOrmManager;
        this.secureHttpClientService = secureHttpClientService;
        this.httpService = this.secureHttpClientService.getHttpClient({
            baseURL: _constants.TWENTY_COMPANIES_BASE_URL
        });
    }
};
CreateCompanyService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager,
        typeof _securehttpclientservice.SecureHttpClientService === "undefined" ? Object : _securehttpclientservice.SecureHttpClientService
    ])
], CreateCompanyService);

//# sourceMappingURL=create-company.service.js.map