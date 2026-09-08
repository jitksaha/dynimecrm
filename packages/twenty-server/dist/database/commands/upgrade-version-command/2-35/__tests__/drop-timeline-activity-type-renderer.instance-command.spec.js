"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _235instancecommandfast1787648000001droptimelineactivitytyperenderer = require("../2-35-instance-command-fast-1787648000001-drop-timeline-activity-type-renderer");
const _droptimelineactivitytyperendererupgradecommandnameconstant = require("../drop-timeline-activity-type-renderer-upgrade-command-name.constant");
const _registeredinstancecommanddecorator = require("../../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
describe('DropTimelineActivityTypeRendererFastInstanceCommand', ()=>{
    const command = new _235instancecommandfast1787648000001droptimelineactivitytyperenderer.DropTimelineActivityTypeRendererFastInstanceCommand();
    it('has a name constant matching its registered name', ()=>{
        const metadata = (0, _registeredinstancecommanddecorator.getRegisteredInstanceCommandMetadata)(_235instancecommandfast1787648000001droptimelineactivitytyperenderer.DropTimelineActivityTypeRendererFastInstanceCommand);
        expect(metadata).toEqual({
            version: '2.35.0',
            timestamp: 1787648000001,
            type: 'fast'
        });
        expect(`${metadata?.version}_${_235instancecommandfast1787648000001droptimelineactivitytyperenderer.DropTimelineActivityTypeRendererFastInstanceCommand.name}_${metadata?.timestamp}`).toBe(_droptimelineactivitytyperendererupgradecommandnameconstant.DROP_TIMELINE_ACTIVITY_TYPE_RENDERER_UPGRADE_COMMAND_NAME);
    });
    it('drops and restores the renderer column', async ()=>{
        const query = jest.fn().mockResolvedValue(undefined);
        const queryRunner = {
            query
        };
        await command.up(queryRunner);
        await command.down(queryRunner);
        expect(query.mock.calls.map(([statement])=>statement)).toEqual([
            'ALTER TABLE "core"."timelineActivityType" DROP COLUMN IF EXISTS "renderer"',
            'ALTER TABLE "core"."timelineActivityType" ADD COLUMN IF NOT EXISTS "renderer" character varying'
        ]);
    });
});

//# sourceMappingURL=drop-timeline-activity-type-renderer.instance-command.spec.js.map