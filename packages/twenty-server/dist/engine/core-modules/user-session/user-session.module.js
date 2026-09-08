"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UserSessionModule", {
    enumerable: true,
    get: function() {
        return UserSessionModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _apptokenentity = require("../app-token/app-token.entity");
const _eventlogemittermodule = require("../event-logs/emit/event-log-emitter.module");
const _jwtmodule = require("../jwt/jwt.module");
const _usersessioncleanupcroncommand = require("./crons/commands/user-session-cleanup.cron.command");
const _usersessioncleanupcronjob = require("./crons/jobs/user-session-cleanup.cron.job");
const _usersessioncookieservice = require("./services/user-session-cookie.service");
const _usersessionservice = require("./services/user-session.service");
const _usersessionentity = require("./user-session.entity");
const _usersessionresolver = require("./user-session.resolver");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let UserSessionModule = class UserSessionModule {
};
UserSessionModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _typeorm.TypeOrmModule.forFeature([
                _usersessionentity.UserSessionEntity,
                _apptokenentity.AppTokenEntity
            ]),
            _jwtmodule.JwtModule,
            _eventlogemittermodule.EventLogEmitterModule
        ],
        providers: [
            _usersessionservice.UserSessionService,
            _usersessioncookieservice.UserSessionCookieService,
            _usersessionresolver.UserSessionResolver,
            _usersessioncleanupcronjob.UserSessionCleanupCronJob,
            _usersessioncleanupcroncommand.UserSessionCleanupCronCommand
        ],
        exports: [
            _usersessionservice.UserSessionService,
            _usersessioncookieservice.UserSessionCookieService,
            _usersessioncleanupcroncommand.UserSessionCleanupCronCommand
        ]
    })
], UserSessionModule);

//# sourceMappingURL=user-session.module.js.map