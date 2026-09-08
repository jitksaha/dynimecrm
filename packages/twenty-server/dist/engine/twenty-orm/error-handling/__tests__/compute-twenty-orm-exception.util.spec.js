"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _postgreserrorcodesconstants = require("../../../api/graphql/workspace-query-runner/constants/postgres-error-codes.constants");
const _postgresexception = require("../../../api/graphql/workspace-query-runner/utils/postgres-exception");
const _computetwentyormexceptionutil = require("../compute-twenty-orm-exception.util");
const _twentyormexception = require("../../exceptions/twenty-orm.exception");
const buildPostgresError = (message, code)=>Object.assign(new Error(message), {
        code
    });
describe('computeTwentyOrmException', ()=>{
    it('should map the pg client query timeout to QUERY_READ_TIMEOUT when the error carries no code', ()=>{
        const error = new Error('Query read timeout');
        const result = (0, _computetwentyormexceptionutil.computeTwentyOrmException)(error);
        expect(result).toBeInstanceOf(_twentyormexception.TwentyOrmException);
        expect(result.code).toBe(_twentyormexception.TwentyOrmExceptionCode.QUERY_READ_TIMEOUT);
        expect(result.message).toBe('Query read timeout');
    });
    it('should map a unique violation to DUPLICATE_ENTRY_DETECTED', ()=>{
        const error = buildPostgresError('duplicate key value violates unique constraint "IDX_person_email"', _postgreserrorcodesconstants.POSTGRESQL_ERROR_CODES.UNIQUE_VIOLATION);
        const result = (0, _computetwentyormexceptionutil.computeTwentyOrmException)(error);
        expect(result).toBeInstanceOf(_twentyormexception.TwentyOrmException);
        expect(result.code).toBe(_twentyormexception.TwentyOrmExceptionCode.DUPLICATE_ENTRY_DETECTED);
    });
    it('should map an invalid text representation to INVALID_INPUT', ()=>{
        const error = buildPostgresError('invalid input syntax for type uuid: "not-a-uuid"', _postgreserrorcodesconstants.POSTGRESQL_ERROR_CODES.INVALID_TEXT_REPRESENTATION);
        const result = (0, _computetwentyormexceptionutil.computeTwentyOrmException)(error);
        expect(result).toBeInstanceOf(_twentyormexception.TwentyOrmException);
        expect(result.code).toBe(_twentyormexception.TwentyOrmExceptionCode.INVALID_INPUT);
        expect(result.message).toBe('invalid input syntax for type uuid: "not-a-uuid"');
    });
    it.each([
        _postgreserrorcodesconstants.POSTGRESQL_ERROR_CODES.NOT_NULL_VIOLATION,
        _postgreserrorcodesconstants.POSTGRESQL_ERROR_CODES.FOREIGN_KEY_VIOLATION,
        _postgreserrorcodesconstants.POSTGRESQL_ERROR_CODES.RESTRICT_VIOLATION
    ])('should map the constraint violation %s to INVALID_INPUT', (code)=>{
        const result = (0, _computetwentyormexceptionutil.computeTwentyOrmException)(buildPostgresError('constraint violation', code));
        expect(result).toBeInstanceOf(_twentyormexception.TwentyOrmException);
        expect(result.code).toBe(_twentyormexception.TwentyOrmExceptionCode.INVALID_INPUT);
    });
    it.each([
        _postgreserrorcodesconstants.POSTGRESQL_ERROR_CODES.IDLE_IN_TRANSACTION_SESSION_TIMEOUT,
        _postgreserrorcodesconstants.POSTGRESQL_ERROR_CODES.CONNECTION_FAILURE,
        _postgreserrorcodesconstants.POSTGRESQL_ERROR_CODES.DEADLOCK_DETECTED
    ])('should map the transient failure %s to TRANSIENT_DATABASE_ERROR', (code)=>{
        const result = (0, _computetwentyormexceptionutil.computeTwentyOrmException)(buildPostgresError('terminating connection due to idle-in-transaction timeout', code));
        expect(result).toBeInstanceOf(_twentyormexception.TwentyOrmException);
        expect(result.code).toBe(_twentyormexception.TwentyOrmExceptionCode.TRANSIENT_DATABASE_ERROR);
    });
    it('should map any other known postgres code to a PostgresException carrying that code', ()=>{
        const error = buildPostgresError('cannot execute UPDATE in a read-only transaction', _postgreserrorcodesconstants.POSTGRESQL_ERROR_CODES.READ_ONLY_SQL_TRANSACTION);
        const result = (0, _computetwentyormexceptionutil.computeTwentyOrmException)(error);
        expect(result).toBeInstanceOf(_postgresexception.PostgresException);
        expect(result.code).toBe(_postgreserrorcodesconstants.POSTGRESQL_ERROR_CODES.READ_ONLY_SQL_TRANSACTION);
        expect(result.message).toBe('Data validation error.');
    });
    it('should return a TRANSIENT_DATABASE_ERROR exception when the socket dies before postgres reports a code', ()=>{
        const error = new Error('Connection terminated unexpectedly');
        const result = (0, _computetwentyormexceptionutil.computeTwentyOrmException)(error);
        expect(result).toBeInstanceOf(_twentyormexception.TwentyOrmException);
        expect(result.code).toBe(_twentyormexception.TwentyOrmExceptionCode.TRANSIENT_DATABASE_ERROR);
    });
    it('should return an unrecognised driver error untouched', ()=>{
        const error = new Error('some driver failure nobody maps');
        expect((0, _computetwentyormexceptionutil.computeTwentyOrmException)(error)).toBe(error);
    });
    it('should return an error carrying an unknown code untouched', ()=>{
        const error = buildPostgresError('some driver failure', 'NOT_A_PG_CODE');
        expect((0, _computetwentyormexceptionutil.computeTwentyOrmException)(error)).toBe(error);
    });
    it('should leave an exception the query builder already computed untouched', ()=>{
        const error = new _twentyormexception.TwentyOrmException('Join path "person.tasks" is to-many', _twentyormexception.TwentyOrmExceptionCode.UNSUPPORTED_OPERATION);
        expect((0, _computetwentyormexceptionutil.computeTwentyOrmException)(error)).toBe(error);
    });
    it('should wrap a non-Error throw rather than reading message off it', ()=>{
        const result = (0, _computetwentyormexceptionutil.computeTwentyOrmException)('connection lost');
        expect(result).toBeInstanceOf(Error);
        expect(result.message).toBe('connection lost');
    });
    it('should keep the original driver error as cause so its detail survives', ()=>{
        const error = buildPostgresError('duplicate key value violates unique constraint "IDX_person_email"', _postgreserrorcodesconstants.POSTGRESQL_ERROR_CODES.UNIQUE_VIOLATION);
        const result = (0, _computetwentyormexceptionutil.computeTwentyOrmException)(error);
        expect(result.cause).toBe(error);
    });
});

//# sourceMappingURL=compute-twenty-orm-exception.util.spec.js.map