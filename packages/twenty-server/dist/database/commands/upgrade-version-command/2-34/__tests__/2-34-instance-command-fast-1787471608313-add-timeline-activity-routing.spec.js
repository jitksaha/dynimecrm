"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _234instancecommandfast1787471608313addtimelineactivityrouting = require("../2-34-instance-command-fast-1787471608313-add-timeline-activity-routing");
describe('AddTimelineActivityRoutingFastInstanceCommand', ()=>{
    const query = jest.fn();
    const queryRunner = {
        query
    };
    const command = new _234instancecommandfast1787471608313addtimelineactivityrouting.AddTimelineActivityRoutingFastInstanceCommand();
    beforeEach(()=>{
        query.mockReset();
    });
    it('adds the generic event-routing contract', async ()=>{
        await command.up(queryRunner);
        expect(query).toHaveBeenCalledWith('ALTER TABLE "core"."timelineActivityType" ADD "targetRelationFieldUniversalIdentifier" uuid');
        expect(query).toHaveBeenCalledWith('ALTER TABLE "core"."timelineActivityType" ADD "triggerFieldUniversalIdentifiers" uuid[]');
        expect(query).toHaveBeenCalledTimes(2);
    });
    it('drops the generic event-routing contract on rollback', async ()=>{
        await command.down(queryRunner);
        expect(query).toHaveBeenCalledWith('ALTER TABLE "core"."timelineActivityType" DROP COLUMN "targetRelationFieldUniversalIdentifier"');
        expect(query).toHaveBeenCalledWith('ALTER TABLE "core"."timelineActivityType" DROP COLUMN "triggerFieldUniversalIdentifiers"');
        expect(query).toHaveBeenCalledTimes(2);
    });
});

//# sourceMappingURL=2-34-instance-command-fast-1787471608313-add-timeline-activity-routing.spec.js.map