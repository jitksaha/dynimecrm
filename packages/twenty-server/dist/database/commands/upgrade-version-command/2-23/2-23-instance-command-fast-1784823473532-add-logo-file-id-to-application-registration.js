"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddLogoFileIdToApplicationRegistration2_23FastInstanceCommand", {
    enumerable: true,
    get: function() {
        return AddLogoFileIdToApplicationRegistration2_23FastInstanceCommand;
    }
});
const _ensureapplicationregistrationlogofileidcolumnutil = require("./utils/ensure-application-registration-logo-file-id-column.util");
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AddLogoFileIdToApplicationRegistration2_23FastInstanceCommand = class AddLogoFileIdToApplicationRegistration2_23FastInstanceCommand {
    async up(queryRunner) {
        await (0, _ensureapplicationregistrationlogofileidcolumnutil.ensureApplicationRegistrationLogoFileIdColumn)((sql)=>queryRunner.query(sql));
    }
    async down(queryRunner) {
        await (0, _ensureapplicationregistrationlogofileidcolumnutil.dropApplicationRegistrationLogoFileIdColumn)((sql)=>queryRunner.query(sql));
    }
};
AddLogoFileIdToApplicationRegistration2_23FastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.23.0', 1784823473532)
], AddLogoFileIdToApplicationRegistration2_23FastInstanceCommand);

//# sourceMappingURL=2-23-instance-command-fast-1784823473532-add-logo-file-id-to-application-registration.js.map