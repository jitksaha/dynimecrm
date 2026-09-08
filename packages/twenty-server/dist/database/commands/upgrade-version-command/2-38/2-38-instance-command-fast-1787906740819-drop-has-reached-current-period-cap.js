"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DropHasReachedCurrentPeriodCapFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return DropHasReachedCurrentPeriodCapFastInstanceCommand;
    }
});
const _iscoretablepresentutil = require("./utils/is-core-table-present.util");
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let DropHasReachedCurrentPeriodCapFastInstanceCommand = class DropHasReachedCurrentPeriodCapFastInstanceCommand {
    async up(queryRunner) {
        if (!await (0, _iscoretablepresentutil.isCoreTablePresent)(queryRunner, 'billingSubscriptionItem')) {
            return;
        }
        await queryRunner.query(`ALTER TABLE "core"."billingSubscriptionItem" DROP COLUMN IF EXISTS "hasReachedCurrentPeriodCap"`);
    }
    async down(queryRunner) {
        if (!await (0, _iscoretablepresentutil.isCoreTablePresent)(queryRunner, 'billingSubscriptionItem')) {
            return;
        }
        await queryRunner.query(`ALTER TABLE "core"."billingSubscriptionItem" ADD COLUMN IF NOT EXISTS "hasReachedCurrentPeriodCap" boolean NOT NULL DEFAULT false`);
    }
};
DropHasReachedCurrentPeriodCapFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.38.0', 1787906740819)
], DropHasReachedCurrentPeriodCapFastInstanceCommand);

//# sourceMappingURL=2-38-instance-command-fast-1787906740819-drop-has-reached-current-period-cap.js.map