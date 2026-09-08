"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _postgreserrorcodesconstants = require("../../../../api/graphql/workspace-query-runner/constants/postgres-error-codes.constants");
const _runinrollbacksafetransactionutil = require("../run-in-rollback-safe-transaction.util");
const _twentyormexception = require("../../../exceptions/twenty-orm.exception");
const buildClient = ()=>({
        query: jest.fn().mockResolvedValue({
            rows: []
        }),
        release: jest.fn()
    });
const buildPool = (client)=>({
        connect: jest.fn().mockResolvedValue(client)
    });
describe('runInRollbackSafeTransaction', ()=>{
    it('should map a transient failure raised while acquiring the connection', async ()=>{
        const connectionError = Object.assign(new Error('too many clients already'), {
            code: _postgreserrorcodesconstants.POSTGRESQL_ERROR_CODES.TOO_MANY_CONNECTIONS
        });
        const pool = {
            connect: jest.fn().mockRejectedValue(connectionError)
        };
        const error = await (0, _runinrollbacksafetransactionutil.runInRollbackSafeTransaction)({
            pool,
            work: async ()=>'never runs'
        }).catch((thrownError)=>thrownError);
        expect(error).toBeInstanceOf(_twentyormexception.TwentyOrmException);
        expect(error.code).toBe(_twentyormexception.TwentyOrmExceptionCode.TRANSIENT_DATABASE_ERROR);
    });
    it('should wrap the work in BEGIN/COMMIT and release the client reusable', async ()=>{
        const client = buildClient();
        const result = await (0, _runinrollbacksafetransactionutil.runInRollbackSafeTransaction)({
            pool: buildPool(client),
            work: async ()=>'done'
        });
        expect(result).toBe('done');
        expect(client.query).toHaveBeenNthCalledWith(1, 'BEGIN');
        expect(client.query).toHaveBeenNthCalledWith(2, 'COMMIT');
        expect(client.release).toHaveBeenCalledWith(false);
    });
    it('should roll back and rethrow the work error', async ()=>{
        const client = buildClient();
        const workError = new Error('work failed');
        await expect((0, _runinrollbacksafetransactionutil.runInRollbackSafeTransaction)({
            pool: buildPool(client),
            work: async ()=>{
                throw workError;
            }
        })).rejects.toBe(workError);
        expect(client.query).toHaveBeenLastCalledWith('ROLLBACK');
        expect(client.release).toHaveBeenCalledWith(false);
    });
    it('should rethrow the original error, not the rollback error, when ROLLBACK also fails', async ()=>{
        const client = buildClient();
        client.query.mockImplementation((statement)=>statement === 'ROLLBACK' ? Promise.reject(new Error('Query read timeout')) : Promise.resolve({
                rows: []
            }));
        const workError = new Error('original failure');
        await expect((0, _runinrollbacksafetransactionutil.runInRollbackSafeTransaction)({
            pool: buildPool(client),
            work: async ()=>{
                throw workError;
            }
        })).rejects.toBe(workError);
    });
    it('should destroy the connection instead of pooling it when ROLLBACK fails', async ()=>{
        const client = buildClient();
        client.query.mockImplementation((statement)=>statement === 'ROLLBACK' ? Promise.reject(new Error('Query read timeout')) : Promise.resolve({
                rows: []
            }));
        await expect((0, _runinrollbacksafetransactionutil.runInRollbackSafeTransaction)({
            pool: buildPool(client),
            work: async ()=>{
                throw new Error('original failure');
            }
        })).rejects.toThrow('original failure');
        expect(client.release).toHaveBeenCalledWith(true);
    });
    it.each([
        _postgreserrorcodesconstants.POSTGRESQL_ERROR_CODES.IDLE_IN_TRANSACTION_SESSION_TIMEOUT,
        _postgreserrorcodesconstants.POSTGRESQL_ERROR_CODES.CONNECTION_FAILURE,
        _postgreserrorcodesconstants.POSTGRESQL_ERROR_CODES.DEADLOCK_DETECTED
    ])('should surface the transient postgres failure %s raised at COMMIT as TRANSIENT_DATABASE_ERROR', async (code)=>{
        const client = buildClient();
        const commitError = Object.assign(new Error('terminating connection due to idle-in-transaction timeout'), {
            code
        });
        client.query.mockImplementation((statement)=>statement === 'COMMIT' ? Promise.reject(commitError) : Promise.resolve({
                rows: []
            }));
        const error = await (0, _runinrollbacksafetransactionutil.runInRollbackSafeTransaction)({
            pool: buildPool(client),
            work: async ()=>'done'
        }).catch((thrownError)=>thrownError);
        expect(error).toBeInstanceOf(_twentyormexception.TwentyOrmException);
        expect(error.code).toBe(_twentyormexception.TwentyOrmExceptionCode.TRANSIENT_DATABASE_ERROR);
        expect(error.cause).toBe(commitError);
    });
    it('should still surface the original transient failure as TRANSIENT_DATABASE_ERROR when ROLLBACK also fails', async ()=>{
        const client = buildClient();
        const workError = Object.assign(new Error('terminating connection due to administrator command'), {
            code: _postgreserrorcodesconstants.POSTGRESQL_ERROR_CODES.ADMIN_SHUTDOWN
        });
        client.query.mockImplementation((statement)=>statement === 'ROLLBACK' ? Promise.reject(new Error('Connection terminated unexpectedly')) : Promise.resolve({
                rows: []
            }));
        const error = await (0, _runinrollbacksafetransactionutil.runInRollbackSafeTransaction)({
            pool: buildPool(client),
            work: async ()=>{
                throw workError;
            }
        }).catch((thrownError)=>thrownError);
        expect(error.code).toBe(_twentyormexception.TwentyOrmExceptionCode.TRANSIENT_DATABASE_ERROR);
        expect(error.cause).toBe(workError);
    });
    it('should rethrow a BEGIN failure and release the client reusable when ROLLBACK succeeds', async ()=>{
        const client = buildClient();
        const beginError = new Error('BEGIN failed');
        client.query.mockImplementation((statement)=>statement === 'BEGIN' ? Promise.reject(beginError) : Promise.resolve({
                rows: []
            }));
        const work = jest.fn();
        await expect((0, _runinrollbacksafetransactionutil.runInRollbackSafeTransaction)({
            pool: buildPool(client),
            work
        })).rejects.toBe(beginError);
        expect(work).not.toHaveBeenCalled();
        expect(client.query).toHaveBeenLastCalledWith('ROLLBACK');
        expect(client.release).toHaveBeenCalledWith(false);
    });
    it('should roll back when COMMIT fails and release the client reusable', async ()=>{
        const client = buildClient();
        const commitError = new Error('COMMIT failed');
        client.query.mockImplementation((statement)=>statement === 'COMMIT' ? Promise.reject(commitError) : Promise.resolve({
                rows: []
            }));
        await expect((0, _runinrollbacksafetransactionutil.runInRollbackSafeTransaction)({
            pool: buildPool(client),
            work: async ()=>'done'
        })).rejects.toBe(commitError);
        expect(client.query).toHaveBeenLastCalledWith('ROLLBACK');
        expect(client.release).toHaveBeenCalledWith(false);
    });
});

//# sourceMappingURL=run-in-rollback-safe-transaction.util.spec.js.map