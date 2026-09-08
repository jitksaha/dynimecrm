"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CodeInterpreterService", {
    enumerable: true,
    get: function() {
        return CodeInterpreterService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _codeinterpreterdriverfactory = require("./code-interpreter-driver.factory");
const _codeinterpreterinterface = require("./code-interpreter.interface");
const _twentyconfigservice = require("../twenty-config/twenty-config.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let CodeInterpreterService = class CodeInterpreterService {
    isEnabled() {
        return this.twentyConfigService.get('CODE_INTERPRETER_TYPE') !== _codeinterpreterinterface.CodeInterpreterDriverType.DISABLED;
    }
    async releaseThreadSandbox(workspaceId, threadId) {
        await this.codeInterpreterDriverFactory.getCurrentDriver().releaseSession?.(`${workspaceId}:${threadId}`);
    }
    async sweepExpiredSandboxes() {
        const maxAgeMs = this.twentyConfigService.get('CODE_INTERPRETER_SESSION_MAX_AGE_MS');
        return await this.codeInterpreterDriverFactory.getCurrentDriver().sweepExpiredSessions?.(maxAgeMs) ?? 0;
    }
    execute(code, files, context, callbacks) {
        const sessionId = context?.sessionId;
        if ((0, _utils.isDefined)(sessionId)) {
            return this.runSerializedPerSession(sessionId, ()=>this.runOnDriver(code, files, context, callbacks));
        }
        return this.runOnDriver(code, files, context, callbacks);
    }
    runOnDriver(code, files, context, callbacks) {
        return this.codeInterpreterDriverFactory.getCurrentDriver().execute(code, files, context, callbacks);
    }
    async runSerializedPerSession(sessionId, task) {
        const previous = this.sessionExecutionTails.get(sessionId) ?? Promise.resolve();
        const result = previous.then(task, task);
        const tail = result.then(()=>undefined, ()=>undefined);
        this.sessionExecutionTails.set(sessionId, tail);
        try {
            return await result;
        } finally{
            if (this.sessionExecutionTails.get(sessionId) === tail) {
                this.sessionExecutionTails.delete(sessionId);
            }
        }
    }
    constructor(codeInterpreterDriverFactory, twentyConfigService){
        this.codeInterpreterDriverFactory = codeInterpreterDriverFactory;
        this.twentyConfigService = twentyConfigService;
        // One active stream per thread (the chat resolver queues the rest), so
        // in-process chaining is enough to serialize a session — no distributed lock.
        this.sessionExecutionTails = new Map();
    }
};
CodeInterpreterService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _codeinterpreterdriverfactory.CodeInterpreterDriverFactory === "undefined" ? Object : _codeinterpreterdriverfactory.CodeInterpreterDriverFactory,
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService
    ])
], CodeInterpreterService);

//# sourceMappingURL=code-interpreter.service.js.map