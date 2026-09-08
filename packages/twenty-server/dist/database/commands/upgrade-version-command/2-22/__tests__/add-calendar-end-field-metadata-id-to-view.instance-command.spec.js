"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _222instancecommandfast1783956795000addcalendarendfieldmetadataidtoview = require("../2-22-instance-command-fast-1783956795000-add-calendar-end-field-metadata-id-to-view");
const _addcalendarendfieldmetadataidtoviewupgradecommandnameconstant = require("../add-calendar-end-field-metadata-id-to-view-upgrade-command-name.constant");
const _registeredinstancecommanddecorator = require("../../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
describe('AddCalendarEndFieldMetadataIdToViewFastInstanceCommand', ()=>{
    const command = new _222instancecommandfast1783956795000addcalendarendfieldmetadataidtoview.AddCalendarEndFieldMetadataIdToViewFastInstanceCommand();
    it('is registered against the current version with a matching name', ()=>{
        const metadata = (0, _registeredinstancecommanddecorator.getRegisteredInstanceCommandMetadata)(_222instancecommandfast1783956795000addcalendarendfieldmetadataidtoview.AddCalendarEndFieldMetadataIdToViewFastInstanceCommand);
        expect(metadata).toEqual({
            timestamp: 1783956795000,
            type: 'fast',
            version: '2.22.0'
        });
        expect(`${metadata?.version}_${_222instancecommandfast1783956795000addcalendarendfieldmetadataidtoview.AddCalendarEndFieldMetadataIdToViewFastInstanceCommand.name}_${metadata?.timestamp}`).toBe(_addcalendarendfieldmetadataidtoviewupgradecommandnameconstant.ADD_CALENDAR_END_FIELD_METADATA_ID_TO_VIEW_UPGRADE_COMMAND_NAME);
    });
    it('adds the column, index and foreign key idempotently', async ()=>{
        const query = jest.fn().mockResolvedValue(undefined);
        await command.up({
            query
        });
        expect(query.mock.calls.map((call)=>call[0])).toEqual([
            'ALTER TABLE "core"."view" ADD COLUMN IF NOT EXISTS "calendarEndFieldMetadataId" uuid',
            'CREATE INDEX IF NOT EXISTS "IDX_VIEW_CALENDAR_END_FIELD_METADATA" ON "core"."view" ("calendarEndFieldMetadataId") ',
            'DO $$ BEGIN ALTER TABLE "core"."view" ADD CONSTRAINT "FK_e1d69dd7402cd7df3b03ce11311" FOREIGN KEY ("calendarEndFieldMetadataId") REFERENCES "core"."fieldMetadata"("id") ON DELETE SET NULL ON UPDATE NO ACTION; EXCEPTION WHEN duplicate_object THEN NULL; END $$'
        ]);
    });
    it('removes the foreign key, index and column idempotently', async ()=>{
        const query = jest.fn().mockResolvedValue(undefined);
        await command.down({
            query
        });
        expect(query.mock.calls.map((call)=>call[0])).toEqual([
            'ALTER TABLE "core"."view" DROP CONSTRAINT IF EXISTS "FK_e1d69dd7402cd7df3b03ce11311"',
            'DROP INDEX IF EXISTS "core"."IDX_VIEW_CALENDAR_END_FIELD_METADATA"',
            'ALTER TABLE "core"."view" DROP COLUMN IF EXISTS "calendarEndFieldMetadataId"'
        ]);
    });
});

//# sourceMappingURL=add-calendar-end-field-metadata-id-to-view.instance-command.spec.js.map