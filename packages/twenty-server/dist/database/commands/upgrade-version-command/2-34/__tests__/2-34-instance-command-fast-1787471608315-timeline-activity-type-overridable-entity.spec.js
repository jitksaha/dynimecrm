"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _234instancecommandfast1787471608315timelineactivitytypeoverridableentity = require("../2-34-instance-command-fast-1787471608315-timeline-activity-type-overridable-entity");
describe('TimelineActivityTypeOverridableEntityFastInstanceCommand', ()=>{
    const query = jest.fn();
    const queryRunner = {
        query
    };
    const command = new _234instancecommandfast1787471608315timelineactivitytypeoverridableentity.TimelineActivityTypeOverridableEntityFastInstanceCommand();
    beforeEach(()=>{
        query.mockReset();
    });
    it('adds workspace override and active-state columns', async ()=>{
        await command.up(queryRunner);
        expect(query).toHaveBeenCalledWith('ALTER TABLE "core"."timelineActivityType" ADD "overrides" jsonb, ADD "isActive" boolean NOT NULL DEFAULT true');
    });
    it('removes workspace override and active-state columns', async ()=>{
        await command.down(queryRunner);
        expect(query).toHaveBeenCalledWith('ALTER TABLE "core"."timelineActivityType" DROP COLUMN "isActive", DROP COLUMN "overrides"');
    });
});

//# sourceMappingURL=2-34-instance-command-fast-1787471608315-timeline-activity-type-overridable-entity.spec.js.map