"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "KeyValuePairService", {
    enumerable: true,
    get: function() {
        return KeyValuePairService;
    }
});
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _keyvaluepairentity = require("./key-value-pair.entity");
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
let KeyValuePairService = class KeyValuePairService {
    async get({ userId, workspaceId, applicationId, type, key }) {
        const keyValuePairs = await this.keyValuePairRepository.find({
            where: {
                ...userId === undefined ? {} : userId === null ? {
                    userId: (0, _typeorm1.IsNull)()
                } : {
                    userId
                },
                ...workspaceId === undefined ? {} : workspaceId === null ? {
                    workspaceId: (0, _typeorm1.IsNull)()
                } : {
                    workspaceId
                },
                ...key === undefined ? {} : {
                    key
                },
                ...applicationId == null ? {
                    applicationId: (0, _typeorm1.IsNull)()
                } : {
                    applicationId
                },
                type
            }
        });
        return keyValuePairs.map((keyValuePair)=>({
                ...keyValuePair,
                value: keyValuePair.value ?? keyValuePair.textValueDeprecated
            }));
    }
    async set({ userId, workspaceId, applicationId, key, value, type }, queryRunner) {
        const normalizedUserId = userId ?? null;
        const normalizedWorkspaceId = workspaceId ?? null;
        const normalizedApplicationId = applicationId ?? null;
        const hasNullUserAndWorkspaceAndApplication = normalizedUserId === null && normalizedWorkspaceId === null && normalizedApplicationId === null;
        const keyValuePairRepository = queryRunner ? queryRunner.manager.getRepository(_keyvaluepairentity.KeyValuePairEntity) : this.keyValuePairRepository;
        const upsertData = {
            userId: normalizedUserId,
            workspaceId: normalizedWorkspaceId,
            applicationId: normalizedApplicationId,
            key,
            value,
            type
        };
        const conflictPaths = [
            'key'
        ];
        let indexPredicate;
        if (normalizedApplicationId !== null) {
            conflictPaths.push('applicationId');
            indexPredicate = normalizedWorkspaceId === null ? '"applicationId" IS NOT NULL AND "workspaceId" IS NULL' : '"applicationId" IS NOT NULL AND "workspaceId" IS NOT NULL';
        } else if (hasNullUserAndWorkspaceAndApplication) {
            indexPredicate = '"userId" IS NULL AND "workspaceId" IS NULL AND "applicationId" IS NULL';
        } else if (normalizedUserId === null) {
            conflictPaths.push('workspaceId');
            indexPredicate = '"userId" IS NULL AND "applicationId" IS NULL';
        } else if (normalizedWorkspaceId === null) {
            conflictPaths.push('userId');
            indexPredicate = '"workspaceId" IS NULL';
        } else {
            conflictPaths.push('userId', 'workspaceId');
        }
        await keyValuePairRepository.upsert(upsertData, {
            conflictPaths,
            indexPredicate
        });
    }
    // Returns false when a row already exists, so callers can use this as a
    // single-winner claim between concurrent requests.
    async setIfNotExists({ userId, workspaceId, applicationId, key, value, type }, queryRunner) {
        const keyValuePairRepository = queryRunner ? queryRunner.manager.getRepository(_keyvaluepairentity.KeyValuePairEntity) : this.keyValuePairRepository;
        const insertResult = await keyValuePairRepository.createQueryBuilder().insert().into(_keyvaluepairentity.KeyValuePairEntity).values({
            userId: userId ?? null,
            workspaceId: workspaceId ?? null,
            applicationId: applicationId ?? null,
            key,
            value,
            type
        }).orIgnore().returning('id').execute();
        return insertResult.raw.length > 0;
    }
    async delete({ userId, workspaceId, applicationId, type, key }, queryRunner) {
        const deleteConditions = {
            ...userId === undefined ? {} : userId === null ? {
                userId: (0, _typeorm1.IsNull)()
            } : {
                userId
            },
            ...workspaceId === undefined ? {} : workspaceId === null ? {
                workspaceId: (0, _typeorm1.IsNull)()
            } : {
                workspaceId
            },
            // Application rows are isolated from core key-value pairs: without an
            // explicit applicationId we only match rows where it is NULL.
            ...applicationId == null ? {
                applicationId: (0, _typeorm1.IsNull)()
            } : {
                applicationId
            },
            type,
            key
        };
        const { affected } = queryRunner ? await queryRunner.manager.getRepository(_keyvaluepairentity.KeyValuePairEntity).delete(deleteConditions) : await this.keyValuePairRepository.delete(deleteConditions);
        return affected;
    }
    constructor(keyValuePairRepository){
        this.keyValuePairRepository = keyValuePairRepository;
    }
};
KeyValuePairService = _ts_decorate([
    _ts_param(0, (0, _typeorm.InjectRepository)(_keyvaluepairentity.KeyValuePairEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], KeyValuePairService);

//# sourceMappingURL=key-value-pair.service.js.map