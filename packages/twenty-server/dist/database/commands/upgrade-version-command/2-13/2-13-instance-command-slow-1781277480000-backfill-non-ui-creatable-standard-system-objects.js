"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BackfillNonUiCreatableStandardSystemObjectsSlowInstanceCommand", {
    enumerable: true,
    get: function() {
        return BackfillNonUiCreatableStandardSystemObjectsSlowInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
// The create-record UI affordance is now gated on isUICreatable alone (the
// !isSystem clause was dropped). Standard system objects relied on that clause
// to stay non-creatable, so their isUICreatable (default true) must be flipped
// to false to preserve behavior. Sync/system-created objects only — the
// user-creatable system objects (e.g. marketing message lists) keep true.
const NON_UI_CREATABLE_STANDARD_SYSTEM_OBJECT_NAMES = [
    'attachment',
    'blocklist',
    'calendarChannelEventAssociation',
    'calendarEventParticipant',
    'calendarEvent',
    'callRecording',
    'messageChannelMessageAssociation',
    'messageChannelMessageAssociationMessageFolder',
    'messageParticipant',
    'messageThread',
    'message',
    'noteTarget',
    'taskTarget',
    'timelineActivity',
    'workflowAutomatedTrigger'
];
let BackfillNonUiCreatableStandardSystemObjectsSlowInstanceCommand = class BackfillNonUiCreatableStandardSystemObjectsSlowInstanceCommand {
    async runDataMigration(dataSource) {
        await dataSource.query(`UPDATE "core"."objectMetadata"
       SET "isUICreatable" = false
       WHERE "isSystem" = true
         AND "isUICreatable" = true
         AND "nameSingular" = ANY($1)`, [
            NON_UI_CREATABLE_STANDARD_SYSTEM_OBJECT_NAMES
        ]);
    }
    async up(_queryRunner) {
        return;
    }
    async down(_queryRunner) {
        return;
    }
};
BackfillNonUiCreatableStandardSystemObjectsSlowInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.13.0', 1781277480000, {
        type: 'slow'
    })
], BackfillNonUiCreatableStandardSystemObjectsSlowInstanceCommand);

//# sourceMappingURL=2-13-instance-command-slow-1781277480000-backfill-non-ui-creatable-standard-system-objects.js.map