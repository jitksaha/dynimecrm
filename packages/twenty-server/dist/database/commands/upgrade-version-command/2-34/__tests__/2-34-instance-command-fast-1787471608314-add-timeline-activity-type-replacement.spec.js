"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _234instancecommandfast1787471608314addtimelineactivitytypereplacement = require("../2-34-instance-command-fast-1787471608314-add-timeline-activity-type-replacement");
describe('AddTimelineActivityTypeReplacementFastInstanceCommand', ()=>{
    const query = jest.fn();
    const queryRunner = {
        query
    };
    const command = new _234instancecommandfast1787471608314addtimelineactivitytypereplacement.AddTimelineActivityTypeReplacementFastInstanceCommand();
    beforeEach(()=>{
        query.mockReset();
    });
    it('adds the explicit override reference', async ()=>{
        await command.up(queryRunner);
        expect(query).toHaveBeenCalledWith('ALTER TABLE "core"."timelineActivityType" ADD "replacesTimelineActivityTypeUniversalIdentifier" uuid');
    });
    it('drops the override reference on rollback', async ()=>{
        await command.down(queryRunner);
        expect(query).toHaveBeenCalledWith('ALTER TABLE "core"."timelineActivityType" DROP COLUMN "replacesTimelineActivityTypeUniversalIdentifier"');
    });
});

//# sourceMappingURL=2-34-instance-command-fast-1787471608314-add-timeline-activity-type-replacement.spec.js.map