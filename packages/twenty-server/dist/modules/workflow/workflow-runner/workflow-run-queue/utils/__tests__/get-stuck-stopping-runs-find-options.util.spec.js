"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _typeorm = require("typeorm");
const _workflowrunworkspaceentity = require("../../../../common/standard-objects/workflow-run.workspace-entity");
const _getstuckstoppingrunsfindoptionsutil = require("../get-stuck-stopping-runs-find-options.util");
describe('getStuckStoppingRunsFindOptions', ()=>{
    it('should match STOPPING runs older than the threshold', ()=>{
        const where = (0, _getstuckstoppingrunsfindoptionsutil.getStuckStoppingRunsFindOptions)();
        expect(where.status).toBe(_workflowrunworkspaceentity.WorkflowRunStatus.STOPPING);
        expect(where.updatedAt).toBeInstanceOf(_typeorm.FindOperator);
    });
});

//# sourceMappingURL=get-stuck-stopping-runs-find-options.util.spec.js.map