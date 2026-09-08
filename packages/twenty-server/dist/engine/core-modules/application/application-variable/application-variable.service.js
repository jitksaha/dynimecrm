"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ApplicationVariableEntityService", {
    enumerable: true,
    get: function() {
        return ApplicationVariableEntityService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _applicationvariableentity = require("./application-variable.entity");
const _applicationvariableexception = require("./application-variable.exception");
const _secretapplicationvariablemaskconstant = require("./constants/secret-application-variable-mask.constant");
const _secretencryptionservice = require("../../secret-encryption/secret-encryption.service");
const _workspacecacheservice = require("../../../workspace-cache/services/workspace-cache.service");
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
let ApplicationVariableEntityService = class ApplicationVariableEntityService {
    getDisplayValue(applicationVariable) {
        const plaintextValue = this.secretEncryptionService.decryptVersionedOrThrow(applicationVariable.value, {
            workspaceId: applicationVariable.workspaceId
        });
        if (plaintextValue === '') {
            return '';
        }
        if (applicationVariable.isSecret) {
            return this.secretEncryptionService.maskDecryptedValue(plaintextValue, _secretapplicationvariablemaskconstant.SECRET_APPLICATION_VARIABLE_MASK);
        }
        return plaintextValue;
    }
    async getServerEnvVariables(args) {
        const flatApplicationVariables = await this.findFlatApplicationVariables(args);
        return this.toEnvVariables(flatApplicationVariables);
    }
    async getPublicEnvVariables(args) {
        const flatApplicationVariables = await this.findFlatApplicationVariables(args);
        return this.toEnvVariables(flatApplicationVariables.filter(({ isSecret })=>!isSecret));
    }
    async findFlatApplicationVariables({ workspaceId, applicationId, applicationVariableMaps: preloadedApplicationVariableMaps }) {
        const applicationVariableMaps = preloadedApplicationVariableMaps ?? (await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'applicationVariableMaps'
        ])).applicationVariableMaps;
        const universalIdentifiers = applicationVariableMaps.universalIdentifiersByApplicationId[applicationId] ?? [];
        return universalIdentifiers.map((universalIdentifier)=>applicationVariableMaps.byUniversalIdentifier[universalIdentifier]).filter(_utils.isDefined);
    }
    toEnvVariables(flatApplicationVariables) {
        return flatApplicationVariables.reduce((acc, flatApplicationVariable)=>{
            acc[flatApplicationVariable.key] = this.decryptValue(flatApplicationVariable);
            return acc;
        }, {});
    }
    decryptValue({ value, workspaceId }) {
        return this.secretEncryptionService.decryptVersionedOrThrow(value, {
            workspaceId
        });
    }
    async update({ key, plainTextValue, applicationId, workspaceId }) {
        const existingVariable = await this.applicationVariableRepository.findOne({
            where: {
                key,
                applicationId
            }
        });
        if (!(0, _utils.isDefined)(existingVariable)) {
            throw new _applicationvariableexception.ApplicationVariableEntityException(`Application variable with key ${key} not found`, _applicationvariableexception.ApplicationVariableEntityExceptionCode.APPLICATION_VARIABLE_NOT_FOUND);
        }
        await this.applicationVariableRepository.update({
            key,
            applicationId
        }, {
            value: this.secretEncryptionService.encryptVersioned(plainTextValue, {
                workspaceId
            })
        });
        await this.workspaceCacheService.invalidateAndRecompute(workspaceId, [
            'applicationVariableMaps'
        ]);
    }
    constructor(applicationVariableRepository, workspaceCacheService, secretEncryptionService){
        this.applicationVariableRepository = applicationVariableRepository;
        this.workspaceCacheService = workspaceCacheService;
        this.secretEncryptionService = secretEncryptionService;
    }
};
ApplicationVariableEntityService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_applicationvariableentity.ApplicationVariableEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _secretencryptionservice.SecretEncryptionService === "undefined" ? Object : _secretencryptionservice.SecretEncryptionService
    ])
], ApplicationVariableEntityService);

//# sourceMappingURL=application-variable.service.js.map