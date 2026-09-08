"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ApplicationRegistrationService", {
    enumerable: true,
    get: function() {
        return ApplicationRegistrationService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _crypto = /*#__PURE__*/ _interop_require_default(require("crypto"));
const _guards = require("@sniptt/guards");
const _bcrypt = /*#__PURE__*/ _interop_require_wildcard(require("bcrypt"));
const _utils = require("twenty-shared/utils");
const _workspace = require("twenty-shared/workspace");
const _typeorm1 = require("typeorm");
const _uuid = require("uuid");
const _coreentitycacheservice = require("../../../core-entity-cache/services/core-entity-cache.service");
const _shouldrefreshapplicationregistrationoninstallutil = require("../application-install/utils/should-refresh-application-registration-on-install.util");
const _marketplaceappscacheconstant = require("../application-marketplace/constants/marketplace-apps-cache.constant");
const _marketplacevettedapplicationsconstant = require("../application-marketplace/constants/marketplace-vetted-applications.constant");
const _oauthscopes = require("../application-oauth/constants/oauth-scopes");
const _applicationregistrationvariableservice = require("../application-registration-variable/application-registration-variable.service");
const _applicationregistrationasseturlservice = require("./application-registration-asset-url.service");
const _applicationregistrationentity = require("./application-registration.entity");
const _applicationregistrationexception = require("./application-registration.exception");
const _applicationregistrationsourcetypeenum = require("./enums/application-registration-source-type.enum");
const _buildregistrationmanifestupdatefieldsutil = require("./utils/build-registration-manifest-update-fields.util");
const _frommanifestapplicationtodisplayfieldsutil = require("./utils/from-manifest-application-to-display-fields.util");
const _applicationentity = require("../application.entity");
const _upgradeapplicationsjobconstants = require("../jobs/upgrade-applications.job-constants");
const _validateredirecturiutil = require("../../auth/utils/validate-redirect-uri.util");
const _cachelockservice = require("../../cache-lock/cache-lock.service");
const _messagequeuedecorator = require("../../message-queue/decorators/message-queue.decorator");
const _messagequeueconstants = require("../../message-queue/message-queue.constants");
const _messagequeueservice = require("../../message-queue/services/message-queue.service");
const _serverfilestorageservice = require("../../file-storage/services/server-file-storage.service");
const _metricsservice = require("../../metrics/metrics.service");
const _metricskeystype = require("../../metrics/types/metrics-keys.type");
const _workspaceentity = require("../../workspace/workspace.entity");
const _twentycliapplicationregistrationconstant = require("../../../workspace-manager/twenty-standard-application/constants/twenty-cli-application-registration.constant");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
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
const BCRYPT_SALT_ROUNDS = 10;
const MAX_APPLICATION_REGISTRATIONS_PAGE_SIZE = 100;
const APPLICATION_REGISTRATION_UPDATE_LOCK_OPTIONS = {
    ttl: 60_000,
    ms: 500,
    maxRetries: 120
};
const APPLICATION_REGISTRATION_WITHOUT_MANIFEST_SELECT = [
    'id',
    'universalIdentifier',
    'name',
    'oAuthClientId',
    'oAuthRedirectUris',
    'oAuthScopes',
    'createdByUserId',
    'ownerWorkspaceId',
    'sourceType',
    'sourcePackage',
    'tarballFileId',
    'latestAvailableVersion',
    'isListed',
    'isVetted',
    'isPreInstalled',
    'logo',
    'logoFileId',
    'description',
    'author',
    'category',
    'websiteUrl',
    'aboutDescription',
    'termsUrl',
    'emailSupport',
    'issueReportUrl',
    'screenshots',
    'galleryImages',
    'createdAt',
    'updatedAt'
];
let ApplicationRegistrationService = class ApplicationRegistrationService {
    // Best-effort: a queue outage must not fail the publish flow that
    // triggered the upgrade.
    async enqueueAutoUpgradeApplications(applicationRegistrationId) {
        try {
            await this.workspaceQueueService.add(_upgradeapplicationsjobconstants.UPGRADE_APPLICATIONS_JOB_NAME, {
                applicationRegistrationId,
                onlyAutoUpgrade: true
            });
        } catch (error) {
            this.logger.error(`Failed to enqueue auto-upgrade for registration ${applicationRegistrationId}`, error);
        }
    }
    async invalidateMarketplaceAppsCache() {
        try {
            await this.coreEntityCacheService.invalidate('marketplaceCatalog', _marketplaceappscacheconstant.MARKETPLACE_CATALOG_CACHE_ENTITY_ID);
        } catch (error) {
            this.logger.error('Failed to invalidate marketplace apps cache', error);
        }
    }
    emitRegistrationPublishMetric({ isNewRegistration, universalIdentifier, name, sourceType, version }) {
        this.metricsService.incrementCounterBy({
            key: isNewRegistration ? _metricskeystype.MetricsKeys.AppRegistrationCreated : _metricskeystype.MetricsKeys.AppRegistrationVersionPublished,
            amount: 1,
            attributes: {
                universal_identifier: universalIdentifier,
                app_name: name,
                source_type: sourceType,
                version: version ?? 'unknown'
            }
        });
    }
    async setLatestAvailableVersionIfChanged(applicationRegistrationId, newVersion) {
        const result = await this.applicationRegistrationRepository.createQueryBuilder().update(_applicationregistrationentity.ApplicationRegistrationEntity).set({
            latestAvailableVersion: newVersion
        }).where('id = :id', {
            id: applicationRegistrationId
        }).andWhere('"latestAvailableVersion" IS DISTINCT FROM :newVersion', {
            newVersion
        }).execute();
        return (result.affected ?? 0) > 0;
    }
    async findMany(ownerWorkspaceId) {
        return this.applicationRegistrationRepository.find({
            select: APPLICATION_REGISTRATION_WITHOUT_MANIFEST_SELECT,
            where: {
                ownerWorkspaceId
            },
            order: {
                createdAt: 'DESC'
            }
        });
    }
    async findAll({ limit, offset, searchTerm, isPreInstalledOnly, sourceTypes, isListed, isConfigured }) {
        const safeLimit = Math.min(Math.max(limit, 1), MAX_APPLICATION_REGISTRATIONS_PAGE_SIZE);
        const safeOffset = Math.max(offset, 0);
        const trimmedSearch = searchTerm?.trim();
        const queryBuilder = this.applicationRegistrationRepository.createQueryBuilder('registration').select(APPLICATION_REGISTRATION_WITHOUT_MANIFEST_SELECT.map((column)=>`registration.${column}`)).orderBy('registration.createdAt', 'DESC').addOrderBy('registration.id', 'ASC');
        if (isPreInstalledOnly === true) {
            queryBuilder.andWhere('registration."isPreInstalled" = true');
        }
        if ((0, _utils.isNonEmptyArray)(sourceTypes)) {
            queryBuilder.andWhere('registration."sourceType" IN (:...sourceTypes)', {
                sourceTypes
            });
        }
        if ((0, _utils.isDefined)(isListed)) {
            queryBuilder.andWhere('registration."isListed" = :isListed', {
                isListed
            });
        }
        if ((0, _utils.isDefined)(trimmedSearch) && trimmedSearch.length > 0) {
            queryBuilder.andWhere(`(registration.name ILIKE :searchTerm
          OR registration."sourcePackage" ILIKE :searchTerm
          OR registration."universalIdentifier"::text ILIKE :searchTerm)`, {
                searchTerm: `%${trimmedSearch}%`
            });
        }
        // Configuration status is computed from variables and installs, not stored
        // on the registration, so this filter paginates in memory.
        if ((0, _utils.isDefined)(isConfigured)) {
            const allRegistrations = await queryBuilder.getMany();
            const configuredStatuses = await this.applicationRegistrationVariableService.isConfiguredBatch(allRegistrations.map((registration)=>registration.id));
            const filteredRegistrations = allRegistrations.filter((registration)=>(configuredStatuses.get(registration.id) ?? false) === isConfigured);
            return {
                registrations: filteredRegistrations.slice(safeOffset, safeOffset + safeLimit),
                totalCount: filteredRegistrations.length,
                hasMore: safeOffset + safeLimit < filteredRegistrations.length
            };
        }
        const [registrations, totalCount] = await queryBuilder.skip(safeOffset).take(safeLimit).getManyAndCount();
        return {
            registrations,
            totalCount,
            hasMore: safeOffset + registrations.length < totalCount
        };
    }
    async findOneById(id, ownerWorkspaceId) {
        const registration = await this.applicationRegistrationRepository.findOne({
            select: APPLICATION_REGISTRATION_WITHOUT_MANIFEST_SELECT,
            where: {
                id,
                ownerWorkspaceId
            }
        });
        if (!registration) {
            throw new _applicationregistrationexception.ApplicationRegistrationException(`Application registration with id ${id} not found`, _applicationregistrationexception.ApplicationRegistrationExceptionCode.APPLICATION_REGISTRATION_NOT_FOUND);
        }
        return registration;
    }
    async findOneByIdGlobal(id) {
        const registration = await this.applicationRegistrationRepository.findOne({
            select: APPLICATION_REGISTRATION_WITHOUT_MANIFEST_SELECT,
            where: {
                id
            }
        });
        if (!registration) {
            throw new _applicationregistrationexception.ApplicationRegistrationException(`Application registration with id ${id} not found`, _applicationregistrationexception.ApplicationRegistrationExceptionCode.APPLICATION_REGISTRATION_NOT_FOUND);
        }
        return registration;
    }
    // Global lookup — used by OAuth flow (no workspace scoping)
    async findOneByClientId(clientId) {
        return this.applicationRegistrationRepository.findOne({
            where: {
                oAuthClientId: clientId
            }
        });
    }
    // Global lookup — used by OAuth authorize page (no workspace scoping)
    async findPublicByClientId(clientId) {
        const registration = await this.applicationRegistrationRepository.findOne({
            where: {
                oAuthClientId: clientId
            },
            select: [
                'id',
                'name',
                'logo',
                'logoFileId',
                'sourceType',
                'sourcePackage',
                'latestAvailableVersion',
                'websiteUrl',
                'oAuthScopes'
            ]
        });
        if (!registration) {
            return null;
        }
        return {
            id: registration.id,
            name: registration.name,
            logoUrl: this.applicationRegistrationAssetUrlService.buildLogoUrl(registration),
            websiteUrl: registration.websiteUrl,
            oAuthScopes: registration.oAuthScopes
        };
    }
    async findOneByUniversalIdentifier(universalIdentifier) {
        return this.applicationRegistrationRepository.findOne({
            where: {
                universalIdentifier
            }
        });
    }
    async create(input, ownerWorkspaceId, createdByUserId) {
        const universalIdentifier = input.universalIdentifier ?? (0, _uuid.v4)();
        const existingByUid = await this.findOneByUniversalIdentifier(universalIdentifier);
        if (existingByUid) {
            throw new _applicationregistrationexception.ApplicationRegistrationException(`Universal identifier ${universalIdentifier} is already claimed`, _applicationregistrationexception.ApplicationRegistrationExceptionCode.UNIVERSAL_IDENTIFIER_ALREADY_CLAIMED);
        }
        if ((0, _utils.isDefined)(input.oAuthRedirectUris)) {
            this.validateRedirectUris(input.oAuthRedirectUris);
        }
        if ((0, _utils.isDefined)(input.oAuthScopes)) {
            this.validateScopes(input.oAuthScopes);
        }
        const clientId = (0, _uuid.v4)();
        const { clientSecret, clientSecretHash } = await this.generateClientSecret();
        const applicationRegistration = this.applicationRegistrationRepository.create({
            universalIdentifier,
            name: input.name,
            oAuthClientId: clientId,
            oAuthClientSecretHash: clientSecretHash,
            oAuthRedirectUris: input.oAuthRedirectUris ?? [],
            oAuthScopes: input.oAuthScopes ?? [],
            createdByUserId,
            ownerWorkspaceId
        });
        const saved = await this.applicationRegistrationRepository.save(applicationRegistration);
        await this.invalidateMarketplaceAppsCache();
        return {
            applicationRegistration: saved,
            clientSecret
        };
    }
    async update(input, ownerWorkspaceId) {
        const { id, update } = input;
        await this.findOneById(id, ownerWorkspaceId);
        await this.applyUpdate(id, update);
        return this.findOneById(id, ownerWorkspaceId);
    }
    async updateGlobal(input) {
        const { id, update } = input;
        await this.findOneByIdGlobal(id);
        await this.applyUpdate(id, update);
        return this.findOneByIdGlobal(id);
    }
    async applyUpdate(id, update) {
        if ((0, _utils.isDefined)(update.oAuthRedirectUris)) {
            this.validateRedirectUris(update.oAuthRedirectUris);
        }
        if ((0, _utils.isDefined)(update.oAuthScopes)) {
            this.validateScopes(update.oAuthScopes);
        }
        const updateData = {};
        if ((0, _utils.isDefined)(update.name)) updateData.name = update.name;
        if ((0, _utils.isDefined)(update.oAuthRedirectUris)) updateData.oAuthRedirectUris = update.oAuthRedirectUris;
        if ((0, _utils.isDefined)(update.oAuthScopes)) updateData.oAuthScopes = update.oAuthScopes;
        if ((0, _utils.isDefined)(update.isListed)) updateData.isListed = update.isListed;
        if ((0, _utils.isDefined)(update.isPreInstalled)) updateData.isPreInstalled = update.isPreInstalled;
        if ((0, _utils.isDefined)(update.isVetted)) updateData.isVetted = update.isVetted;
        if (Object.keys(updateData).length > 0) {
            await this.applicationRegistrationRepository.update(id, updateData);
            await this.invalidateMarketplaceAppsCache();
        }
    }
    async updateFromManifest({ applicationRegistrationId, manifest, sourceType, latestAvailableVersion, preventVersionDowngrade = false, additionalFields }) {
        return this.cacheLockService.withLock(async ()=>{
            const existing = await this.applicationRegistrationRepository.findOneOrFail({
                where: {
                    id: applicationRegistrationId
                }
            });
            if (preventVersionDowngrade && (0, _utils.isDefined)(latestAvailableVersion) && !(0, _shouldrefreshapplicationregistrationoninstallutil.shouldRefreshApplicationRegistrationOnInstall)({
                installedVersion: latestAvailableVersion,
                latestAvailableVersion: existing.latestAvailableVersion
            })) {
                this.logger.log(`Skipping registration update for ${existing.universalIdentifier}: version ${latestAvailableVersion} is older than latest available version ${existing.latestAvailableVersion}`);
                return false;
            }
            const manifestUpdateFields = (0, _buildregistrationmanifestupdatefieldsutil.buildRegistrationManifestUpdateFields)({
                manifestApplication: manifest.application,
                existingGalleryImages: existing.galleryImages
            });
            // The stored logo file belongs to the previous logo path.
            const hasLogoPathChanged = (manifestUpdateFields.logo ?? null) !== (existing.logo ?? null);
            // Partial update in one transaction: the row and its variable schemas
            // stay on the same manifest without clobbering columns written by
            // flows outside this lock.
            await this.applicationRegistrationRepository.manager.transaction(async (entityManager)=>{
                await entityManager.getRepository(_applicationregistrationentity.ApplicationRegistrationEntity).update(applicationRegistrationId, {
                    name: manifest.application?.displayName ?? existing.name,
                    manifest,
                    ...manifestUpdateFields,
                    ...hasLogoPathChanged && {
                        logoFileId: null
                    },
                    ...sourceType !== undefined && {
                        sourceType
                    },
                    ...latestAvailableVersion !== undefined && {
                        latestAvailableVersion
                    },
                    ...additionalFields
                });
                if ((0, _utils.isDefined)(manifest.application?.serverVariables)) {
                    await this.applicationRegistrationVariableService.syncVariableSchemas(applicationRegistrationId, manifest.application.serverVariables, entityManager);
                }
            });
            await this.invalidateMarketplaceAppsCache();
            return true;
        }, `application-registration-update:${applicationRegistrationId}`, APPLICATION_REGISTRATION_UPDATE_LOCK_OPTIONS);
    }
    async delete(id, ownerWorkspaceId) {
        await this.findOneById(id, ownerWorkspaceId);
        // Stored assets (logo, gallery images) go with the registration; deleting
        // them first also removes the bytes, which the row FK cascade cannot do.
        try {
            await this.serverFileStorageService.deleteByApplicationRegistrationId(id);
        } catch (error) {
            this.logger.error(`Failed to delete server files for registration ${id}`, error);
        }
        await this.applicationRegistrationRepository.delete(id);
        await this.invalidateMarketplaceAppsCache();
        return true;
    }
    async rotateClientSecret(id, ownerWorkspaceId) {
        await this.findOneById(id, ownerWorkspaceId);
        const { clientSecret, clientSecretHash } = await this.generateClientSecret();
        await this.applicationRegistrationRepository.update(id, {
            oAuthClientSecretHash: clientSecretHash
        });
        await this.invalidateMarketplaceAppsCache();
        return clientSecret;
    }
    async verifyClientSecret(registration, clientSecret) {
        if (!registration.oAuthClientSecretHash) {
            return false;
        }
        return _bcrypt.compare(clientSecret, registration.oAuthClientSecretHash);
    }
    async upsertFromCatalog(params) {
        const existing = await this.findOneByUniversalIdentifier(params.universalIdentifier);
        const vettedIdentifiers = new Set(_marketplacevettedapplicationsconstant.MARKETPLACE_VETTED_APPLICATIONS.map((entry)=>entry.universalIdentifier));
        const isVetted = vettedIdentifiers.has(params.universalIdentifier);
        if ((0, _utils.isDefined)(existing) && (0, _utils.isDefined)(params.manifest)) {
            const isNewVersion = await this.setLatestAvailableVersionIfChanged(existing.id, params.latestAvailableVersion ?? null);
            await this.updateFromManifest({
                applicationRegistrationId: existing.id,
                manifest: params.manifest,
                sourceType: params.sourceType,
                latestAvailableVersion: params.latestAvailableVersion,
                additionalFields: {
                    name: params.name,
                    sourcePackage: params.sourcePackage,
                    isVetted
                }
            });
            if (isNewVersion) {
                this.emitRegistrationPublishMetric({
                    isNewRegistration: false,
                    universalIdentifier: params.universalIdentifier,
                    name: params.name,
                    sourceType: params.sourceType,
                    version: params.latestAvailableVersion
                });
                await this.enqueueAutoUpgradeApplications(existing.id);
            }
            return;
        }
        if ((0, _utils.isDefined)(existing)) {
            const isNewVersion = await this.setLatestAvailableVersionIfChanged(existing.id, params.latestAvailableVersion ?? null);
            // A registration first created by a local install (CLI dev / tarball
            // upload) starts unlisted on purpose. Once the catalog source serves the
            // same universalIdentifier, surface it in the marketplace — while
            // preserving an operator's decision to delist a registry-sourced app.
            const isRelistedFromLocalSource = existing.sourceType === _applicationregistrationsourcetypeenum.ApplicationRegistrationSourceType.TARBALL || existing.sourceType === _applicationregistrationsourcetypeenum.ApplicationRegistrationSourceType.LOCAL;
            await this.applicationRegistrationRepository.save({
                ...existing,
                name: params.name,
                sourceType: params.sourceType,
                sourcePackage: params.sourcePackage,
                latestAvailableVersion: params.latestAvailableVersion,
                isListed: existing.isListed || isRelistedFromLocalSource,
                isVetted,
                manifest: params.manifest,
                ...(0, _frommanifestapplicationtodisplayfieldsutil.fromManifestApplicationToDisplayFields)(params.manifest?.application)
            });
            await this.invalidateMarketplaceAppsCache();
            if (isNewVersion) {
                this.emitRegistrationPublishMetric({
                    isNewRegistration: false,
                    universalIdentifier: params.universalIdentifier,
                    name: params.name,
                    sourceType: params.sourceType,
                    version: params.latestAvailableVersion
                });
                await this.enqueueAutoUpgradeApplications(existing.id);
            }
            return;
        }
        const registration = this.applicationRegistrationRepository.create({
            universalIdentifier: params.universalIdentifier,
            name: params.name,
            sourceType: params.sourceType,
            sourcePackage: params.sourcePackage,
            latestAvailableVersion: params.latestAvailableVersion,
            isListed: true,
            isVetted,
            manifest: params.manifest,
            ...(0, _frommanifestapplicationtodisplayfieldsutil.fromManifestApplicationToDisplayFields)(params.manifest?.application),
            oAuthClientId: (0, _uuid.v4)(),
            oAuthRedirectUris: [],
            oAuthScopes: [],
            ownerWorkspaceId: null
        });
        await this.applicationRegistrationRepository.save(registration);
        this.emitRegistrationPublishMetric({
            isNewRegistration: true,
            universalIdentifier: params.universalIdentifier,
            name: params.name,
            sourceType: params.sourceType,
            version: params.latestAvailableVersion
        });
        await this.invalidateMarketplaceAppsCache();
        if (!(0, _utils.isDefined)(params.manifest?.application?.serverVariables)) {
            return;
        }
        await this.applicationRegistrationVariableService.syncVariableSchemas(registration.id, params.manifest.application.serverVariables);
    }
    async createCliRegistrationIfNotExists() {
        const existing = await this.findOneByUniversalIdentifier(_twentycliapplicationregistrationconstant.TWENTY_CLI_APPLICATION_REGISTRATION.universalIdentifier);
        if ((0, _utils.isDefined)(existing)) {
            return null;
        }
        const registration = this.applicationRegistrationRepository.create({
            universalIdentifier: _twentycliapplicationregistrationconstant.TWENTY_CLI_APPLICATION_REGISTRATION.universalIdentifier,
            name: _twentycliapplicationregistrationconstant.TWENTY_CLI_APPLICATION_REGISTRATION.name,
            oAuthClientId: (0, _uuid.v4)(),
            oAuthClientSecretHash: null,
            oAuthRedirectUris: [],
            oAuthScopes: _twentycliapplicationregistrationconstant.TWENTY_CLI_APPLICATION_REGISTRATION.oAuthScopes,
            ownerWorkspaceId: null,
            sourceType: _applicationregistrationsourcetypeenum.ApplicationRegistrationSourceType.OAUTH_ONLY,
            createdByUserId: null
        });
        const saved = await this.applicationRegistrationRepository.save(registration);
        await this.invalidateMarketplaceAppsCache();
        return saved;
    }
    async findManyListedCatalogCards() {
        const registrations = await this.applicationRegistrationRepository.find({
            select: [
                'id',
                'universalIdentifier',
                'name',
                'sourceType',
                'sourcePackage',
                'latestAvailableVersion',
                'isVetted',
                'logo',
                'logoFileId',
                'description',
                'author',
                'category'
            ],
            where: {
                isListed: true,
                sourceType: _applicationregistrationsourcetypeenum.ApplicationRegistrationSourceType.NPM
            }
        });
        return registrations.map((registration)=>({
                id: registration.id,
                universalIdentifier: registration.universalIdentifier,
                name: registration.name,
                sourcePackage: registration.sourcePackage,
                isVetted: registration.isVetted,
                description: registration.description,
                author: registration.author,
                category: registration.category,
                logoUrl: this.applicationRegistrationAssetUrlService.buildLogoUrl(registration)
            }));
    }
    async getStats(applicationRegistrationId, ownerWorkspaceId) {
        await this.findOneById(applicationRegistrationId, ownerWorkspaceId);
        return this.computeStats(applicationRegistrationId);
    }
    // Admin panel views apps across all workspaces, so ownership is not enforced.
    async getStatsGlobal(applicationRegistrationId) {
        await this.findOneByIdGlobal(applicationRegistrationId);
        return this.computeStats(applicationRegistrationId);
    }
    async computeStats(applicationRegistrationId) {
        const rawVersionDistribution = await this.applicationRepository.createQueryBuilder('application').select("COALESCE(application.version, 'unknown')", 'version').addSelect('COUNT(*)::int', 'count').addSelect(`COUNT(*) FILTER (WHERE workspace."activationStatus" = :suspendedStatus)::int`, 'suspendedCount').innerJoin('application.workspace', 'workspace').where('application."applicationRegistrationId" = :applicationRegistrationId', {
            applicationRegistrationId
        }).andWhere('application."deletedAt" IS NULL').andWhere('workspace."deletedAt" IS NULL').setParameter('suspendedStatus', _workspace.WorkspaceActivationStatus.SUSPENDED).groupBy('version').orderBy('count', 'DESC').getRawMany();
        const activeInstalls = rawVersionDistribution.reduce((sum, entry)=>sum + entry.count, 0);
        const suspendedInstalls = rawVersionDistribution.reduce((sum, entry)=>sum + entry.suspendedCount, 0);
        const mostInstalledVersion = rawVersionDistribution[0]?.version ?? null;
        return {
            activeInstalls,
            suspendedInstalls,
            mostInstalledVersion,
            versionDistribution: rawVersionDistribution.map((entry)=>({
                    version: entry.version,
                    count: entry.count
                }))
        };
    }
    // Installed workspaces are only exposed in the admin panel, which views apps
    // across all workspaces, so ownership is not enforced.
    async getInstalledWorkspacesGlobal(applicationRegistrationId, limit, offset, searchTerm) {
        await this.findOneByIdGlobal(applicationRegistrationId);
        return this.computeInstalledWorkspaces(applicationRegistrationId, limit, offset, searchTerm);
    }
    async computeInstalledWorkspaces(applicationRegistrationId, limit, offset, searchTerm) {
        const trimmedSearch = searchTerm?.trim();
        const queryBuilder = this.applicationRepository.createQueryBuilder('application').innerJoinAndSelect('application.workspace', 'workspace').where('application."applicationRegistrationId" = :applicationRegistrationId', {
            applicationRegistrationId
        }).andWhere('application."deletedAt" IS NULL').andWhere('workspace."deletedAt" IS NULL').orderBy('workspace.displayName', 'ASC').addOrderBy('application.id', 'ASC').skip(offset).take(limit);
        if ((0, _utils.isDefined)(trimmedSearch) && trimmedSearch.length > 0) {
            queryBuilder.andWhere(`(workspace."displayName" ILIKE :searchTerm
          OR application."version" ILIKE :searchTerm)`, {
                searchTerm: `%${trimmedSearch}%`
            });
        }
        const [applications, totalCount] = await queryBuilder.getManyAndCount();
        const workspaces = applications.map((application)=>({
                id: application.workspace.id,
                displayName: application.workspace.displayName ?? null,
                logo: application.workspace.logo ?? null,
                version: application.version ?? null
            }));
        return {
            workspaces,
            totalCount,
            hasMore: offset + workspaces.length < totalCount
        };
    }
    async findClaimable(params) {
        const hasPackage = (0, _guards.isNonEmptyString)(params.sourcePackage);
        const hasUniversalIdentifier = (0, _guards.isNonEmptyString)(params.universalIdentifier);
        if (hasPackage === hasUniversalIdentifier) {
            throw new _applicationregistrationexception.ApplicationRegistrationException('Provide exactly one of sourcePackage or universalIdentifier', _applicationregistrationexception.ApplicationRegistrationExceptionCode.INVALID_INPUT);
        }
        const where = {
            sourceType: _applicationregistrationsourcetypeenum.ApplicationRegistrationSourceType.NPM,
            ...hasPackage ? {
                sourcePackage: params.sourcePackage
            } : {
                universalIdentifier: params.universalIdentifier
            }
        };
        const registration = await this.applicationRegistrationRepository.findOne({
            select: APPLICATION_REGISTRATION_WITHOUT_MANIFEST_SELECT,
            where
        });
        if (!(0, _utils.isDefined)(registration)) {
            return null;
        }
        return {
            id: registration.id,
            universalIdentifier: registration.universalIdentifier,
            name: registration.name,
            sourcePackage: registration.sourcePackage,
            logoUrl: this.applicationRegistrationAssetUrlService.buildLogoUrl(registration),
            description: registration.description,
            author: registration.author,
            isOwned: (0, _utils.isDefined)(registration.ownerWorkspaceId)
        };
    }
    async claimOwnership(params) {
        const registration = await this.findOneByIdGlobal(params.applicationRegistrationId);
        // Only unclaimed registrations (no owner workspace) can be claimed.
        if ((0, _utils.isDefined)(registration.ownerWorkspaceId)) {
            throw new _applicationregistrationexception.ApplicationRegistrationException('Application registration is already owned by a workspace', _applicationregistrationexception.ApplicationRegistrationExceptionCode.APPLICATION_REGISTRATION_ALREADY_OWNED);
        }
        // Claim atomically: only update while still unowned so concurrent
        // claimers can't overwrite each other (first-claimant-wins).
        const updateResult = await this.applicationRegistrationRepository.update({
            id: registration.id,
            ownerWorkspaceId: (0, _typeorm1.IsNull)()
        }, {
            ownerWorkspaceId: params.claimingWorkspaceId
        });
        if (updateResult.affected === 0) {
            throw new _applicationregistrationexception.ApplicationRegistrationException('Application registration is already owned by a workspace', _applicationregistrationexception.ApplicationRegistrationExceptionCode.APPLICATION_REGISTRATION_ALREADY_OWNED);
        }
        await this.invalidateMarketplaceAppsCache();
        return this.applicationRegistrationRepository.findOneOrFail({
            where: {
                id: registration.id
            }
        });
    }
    async transferOwnership(params) {
        const registration = await this.findOneById(params.applicationRegistrationId, params.currentOwnerWorkspaceId);
        const targetWorkspace = await this.workspaceRepository.findOne({
            where: {
                subdomain: params.targetWorkspaceSubdomain
            }
        });
        if (!(0, _utils.isDefined)(targetWorkspace)) {
            throw new _applicationregistrationexception.ApplicationRegistrationException(`No workspace found with subdomain "${params.targetWorkspaceSubdomain}"`, _applicationregistrationexception.ApplicationRegistrationExceptionCode.APPLICATION_REGISTRATION_NOT_FOUND);
        }
        if (targetWorkspace.id === params.currentOwnerWorkspaceId) {
            throw new _applicationregistrationexception.ApplicationRegistrationException('Cannot transfer ownership to the same workspace', _applicationregistrationexception.ApplicationRegistrationExceptionCode.INVALID_INPUT);
        }
        await this.applicationRegistrationRepository.update(registration.id, {
            ownerWorkspaceId: targetWorkspace.id
        });
        await this.invalidateMarketplaceAppsCache();
        return this.applicationRegistrationRepository.findOneOrFail({
            where: {
                id: registration.id
            }
        });
    }
    async generateClientSecret() {
        const clientSecret = _crypto.default.randomBytes(32).toString('hex');
        const clientSecretHash = await _bcrypt.hash(clientSecret, BCRYPT_SALT_ROUNDS);
        return {
            clientSecret,
            clientSecretHash
        };
    }
    validateRedirectUris(uris) {
        for (const uri of uris){
            const result = (0, _validateredirecturiutil.validateRedirectUri)(uri);
            if (!result.valid) {
                throw new _applicationregistrationexception.ApplicationRegistrationException(result.reason, _applicationregistrationexception.ApplicationRegistrationExceptionCode.INVALID_REDIRECT_URI);
            }
        }
    }
    validateScopes(scopes) {
        const validScopes = _oauthscopes.ALL_OAUTH_SCOPES;
        const invalidScopes = scopes.filter((scope)=>!validScopes.includes(scope));
        if (invalidScopes.length > 0) {
            throw new _applicationregistrationexception.ApplicationRegistrationException(`Invalid scopes: ${invalidScopes.join(', ')}`, _applicationregistrationexception.ApplicationRegistrationExceptionCode.INVALID_SCOPE);
        }
    }
    constructor(applicationRegistrationRepository, applicationRepository, workspaceRepository, applicationRegistrationVariableService, applicationRegistrationAssetUrlService, serverFileStorageService, cacheLockService, coreEntityCacheService, metricsService, workspaceQueueService){
        this.applicationRegistrationRepository = applicationRegistrationRepository;
        this.applicationRepository = applicationRepository;
        this.workspaceRepository = workspaceRepository;
        this.applicationRegistrationVariableService = applicationRegistrationVariableService;
        this.applicationRegistrationAssetUrlService = applicationRegistrationAssetUrlService;
        this.serverFileStorageService = serverFileStorageService;
        this.cacheLockService = cacheLockService;
        this.coreEntityCacheService = coreEntityCacheService;
        this.metricsService = metricsService;
        this.workspaceQueueService = workspaceQueueService;
        this.logger = new _common.Logger(ApplicationRegistrationService.name);
    }
};
ApplicationRegistrationService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_applicationregistrationentity.ApplicationRegistrationEntity)),
    _ts_param(1, (0, _typeorm.InjectRepository)(_applicationentity.ApplicationEntity)),
    _ts_param(2, (0, _typeorm.InjectRepository)(_workspaceentity.WorkspaceEntity)),
    _ts_param(9, (0, _messagequeuedecorator.InjectMessageQueue)(_messagequeueconstants.MessageQueue.workspaceQueue)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof Repository === "undefined" ? Object : Repository,
        typeof Repository === "undefined" ? Object : Repository,
        typeof Repository === "undefined" ? Object : Repository,
        typeof _applicationregistrationvariableservice.ApplicationRegistrationVariableService === "undefined" ? Object : _applicationregistrationvariableservice.ApplicationRegistrationVariableService,
        typeof _applicationregistrationasseturlservice.ApplicationRegistrationAssetUrlService === "undefined" ? Object : _applicationregistrationasseturlservice.ApplicationRegistrationAssetUrlService,
        typeof _serverfilestorageservice.ServerFileStorageService === "undefined" ? Object : _serverfilestorageservice.ServerFileStorageService,
        typeof _cachelockservice.CacheLockService === "undefined" ? Object : _cachelockservice.CacheLockService,
        typeof _coreentitycacheservice.CoreEntityCacheService === "undefined" ? Object : _coreentitycacheservice.CoreEntityCacheService,
        typeof _metricsservice.MetricsService === "undefined" ? Object : _metricsservice.MetricsService,
        typeof _messagequeueservice.MessageQueueService === "undefined" ? Object : _messagequeueservice.MessageQueueService
    ])
], ApplicationRegistrationService);

//# sourceMappingURL=application-registration.service.js.map