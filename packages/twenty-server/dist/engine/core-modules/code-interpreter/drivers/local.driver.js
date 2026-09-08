"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "LocalDriver", {
    enumerable: true,
    get: function() {
        return LocalDriver;
    }
});
const _child_process = require("child_process");
const _fs = require("fs");
const _os = require("os");
const _path = require("path");
const _utils = require("twenty-shared/utils");
const _uuid = require("uuid");
const _codeinterpreterconstants = require("../code-interpreter.constants");
const _localdriverkernelconst = require("./local-driver-kernel.const");
const _getmimetypeutil = require("../utils/get-mime-type.util");
const SANDBOX_SCRIPTS_PATH = (0, _path.join)(__dirname, '..', 'sandbox-scripts');
async function copyDirectoryRecursive(src, dest) {
    await _fs.promises.mkdir(dest, {
        recursive: true
    });
    const entries = await _fs.promises.readdir(src, {
        withFileTypes: true
    });
    for (const entry of entries){
        const srcPath = (0, _path.join)(src, entry.name);
        const destPath = (0, _path.join)(dest, entry.name);
        if (entry.isDirectory()) {
            await copyDirectoryRecursive(srcPath, destPath);
        } else {
            await _fs.promises.copyFile(srcPath, destPath);
        }
    }
}
const buildEnvSetup = (env)=>{
    if (!(0, _utils.isDefined)(env)) {
        return '';
    }
    const assignments = Object.entries(env).map(([key, value])=>{
        const escapedValue = value.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '\\r');
        return `os.environ['${key}'] = '${escapedValue}'`;
    }).join('\n');
    return `import os\n${assignments}\n\n`;
};
let LocalDriver = class LocalDriver {
    async execute(code, files, context, callbacks) {
        if ((0, _utils.isDefined)(context?.sessionId)) {
            return this.executeInSession(context.sessionId, code, files, context, callbacks);
        }
        return this.executeEphemeral(code, files, context, callbacks);
    }
    // Persistent path: reuse a per-session process + work dir so state survives
    // between calls (variables, imports, files).
    async executeInSession(sessionId, code, files, context, callbacks) {
        const session = await this.getOrCreateSession(sessionId, context?.env);
        // /home/user/output is cleared at the start of every call (matching the E2B
        // behavior and the tool contract).
        await _fs.promises.rm(session.outputDir, {
            recursive: true,
            force: true
        });
        await _fs.promises.mkdir(session.outputDir, {
            recursive: true
        });
        for (const file of files ?? []){
            const safeFilename = (0, _path.basename)(file.filename);
            await _fs.promises.writeFile((0, _path.join)(session.workDir, safeFilename), file.content);
        }
        const rewrittenCode = this.rewriteSandboxPaths(code, session.workDir, session.scriptsDir, session.outputDir);
        const submission = buildEnvSetup(context?.env) + rewrittenCode;
        const timeoutMs = this.options.timeoutMs ?? _codeinterpreterconstants.DEFAULT_CODE_INTERPRETER_TIMEOUT_MS;
        let response;
        try {
            response = await this.runInSession(session, submission, timeoutMs);
        } catch (error) {
            // A timeout or a dead kernel: kill the (possibly wedged) process so the
            // next call recreates a clean one. The 'exit' handler reclaims the work
            // dir.
            session.hasExited = true;
            this.sessions.delete(sessionId);
            session.child.kill('SIGKILL');
            return {
                stdout: '',
                stderr: error instanceof Error ? error.message : String(error),
                exitCode: 1,
                files: [],
                error: error instanceof Error ? error.message : String(error)
            };
        }
        this.streamCaptured(response, callbacks);
        const outputFiles = await this.collectOutputFiles(session.outputDir, callbacks);
        return {
            stdout: response.stdout,
            stderr: response.stderr,
            exitCode: response.exitCode,
            files: outputFiles
        };
    }
    // Ephemeral path (no session): fresh work dir + process per call, cleaned up
    // afterwards. State does NOT persist between calls here.
    async executeEphemeral(code, files, context, callbacks) {
        const workDir = await _fs.promises.mkdtemp((0, _path.join)((0, _os.tmpdir)(), 'code-interpreter-'));
        const outputDir = (0, _path.join)(workDir, 'output');
        const scriptsDir = (0, _path.join)(workDir, 'scripts');
        await _fs.promises.mkdir(outputDir);
        try {
            await copyDirectoryRecursive(SANDBOX_SCRIPTS_PATH, scriptsDir);
        } catch  {
        // Scripts directory might not exist in dev environment
        }
        try {
            for (const file of files ?? []){
                const safeFilename = (0, _path.basename)(file.filename);
                await _fs.promises.writeFile((0, _path.join)(workDir, safeFilename), file.content);
            }
            const rewrittenCode = this.rewriteSandboxPaths(code, workDir, scriptsDir, outputDir);
            const scriptPath = (0, _path.join)(workDir, 'script.py');
            await _fs.promises.writeFile(scriptPath, rewrittenCode);
            const timeoutMs = this.options.timeoutMs ?? _codeinterpreterconstants.DEFAULT_CODE_INTERPRETER_TIMEOUT_MS;
            const { stdout, stderr, exitCode, error } = await this.runPythonScript(scriptPath, workDir, outputDir, context?.env, timeoutMs, callbacks);
            const outputFiles = await this.collectOutputFiles(outputDir, callbacks);
            return {
                stdout,
                stderr,
                exitCode,
                files: outputFiles,
                error
            };
        } finally{
            await _fs.promises.rm(workDir, {
                recursive: true,
                force: true
            });
        }
    }
    rewriteSandboxPaths(code, workDir, scriptsDir, outputDir) {
        // Rewrite E2B-style paths to local paths for compatibility
        return code.replace(/\/home\/user\/scripts\//g, `${scriptsDir}/`).replace(/\/home\/user\/scripts/g, scriptsDir).replace(/\/home\/user\/output\//g, `${outputDir}/`).replace(/\/home\/user\/output/g, outputDir).replace(/\/home\/user\//g, `${workDir}/`).replace(/\/home\/user/g, workDir);
    }
    async collectOutputFiles(outputDir, callbacks) {
        const outputFiles = [];
        try {
            const outputEntries = await _fs.promises.readdir(outputDir, {
                withFileTypes: true
            });
            for (const entry of outputEntries){
                if (entry.isFile()) {
                    const content = await _fs.promises.readFile((0, _path.join)(outputDir, entry.name));
                    const outputFile = {
                        filename: entry.name,
                        content,
                        mimeType: (0, _getmimetypeutil.getMimeType)(entry.name)
                    };
                    outputFiles.push(outputFile);
                    await callbacks?.onResult?.(outputFile);
                }
            }
        } catch  {
        // Output directory might be empty or not exist
        }
        return outputFiles;
    }
    streamCaptured(response, callbacks) {
        for (const line of response.stdout.split('\n')){
            if (line) {
                callbacks?.onStdout?.(line);
            }
        }
        for (const line of response.stderr.split('\n')){
            if (line) {
                callbacks?.onStderr?.(line);
            }
        }
    }
    async getOrCreateSession(sessionId, env) {
        const existing = this.sessions.get(sessionId);
        if ((0, _utils.isDefined)(existing) && !existing.hasExited) {
            return existing;
        }
        if ((0, _utils.isDefined)(existing)) {
            this.sessions.delete(sessionId);
        }
        const sessionDirName = `code-interpreter-session-${sessionId}-${(0, _uuid.v4)()}`;
        const workDir = (0, _path.join)((0, _os.tmpdir)(), sessionDirName);
        const outputDir = (0, _path.join)(workDir, 'output');
        const scriptsDir = (0, _path.join)(workDir, 'scripts');
        await _fs.promises.mkdir(outputDir, {
            recursive: true
        });
        try {
            await copyDirectoryRecursive(SANDBOX_SCRIPTS_PATH, scriptsDir);
        } catch  {
        // Scripts directory might not exist in dev environment
        }
        const kernelPath = (0, _path.join)(workDir, 'kernel.py');
        await _fs.promises.writeFile(kernelPath, _localdriverkernelconst.LOCAL_DRIVER_PERSISTENT_KERNEL_SCRIPT);
        const child = (0, _child_process.spawn)('python3', [
            '-u',
            kernelPath
        ], {
            cwd: workDir,
            env: {
                ...process.env,
                OUTPUT_DIR: outputDir,
                KERNEL_IDLE_TIMEOUT_MS: String(this.options.idleTimeoutMs ?? 0),
                ...env
            },
            stdio: [
                'ignore',
                'ignore',
                'pipe',
                'pipe',
                'pipe'
            ]
        });
        const controlIn = child.stdio[3];
        const controlOut = child.stdio[4];
        const session = {
            workDir,
            outputDir,
            scriptsDir,
            child,
            controlIn,
            controlOut,
            controlBuffer: '',
            hasExited: false
        };
        controlOut.on('data', (chunk)=>{
            session.controlBuffer += chunk.toString();
            let newlineIndex = session.controlBuffer.indexOf('\n');
            while(newlineIndex >= 0){
                const line = session.controlBuffer.slice(0, newlineIndex);
                session.controlBuffer = session.controlBuffer.slice(newlineIndex + 1);
                if (line.trim().length > 0 && (0, _utils.isDefined)(session.pending)) {
                    const pending = session.pending;
                    session.pending = undefined;
                    try {
                        pending.resolve(JSON.parse(line));
                    } catch (error) {
                        pending.reject(error instanceof Error ? error : new Error(String(error)));
                    }
                }
                newlineIndex = session.controlBuffer.indexOf('\n');
            }
        });
        const markExited = ()=>{
            session.hasExited = true;
            this.sessions.delete(sessionId);
            session.pending?.reject(new Error('Python kernel process exited'));
            session.pending = undefined;
            // The kernel self-terminates (idle watchdog) or dies on its own; reclaim
            // its work dir here so it doesn't leak.
            void _fs.promises.rm(workDir, {
                recursive: true,
                force: true
            }).catch(()=>{});
        };
        child.on('exit', markExited);
        child.on('error', markExited);
        this.sessions.set(sessionId, session);
        return session;
    }
    runInSession(session, submission, timeoutMs) {
        return new Promise((resolve, reject)=>{
            const timeout = setTimeout(()=>{
                if (session.pending) {
                    session.pending = undefined;
                    reject(new Error('Process timed out'));
                }
            }, timeoutMs);
            session.pending = {
                resolve: (response)=>{
                    clearTimeout(timeout);
                    resolve(response);
                },
                reject: (error)=>{
                    clearTimeout(timeout);
                    reject(error);
                }
            };
            const payload = JSON.stringify({
                code: Buffer.from(submission, 'utf-8').toString('base64')
            }) + '\n';
            session.controlIn.write(payload, (error)=>{
                if ((0, _utils.isDefined)(error) && session.pending) {
                    session.pending = undefined;
                    clearTimeout(timeout);
                    reject(error);
                }
            });
        });
    }
    runPythonScript(scriptPath, workDir, outputDir, env, timeoutMs, callbacks) {
        return new Promise((resolve)=>{
            const child = (0, _child_process.spawn)('python3', [
                scriptPath
            ], {
                cwd: workDir,
                env: {
                    ...process.env,
                    OUTPUT_DIR: outputDir,
                    ...env
                }
            });
            let stdout = '';
            let stderr = '';
            let killed = false;
            const timeout = setTimeout(()=>{
                killed = true;
                child.kill('SIGKILL');
            }, timeoutMs ?? _codeinterpreterconstants.DEFAULT_CODE_INTERPRETER_TIMEOUT_MS);
            child.stdout.on('data', (data)=>{
                const text = data.toString();
                stdout += text;
                const lines = text.split('\n');
                for (const line of lines){
                    if (line) {
                        callbacks?.onStdout?.(line);
                    }
                }
            });
            child.stderr.on('data', (data)=>{
                const text = data.toString();
                stderr += text;
                const lines = text.split('\n');
                for (const line of lines){
                    if (line) {
                        callbacks?.onStderr?.(line);
                    }
                }
            });
            child.on('close', (code)=>{
                clearTimeout(timeout);
                resolve({
                    stdout,
                    stderr,
                    exitCode: code ?? 0,
                    error: killed ? 'Process timed out' : undefined
                });
            });
            child.on('error', (err)=>{
                clearTimeout(timeout);
                resolve({
                    stdout,
                    stderr,
                    exitCode: 1,
                    error: err.message
                });
            });
        });
    }
    constructor(options = {}){
        this.options = options;
        this.sessions = new Map();
    }
};

//# sourceMappingURL=local.driver.js.map