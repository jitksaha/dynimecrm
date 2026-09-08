"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "E2BDriver", {
    enumerable: true,
    get: function() {
        return E2BDriver;
    }
});
const _fs = require("fs");
const _path = require("path");
const _codeinterpreter = require("@e2b/code-interpreter");
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _codeinterpreterconstants = require("../code-interpreter.constants");
const _getorcreatesessionsandboxutil = require("./utils/get-or-create-session-sandbox.util");
const _releasesessionsandboxesutil = require("./utils/release-session-sandboxes.util");
const _sweepexpiredsessionsandboxesutil = require("./utils/sweep-expired-session-sandboxes.util");
const _getmimetypeutil = require("../utils/get-mime-type.util");
const SANDBOX_SCRIPTS_PATH = (0, _path.join)(__dirname, '..', 'sandbox-scripts');
async function uploadDirectoryToSandbox(sandbox, localPath, remotePath) {
    const entries = await _fs.promises.readdir(localPath, {
        withFileTypes: true
    });
    for (const entry of entries){
        const localEntryPath = (0, _path.join)(localPath, entry.name);
        const remoteEntryPath = `${remotePath}/${entry.name}`;
        if (entry.isDirectory()) {
            await uploadDirectoryToSandbox(sandbox, localEntryPath, remoteEntryPath);
        } else {
            const content = await _fs.promises.readFile(localEntryPath);
            const arrayBuffer = new Uint8Array(content).buffer;
            await sandbox.files.write(remoteEntryPath, arrayBuffer);
        }
    }
}
let E2BDriver = class E2BDriver {
    async execute(code, files, context, callbacks) {
        const { apiKey } = this.options;
        const sessionId = context?.sessionId;
        const idleTimeoutMs = this.options.idleTimeoutMs ?? _codeinterpreterconstants.DEFAULT_CODE_INTERPRETER_TIMEOUT_MS;
        const timeoutMs = this.options.timeoutMs ?? _codeinterpreterconstants.DEFAULT_CODE_INTERPRETER_TIMEOUT_MS;
        let sandbox;
        let isReused = false;
        let keepWarm = false;
        if ((0, _utils.isDefined)(sessionId)) {
            keepWarm = true;
            ({ sandbox, isReused } = await (0, _getorcreatesessionsandboxutil.getOrCreateSessionSandbox)({
                sandboxApi: _codeinterpreter.Sandbox,
                apiKey,
                sessionId,
                timeoutMs,
                idleTimeoutMs
            }));
        } else {
            sandbox = await _codeinterpreter.Sandbox.create({
                apiKey,
                timeoutMs
            });
        }
        try {
            // A reused sandbox already has the scripts from its first run.
            if (!isReused) {
                try {
                    await uploadDirectoryToSandbox(sandbox, SANDBOX_SCRIPTS_PATH, '/home/user/scripts');
                } catch  {
                // Scripts directory might not exist
                }
            }
            if (isReused) {
                await this.resetOutputDirectory(sandbox);
            }
            for (const file of files ?? []){
                const arrayBuffer = new Uint8Array(file.content).buffer;
                await sandbox.files.write(`/home/user/${file.filename}`, arrayBuffer);
            }
            const envSetup = context?.env ? `import os\n${Object.entries(context.env).map(([key, value])=>{
                const escapedValue = value.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '\\r');
                return `os.environ['${key}'] = '${escapedValue}'`;
            }).join('\n')}\n\n` : '';
            const outputFiles = [];
            let chartCounter = 0;
            const execution = await sandbox.runCode(envSetup + code, {
                onStdout: (data)=>callbacks?.onStdout?.(data.line),
                onStderr: (data)=>callbacks?.onStderr?.(data.line),
                onResult: async (result)=>{
                    if (result.png) {
                        const outputFile = {
                            filename: `chart-${chartCounter++}.png`,
                            content: Buffer.from(result.png, 'base64'),
                            mimeType: 'image/png'
                        };
                        outputFiles.push(outputFile);
                        await callbacks?.onResult?.(outputFile);
                    }
                }
            });
            try {
                const outputDir = await sandbox.files.list('/home/user/output');
                for (const file of outputDir){
                    if (file.type === 'file') {
                        const content = await sandbox.files.read(`/home/user/output/${file.name}`, {
                            format: 'bytes'
                        });
                        const outputFile = {
                            filename: file.name,
                            content: Buffer.from(content),
                            mimeType: (0, _getmimetypeutil.getMimeType)(file.name)
                        };
                        outputFiles.push(outputFile);
                        await callbacks?.onResult?.(outputFile);
                    }
                }
            } catch  {
            // Output directory doesn't exist - that's fine
            }
            return {
                stdout: execution.logs.stdout.join('\n'),
                stderr: execution.logs.stderr.join('\n'),
                exitCode: execution.error ? 1 : 0,
                files: outputFiles,
                error: execution.error?.value
            };
        } finally{
            if (!keepWarm) {
                await sandbox.kill();
            }
        }
    }
    async resetOutputDirectory(sandbox) {
        const outputDirectory = '/home/user/output';
        try {
            if (await sandbox.files.exists(outputDirectory)) {
                await sandbox.files.remove(outputDirectory);
            }
            await sandbox.files.makeDir(outputDirectory);
        } catch (error) {
            const reason = error instanceof Error ? error.message : String(error);
            this.logger.warn(`Failed to reset reused sandbox output directory; results may include stale files: ${reason}`);
        }
    }
    async releaseSession(sessionId) {
        await (0, _releasesessionsandboxesutil.releaseSessionSandboxes)(_codeinterpreter.Sandbox, this.options.apiKey, sessionId);
    }
    async sweepExpiredSessions(maxAgeMs) {
        return (0, _sweepexpiredsessionsandboxesutil.sweepExpiredSessionSandboxes)(_codeinterpreter.Sandbox, this.options.apiKey, maxAgeMs);
    }
    constructor(options){
        this.options = options;
        this.logger = new _common.Logger(E2BDriver.name);
    }
};

//# sourceMappingURL=e2b.driver.js.map