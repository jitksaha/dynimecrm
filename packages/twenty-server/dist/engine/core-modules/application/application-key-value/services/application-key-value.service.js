"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ApplicationKeyValueService", {
    enumerable: true,
    get: function() {
        return ApplicationKeyValueService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _utils = require("twenty-shared/utils");
const _appkeyvaluescopeenum = require("../enums/app-key-value-scope.enum");
const _applicationregistrationentity = require("../../application-registration/application-registration.entity");
const _applicationentity = require("../../application.entity");
const _applicationexception = require("../../application.exception");
const _keyvaluepairentity = require("../../../key-value-pair/key-value-pair.entity");
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
let ApplicationKeyValueService = class ApplicationKeyValueService {
    async get({ application, workspaceId, key, scope }) {
        const scopedWhere = scope === _appkeyvaluescopeenum.AppKeyValueScope.SERVER ? {
            applicationId: await this.resolveServerApplicationId(application),
            workspaceId: (0, _typeorm1.IsNull)()
        } : {
            applicationId: application.id,
            workspaceId
        };
        const entry = await this.keyValuePairRepository.findOne({
            where: {
                key,
                type: _keyvaluepairentity.KeyValuePairType.APPLICATION_VARIABLE,
                ...scopedWhere
            }
        });
        if (!(0, _utils.isDefined)(entry)) {
            return null;
        }
        return {
            key,
            value: entry.value,
            scope
        };
    }
    async set({ application, workspaceId, key, value, scope }) {
        if (scope === _appkeyvaluescopeenum.AppKeyValueScope.SERVER) {
            return this.claimServerKey({
                application,
                workspaceId,
                key
            });
        }
        await this.keyValuePairRepository.upsert({
            key,
            value: value,
            applicationId: application.id,
            workspaceId,
            userId: null,
            type: _keyvaluepairentity.KeyValuePairType.APPLICATION_VARIABLE
        }, {
            conflictPaths: [
                'key',
                'applicationId'
            ],
            indexPredicate: '"applicationId" IS NOT NULL AND "workspaceId" IS NOT NULL'
        });
        return {
            key,
            value,
            scope
        };
    }
    async delete({ application, workspaceId, key, scope }) {
        if (scope === _appkeyvaluescopeenum.AppKeyValueScope.SERVER) {
            const result = await this.keyValuePairRepository.createQueryBuilder().delete().where('"key" = :key', {
                key
            }).andWhere('"applicationId" = :applicationId', {
                applicationId: await this.resolveServerApplicationId(application)
            }).andWhere('"workspaceId" IS NULL').andWhere('"type" = :type', {
                type: _keyvaluepairentity.KeyValuePairType.APPLICATION_VARIABLE
            }).andWhere('"value" = :value::jsonb', {
                value: JSON.stringify(workspaceId)
            }).execute();
            return (result.affected ?? 0) > 0;
        }
        const result = await this.keyValuePairRepository.delete({
            key,
            applicationId: application.id,
            workspaceId,
            type: _keyvaluepairentity.KeyValuePairType.APPLICATION_VARIABLE
        });
        return (result.affected ?? 0) > 0;
    }
    // SERVER keys are a claim registry: the stored value is always the caller's
    // token-derived workspaceId, so any value passed by the caller is ignored.
    async claimServerKey({ application, workspaceId, key }) {
        const serverApplicationId = await this.resolveServerApplicationId(application);
        const claimValue = workspaceId;
        await this.keyValuePairRepository.createQueryBuilder().insert().into(_keyvaluepairentity.KeyValuePairEntity).values({
            key,
            value: claimValue,
            applicationId: serverApplicationId,
            workspaceId: null,
            userId: null,
            type: _keyvaluepairentity.KeyValuePairType.APPLICATION_VARIABLE
        }).orIgnore().execute();
        const entry = await this.keyValuePairRepository.findOne({
            where: {
                key,
                applicationId: serverApplicationId,
                workspaceId: (0, _typeorm1.IsNull)(),
                type: _keyvaluepairentity.KeyValuePairType.APPLICATION_VARIABLE
            }
        });
        if (!(0, _utils.isDefined)(entry)) {
            throw new _applicationexception.ApplicationException(`Could not persist server key "${key}"`, _applicationexception.ApplicationExceptionCode.KEY_VALUE_PERSISTENCE_FAILED);
        }
        const claimedWorkspaceId = entry.value;
        if (claimedWorkspaceId !== workspaceId) {
            throw new _applicationexception.ApplicationException(`Server key "${key}" is already claimed by another workspace`, _applicationexception.ApplicationExceptionCode.FORBIDDEN, {
                userFriendlyMessage: /*i18n*/ {
                    id: "DEJJoY",
                    message: "This server key is already claimed by another workspace."
                }
            });
        }
        return {
            key,
            value: entry.value,
            scope: _appkeyvaluescopeenum.AppKeyValueScope.SERVER
        };
    }
    // SERVER entries of a registered application all live under the registration owner workspace's install
    async resolveServerApplicationId(application) {
        if (!(0, _utils.isDefined)(application.applicationRegistrationId)) {
            return application.id;
        }
        const registration = await this.applicationRegistrationRepository.findOne({
            where: {
                id: application.applicationRegistrationId
            }
        });
        if (!(0, _utils.isDefined)(registration) || !(0, _utils.isDefined)(registration.ownerWorkspaceId)) {
            return application.id;
        }
        if (registration.ownerWorkspaceId === application.workspaceId) {
            return application.id;
        }
        const ownerInstall = await this.applicationRepository.findOne({
            where: {
                applicationRegistrationId: registration.id,
                workspaceId: registration.ownerWorkspaceId
            }
        });
        if (!(0, _utils.isDefined)(ownerInstall)) {
            throw new _applicationexception.ApplicationException(`Server keys are unavailable for application ${application.id}: the registration owner workspace has no install`, _applicationexception.ApplicationExceptionCode.APP_NOT_INSTALLED, {
                userFriendlyMessage: /*i18n*/ {
                    id: "uK5uBy",
                    message: "Server keys require the application publisher workspace to have the application installed."
                }
            });
        }
        return ownerInstall.id;
    }
    constructor(keyValuePairRepository, applicationRepository, applicationRegistrationRepository){
        this.keyValuePairRepository = keyValuePairRepository;
        this.applicationRepository = applicationRepository;
        this.applicationRegistrationRepository = applicationRegistrationRepository;
    }
};
ApplicationKeyValueService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_keyvaluepairentity.KeyValuePairEntity)),
    _ts_param(1, (0, _typeorm.InjectRepository)(_applicationentity.ApplicationEntity)),
    _ts_param(2, (0, _typeorm.InjectRepository)(_applicationregistrationentity.ApplicationRegistrationEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], ApplicationKeyValueService);

//# sourceMappingURL=application-key-value.service.js.map