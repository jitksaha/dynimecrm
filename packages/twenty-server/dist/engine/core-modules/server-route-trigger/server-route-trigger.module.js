"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ServerRouteTriggerModule", {
    enumerable: true,
    get: function() {
        return ServerRouteTriggerModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _logicfunctionexecutormodule = require("../logic-function/logic-function-executor/logic-function-executor.module");
const _serverroutetriggercontroller = require("./server-route-trigger.controller");
const _serverroutetriggerservice = require("./server-route-trigger.service");
const _logicfunctionentity = require("../../metadata-modules/logic-function/logic-function.entity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ServerRouteTriggerModule = class ServerRouteTriggerModule {
};
ServerRouteTriggerModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _typeorm.TypeOrmModule.forFeature([
                _logicfunctionentity.LogicFunctionEntity
            ]),
            _logicfunctionexecutormodule.LogicFunctionExecutorModule
        ],
        controllers: [
            _serverroutetriggercontroller.ServerRouteTriggerController
        ],
        providers: [
            _serverroutetriggerservice.ServerRouteTriggerService
        ]
    })
], ServerRouteTriggerModule);

//# sourceMappingURL=server-route-trigger.module.js.map