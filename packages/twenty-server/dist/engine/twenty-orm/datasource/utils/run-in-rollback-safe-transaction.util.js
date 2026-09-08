"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "runInRollbackSafeTransaction", {
    enumerable: true,
    get: function() {
        return runInRollbackSafeTransaction;
    }
});
const _common = require("@nestjs/common");
const _computetwentyormexceptionutil = require("../../error-handling/compute-twenty-orm-exception.util");
const logger = new _common.Logger('runInRollbackSafeTransaction');
const runInRollbackSafeTransaction = async ({ pool, work })=>{
    const client = await pool.connect().catch((error)=>{
        throw (0, _computetwentyormexceptionutil.computeTwentyOrmException)(error);
    });
    let shouldDestroyConnection = false;
    try {
        await client.query('BEGIN');
        const result = await work(client);
        await client.query('COMMIT');
        return result;
    } catch (error) {
        try {
            await client.query('ROLLBACK');
        } catch (rollbackError) {
            shouldDestroyConnection = true;
            logger.warn(`Destroying connection after failed transaction ROLLBACK: ${rollbackError instanceof Error ? rollbackError.message : String(rollbackError)}`);
        }
        throw (0, _computetwentyormexceptionutil.computeTwentyOrmException)(error);
    } finally{
        client.release(shouldDestroyConnection);
    }
};

//# sourceMappingURL=run-in-rollback-safe-transaction.util.js.map