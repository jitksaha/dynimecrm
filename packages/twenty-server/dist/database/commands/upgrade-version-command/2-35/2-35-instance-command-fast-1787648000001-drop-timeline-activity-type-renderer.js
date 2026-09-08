"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DropTimelineActivityTypeRendererFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return DropTimelineActivityTypeRendererFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let DropTimelineActivityTypeRendererFastInstanceCommand = class DropTimelineActivityTypeRendererFastInstanceCommand {
    async up(queryRunner) {
        await queryRunner.query('ALTER TABLE "core"."timelineActivityType" DROP COLUMN IF EXISTS "renderer"');
    }
    async down(queryRunner) {
        await queryRunner.query('ALTER TABLE "core"."timelineActivityType" ADD COLUMN IF NOT EXISTS "renderer" character varying');
    }
};
DropTimelineActivityTypeRendererFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.35.0', 1787648000001)
], DropTimelineActivityTypeRendererFastInstanceCommand);

//# sourceMappingURL=2-35-instance-command-fast-1787648000001-drop-timeline-activity-type-renderer.js.map