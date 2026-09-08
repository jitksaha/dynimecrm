"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddTimelineActivityRoutingFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return AddTimelineActivityRoutingFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AddTimelineActivityRoutingFastInstanceCommand = class AddTimelineActivityRoutingFastInstanceCommand {
    async up(queryRunner) {
        await queryRunner.query('ALTER TABLE "core"."timelineActivityType" ADD "targetRelationFieldUniversalIdentifier" uuid');
        await queryRunner.query('ALTER TABLE "core"."timelineActivityType" ADD "triggerFieldUniversalIdentifiers" uuid[]');
    }
    async down(queryRunner) {
        await queryRunner.query('ALTER TABLE "core"."timelineActivityType" DROP COLUMN "triggerFieldUniversalIdentifiers"');
        await queryRunner.query('ALTER TABLE "core"."timelineActivityType" DROP COLUMN "targetRelationFieldUniversalIdentifier"');
    }
};
AddTimelineActivityRoutingFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.34.0', 1787471608313)
], AddTimelineActivityRoutingFastInstanceCommand);

//# sourceMappingURL=2-34-instance-command-fast-1787471608313-add-timeline-activity-routing.js.map