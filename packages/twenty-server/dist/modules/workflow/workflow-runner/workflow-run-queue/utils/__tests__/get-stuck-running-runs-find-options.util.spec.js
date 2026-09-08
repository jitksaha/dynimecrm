"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _typeorm = require("typeorm");
const _workflowrunworkspaceentity = require("../../../../common/standard-objects/workflow-run.workspace-entity");
const _getstuckrunningrunsfindoptionsutil = require("../get-stuck-running-runs-find-options.util");
describe('getStuckRunningRunsFindOptions', ()=>{
    it('should match RUNNING runs older than the threshold', ()=>{
        const where = (0, _getstuckrunningrunsfindoptionsutil.getStuckRunningRunsFindOptions)();
        expect(where.status).toBe(_workflowrunworkspaceentity.WorkflowRunStatus.RUNNING);
        expect(where.updatedAt).toBeInstanceOf(_typeorm.FindOperator);
        expect(where.updatedAt.type).toBe('lessThan');
    });
});

//# sourceMappingURL=get-stuck-running-runs-find-options.util.spec.js.map