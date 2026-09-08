"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CommandShutdownService", {
    enumerable: true,
    get: function() {
        return CommandShutdownService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
const SHUTDOWN_SIGNALS = [
    'SIGINT',
    'SIGTERM'
];
const EXIT_CODE_BY_SIGNAL = {
    SIGINT: 130,
    SIGTERM: 143
};
let CommandShutdownService = class CommandShutdownService {
    listenToShutdownSignals() {
        if (this.isListening) {
            return;
        }
        this.isListening = true;
        for (const shutdownSignal of SHUTDOWN_SIGNALS){
            process.on(shutdownSignal, ()=>this.handleSignal(shutdownSignal));
        }
    }
    isShutdownRequested() {
        return (0, _utils.isDefined)(this.receivedSignal);
    }
    handleSignal(shutdownSignal) {
        if (this.isShutdownRequested()) {
            this.logger.warn(`Received ${shutdownSignal} again, exiting immediately. ` + 'The step in progress is left unfinished, rerun the command to resume from the last recorded step.');
            process.exit(EXIT_CODE_BY_SIGNAL[shutdownSignal]);
        }
        this.receivedSignal = shutdownSignal;
        process.exitCode = EXIT_CODE_BY_SIGNAL[shutdownSignal];
        this.logger.warn(`Received ${shutdownSignal}, finishing the step in progress then stopping. ` + `Send ${shutdownSignal} again to exit immediately.`);
    }
    constructor(){
        this.logger = new _common.Logger(CommandShutdownService.name);
        this.isListening = false;
    }
};
CommandShutdownService = _ts_decorate([
    (0, _common.Injectable)()
], CommandShutdownService);

//# sourceMappingURL=command-shutdown.service.js.map