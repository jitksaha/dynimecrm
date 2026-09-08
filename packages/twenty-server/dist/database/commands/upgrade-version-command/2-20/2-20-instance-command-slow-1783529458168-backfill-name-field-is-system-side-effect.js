"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BackfillNameFieldIsSystemSideEffectSlowInstanceCommand", {
    enumerable: true,
    get: function() {
        return BackfillNameFieldIsSystemSideEffectSlowInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let BackfillNameFieldIsSystemSideEffectSlowInstanceCommand = class BackfillNameFieldIsSystemSideEffectSlowInstanceCommand {
    async runDataMigration(dataSource) {
        await dataSource.query(`UPDATE "core"."fieldMetadata" SET "isSystemSideEffect" = false WHERE "name" = 'name' AND "isSystemSideEffect" = true`);
    }
    async up(_queryRunner) {
        return;
    }
    // Intentional no-op: this backfill cannot be safely reversed. Pre-2.15 `name`
    async down(_queryRunner) {
        return;
    }
};
BackfillNameFieldIsSystemSideEffectSlowInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.20.0', 1783529458168, {
        type: 'slow'
    })
], BackfillNameFieldIsSystemSideEffectSlowInstanceCommand);

//# sourceMappingURL=2-20-instance-command-slow-1783529458168-backfill-name-field-is-system-side-effect.js.map