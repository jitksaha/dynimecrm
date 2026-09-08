"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ApplicationTarballService", {
    enumerable: true,
    get: function() {
        return ApplicationTarballService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _fs = require("fs");
const _os = require("os");
const _path = require("path");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _uuid = require("uuid");
const _applicationversionvalidationservice = require("../application-package/application-version-validation.service");
const _versionreasontoexceptioncodeconstant = require("../application-package/constants/version-reason-to-exception-code.constant");
const _extracttarballsecurelyutil = require("../application-package/utils/extract-tarball-securely.util");
const _readjsonfileutil = require("../application-package/utils/read-json-file.util");
const _tarballutils = require("../application-package/utils/tarball-utils");
const _applicationregistrationassetservice = require("./application-registration-asset.service");
const _applicationregistrationentity = require("./application-registration.entity");
const _applicationregistrationexception = require("./application-registration.exception");
const _applicationregistrationservice = require("./application-registration.service");
const _applicationregistrationsourcetypeenum = require("./enums/application-registration-source-type.enum");
const _frommanifestapplicationtodisplayfieldsutil = require("./utils/from-manifest-application-to-display-fields.util");
const _applicationservice = require("../application.service");
const _filestorageservice = require("../../file-storage/services/file-storage.service");
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
let ApplicationTarballService = class ApplicationTarballService {
    async uploadTarball(params) {
        const tempDir = (0, _path.join)((0, _os.tmpdir)(), 'twenty-tarball-upload', (0, _uuid.v4)());
        await _fs.promises.mkdir(tempDir, {
            recursive: true
        });
        try {
            const { contentDir, manifest, packageJson } = await this.extractAndValidateTarball(tempDir, params.tarballBuffer);
            const universalIdentifier = params.universalIdentifier ?? manifest.application?.universalIdentifier;
            if (!(0, _utils.isDefined)(universalIdentifier)) {
                throw new _applicationregistrationexception.ApplicationRegistrationException('universalIdentifier is required (in body or manifest)', _applicationregistrationexception.ApplicationRegistrationExceptionCode.INVALID_INPUT);
            }
            const existingRegistration = await this.appRegistrationRepository.findOne({
                where: {
                    universalIdentifier,
                    ownerWorkspaceId: params.ownerWorkspaceId
                }
            });
            const isNewRegistration = !(0, _utils.isDefined)(existingRegistration);
            const previousLatestAvailableVersion = existingRegistration?.latestAvailableVersion ?? null;
            const appRegistration = (0, _utils.isDefined)(existingRegistration) ? this.assertTarballCanReplaceRegistration({
                registration: existingRegistration,
                incomingVersion: packageJson?.version,
                universalIdentifier
            }) : await this.createTarballRegistration({
                universalIdentifier,
                manifest,
                packageJsonVersion: packageJson?.version ?? null,
                ownerWorkspaceId: params.ownerWorkspaceId
            });
            const savedFile = await this.storeTarballFile({
                appRegistration,
                tarballBuffer: params.tarballBuffer,
                ownerWorkspaceId: params.ownerWorkspaceId
            });
            await this.applicationRegistrationService.updateFromManifest({
                applicationRegistrationId: appRegistration.id,
                manifest: manifest,
                sourceType: _applicationregistrationsourcetypeenum.ApplicationRegistrationSourceType.TARBALL,
                latestAvailableVersion: packageJson?.version ?? null,
                additionalFields: {
                    tarballFileId: savedFile.id,
                    isListed: false,
                    isVetted: false,
                    ownerWorkspaceId: params.ownerWorkspaceId
                }
            });
            await this.applicationRegistrationAssetService.storeRegistrationAssets({
                applicationRegistrationId: appRegistration.id,
                manifestApplication: manifest.application,
                readAsset: (path)=>this.readAssetFromContentDir(contentDir, path)
            });
            this.logger.log(`Tarball uploaded for app ${universalIdentifier} (registration ${appRegistration.id})`);
            const incomingVersion = packageJson?.version ?? null;
            if (isNewRegistration || previousLatestAvailableVersion !== incomingVersion) {
                this.applicationRegistrationService.emitRegistrationPublishMetric({
                    isNewRegistration,
                    universalIdentifier,
                    name: manifest.application?.displayName ?? 'Unknown App',
                    sourceType: _applicationregistrationsourcetypeenum.ApplicationRegistrationSourceType.TARBALL,
                    version: incomingVersion
                });
                if (!isNewRegistration) {
                    await this.applicationRegistrationService.enqueueAutoUpgradeApplications(appRegistration.id);
                }
            }
            return this.appRegistrationRepository.findOneOrFail({
                where: {
                    id: appRegistration.id
                }
            });
        } finally{
            await _fs.promises.rm(tempDir, {
                recursive: true,
                force: true
            });
        }
    }
    async extractAndValidateTarball(tempDir, tarballBuffer) {
        const tarballPath = (0, _path.join)(tempDir, 'app.tar.gz');
        await _fs.promises.writeFile(tarballPath, tarballBuffer);
        const extractDir = (0, _path.join)(tempDir, 'extracted');
        await _fs.promises.mkdir(extractDir, {
            recursive: true
        });
        await (0, _extracttarballsecurelyutil.extractTarballSecurely)(tarballPath, extractDir);
        const contentDir = await (0, _tarballutils.resolvePackageContentDir)(extractDir);
        const manifest = await (0, _readjsonfileutil.readJsonFile)(contentDir, 'manifest.json');
        const packageJson = await (0, _readjsonfileutil.readJsonFile)(contentDir, 'package.json');
        if (manifest === null) {
            throw new _applicationregistrationexception.ApplicationRegistrationException('manifest.json not found or invalid in tarball', _applicationregistrationexception.ApplicationRegistrationExceptionCode.INVALID_INPUT);
        }
        const versionValidation = await this.applicationVersionValidationService.validateServerCompatibility(packageJson?.engines?.twenty);
        if (!versionValidation.compatible) {
            throw new _applicationregistrationexception.ApplicationRegistrationException(versionValidation.message, _versionreasontoexceptioncodeconstant.VERSION_REASON_TO_APPLICATION_REGISTRATION_EXCEPTION_CODE[versionValidation.reason]);
        }
        return {
            contentDir,
            manifest,
            packageJson
        };
    }
    assertTarballCanReplaceRegistration({ registration, incomingVersion, universalIdentifier }) {
        if (registration.sourceType !== _applicationregistrationsourcetypeenum.ApplicationRegistrationSourceType.LOCAL && registration.sourceType !== _applicationregistrationsourcetypeenum.ApplicationRegistrationSourceType.TARBALL) {
            throw new _applicationregistrationexception.ApplicationRegistrationException(`This app is registered as ${registration.sourceType}. Cannot upload tarball.`, _applicationregistrationexception.ApplicationRegistrationExceptionCode.SOURCE_CHANNEL_MISMATCH);
        }
        if (registration.sourceType === _applicationregistrationsourcetypeenum.ApplicationRegistrationSourceType.TARBALL && (0, _utils.isDefined)(registration.latestAvailableVersion) && (0, _utils.isDefined)(incomingVersion)) {
            const progression = this.applicationVersionValidationService.validateVersionProgression({
                incomingVersion,
                currentVersion: registration.latestAvailableVersion,
                universalIdentifier,
                action: 'deploy'
            });
            if (!progression.allowed) {
                throw new _applicationregistrationexception.ApplicationRegistrationException(progression.message, _versionreasontoexceptioncodeconstant.VERSION_PROGRESSION_REASON_TO_DEPLOY_EXCEPTION_CODE[progression.reason]);
            }
        }
        return registration;
    }
    async createTarballRegistration({ universalIdentifier, manifest, packageJsonVersion, ownerWorkspaceId }) {
        return this.appRegistrationRepository.save(this.appRegistrationRepository.create({
            universalIdentifier,
            name: manifest.application?.displayName ?? 'Unknown App',
            sourceType: _applicationregistrationsourcetypeenum.ApplicationRegistrationSourceType.TARBALL,
            manifest,
            ...(0, _frommanifestapplicationtodisplayfieldsutil.fromManifestApplicationToDisplayFields)(manifest.application),
            latestAvailableVersion: packageJsonVersion,
            isListed: false,
            isVetted: false,
            oAuthClientId: (0, _uuid.v4)(),
            oAuthRedirectUris: [],
            oAuthScopes: [],
            ownerWorkspaceId
        }));
    }
    async storeTarballFile({ appRegistration, tarballBuffer, ownerWorkspaceId }) {
        const { workspaceCustomFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId: ownerWorkspaceId
        });
        return this.fileStorageService.writeFile({
            sourceFile: tarballBuffer,
            resourcePath: `${appRegistration.id}/app.tar.gz`,
            fileFolder: _types.FileFolder.AppTarball,
            applicationUniversalIdentifier: workspaceCustomFlatApplication.universalIdentifier,
            workspaceId: ownerWorkspaceId,
            fileId: appRegistration.tarballFileId ?? (0, _uuid.v4)(),
            settings: {
                isTemporaryFile: false,
                toDelete: false
            }
        });
    }
    async readAssetFromContentDir(contentDir, path) {
        const absolutePath = (0, _path.resolve)(contentDir, path);
        const relativeToContentDir = (0, _path.relative)(contentDir, absolutePath);
        if (relativeToContentDir === '..' || relativeToContentDir.startsWith('../') || (0, _path.isAbsolute)(relativeToContentDir)) {
            this.logger.warn(`Asset "${path}" escapes the package directory; skipping`);
            return null;
        }
        return _fs.promises.readFile(absolutePath);
    }
    constructor(appRegistrationRepository, fileStorageService, applicationRegistrationAssetService, applicationService, applicationVersionValidationService, applicationRegistrationService){
        this.appRegistrationRepository = appRegistrationRepository;
        this.fileStorageService = fileStorageService;
        this.applicationRegistrationAssetService = applicationRegistrationAssetService;
        this.applicationService = applicationService;
        this.applicationVersionValidationService = applicationVersionValidationService;
        this.applicationRegistrationService = applicationRegistrationService;
        this.logger = new _common.Logger(ApplicationTarballService.name);
    }
};
ApplicationTarballService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_applicationregistrationentity.ApplicationRegistrationEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _filestorageservice.FileStorageService === "undefined" ? Object : _filestorageservice.FileStorageService,
        typeof _applicationregistrationassetservice.ApplicationRegistrationAssetService === "undefined" ? Object : _applicationregistrationassetservice.ApplicationRegistrationAssetService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _applicationversionvalidationservice.ApplicationVersionValidationService === "undefined" ? Object : _applicationversionvalidationservice.ApplicationVersionValidationService,
        typeof _applicationregistrationservice.ApplicationRegistrationService === "undefined" ? Object : _applicationregistrationservice.ApplicationRegistrationService
    ])
], ApplicationTarballService);

//# sourceMappingURL=application-tarball.service.js.map