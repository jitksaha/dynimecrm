"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _workspacemigrationrunnerexception = require("../workspace-migration-runner.exception");
describe('WorkspaceMigrationRunnerException', ()=>{
    it('includes the universal identifier of a failed create action in the message', ()=>{
        const action = {
            type: 'create',
            metadataName: 'fieldMetadata',
            flatEntity: {
                universalIdentifier: '20202020-6736-4337-b5c4-8b39fae325a5'
            }
        };
        const exception = new _workspacemigrationrunnerexception.WorkspaceMigrationRunnerException({
            code: _workspacemigrationrunnerexception.WorkspaceMigrationRunnerExceptionCode.EXECUTION_FAILED,
            action,
            errors: {}
        });
        expect(exception.message).toBe("Migration action 'create' for 'fieldMetadata' (universalIdentifier: 20202020-6736-4337-b5c4-8b39fae325a5) failed");
    });
    it('includes the universal identifier of a failed delete action in the message', ()=>{
        const action = {
            type: 'delete',
            metadataName: 'pageLayout',
            universalIdentifier: 'uid-page-layout'
        };
        const exception = new _workspacemigrationrunnerexception.WorkspaceMigrationRunnerException({
            code: _workspacemigrationrunnerexception.WorkspaceMigrationRunnerExceptionCode.EXECUTION_FAILED,
            action,
            errors: {}
        });
        expect(exception.message).toBe("Migration action 'delete' for 'pageLayout' (universalIdentifier: uid-page-layout) failed");
    });
    it('includes the underlying execution errors in the message', ()=>{
        const action = {
            type: 'create',
            metadataName: 'index',
            flatEntity: {
                universalIdentifier: '9e20a0f6-7a18-51c5-a422-5dc4dbd1d972'
            }
        };
        const exception = new _workspacemigrationrunnerexception.WorkspaceMigrationRunnerException({
            code: _workspacemigrationrunnerexception.WorkspaceMigrationRunnerExceptionCode.EXECUTION_FAILED,
            action,
            errors: {
                workspaceSchema: new Error('relation "IDX_abc" already exists')
            }
        });
        expect(exception.message).toBe("Migration action 'create' for 'index' (universalIdentifier: 9e20a0f6-7a18-51c5-a422-5dc4dbd1d972) failed: [workspaceSchema] relation \"IDX_abc\" already exists");
    });
});

//# sourceMappingURL=workspace-migration-runner.exception.spec.js.map