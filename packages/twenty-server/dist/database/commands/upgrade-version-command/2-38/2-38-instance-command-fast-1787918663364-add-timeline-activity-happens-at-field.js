"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddTimelineActivityHappensAtFieldFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return AddTimelineActivityHappensAtFieldFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AddTimelineActivityHappensAtFieldFastInstanceCommand = class AddTimelineActivityHappensAtFieldFastInstanceCommand {
    async up(queryRunner) {
        await queryRunner.query('ALTER TABLE "core"."timelineActivityType" ADD "happensAtFieldUniversalIdentifier" uuid');
    }
    async down(queryRunner) {
        await queryRunner.query('ALTER TABLE "core"."timelineActivityType" DROP COLUMN "happensAtFieldUniversalIdentifier"');
    }
};
AddTimelineActivityHappensAtFieldFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.38.0', 1787918663364)
], AddTimelineActivityHappensAtFieldFastInstanceCommand);

//# sourceMappingURL=2-38-instance-command-fast-1787918663364-add-timeline-activity-happens-at-field.js.map