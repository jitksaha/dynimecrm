"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _promises = require("node:fs/promises");
const _nodeos = require("node:os");
const _nodepath = require("node:path");
const _localchildprocessrunnerservice = require("./local-child-process-runner.service");
describe('LocalChildProcessRunnerService', ()=>{
    it('preserves a thrown error name in the child-process result', async ()=>{
        jest.useRealTimers();
        const logicFunctionDirectory = await (0, _promises.mkdtemp)((0, _nodepath.join)((0, _nodeos.tmpdir)(), 'twenty-retryable-logic-function-'));
        try {
            const builtLogicFunctionPath = (0, _nodepath.join)(logicFunctionDirectory, 'logic-function.mjs');
            await (0, _promises.writeFile)(builtLogicFunctionPath, `export const main = async (_payload, context) => {
          const retryableError = new Error('Dependency unavailable on retry ' + context.retryCount);
          retryableError.name = 'RetryableLogicFunctionError';
          throw retryableError;
        };`, 'utf8');
            const localChildProcessRunnerService = new _localchildprocessrunnerservice.LocalChildProcessRunnerService();
            const runnerPath = await localChildProcessRunnerService.writeBootstrapRunner({
                dir: logicFunctionDirectory,
                builtFileAbsPath: builtLogicFunctionPath,
                handlerName: 'main'
            });
            const executionResult = await localChildProcessRunnerService.runChildWithEnv({
                runnerPath,
                env: {},
                payload: {},
                context: {
                    retryCount: 2,
                    maxRetries: 3,
                    workspaceId: 'workspace-1',
                    userWorkspaceId: null,
                    workspaceMemberId: null
                },
                timeoutMs: 5_000
            });
            expect(executionResult).toMatchObject({
                ok: false,
                errorType: 'RetryableLogicFunctionError',
                error: 'Dependency unavailable on retry 2'
            });
        } finally{
            await (0, _promises.rm)(logicFunctionDirectory, {
                recursive: true,
                force: true
            });
            jest.useFakeTimers();
        }
    });
});

//# sourceMappingURL=local-child-process-runner.service.spec.js.map