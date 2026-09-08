"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "LocalChildProcessRunnerService", {
    enumerable: true,
    get: function() {
        return LocalChildProcessRunnerService;
    }
});
const _fs = require("fs");
const _nodechild_process = require("node:child_process");
const _path = require("path");
const _getlocaldepslayerpathutil = require("../utils/get-local-deps-layer-path.util");
const _getlocalsdklayerpathutil = require("../utils/get-local-sdk-layer-path.util");
const _handlercontant = require("../../../../../../metadata-modules/logic-function/constants/handler.contant");
let LocalChildProcessRunnerService = class LocalChildProcessRunnerService {
    // Symlinks everything from the deps layer except twenty-client-sdk,
    // which comes from the SDK layer (workspace-specific generated client).
    async assembleNodeModules({ sourceTemporaryDir, flatApplication, applicationUniversalIdentifier }) {
        const depsNodeModules = (0, _path.join)((0, _getlocaldepslayerpathutil.getLocalDepsLayerPath)(flatApplication), 'node_modules');
        const sdkNodeModules = (0, _path.join)((0, _getlocalsdklayerpathutil.getLocalSdkLayerPath)({
            workspaceId: flatApplication.workspaceId,
            applicationUniversalIdentifier
        }), 'node_modules');
        const execNodeModules = (0, _path.join)(sourceTemporaryDir, 'node_modules');
        await _fs.promises.mkdir(execNodeModules, {
            recursive: true
        });
        const entries = await _fs.promises.readdir(depsNodeModules, {
            withFileTypes: true
        });
        const symlinkPromises = entries.filter((entry)=>entry.name !== 'twenty-client-sdk').map((entry)=>_fs.promises.symlink((0, _path.join)(depsNodeModules, entry.name), (0, _path.join)(execNodeModules, entry.name), entry.isDirectory() ? 'dir' : 'file'));
        await Promise.all(symlinkPromises);
        await _fs.promises.symlink((0, _path.join)(sdkNodeModules, 'twenty-client-sdk'), (0, _path.join)(execNodeModules, 'twenty-client-sdk'), 'dir');
    }
    async writeBootstrapRunner({ dir, builtFileAbsPath, handlerName }) {
        if (!_handlercontant.HANDLER_NAME_REGEX.test(handlerName)) {
            throw new Error(`Invalid handlerName "${handlerName}": must be a valid JavaScript identifier or dotted path`);
        }
        const runnerPath = (0, _path.join)(dir, '__runner.cjs');
        const handlerAccessor = `mod?.${handlerName.split('.').join('?.')}`;
        const code = `
      // Auto-generated. Do not edit.
      const { pathToFileURL } = require('node:url');

      (async () => {
        try {
          const builtUrl = pathToFileURL(${JSON.stringify(builtFileAbsPath)});
          const mod = await import(builtUrl.href);
          const handlerFn = ${handlerAccessor};
          if (typeof handlerFn !== 'function') {
            throw new Error('Export "' + ${JSON.stringify(handlerName)} + '" not found in function bundle');
          }

          let payload = undefined;
          if (process.send) {
            process.on('message', async (msg) => {
              if (!msg || msg.type !== 'run') return;
              try {
                const out = await handlerFn(msg.payload, msg.context);
                // Wait for the async IPC flush before exiting, otherwise results
                // larger than the OS pipe buffer are dropped before delivery.
                if (process.send) {
                  process.send({ ok: true, result: out }, () => process.exit(0));
                } else {
                  process.exit(0);
                }
              } catch (error) {
                if (process.send) {
                  process.send({
                    ok: false,
                    errorType: error instanceof Error ? error.name : 'Error',
                    error: error instanceof Error ? error.message : String(error),
                    stack: error?.stack,
                  }, () => process.exit(1));
                } else {
                  process.exit(1);
                }
              }
            });
          } else {
            // Fallback for a runner started without IPC: the context travels as
            // argv[3] because the script is written once, before any run exists.
            const json = process.argv[2];
            payload = json ? JSON.parse(json) : undefined;
            const contextJson = process.argv[3];
            const out = await handlerFn(payload, contextJson ? JSON.parse(contextJson) : undefined);
            process.stdout.write(JSON.stringify({ ok: true, result: out }), () => process.exit(0));
          }
        } catch (error) {
          const errorMessage = String(error);
          if (process.send) {
            process.send({
              ok: false,
              errorType: error instanceof Error ? error.name : 'Error',
              error: error instanceof Error ? error.message : errorMessage,
              stack: error?.stack,
            }, () => process.exit(1));
          } else {
            process.stdout.write(errorMessage, () => process.exit(1));
          }
        }
      })();
    `;
        await _fs.promises.writeFile(runnerPath, code, 'utf8');
        return runnerPath;
    }
    runChildWithEnv(options) {
        const { runnerPath, env, payload, context, timeoutMs } = options;
        return new Promise((resolve)=>{
            // Strip NODE_OPTIONS to prevent tsx loader from being inherited
            const { NODE_OPTIONS: _n1, ...cleanProcessEnv } = process.env;
            const { NODE_OPTIONS: _n2, ...cleanUserEnv } = env;
            const child = (0, _nodechild_process.spawn)(process.execPath, [
                runnerPath
            ], {
                env: {
                    ...cleanProcessEnv,
                    ...cleanUserEnv
                },
                stdio: [
                    'pipe',
                    'pipe',
                    'pipe',
                    'ipc'
                ]
            });
            let stdout = '';
            let stderr = '';
            let settled = false;
            child.stdout?.on('data', (d)=>stdout += String(d));
            child.stderr?.on('data', (d)=>stderr += String(d));
            child.on('message', (msg)=>{
                if (settled) return;
                settled = true;
                resolve({
                    ...msg,
                    stdout,
                    stderr
                });
            });
            child.on('exit', (code)=>{
                if (settled) return;
                settled = true;
                if (code === 0) {
                    resolve({
                        ok: true,
                        stdout,
                        stderr
                    });
                } else {
                    resolve({
                        ok: false,
                        error: `Exited with code ${code}`,
                        stdout,
                        stderr
                    });
                }
            });
            const t = setTimeout(()=>{
                if (settled) return;
                settled = true;
                child.kill('SIGKILL');
                resolve({
                    ok: false,
                    error: `Timed out after ${timeoutMs}ms`,
                    stdout,
                    stderr
                });
            }, timeoutMs);
            child.send?.({
                type: 'run',
                payload,
                context
            });
            child.on('close', ()=>clearTimeout(t));
        });
    }
};

//# sourceMappingURL=local-child-process-runner.service.js.map