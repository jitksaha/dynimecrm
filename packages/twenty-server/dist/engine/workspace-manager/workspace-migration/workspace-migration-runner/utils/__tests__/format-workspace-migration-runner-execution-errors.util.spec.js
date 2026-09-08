"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _typeorm = require("typeorm");
const _formatworkspacemigrationrunnerexecutionerrorsutil = require("../format-workspace-migration-runner-execution-errors.util");
const buildQueryFailedError = ({ message, code, detail })=>{
    const driverError = new Error(message);
    Object.assign(driverError, {
        code,
        detail
    });
    return new _typeorm.QueryFailedError('INSERT INTO "core"."index"', [], driverError);
};
describe('formatWorkspaceMigrationRunnerExecutionErrors', ()=>{
    it('returns undefined when no error is set', ()=>{
        expect((0, _formatworkspacemigrationrunnerexecutionerrorsutil.formatWorkspaceMigrationRunnerExecutionErrors)({})).toBeUndefined();
    });
    it('formats a plain error with its origin label', ()=>{
        expect((0, _formatworkspacemigrationrunnerexecutionerrorsutil.formatWorkspaceMigrationRunnerExecutionErrors)({
            metadata: new Error('column "label" cannot be null')
        })).toBe('[metadata] column "label" cannot be null');
    });
    it('includes postgres code and detail of a QueryFailedError', ()=>{
        expect((0, _formatworkspacemigrationrunnerexecutionerrorsutil.formatWorkspaceMigrationRunnerExecutionErrors)({
            workspaceSchema: buildQueryFailedError({
                message: 'relation "IDX_abc" already exists',
                code: '42P07'
            })
        })).toBe('[workspaceSchema] relation "IDX_abc" already exists (pg code: 42P07)');
        expect((0, _formatworkspacemigrationrunnerexecutionerrorsutil.formatWorkspaceMigrationRunnerExecutionErrors)({
            metadata: buildQueryFailedError({
                message: 'duplicate key value violates unique constraint "UQ_name"',
                code: '23505',
                detail: 'Key (name)=(foo) already exists.'
            })
        })).toBe('[metadata] duplicate key value violates unique constraint "UQ_name" (pg code: 23505, detail: Key (name)=(foo) already exists.)');
    });
    it('joins multiple errors', ()=>{
        expect((0, _formatworkspacemigrationrunnerexecutionerrorsutil.formatWorkspaceMigrationRunnerExecutionErrors)({
            metadata: new Error('column "label" cannot be null'),
            workspaceSchema: new Error('table already exists')
        })).toBe('[metadata] column "label" cannot be null; [workspaceSchema] table already exists');
    });
    it('hides a 25P02 aborted-transaction error when a root cause is available', ()=>{
        expect((0, _formatworkspacemigrationrunnerexecutionerrorsutil.formatWorkspaceMigrationRunnerExecutionErrors)({
            metadata: buildQueryFailedError({
                message: 'current transaction is aborted',
                code: '25P02'
            }),
            workspaceSchema: buildQueryFailedError({
                message: 'relation "IDX_abc" already exists',
                code: '42P07'
            })
        })).toBe('[workspaceSchema] relation "IDX_abc" already exists (pg code: 42P07)');
    });
    it('keeps a 25P02 error when it is the only one', ()=>{
        expect((0, _formatworkspacemigrationrunnerexecutionerrorsutil.formatWorkspaceMigrationRunnerExecutionErrors)({
            metadata: buildQueryFailedError({
                message: 'current transaction is aborted',
                code: '25P02'
            })
        })).toBe('[metadata] current transaction is aborted (pg code: 25P02)');
    });
    it('truncates an oversized summary to the cap, marker included', ()=>{
        const summary = (0, _formatworkspacemigrationrunnerexecutionerrorsutil.formatWorkspaceMigrationRunnerExecutionErrors)({
            metadata: new Error('x'.repeat(5_000))
        });
        expect(summary).toHaveLength(1_500);
        expect(summary?.endsWith(' [truncated]')).toBe(true);
    });
    it('stringifies a non-Error rejection value', ()=>{
        expect((0, _formatworkspacemigrationrunnerexecutionerrorsutil.formatWorkspaceMigrationRunnerExecutionErrors)({
            metadata: 'plain string rejection'
        })).toBe('[metadata] plain string rejection');
    });
});

//# sourceMappingURL=format-workspace-migration-runner-execution-errors.util.spec.js.map