"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ConsoleEventSink", {
    enumerable: true,
    get: function() {
        return ConsoleEventSink;
    }
});
const _common = require("@nestjs/common");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ConsoleEventSink = class ConsoleEventSink {
    async write(events) {
        for (const event of events){
            if (event.table === 'applicationLog') {
                const context = `${event.row.logicFunctionName}:${event.row.executionId}`;
                switch(event.row.level){
                    case 'ERROR':
                        this.logger.error(event.row.message, undefined, context);
                        break;
                    case 'WARN':
                        this.logger.warn(event.row.message, context);
                        break;
                    case 'DEBUG':
                        this.logger.debug(event.row.message, context);
                        break;
                    default:
                        this.logger.log(event.row.message, context);
                        break;
                }
            } else {
                this.logger.log(JSON.stringify(event.row), event.table);
            }
        }
    }
    constructor(){
        this.logger = new _common.Logger(ConsoleEventSink.name);
    }
};
ConsoleEventSink = _ts_decorate([
    (0, _common.Injectable)()
], ConsoleEventSink);

//# sourceMappingURL=console-event.sink.js.map