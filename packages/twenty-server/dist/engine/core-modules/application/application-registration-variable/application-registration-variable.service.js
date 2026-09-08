"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ApplicationRegistrationVariableService", {
    enumerable: true,
    get: function() {
        return ApplicationRegistrationVariableService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _applicationregistrationvariableentity = require("./application-registration-variable.entity");
const _applicationregistrationentity = require("../application-registration/application-registration.entity");
const _applicationentity = require("../application.entity");
const _applicationregistrationexception = require("../application-registration/application-registration.exception");
const _secretencryptionservice = require("../../secret-encryption/secret-encryption.service");
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
let ApplicationRegistrationVariableService = class ApplicationRegistrationVariableService {
    async findVariablesWithObfuscatedValues(applicationRegistrationId, workspaceId) {
        await this.assertRegistrationOwnedByWorkspace(applicationRegistrationId, workspaceId);
        return this.findVariablesWithObfuscatedValuesGlobal(applicationRegistrationId);
    }
    async findVariablesWithObfuscatedValuesGlobal(applicationRegistrationId) {
        const variables = await this.variableRepository.find({
            where: {
                applicationRegistrationId
            },
            order: {
                key: 'ASC'
            }
        });
        return variables.map((variable)=>this.toObfuscatedDTO(variable));
    }
    async createVariable(input, workspaceId) {
        await this.assertRegistrationOwnedByWorkspace(input.applicationRegistrationId, workspaceId);
        const encryptedValue = this.encryptionService.encryptVersioned(input.value);
        const variable = this.variableRepository.create({
            applicationRegistrationId: input.applicationRegistrationId,
            key: input.key,
            encryptedValue,
            description: input.description ?? '',
            isSecret: input.isSecret ?? true
        });
        return this.toObfuscatedDTO(await this.variableRepository.save(variable));
    }
    async updateVariable(input, workspaceId) {
        const variable = await this.findVariableOrThrow(input.id);
        await this.assertRegistrationOwnedByWorkspace(variable.applicationRegistrationId, workspaceId);
        return this.toObfuscatedDTO(await this.applyVariableUpdate(input));
    }
    async updateVariableGlobal(input) {
        await this.findVariableOrThrow(input.id);
        const entity = await this.applyVariableUpdate(input);
        return this.toObfuscatedDTO(entity);
    }
    async deleteVariable(id, workspaceId) {
        const variable = await this.findVariableOrThrow(id);
        await this.assertRegistrationOwnedByWorkspace(variable.applicationRegistrationId, workspaceId);
        await this.variableRepository.delete(id);
        return true;
    }
    // Syncs variable schemas from manifest: creates missing, updates metadata, removes stale
    async syncVariableSchemas(applicationRegistrationId, serverVariables, entityManager) {
        const variableRepository = (0, _utils.isDefined)(entityManager) ? entityManager.getRepository(_applicationregistrationvariableentity.ApplicationRegistrationVariableEntity) : this.variableRepository;
        const declaredKeys = Object.keys(serverVariables);
        const existingVariables = await variableRepository.find({
            where: {
                applicationRegistrationId
            }
        });
        const existingByKey = new Map(existingVariables.map((variable)=>[
                variable.key,
                variable
            ]));
        for (const [key, schema] of Object.entries(serverVariables)){
            const existing = existingByKey.get(key);
            const isDeprecated = schema.isDeprecated ?? false;
            const isRequired = isDeprecated ? false : schema.isRequired ?? false;
            if (existing) {
                await variableRepository.update(existing.id, {
                    description: schema.description ?? '',
                    isSecret: schema.isSecret ?? true,
                    isRequired,
                    isDeprecated,
                    type: schema.type ?? _types.FieldMetadataType.TEXT,
                    options: schema.options ?? null
                });
            } else {
                await variableRepository.save(variableRepository.create({
                    applicationRegistrationId,
                    key,
                    encryptedValue: this.encryptionService.encryptVersioned(''),
                    description: schema.description ?? '',
                    isSecret: schema.isSecret ?? true,
                    isRequired,
                    isDeprecated,
                    type: schema.type ?? _types.FieldMetadataType.TEXT,
                    options: schema.options ?? null
                }));
            }
        }
        if (declaredKeys.length > 0) {
            await variableRepository.delete({
                applicationRegistrationId,
                key: (0, _typeorm1.Not)((0, _typeorm1.In)(declaredKeys))
            });
        } else {
            await variableRepository.delete({
                applicationRegistrationId
            });
        }
    }
    async isConfiguredBatch(applicationRegistrationIds) {
        const [variables, registrations, installedApps] = await Promise.all([
            this.variableRepository.find({
                where: {
                    applicationRegistrationId: (0, _typeorm1.In)(applicationRegistrationIds)
                }
            }),
            this.applicationRegistrationRepository.find({
                where: {
                    id: (0, _typeorm1.In)(applicationRegistrationIds)
                },
                select: {
                    id: true,
                    manifest: true,
                    ownerWorkspaceId: true
                }
            }),
            this.applicationRepository.find({
                where: {
                    applicationRegistrationId: (0, _typeorm1.In)(applicationRegistrationIds)
                },
                select: {
                    applicationRegistrationId: true,
                    workspaceId: true
                }
            })
        ]);
        const result = new Map();
        for (const id of applicationRegistrationIds){
            const registration = registrations.find((registration)=>registration.id === id);
            const areVariablesConfigured = variables.filter((variable)=>variable.applicationRegistrationId === id && variable.isRequired).every((variable)=>this.isVariableFilled(variable));
            const isInstalledOnOwnerWorkspace = installedApps.some((app)=>app.applicationRegistrationId === id && app.workspaceId === registration?.ownerWorkspaceId);
            result.set(id, areVariablesConfigured && this.isServerRouteConfigured(registration, isInstalledOnOwnerWorkspace));
        }
        return result;
    }
    isServerRouteConfigured(registration, isInstalledOnOwnerWorkspace) {
        const hasServerRouteFunction = registration?.manifest?.logicFunctions?.some((logicFunction)=>(0, _utils.isDefined)(logicFunction.serverRouteTriggerSettings)) ?? false;
        if (!hasServerRouteFunction) {
            return true;
        }
        return (0, _utils.isDefined)(registration?.ownerWorkspaceId) && isInstalledOnOwnerWorkspace;
    }
    async findVariableOrThrow(id) {
        const variable = await this.variableRepository.findOne({
            where: {
                id
            }
        });
        if (!variable) {
            throw new _applicationregistrationexception.ApplicationRegistrationException(`Variable with id ${id} not found`, _applicationregistrationexception.ApplicationRegistrationExceptionCode.VARIABLE_NOT_FOUND);
        }
        return variable;
    }
    async applyVariableUpdate(input) {
        const { id, update } = input;
        const updateData = {};
        if ((0, _utils.isDefined)(update.value)) {
            updateData.encryptedValue = this.encryptionService.encryptVersioned(update.value);
        }
        if ((0, _utils.isDefined)(update.resetValue) && update.resetValue) {
            updateData.encryptedValue = this.encryptionService.encryptVersioned('');
        }
        if ((0, _utils.isDefined)(update.description)) {
            updateData.description = update.description;
        }
        if (Object.keys(updateData).length > 0) {
            await this.variableRepository.update(id, updateData);
        }
        return this.variableRepository.findOneOrFail({
            where: {
                id
            }
        });
    }
    decryptValue(variable) {
        return this.encryptionService.decryptVersionedOrThrow(variable.encryptedValue);
    }
    isVariableFilled(variable) {
        return this.decryptValue(variable) !== '';
    }
    toObfuscatedDTO(variable) {
        const plaintextValue = this.decryptValue(variable);
        const isFilled = plaintextValue !== '';
        return {
            ...variable,
            isFilled,
            value: !isFilled ? null : variable.isSecret ? '•••••••••••••' : plaintextValue
        };
    }
    async assertRegistrationOwnedByWorkspace(registrationId, workspaceId) {
        const registration = await this.applicationRegistrationRepository.findOne({
            where: {
                id: registrationId,
                ownerWorkspaceId: workspaceId
            }
        });
        if (!registration) {
            throw new _applicationregistrationexception.ApplicationRegistrationException(`Application registration with id ${registrationId} not found`, _applicationregistrationexception.ApplicationRegistrationExceptionCode.APPLICATION_REGISTRATION_NOT_FOUND);
        }
    }
    constructor(variableRepository, applicationRegistrationRepository, applicationRepository, encryptionService){
        this.variableRepository = variableRepository;
        this.applicationRegistrationRepository = applicationRegistrationRepository;
        this.applicationRepository = applicationRepository;
        this.encryptionService = encryptionService;
    }
};
ApplicationRegistrationVariableService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_applicationregistrationvariableentity.ApplicationRegistrationVariableEntity)),
    _ts_param(1, (0, _typeorm.InjectRepository)(_applicationregistrationentity.ApplicationRegistrationEntity)),
    _ts_param(2, (0, _typeorm.InjectRepository)(_applicationentity.ApplicationEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof Repository === "undefined" ? Object : Repository,
        typeof Repository === "undefined" ? Object : Repository,
        typeof Repository === "undefined" ? Object : Repository,
        typeof _secretencryptionservice.SecretEncryptionService === "undefined" ? Object : _secretencryptionservice.SecretEncryptionService
    ])
], ApplicationRegistrationVariableService);

//# sourceMappingURL=application-registration-variable.service.js.map