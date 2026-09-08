"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ApplicationAuthorizationService", {
    enumerable: true,
    get: function() {
        return ApplicationAuthorizationService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _applicationauthorizationentity = require("../application-authorization.entity");
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
let ApplicationAuthorizationService = class ApplicationAuthorizationService {
    // Re-authorizing an application the user previously revoked reinstates the
    // same row: they have just consented again, so the revocation is spent.
    async recordAuthorization({ userId, workspaceId, userWorkspaceId, applicationId, scopes }) {
        const now = new Date();
        await this.applicationAuthorizationRepository.upsert({
            userId,
            workspaceId,
            userWorkspaceId,
            applicationId,
            scopes,
            lastAuthorizedAt: now,
            lastUsedAt: now,
            revokedAt: null
        }, {
            conflictPaths: [
                'userId',
                'applicationId'
            ],
            skipUpdateIfNoValuesChanged: false
        });
    }
    // Stands in for the consent event that happened before this table existed.
    // The refresh token proves the authorization took place but carries no scope
    // claim and no timestamp for it, so both are left null instead of being
    // guessed from what the application declares today. Insert-only, so it can
    // never overwrite a row written by a real consent.
    async backfillAuthorizationFromRefreshToken({ userId, workspaceId, userWorkspaceId, applicationId }) {
        await this.applicationAuthorizationRepository.createQueryBuilder().insert().values({
            userId,
            workspaceId,
            userWorkspaceId,
            applicationId,
            scopes: null,
            lastAuthorizedAt: null,
            lastUsedAt: new Date(),
            revokedAt: null
        }).orIgnore().execute();
    }
    // Returns revoked rows too: the caller has to tell "never authorized" apart
    // from "authorized then revoked", which are opposite answers.
    async findByUserAndApplication({ userId, applicationId }) {
        return await this.applicationAuthorizationRepository.findOneBy({
            userId,
            applicationId
        });
    }
    // Inner join, so an application that has been soft-deleted takes its
    // authorizations off the list rather than surfacing them with nothing to
    // name them.
    // Scoped to one workspace: an authorization grants an application access to
    // this workspace's data, so it is this workspace's to list and revoke. The
    // same person's grants elsewhere are not visible from here.
    async findActiveAuthorizationsForUserWorkspace({ userId, workspaceId }) {
        return await this.applicationAuthorizationRepository.createQueryBuilder('applicationAuthorization').innerJoinAndSelect('applicationAuthorization.application', 'application').where('applicationAuthorization.userId = :userId', {
            userId
        }).andWhere('applicationAuthorization.workspaceId = :workspaceId', {
            workspaceId
        }).andWhere('applicationAuthorization.revokedAt IS NULL').orderBy('applicationAuthorization.lastUsedAt', 'DESC').getMany();
    }
    async touchLastUsedAt(authorizationId) {
        await this.applicationAuthorizationRepository.update({
            id: authorizationId
        }, {
            lastUsedAt: new Date()
        });
    }
    // Scoped in the UPDATE itself rather than read-then-write, so one user can
    // never revoke another user's authorization, or their own in another
    // workspace, by guessing an id.
    async revokeAuthorizationByIdForUserWorkspace({ authorizationId, userId, workspaceId }) {
        return await this.revokeMatching({
            id: authorizationId,
            userId,
            workspaceId
        });
    }
    async revokeAuthorizationForApplication({ userId, applicationId }) {
        return await this.revokeMatching({
            userId,
            applicationId
        });
    }
    // Returns whether this call was the one that revoked it, so a repeated
    // revocation reports false rather than moving revokedAt forward. The union
    // rules out an empty criteria object, which would revoke every row.
    async revokeMatching(criteria) {
        const { affected } = await this.applicationAuthorizationRepository.update({
            ...criteria,
            revokedAt: (0, _typeorm1.IsNull)()
        }, {
            revokedAt: new Date()
        });
        return (0, _utils.isDefined)(affected) && affected > 0;
    }
    constructor(applicationAuthorizationRepository){
        this.applicationAuthorizationRepository = applicationAuthorizationRepository;
    }
};
ApplicationAuthorizationService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_applicationauthorizationentity.ApplicationAuthorizationEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], ApplicationAuthorizationService);

//# sourceMappingURL=application-authorization.service.js.map