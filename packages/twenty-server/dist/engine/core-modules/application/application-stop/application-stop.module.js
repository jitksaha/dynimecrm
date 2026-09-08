"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ApplicationStopModule", {
    enumerable: true,
    get: function() {
        return ApplicationStopModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _applicationregistrationentity = require("../application-registration/application-registration.entity");
const _applicationstopservice = require("./application-stop.service");
const _applicationkillswitchcommand = require("./commands/application-kill-switch.command");
const _applicationentity = require("../application.entity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ApplicationStopModule = class ApplicationStopModule {
};
ApplicationStopModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _typeorm.TypeOrmModule.forFeature([
                _applicationregistrationentity.ApplicationRegistrationEntity,
                _applicationentity.ApplicationEntity
            ])
        ],
        providers: [
            _applicationstopservice.ApplicationStopService,
            _applicationkillswitchcommand.ApplicationKillSwitchCommand
        ],
        exports: [
            _applicationstopservice.ApplicationStopService
        ]
    })
], ApplicationStopModule);

//# sourceMappingURL=application-stop.module.js.map