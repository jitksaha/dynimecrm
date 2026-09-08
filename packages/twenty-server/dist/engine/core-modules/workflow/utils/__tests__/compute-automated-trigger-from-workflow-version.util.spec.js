"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _computeautomatedtriggerfromworkflowversionutil = require("../compute-automated-trigger-from-workflow-version.util");
const _workflowautomatedtriggerworkspaceentity = require("../../../../../modules/workflow/common/standard-objects/workflow-automated-trigger.workspace-entity");
const _workflowtriggertype = require("../../../../../modules/workflow/workflow-trigger/types/workflow-trigger.type");
const buildWorkflowVersion = (trigger)=>({
        id: 'core-version-1',
        workflowId: 'workspace-workflow-1',
        triggers: trigger ? [
            trigger
        ] : []
    });
describe('computeAutomatedTriggerFromWorkflowVersion', ()=>{
    it('should build a database event trigger carrying both version ids', ()=>{
        const workflowVersion = buildWorkflowVersion({
            type: _workflowtriggertype.WorkflowTriggerType.DATABASE_EVENT,
            name: 'Record created',
            settings: {
                eventName: 'company.created',
                outputSchema: {}
            }
        });
        expect((0, _computeautomatedtriggerfromworkflowversionutil.computeAutomatedTriggerFromWorkflowVersion)({
            workflowVersion,
            workspaceWorkflowVersionId: 'workspace-version-1'
        })).toEqual({
            workflowId: 'workspace-workflow-1',
            coreWorkflowVersionId: 'core-version-1',
            workspaceWorkflowVersionId: 'workspace-version-1',
            type: _workflowautomatedtriggerworkspaceentity.AutomatedTriggerType.DATABASE_EVENT,
            settings: {
                eventName: 'company.created',
                outputSchema: {}
            }
        });
    });
    it('should collapse both ids to the legacy shape when the twin is missing', ()=>{
        const workflowVersion = buildWorkflowVersion({
            type: _workflowtriggertype.WorkflowTriggerType.DATABASE_EVENT,
            name: 'Record created',
            settings: {
                eventName: 'company.created',
                outputSchema: {}
            }
        });
        const automatedTrigger = (0, _computeautomatedtriggerfromworkflowversionutil.computeAutomatedTriggerFromWorkflowVersion)({
            workflowVersion,
            workspaceWorkflowVersionId: null
        });
        expect(automatedTrigger?.workspaceWorkflowVersionId).toBeNull();
        expect(automatedTrigger?.coreWorkflowVersionId).toBeNull();
    });
    it('should return null for manual triggers', ()=>{
        const workflowVersion = buildWorkflowVersion({
            type: _workflowtriggertype.WorkflowTriggerType.MANUAL,
            name: 'Manual trigger',
            settings: {
                outputSchema: {}
            }
        });
        expect((0, _computeautomatedtriggerfromworkflowversionutil.computeAutomatedTriggerFromWorkflowVersion)({
            workflowVersion,
            workspaceWorkflowVersionId: 'workspace-version-1'
        })).toBeNull();
    });
});

//# sourceMappingURL=compute-automated-trigger-from-workflow-version.util.spec.js.map