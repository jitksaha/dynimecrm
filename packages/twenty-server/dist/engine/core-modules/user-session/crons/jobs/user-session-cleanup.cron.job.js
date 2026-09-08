"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UserSessionCleanupCronJob", {
    enumerable: true,
    get: function() {
        return UserSessionCleanupCronJob;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _apptokenentity = require("../../../app-token/app-token.entity");
const _sentrycronmonitordecorator = require("../../../cron/sentry-cron-monitor.decorator");
const _processdecorator = require("../../../message-queue/decorators/process.decorator");
const _processordecorator = require("../../../message-queue/decorators/processor.decorator");
const _messagequeueconstants = require("../../../message-queue/message-queue.constants");
const _usersessioncleanupcronpatternconstant = require("../../constants/user-session-cleanup-cron-pattern.constant");
const _usersessionentity = require("../../user-session.entity");
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
// Rows outlive their usability so the sessions UI and audits can still show
// recently ended sessions.
const ENDED_SESSION_RETENTION_MS = 30 * 24 * 60 * 60 * 1000;
const DELETE_BATCH_SIZE = 10000;
let UserSessionCleanupCronJob = class UserSessionCleanupCronJob {
    async handle() {
        const threshold = new Date(Date.now() - ENDED_SESSION_RETENTION_MS);
        const deletedSessionCount = await this.deleteInBatches(()=>this.userSessionRepository.createQueryBuilder().delete().where(`"id" IN (
            SELECT "id" FROM "core"."userSession"
            WHERE "expiresAt" < :threshold OR "revokedAt" < :threshold
            LIMIT :batchSize
          )`, {
                threshold,
                batchSize: DELETE_BATCH_SIZE
            }).execute().then((result)=>result.affected ?? 0));
        const deletedRefreshTokenCount = await this.deleteInBatches(()=>this.appTokenRepository.createQueryBuilder().delete().where(`"id" IN (
            SELECT "id" FROM "core"."appToken"
            WHERE "type" = 'REFRESH_TOKEN'
              AND ("expiresAt" < :threshold OR "revokedAt" < :threshold)
            LIMIT :batchSize
          )`, {
                threshold,
                batchSize: DELETE_BATCH_SIZE
            }).execute().then((result)=>result.affected ?? 0));
        if (deletedSessionCount > 0 || deletedRefreshTokenCount > 0) {
            this.logger.log(`Deleted ${deletedSessionCount} ended sessions and ${deletedRefreshTokenCount} stale refresh tokens`);
        }
    }
    async deleteInBatches(deleteBatch) {
        let totalDeleted = 0;
        let affected = 0;
        do {
            affected = await deleteBatch();
            totalDeleted += affected;
        }while (affected === DELETE_BATCH_SIZE)
        return totalDeleted;
    }
    constructor(userSessionRepository, appTokenRepository){
        this.userSessionRepository = userSessionRepository;
        this.appTokenRepository = appTokenRepository;
        this.logger = new _common.Logger(UserSessionCleanupCronJob.name);
    }
};
_ts_decorate([
    (0, _processdecorator.Process)(UserSessionCleanupCronJob.name),
    (0, _sentrycronmonitordecorator.SentryCronMonitor)(UserSessionCleanupCronJob.name, _usersessioncleanupcronpatternconstant.USER_SESSION_CLEANUP_CRON_PATTERN),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], UserSessionCleanupCronJob.prototype, "handle", null);
UserSessionCleanupCronJob = _ts_decorate([
    (0, _common.Injectable)(),
    (0, _processordecorator.Processor)(_messagequeueconstants.MessageQueue.cronQueue),
    _ts_param(0, (0, _typeorm.InjectRepository)(_usersessionentity.UserSessionEntity)),
    _ts_param(1, (0, _typeorm.InjectRepository)(_apptokenentity.AppTokenEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], UserSessionCleanupCronJob);

//# sourceMappingURL=user-session-cleanup.cron.job.js.map