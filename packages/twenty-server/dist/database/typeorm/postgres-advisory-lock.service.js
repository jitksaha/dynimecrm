"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PostgresAdvisoryLockService", {
    enumerable: true,
    get: function() {
        return PostgresAdvisoryLockService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
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
const toError = (error)=>error instanceof Error ? error : new Error(String(error));
let PostgresAdvisoryLockService = class PostgresAdvisoryLockService {
    async tryWithLock(lockName, callback) {
        const lockSession = await PostgresAdvisoryLockSession.tryAcquire(this.coreDataSource, lockName);
        if (!lockSession) {
            return {
                acquired: false
            };
        }
        const callbackResult = await this.captureCallbackResult(callback);
        const cleanupError = await lockSession.unlockAndClose();
        if (callbackResult.status === 'rejected') {
            if (cleanupError) {
                this.logger.warn(`Secondary PostgreSQL advisory lock error for "${lockName}" after callback failure: ${cleanupError}`);
            }
            throw callbackResult.reason;
        }
        if (cleanupError) {
            throw cleanupError;
        }
        return {
            acquired: true,
            value: callbackResult.value
        };
    }
    async captureCallbackResult(callback) {
        try {
            return {
                status: 'fulfilled',
                value: await callback()
            };
        } catch (reason) {
            return {
                status: 'rejected',
                reason
            };
        }
    }
    constructor(coreDataSource){
        this.coreDataSource = coreDataSource;
        this.logger = new _common.Logger(PostgresAdvisoryLockService.name);
    }
};
PostgresAdvisoryLockService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectDataSource)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.DataSource === "undefined" ? Object : _typeorm1.DataSource
    ])
], PostgresAdvisoryLockService);
let PostgresAdvisoryLockSession = class PostgresAdvisoryLockSession {
    static async tryAcquire(dataSource, lockName) {
        const [connection, releaseConnection] = await dataSource.driver.obtainMasterConnection();
        const lockSession = new PostgresAdvisoryLockSession(connection, releaseConnection, lockName);
        let isLockAcquired;
        try {
            isLockAcquired = await lockSession.tryAcquireLock();
        } catch (error) {
            lockSession.close(toError(error));
            throw error;
        }
        if (!isLockAcquired) {
            const closeError = lockSession.close();
            if (closeError) {
                throw closeError;
            }
            return undefined;
        }
        return lockSession;
    }
    async unlockAndClose() {
        let unlockError;
        try {
            await this.unlock();
        } catch (error) {
            unlockError = toError(error);
        }
        return this.close(unlockError);
    }
    async tryAcquireLock() {
        const { rows: [result] } = await this.connection.query(`SELECT pg_try_advisory_lock(hashtextextended($1, 0)) AS "acquired"`, [
            this.lockName
        ]);
        return result?.acquired === true;
    }
    async unlock() {
        const { rows: [result] } = await this.connection.query(`SELECT pg_advisory_unlock(hashtextextended($1, 0)) AS "released"`, [
            this.lockName
        ]);
        if (result?.released !== true) {
            throw new Error(`Could not release PostgreSQL advisory lock ${this.lockName}`);
        }
    }
    close(error) {
        this.connection.removeListener('error', this.handleConnectionError);
        const errorToRelease = error ?? this.connectionError;
        if (errorToRelease) {
            this.releaseConnection(errorToRelease);
        } else {
            this.releaseConnection();
        }
        return errorToRelease;
    }
    constructor(connection, releaseConnection, lockName){
        this.connection = connection;
        this.releaseConnection = releaseConnection;
        this.lockName = lockName;
        this.handleConnectionError = (error)=>{
            this.connectionError ??= error;
        };
        this.connection.on('error', this.handleConnectionError);
    }
};

//# sourceMappingURL=postgres-advisory-lock.service.js.map