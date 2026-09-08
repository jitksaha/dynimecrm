"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "EnforceTimelineActivityTypeEmitUniquenessFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return EnforceTimelineActivityTypeEmitUniquenessFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
const BASE_EMIT_SLOT_INDEX_NAME = 'IDX_TIMELINE_ACTIVITY_TYPE_BASE_EMIT_SLOT_UNIQUE';
const OVERRIDE_EMIT_SLOT_INDEX_NAME = 'IDX_TIMELINE_ACTIVITY_TYPE_OVERRIDE_EMIT_SLOT_UNIQUE';
let EnforceTimelineActivityTypeEmitUniquenessFastInstanceCommand = class EnforceTimelineActivityTypeEmitUniquenessFastInstanceCommand {
    async up(queryRunner) {
        await queryRunner.query(`CREATE UNIQUE INDEX "${BASE_EMIT_SLOT_INDEX_NAME}" ON "core"."timelineActivityType" ("workspaceId", "action", "objectUniversalIdentifier", "targetRelationFieldUniversalIdentifier") NULLS NOT DISTINCT WHERE "action" IS NOT NULL AND "replacesTimelineActivityTypeUniversalIdentifier" IS NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "${OVERRIDE_EMIT_SLOT_INDEX_NAME}" ON "core"."timelineActivityType" ("workspaceId", "action", "objectUniversalIdentifier", "targetRelationFieldUniversalIdentifier") NULLS NOT DISTINCT WHERE "action" IS NOT NULL AND "replacesTimelineActivityTypeUniversalIdentifier" IS NOT NULL`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX "core"."${OVERRIDE_EMIT_SLOT_INDEX_NAME}"`);
        await queryRunner.query(`DROP INDEX "core"."${BASE_EMIT_SLOT_INDEX_NAME}"`);
    }
};
EnforceTimelineActivityTypeEmitUniquenessFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.34.0', 1787471608316)
], EnforceTimelineActivityTypeEmitUniquenessFastInstanceCommand);

//# sourceMappingURL=2-34-instance-command-fast-1787471608316-enforce-timeline-activity-type-emit-uniqueness.js.map