"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CreateCalendarEventModule", {
    enumerable: true,
    get: function() {
        return CreateCalendarEventModule;
    }
});
const _common = require("@nestjs/common");
const _connectedaccountmetadatamodule = require("../../../engine/metadata-modules/connected-account/connected-account-metadata.module");
const _permissionsmodule = require("../../../engine/metadata-modules/permissions/permissions.module");
const _calendareventcreationmanagermodule = require("./calendar-event-creation-manager.module");
const _createcalendareventresolver = require("./resolvers/create-calendar-event.resolver");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let CreateCalendarEventModule = class CreateCalendarEventModule {
};
CreateCalendarEventModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _calendareventcreationmanagermodule.CalendarEventCreationManagerModule,
            _connectedaccountmetadatamodule.ConnectedAccountMetadataModule,
            _permissionsmodule.PermissionsModule
        ],
        providers: [
            _createcalendareventresolver.CreateCalendarEventResolver
        ]
    })
], CreateCalendarEventModule);

//# sourceMappingURL=create-calendar-event.module.js.map