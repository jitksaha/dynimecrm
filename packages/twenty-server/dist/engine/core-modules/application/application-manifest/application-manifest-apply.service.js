"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ApplicationManifestApplyService", {
    enumerable: true,
    get: function() {
        return ApplicationManifestApplyService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _applicationsyncservice = require("./application-sync.service");
const _applicationregistrationservice = require("../application-registration/application-registration.service");
const _applicationregistrationsourcetypeenum = require("../application-registration/enums/application-registration-source-type.enum");
const _sdkclientgenerationservice = require("../../sdk-client/sdk-client-generation.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let ApplicationManifestApplyService = class ApplicationManifestApplyService {
    async applyManifestToWorkspace({ workspaceId, manifest, applicationRegistrationId, application, forceSdkClientGeneration = false }) {
        // The application version is only persisted by a successful sync: no
        // version means no sync ever completed, so the SDK client must be
        // generated regardless of schema changes.
        const isFirstApply = !(0, _utils.isDefined)(application.version);
        const { workspaceMigration, hasSchemaMetadataChanged } = await this.applicationSyncService.synchronizeFromManifest({
            workspaceId,
            manifest,
            applicationRegistrationId
        });
        if (forceSdkClientGeneration || isFirstApply || hasSchemaMetadataChanged) {
            await this.sdkClientGenerationService.generateSdkClientForApplication({
                workspaceId,
                applicationId: application.id,
                applicationUniversalIdentifier: application.universalIdentifier,
                trigger: 'manifest-sync'
            });
        }
        return {
            workspaceMigration,
            hasSchemaMetadataChanged
        };
    }
    async refreshRegistrationFromManifest({ applicationRegistrationId, manifest, sourceType, latestAvailableVersion, preventVersionDowngrade, onlyIfOwnedByWorkspaceId }) {
        if ((0, _utils.isDefined)(onlyIfOwnedByWorkspaceId)) {
            const registration = await this.applicationRegistrationService.findOneByIdGlobal(applicationRegistrationId);
            if (registration.sourceType === _applicationregistrationsourcetypeenum.ApplicationRegistrationSourceType.NPM || registration.ownerWorkspaceId !== onlyIfOwnedByWorkspaceId) {
                return false;
            }
        }
        return this.applicationRegistrationService.updateFromManifest({
            applicationRegistrationId,
            manifest,
            sourceType,
            latestAvailableVersion,
            preventVersionDowngrade
        });
    }
    constructor(applicationSyncService, sdkClientGenerationService, applicationRegistrationService){
        this.applicationSyncService = applicationSyncService;
        this.sdkClientGenerationService = sdkClientGenerationService;
        this.applicationRegistrationService = applicationRegistrationService;
    }
};
ApplicationManifestApplyService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _applicationsyncservice.ApplicationSyncService === "undefined" ? Object : _applicationsyncservice.ApplicationSyncService,
        typeof _sdkclientgenerationservice.SdkClientGenerationService === "undefined" ? Object : _sdkclientgenerationservice.SdkClientGenerationService,
        typeof _applicationregistrationservice.ApplicationRegistrationService === "undefined" ? Object : _applicationregistrationservice.ApplicationRegistrationService
    ])
], ApplicationManifestApplyService);

//# sourceMappingURL=application-manifest-apply.service.js.map